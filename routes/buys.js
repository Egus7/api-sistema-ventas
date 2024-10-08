const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const moment = require('moment-timezone');

const router = express.Router();

    // Obtener todas las compras
    router.get('/', authenticateToken, async (req, res) => {
        const query = 'SELECT * FROM compras ORDER BY id_compra';
    
        try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al obtener las compras', error);
        res.status(400).json({ error: 'Error al obtener las compras' });
        }
    });

    // Obtener una compra por su ID
    router.get('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
    
        const query = 'SELECT * FROM compras WHERE id_compra = $1';
        const values = [id];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al obtener una compra', error);
        res.status(400).json({ error: 'Error al obtener la compra' });
        }
    });

    // detalle de compras
    router.get('/detalle_compras', authenticateToken,  async (req, res) => {

        const query = 'SELECT * FROM detalle_compras ORDER BY id_detalle_compra';

        try {
            const result = await client.query(query);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error al obtener el detalle compras', error);
            res.status(400).json({error: 'Error al obtener el detalle compras'});
        }
    });

    // para obtener un detalle de compra
    router.get('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;

        const query = `SELECT * FROM detalle_compras WHERE id_detalle_compra = ${id}`;

        try {
            const result = await client.query(query);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error al obtener un detalle compra', error);
            res.status(400).json({ error: 'Error al obtener el detalle compra' });
        }        
    });

    //que sea vea el detalle de la compra con el id de la compra
    router.get('/detallecompras/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;

        const query = `SELECT * FROM detalle_compras WHERE compra_id = ${id}`;

        try {
            const result = await client.query(query);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error al obtener una compra con detalles', error);
            res.status(400).json({ error: 'Error al obtener la compra con detalle' });
        } 
    }); 

    router.post('/registrarcompras', authenticateToken, async (req, res) => {
        const { fecha_compra, proveedor_id, total, detalles } = req.body;
      
        try {
          // Empezamos una transacción para insertar los datos de la compra y sus detalles en forma atómica
          await client.query('BEGIN');
      
          // Insertamos los datos de la compra
          const compraInsertQuery = `INSERT INTO compras (fecha_compra, proveedor_id, total) 
                                        VALUES ($1, $2, $3) RETURNING id_compra`;
          const compraInsertValues = [fecha_compra, proveedor_id, total];
          const compraResult = await client.query(compraInsertQuery, compraInsertValues);
          const idCompra = compraResult.rows[0].id_compra;
      
          // Insertamos los detalles de la compra
          const detalleInsertPromises = detalles.map(detalle => {
            const { producto_id, cantidad, precio_unitario, iva } = detalle;
            const detalleQuery = `INSERT INTO detalle_compras(compra_id, producto_id, cantidad, 
                                    precio_unitario, iva) VALUES ($1, $2, $3, $4, $5)`;
            const detalleValues = [idCompra, producto_id, cantidad, precio_unitario, iva];
            return client.query(detalleQuery, detalleValues);
          });
      
          await Promise.all(detalleInsertPromises);
      
          // Si todo salió bien, hacemos commit
          await client.query('COMMIT');
      
          // Actualizamos el stock de los productos
          const updateStockPromises = detalles.map(detalle => {
            const { producto_id, cantidad } = detalle;
            const updateStockQuery = `UPDATE productos SET stock_producto = stock_producto + $1 
                                        WHERE id_producto = $2`;
            const updateStockValues = [cantidad, producto_id];
            return client.query(updateStockQuery, updateStockValues);
          });
      
          await Promise.all(updateStockPromises);
      
          // Obtener la fecha y hora actual con zona horaria de Ecuador
          const fechaInventario = moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');
          const operacion = 'INGRESOS';
      
          // Registramos el movimiento en el inventario
          const insertInventarioPromises = detalles.map(detalle => {
            const { producto_id, cantidad } = detalle;
            const insertInventarioQuery = `INSERT INTO inventario (producto_id, cantidad, operacion, 
                                                fecha_inventario) VALUES ($1, $2, $3, $4)`;
            const insertInventarioValues = [producto_id, cantidad, operacion, fechaInventario];
            return client.query(insertInventarioQuery, insertInventarioValues);
          });
      
          await Promise.all(insertInventarioPromises);
      
          res.status(201).json({ message: 'Compra registrada correctamente' });
        } catch (error) {
          // Si algo salió mal, hacemos rollback
          await client.query('ROLLBACK');
          console.error(error);
          res.status(400).json({ error: 'Error al registrar compra' });
        }
    });

    module.exports = router;


const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const moment = require('moment-timezone');

const router = express.Router();

    // Obtener todas las ventas
    router.get('/', authenticateToken, async (req, res) => {
        const query = 'SELECT * FROM ventas ORDER BY id_venta';

        try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al obtener las ventas', error);
        res.status(400).json({ error: 'Error al obtener las ventas' });
        }
    });

    // Obtener una venta por su ID
    router.get('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;

        const query = 'SELECT * FROM ventas WHERE id_venta = $1';
        const values = [id];

        try {
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'No se encontró la venta con el ID proporcionado' });
        } else {
            res.status(200).json(result.rows);
        }
        } catch (error) {
        console.error('Error al obtener una venta', error);
        res.status(400).json({ error: 'Error al obtener la venta' });
        }
    });

    //detalle ventas
    router.get('/detalle_ventas', authenticateToken, async (req, res) => {
        try {
            const query = 'SELECT * FROM detalle_ventas ORDER BY id_detalle_venta';
            const result = await client.query(query);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error al obtener los detalles de ventas', error);
            res.status(400).json({ error: 'Error al obtener los detalles de ventas' });
        }
    });

    // detalle ventas por id
    router.get('/detalle_ventas/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;

        try {
        const query = 'SELECT * FROM detalle_ventas WHERE id_detalle_venta = $1';
        const values = [id];
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'No se encontró el detalle de venta con el ID proporcionado' });
        } else {
            res.status(200).json(result.rows);
        } 
        } catch (error) {
        console.error('Error al obtener un detalle de venta', error);
        res.status(400).json({ error: 'Error al obtener el detalle de venta' });
        }
    });

    //que sea vea el detalle de la venta con el id de la venta
    router.get('/detalleventas/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;

        try {
        const query = 'SELECT * FROM detalle_ventas WHERE venta_id = $1';
        const values = [id];
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al obtener los detalles de venta para una venta específica', error);
        res.status(400).json({ error: 'Error al obtener los detalles de venta' });
        }
    });

    // registrar venta
    router.post('/registrarventas', authenticateToken, async (req, res) => {
        const { fecha_venta, total, forma_pago, cliente_id, detalles } = req.body;

        try {
        // Iniciamos una transacción para insertar los datos de la venta y sus detalles de forma atómica
        await client.query('BEGIN');

        // Registramos la venta
        const insertVentaQuery = `INSERT INTO ventas (fecha_venta, total, forma_pago, cliente_id)
                                VALUES ($1, $2, $3, $4) RETURNING id_venta`;
        const values = [fecha_venta, total, forma_pago, cliente_id];
        const ventaResult = await client.query(insertVentaQuery, values);
        const idVenta = ventaResult.rows[0].id_venta;

        // Registramos los detalles de la venta
        const insertDetalleVentaPromises = detalles.map(detalle => {
            const { producto_id, cantidad, precio_unitario, iva } = detalle;
            const detalleQuery = `INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, 
                                    precio_unitario, iva) VALUES ($1, $2, $3, $4, $5)`;
            const detalleValues = [idVenta, producto_id, cantidad, precio_unitario, iva];
            return client.query(detalleQuery, detalleValues);
        });

        await Promise.all(insertDetalleVentaPromises);

        // Si todo salió bien, hacemos commit
        await client.query('COMMIT');

        // Actualizamos el inventario
        const updateStockPromises = detalles.map(detalle => {
            const { producto_id, cantidad } = detalle;
            const updateStockQuery = `UPDATE productos SET stock_producto = stock_producto - $1 
                                        WHERE id_producto = $2`;
            const updateStockValues = [cantidad, producto_id];
            return client.query(updateStockQuery, updateStockValues);
        });

        await Promise.all(updateStockPromises);

        // Obtener la fecha y hora actual con zona horaria de Ecuador
        const fechaInventario = moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');
        const operacion = 'EGRESOS';

        // Registramos el movimiento en el inventario
        const insertInventarioPromises = detalles.map(detalle => {
            const { producto_id, cantidad } = detalle;
            const insertInventarioQuery = `INSERT INTO inventario (producto_id, cantidad, operacion, 
                                            fecha_inventario) VALUES ($1, $2, $3, $4)`;
            const insertInventarioValues = [producto_id, cantidad, operacion, fechaInventario];
            return client.query(insertInventarioQuery, insertInventarioValues);
        });

        await Promise.all(insertInventarioPromises);

        res.status(201).json({message: 'Venta registrada correctamente'});
        } catch (error) {
        // Si algo salió mal, hacemos rollback
        await client.query('ROLLBACK');
        console.error(error);
        res.status(400).json({error: 'Error al registrar la venta'});
        }
    });
    
    module.exports = router;
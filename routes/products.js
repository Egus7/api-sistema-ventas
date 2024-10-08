const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// para obtener todos los productos
router.get('/', authenticateToken, async (req, res) => {
    
    const query = 'SELECT * FROM productos ORDER BY id_producto';

    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los clientes'. error);
        res.status(400).json({ error: 'Error al obtener los productos' });
    }      
});

// para obtener un producto
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;   

    const query = `SELECT * FROM productos WHERE id_producto = '${id}'`;

       try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
       } catch(error) {
            console.log('Error al obtener un producto', error);
            res.status(400).json({ error: 'Error al obtener el producto' }); 
        }
});

// para insertar un producto
router.post('/', authenticateToken, async (req, res) => {
    const {nombre_producto, descripcion_producto, precio_unitario, precio_venta, stock_producto,
            presentacion_producto, categoria_id, marca_id, iva} = req.body;

    const query = `INSERT INTO productos (nombre_producto, descripcion_producto, precio_unitario, precio_venta, 
                    stock_producto, presentacion_producto, categoria_id, marca_id, iva) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const values = [nombre_producto, descripcion_producto, precio_unitario, precio_venta, stock_producto, 
                        presentacion_producto, categoria_id, marca_id, iva];
    
    try {
        const result = await client.query(query, values);
        res.status(200).json({message: 'Producto creado con éxito'});
    } catch(error) {
        console.log('Error al insertar un producto', error);
        res.status(400).json({ error: 'Error al insertar el producto' });
    } 
});

// para actualizar un producto
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { nombre_producto, descripcion_producto, precio_unitario, presentacion_producto, categoria_id, 
                    marca_id, iva, precio_venta } = req.body;

    const query = `UPDATE productos SET nombre_producto = $1, descripcion_producto = $2,
                    precio_unitario = $3, presentacion_producto = $4, categoria_id = $5,
                    marca_id = $6, iva = $7, precio_venta = $8 WHERE id_producto = '${id}'`;
    const values = [nombre_producto, descripcion_producto, precio_unitario, presentacion_producto,
                    categoria_id, marca_id, iva, precio_venta];

    try {
        await client.query(query, values);
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.log('Error al actualizar un producto', error);
        res.status(400).json({ error: 'Error al actualizar el producto' });
    }
});

// para eliminar un producto
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM productos WHERE id_producto = '${id}'`;

    try {
        await client.query(query);
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.log('Error al eliminar un producto', error);
        res.status(400).json({ error: 'Error al eliminar el producto' });
    }    
});

router.get('/buscarProducto/:termino', authenticateToken, async (req, res) => {
    const { termino } = req.params;

    const query = `SELECT * FROM productos 
                  WHERE nombre_producto ILIKE $1 
                  OR descripcion_producto ILIKE $1
                  OR categoria_id::text ILIKE $1
                  OR marca_id::text ILIKE $1
                  OR presentacion_producto ILIKE $1
                  OR precio_unitario::text ILIKE $1
                  OR stock_producto::text ILIKE $1
                  OR id_producto ILIKE $1`;

    try {
        const result = await client.query(query, [`%${termino}%`]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al buscar productos', error);
        res.status(400).json({ error: 'Error al buscar productos' });
    }
});

module.exports = router;
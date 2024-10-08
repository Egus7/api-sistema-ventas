const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/** Proveedores */
    // Obtener todos los proveedores
    router.get('/', authenticateToken, async (req, res) => {
        const query = 'SELECT * FROM proveedores ORDER BY id_proveedor';
    
        try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al obtener los proveedores', error);
        res.status(400).json({ error: 'Error al obtener los proveedores' });
        }
    });

    // Obtener un proveedor por su ID
    router.get('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
    
        const query = 'SELECT * FROM proveedores WHERE id_proveedor = $1';
        const values = [id];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al obtener un proveedor', error);
        res.status(400).json({ error: 'Error al obtener el proveedor' });
        }
    });

    // Insertar un nuevo proveedor
    router.post('/', authenticateToken, async (req, res) => {
        const { ruc_proveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor } = req.body;
    
        const query = `INSERT INTO proveedores (ruc_proveedor, nombre_proveedor, direccion_proveedor, 
                            telefono_proveedor, email_proveedor) VALUES ($1, $2, $3, $4, $5)`;
        const values = [ruc_proveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor];
    
        try {
        const result = await client.query(query, values);
        res.status(201).json({ message: 'Proveedor agregado' });
        } catch (error) {
        console.error('Error al agregar un proveedor', error);
        res.status(400).json({ error: 'Error al agregar el proveedor' });
        }
    });

    // Actualizar un proveedor por su ID
    router.put('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { ruc_proveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor, email_proveedor } = req.body;
    
        const query = `UPDATE proveedores SET ruc_proveedor = $1, nombre_proveedor = $2, direccion_proveedor = $3, 
                            telefono_proveedor = $4, email_proveedor = $5 WHERE id_proveedor = $6`;
        const values = [ruc_proveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor, 
                                email_proveedor, id];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json({ message: `Proveedor con ID ${id} actualizado` });
        } catch (error) {
        console.error('Error al actualizar un proveedor', error);
        res.status(400).json({ error: 'Error al actualizar el proveedor' });
        }
    });

    // Eliminar un proveedor por su ID
    router.delete('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
    
        const query = 'DELETE FROM proveedores WHERE id_proveedor = $1';
        const values = [id];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json({ message: 'Proveedor eliminado' });
        } catch (error) {
        console.error('Error al eliminar un proveedor', error);
        res.status(400).json({ error: 'Error al eliminar el proveedor' });
        }
    });

    module.exports = router;
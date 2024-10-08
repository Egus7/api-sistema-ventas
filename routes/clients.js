const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/** Clientes */
    // Obtener todos los clientes
    router.get('/', authenticateToken, async (req, res) => {
        const query = 'SELECT * FROM clientes ORDER BY apellidos_cliente';
    
        try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al obtener los clientes', error);
        res.status(400).json({ error: 'Error al obtener los clientes' });
        }
    });

    // Obtener un cliente por su cédula
    router.get('/:cedula', authenticateToken, async (req, res) => {
        const { cedula } = req.params;
    
        const query = 'SELECT * FROM clientes WHERE cedula_cliente = $1';
        const values = [cedula];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al obtener un cliente', error);
        res.status(400).json({ error: 'Error al obtener el cliente' });
        }
    });

    // Insertar un nuevo cliente
    router.post('/', authenticateToken, async (req, res) => {
        const { cedula_cliente, nombres_cliente, apellidos_cliente, direccion, telefono } = req.body;
    
        const query = `INSERT INTO clientes (cedula_cliente, nombres_cliente, apellidos_cliente, direccion, 
                            telefono) VALUES ($1, $2, $3, $4, $5)`;
        const values = [cedula_cliente, nombres_cliente, apellidos_cliente, direccion, telefono];
    
        try {
        const result = await client.query(query, values);
        res.status(201).json({ message: 'Cliente agregado' });
        } catch (error) {
        console.error('Error al agregar un cliente', error);
        res.status(400).json({ error: 'Error al agregar el cliente' });
        }
    });

    // Actualizar un cliente por su cédula
    router.put('/:cedula', authenticateToken, async (req, res) => {
        const { cedula } = req.params;
        const { nombres_cliente, apellidos_cliente, direccion, telefono } = req.body;
    
        const query = `UPDATE clientes SET nombres_cliente = $1, apellidos_cliente = $2, direccion = $3, 
                            telefono = $4 WHERE cedula_cliente = $5`;
        const values = [nombres_cliente, apellidos_cliente, direccion, telefono, cedula];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json({ message: `Cliente con cédula ${cedula} actualizado` });
        } catch (error) {
        console.error('Error al actualizar un cliente', error);
        res.status(400).json({ error: 'Error al actualizar el cliente' });
        }
    });

    // Eliminar un cliente por su cédula
    router.delete('/:cedula', authenticateToken, async (req, res) => {
        const { cedula } = req.params;
    
        const query = 'DELETE FROM clientes WHERE cedula_cliente = $1';
        const values = [cedula];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json({ message: 'Cliente eliminado' });
        } catch (error) {
        console.error('Error al eliminar un cliente', error);
        res.status(400).json({ error: 'Error al eliminar el cliente' });
        }
    });

    // Buscar clientes por nombre
    router.get('/buscarClientes/:nombre', authenticateToken, async (req, res) => {
        const { nombre } = req.params;
    
        const query = `SELECT * FROM clientes WHERE cedula_cliente ILIKE $1 OR nombres_cliente ILIKE $1 OR 
                        apellidos_cliente ILIKE $1 OR direccion ILIKE $1 OR telefono ILIKE $1`;
        const values = [`%${nombre}%`];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al buscar clientes', error);
        res.status(400).json({ error: 'Error al buscar clientes' });
        }
    });

    module.exports = router;
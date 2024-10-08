const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const moment = require('moment-timezone');

const router = express.Router();

    // Obtener listado de inventario
    router.get('/', authenticateToken, async (req, res) => {
        try {
            const query = 'SELECT * FROM inventario ORDER BY fecha_inventario DESC';
            const response = await client.query(query);
            res.json(response.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener el inventario' });
        }
    });

    // Obtener listado de inventario por ID
    router.get('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        try {
            const query = 'SELECT * FROM inventario WHERE id_inventario = $1';
            const response = await client.query(query, [id]);
            if (response.rows.length === 0) {
                res.status(404).json({ error: 'No se encontró el registro de inventario con el ID proporcionado' });
            } else {
                res.json(response.rows);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener el registro de inventario' });
        }
    });

    module.exports = router;

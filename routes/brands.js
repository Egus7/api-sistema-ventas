const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

    //marcas
    //obtener listado de marcas
    router.get('/', authenticateToken,  async (req, res) => {
        
        const query = 'SELECT * FROM marcas ORDER BY id_marca';

        try {
            const result = await client.query(query);
            res.status(200).json(result.rows);
        } catch (error) {
            console.log('Ocurrio un error al obtener las marcas', error);
            res.status(400).json({ error: 'Error al obtener las marcas' });
        }
    });

    // Insertar una nueva marca
    router.post('/', authenticateToken, async (req, res) => {
        const { nombre_marca } = req.body;
    
        const query = 'INSERT INTO marcas (nombre_marca) VALUES ($1)';
        const values = [nombre_marca];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json({ message: 'Marca agregada' });
        } catch (error) {
        console.error('Error al agregar una marca', error);
        res.status(400).json({ error: 'Error al agregar la marca' });
        }
    });

    // Actualizar una marca por su ID
    router.put('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { nombre_marca } = req.body;
    
        const query = 'UPDATE marcas SET nombre_marca = $1 WHERE id_marca = $2';
        const values = [nombre_marca, id];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json({ message: `Marca con ID ${id} actualizada` });
        } catch (error) {
        console.error('Error al actualizar una marca', error);
        res.status(400).json({ error: 'Error al actualizar la marca' });
        }
    });

    // Eliminar una marca por su ID
    router.delete('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
    
        const query = 'DELETE FROM marcas WHERE id_marca = $1';
        const values = [id];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json({ message: 'Marca eliminada' });
        } catch (error) {
        console.error('Error al eliminar una marca', error);
        res.status(400).json({ error: 'Error al eliminar la marca' });
        }
    });

    // Buscar marcas por nombre
    router.get('/buscarMarcas/:nombre', authenticateToken, async (req, res) => {
        const { nombre } = req.params;
    
        const query = 'SELECT * FROM marcas WHERE nombre_marca ILIKE $1';
        const values = [`%${nombre}%`];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al buscar marcas', error);
        res.status(400).json({ error: 'Error al buscar marcas' });
        }
    });

    module.exports = router;
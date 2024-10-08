const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las categorías
    router.get('/', authenticateToken, async (req, res) => {
        const query = 'SELECT * FROM categorias ORDER BY id_cat';
    
        try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
        } catch (error) {
        console.log('Ocurrió un error al obtener las categorías', error);
        res.status(400).json({ error: 'Error al obtener las categorías' });
        }
    });

    // Obtener una categoría por su ID
    router.get('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
      
        const query = 'SELECT * FROM categorias WHERE id_cat = $1';
        const values = [id];
      
        try {
          const result = await client.query(query, values);
          res.status(200).json(result.rows);
        } catch (error) {
          console.error('Error al obtener una categoría', error);
          res.status(400).json({ error: 'Error al obtener la categoría' });
        }
    });

    // Insertar una nueva categoría
    router.post('/', authenticateToken, async (req, res) => {
        const { nombre_cat } = req.body;
    
        const query = 'INSERT INTO categorias (nombre_cat) VALUES ($1)';
        const values = [nombre_cat];
    
        try {
        const result = await client.query(query, values);
        res.status(201).json({ message: 'Categoría agregada' });
        } catch (error) {
        console.error('Error al agregar una categoría', error);
        res.status(400).json({ error: 'Error al agregar la categoría' });
        }
    });

    // Actualizar una categoría por su ID
    router.put('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { nombre_cat } = req.body;
    
        const query = 'UPDATE categorias SET nombre_cat = $1 WHERE id_cat = $2';
        const values = [nombre_cat, id];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json({ message: `Categoría con ID ${id} actualizada` });
        } catch (error) {
        console.error('Error al actualizar una categoría', error);
        res.status(400).json({ error: 'Error al actualizar la categoría' });
        }
    });

    // Eliminar una categoría por su ID
    router.delete('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
    
        const query = 'DELETE FROM categorias WHERE id_cat = $1';
        const values = [id];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json({ message: 'Categoría eliminada' });
        } catch (error) {
        console.error('Error al eliminar una categoría', error);
        res.status(400).json({ error: 'Error al eliminar la categoría' });
        }
    });

    // Buscar categorías por nombre
    router.get('/buscarCategoria/:nombre', authenticateToken, async (req, res) => {
        const { nombre } = req.params;
    
        const query = 'SELECT * FROM categorias WHERE nombre_cat ILIKE $1';
        const values = [`%${nombre}%`];
    
        try {
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
        } catch (error) {
        console.error('Error al buscar categorías', error);
        res.status(400).json({ error: 'Error al buscar categorías' });
        }
    });

    module.exports = router;
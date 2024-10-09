const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

    // Obtener todas las categorías
    router.get('/', async (req, res) => {
        try {
            const query = `SELECT porcentaje FROM parametro_iva 
                                ORDER BY fecha_efectiva DESC LIMIT 1`;
            const result = await client.query(query);

            if (result.rows.length > 0) {
              const valor_iva = result.rows[0].porcentaje;
              res.json({ valor_iva });
            } else {
              res.status(404).json({ message: 'No se encontró el valor del IVA' });
            }
        } catch (error) {
            console.error('Error al obtener el IVA', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });

    module.exports = router;
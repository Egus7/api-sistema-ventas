const express = require('express');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const moment = require('moment-timezone');

const router = express.Router();

    // Obtener todas las facturas
    router.get('/', authenticateToken, async (req, res) => {
        try {
            const query = 'SELECT * FROM facturas ORDER BY fecha_emision';
            const result = await client.query(query);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error al obtener las facturas', error);
            res.status(400).json({ error: 'Error al obtener las facturas' });
        }
    });

    // Obtener una factura por su ID
    router.get('/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;

        try {
            const query = 'SELECT * FROM facturas WHERE id_factura = $1';
            const values = [id];
            const result = await client.query(query, values);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error al obtener una factura', error);
            res.status(400).json({ error: 'Error al obtener la factura' });
        }
    });

    // Obtener el detalle de la factura con el ID de la factura
    router.get('/detallefacturas/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;

        try {
            const query = 'SELECT * FROM detalle_facturas WHERE factura_id = $1';
            const values = [id];
            const result = await client.query(query, values);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error al obtener el detalle de la factura', error);
            res.status(400).json({ error: 'Error al obtener el detalle de la factura' });
        }
    });

    // Ver la factura con su detalle de facturas
    router.get('/:id/detalle', authenticateToken, async (req, res) => {
        const { id } = req.params;

        try {
            const facturaQuery = 'SELECT * FROM facturas WHERE id_factura = $1';
            const detalleQuery = 'SELECT * FROM detalle_facturas WHERE factura_id = $1';

            const facturaValues = [id];
            const detalleValues = [id];

            const facturaResult = await client.query(facturaQuery, facturaValues);
            const detalleResult = await client.query(detalleQuery, detalleValues);

            const factura = facturaResult.rows[0];
            const detalleFacturas = detalleResult.rows;

            res.status(200).json({ factura, detalleFacturas });
        } catch (error) {
            console.error('Error al obtener la factura con su detalle de facturas', error);
            res.status(400).json({ error: 'Error al obtener la factura con su detalle de facturas' });
        }
    });

    //registrar facturas
    router.post('/registrarfacturas', authenticateToken, async (req, res) => {
        const { total, forma_pago, cliente_id, detalles } = req.body;

        try {
            // Iniciamos la transacción
            await client.query('BEGIN');

            const fechaEmision = moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');

            // Registramos la factura
            const insertFacturaQuery = `INSERT INTO facturas (fecha_emision, total, forma_pago, cliente_id)
                                        VALUES ($1, $2, $3, $4) RETURNING id_factura`;
            const facturaValues = [fechaEmision, total, forma_pago, cliente_id];

            const facturaResult = await client.query(insertFacturaQuery, facturaValues);
            const idFactura = facturaResult.rows[0].id_factura;

            // Registramos los detalles de la factura
            const insertDetalleFacturaPromises = detalles.map(detalle => {
                const { producto_id, cantidad, precio_unitario, iva } = detalle;
                const detalleQuery = `INSERT INTO detalle_facturas (factura_id, producto_id, cantidad, 
                                        precio_unitario, iva) VALUES ($1, $2, $3, $4, $5)`;
                const detalleValues = [idFactura, producto_id, cantidad, precio_unitario, iva];
                return client.query(detalleQuery, detalleValues);
            });

            await Promise.all(insertDetalleFacturaPromises);

            // Si todo salió bien, hacemos commit
            await client.query('COMMIT');
            res.status(201).json({message: 'Factura registrada correctamente'});
        } catch (error) {
            // Si algo salió mal, hacemos rollback
            await client.query('ROLLBACK');
            console.error(error);
            res.status(400).json({error: 'Error al registrar la factura'});
        }
    });

    module.exports = router;
const express = require('express');
const usersRoutes = require('./users');
const productsRoutes = require('./products');
const categoryRoutes = require('./category');
const brandsRoutes = require('./brands');
const clientsRoutes = require('./clients');
const providersRoutes = require('./providers');
const buysRoutes = require('./buys');
const inventoryRoutes = require('./inventory');
const salesRoutes = require('./sales');
const commercial_invoiceRoutes = require('./commercial_invoice');

const router = express.Router();

// Usar las rutas de usuarios para las peticiones que comiencen con /usuarios
router.use('/usuarios', usersRoutes);
router.use('/productos', productsRoutes);
router.use('/categorias', categoryRoutes);
router.use('/marcas', brandsRoutes);
router.use('/clientes', clientsRoutes);
router.use('/proveedores', providersRoutes);
router.use('/compras', buysRoutes);
router.use('/inventario', inventoryRoutes);
router.use('/ventas', salesRoutes);
router.use('/facturas', commercial_invoiceRoutes);

module.exports = router;

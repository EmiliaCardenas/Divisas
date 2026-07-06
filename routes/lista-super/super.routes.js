const express = require('express');
const router = express.Router();
const controller = require('../../controllers/lista-super/super.controller');

// Rutas existentes
router.get('/usuarios', controller.getInicio);
router.get('/lista', controller.getListaPorUsuario); 
router.get('/unidades', controller.getUnidades);
router.post('/productos', controller.addProducto);

// Nuevas rutas para gestión de permanentes
router.get('/productos-permanencia', controller.getProductosPermanencia);
router.post('/toggle-permanente', controller.updatePermanente);

module.exports = router;
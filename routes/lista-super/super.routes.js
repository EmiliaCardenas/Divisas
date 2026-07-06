const express = require('express');
const router = express.Router();
const controller = require('../../controllers/lista-super/super.controller');

// routes/lista-super/super.routes.js
router.get('/usuarios', controller.getInicio);
// Cambiado de /lista/:id_usuario a /lista
router.get('/lista', controller.getListaPorUsuario); 
router.get('/unidades', controller.getUnidades);
router.post('/productos', controller.addProducto);

module.exports = router;
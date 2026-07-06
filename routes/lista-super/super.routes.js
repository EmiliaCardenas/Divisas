const express = require('express');
const router = express.Router();
const controller = require('../../controllers/lista-super/super.controller');

router.get('/usuarios', controller.getInicio);
router.get('/lista/:id_usuario', controller.getListaPorUsuario);
router.get('/unidades', controller.getUnidades); // Nueva ruta
router.post('/productos', controller.addProducto); // Nueva ruta

module.exports = router;
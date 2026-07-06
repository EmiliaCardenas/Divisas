const express = require('express');
const router = express.Router();
const controller = require('../../controllers/lista-super/super.controller');

router.get('/usuarios', controller.getInicio);
router.get('/lista/:id_usuario', controller.getListaPorUsuario);

module.exports = router;
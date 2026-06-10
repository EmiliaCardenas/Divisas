const express = require('express');
const router = express.Router();
const rutas_divisas = require('./divisas.routes');

router.use('/', rutas_divisas); 

module.exports = router;
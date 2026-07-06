const express = require('express');
const router = express.Router();
const controller = require('../../controllers/lista-super/super.controller');

router.get('/', controller.get_datos); 

module.exports = router;
const express = require('express');
const router = express.Router();

const controller = require('../controllers/divisas.controller');

router.get('/divisas', controller.get_datos);

module.exports = router;
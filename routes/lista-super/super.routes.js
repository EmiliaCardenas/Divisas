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
router.get('/lista-activa', controller.getListaActiva); // Carga permanentes
router.post('/guardar-lista', controller.guardarLista);
router.get('/historial-fechas', controller.getHistorialFechas); // Obtener días con compras
router.get('/lista-por-fecha/:fecha', controller.getListaPorFecha);
router.post('/marcar', controller.updateMarcado); // Marcar/desmarcar producto

module.exports = router;
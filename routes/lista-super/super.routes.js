const express = require('express');
const router = express.Router();
const controller = require('../../controllers/lista-super/super.controller');

// Usuarios
router.get('/usuarios', controller.getInicio);

// Lista general
router.get('/lista', controller.getListaPorUsuario); 

// Unidades de medida
router.get('/unidades', controller.getUnidades);

// Añadir productos
router.post('/productos', controller.addProducto);

// Productos permanentes
router.get('/productos-permanencia', controller.getProductosPermanencia);
router.post('/toggle-permanente', controller.updatePermanente);

// Añadir lista
router.get('/lista-activa', controller.getListaActiva); 
router.post('/guardar-lista', controller.guardarLista);

// Historial de listas
router.get('/historial-fechas', controller.getHistorialFechas);
router.get('/lista-por-fecha/:fecha', controller.getListaPorFecha);

// Marcar seleccionado
router.post('/marcar', controller.updateMarcado);

// Actualizar la lista
router.post('/actualizar-lista', controller.updateLista);

// Eliminar
router.delete('/eliminar-producto/:id_lista', controller.eliminarDeLista);
router.delete('/eliminar-lista-completa/:fecha', controller.eliminarListaCompleta);

module.exports = router;
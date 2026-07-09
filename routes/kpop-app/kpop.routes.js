const express = require('express');
const router = express.Router();
const controller = require('../../controllers/kpop-app/kpop.controller');

router.post('/rank', controller.rankearCancion);
router.get('/top-canciones', controller.obtenerRanking);
router.post('/artista', controller.crearArtista);
router.post('/album', controller.crearAlbum);
router.post('/cancion', controller.crearCancion);
router.get('/grupos', controller.getGrupos);
router.get('/artistas', controller.getArtistas);
router.get('/albumes', controller.getAlbumes);
router.post('/colaboracion', controller.crearColaboracion); // Esta es la que faltaba
router.get('/canciones', controller.getCanciones);
router.get('/catalogo', controller.getCatalogo);

module.exports = router;
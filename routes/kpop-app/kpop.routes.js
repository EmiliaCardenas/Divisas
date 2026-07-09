const express = require('express');
const router = express.Router();
const controller = require('../../controllers/kpop-app/kpop.controller');

router.post('/rank', controller.rankearCancion);
router.get('/top-canciones', controller.obtenerRanking);
router.post('/artista', controller.crearArtista);
router.post('/album', controller.crearAlbum);
router.post('/cancion', controller.crearCancion);

module.exports = router;
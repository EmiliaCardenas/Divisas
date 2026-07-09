const Kpop = require('../../models/kpop-app/kpop.model');

exports.rankearCancion = async (req, res) => {
    try {
        await Kpop.addRanking(req.body.id_cancion, req.body.puntuacion);
        res.status(201).json({ message: "Puntuación registrada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerRanking = async (req, res) => {
    const [rows] = await Kpop.getTopCanciones();
    res.json(rows);
};

exports.crearArtista = async (req, res) => {
    try {
        await Kpop.addArtista(req.body);
        res.status(201).json({ message: "Artista creado con éxito" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.crearAlbum = async (req, res) => {
    try {
        await Kpop.addAlbum(req.body);
        res.status(201).json({ message: "Álbum añadido al artista" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.crearCancion = async (req, res) => {
    try {
        await Kpop.addCancion(req.body);
        res.status(201).json({ message: "Canción añadida al álbum" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

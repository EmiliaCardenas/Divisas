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
        // Asegúrate de que el objeto que envías al modelo tenga todas las propiedades
        await Kpop.addArtista({
            nombre: req.body.nombre,
            num_integrantes: req.body.num_integrantes,
            es_grupo: req.body.es_grupo,
            id_padre: req.body.id_padre // Esto debe llegar desde el frontend
        });
        res.status(201).json({ message: "Artista creado con éxito" });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

exports.crearAlbum = async (req, res) => {
    try {
        const result = await Kpop.addAlbum(req.body);
        // ¡CAMBIA ESTO! La mayoría de los drivers devuelven el resultado en la posición 0
        const id_album = result[0].insertId; 
        res.status(201).json({ message: "Álbum creado", id_album: id_album });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

exports.crearCancion = async (req, res) => {
    try {
        const result = await Kpop.addCancion(req.body);
        const id_cancion = result[0].insertId; // Capturamos el ID generado
        res.status(201).json({ message: "Canción creada", id_cancion });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
};

exports.getGrupos = async (req, res) => {
    const [rows] = await Kpop.getGrupos();
    res.json(rows);
};

exports.getArtistas = async (req, res) => {
    try {
        const [rows] = await Kpop.getAllArtistas();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAlbumes = async (req, res) => {
    try {
        const [rows] = await Kpop.getAllAlbumes();
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.crearColaboracion = async (req, res) => {
    // 1. Extrae todos los campos posibles
    const { id_album, id_cancion, id_artista } = req.body;

    // 2. Validación flexible: Requiere artista, y al menos álbum O canción
    if (!id_artista || (!id_album && !id_cancion)) {
        console.log("Validación falló: Faltan campos. Recibido:", req.body);
        return res.status(400).json({ error: "Faltan datos (artista y (álbum o canción))" });
    }

    try {
        // 3. Envía los datos tal cual al modelo
        await Kpop.addColaboracion({ id_album, id_cancion, id_artista }); 
        res.status(201).json({ message: "Colaboración añadida" });
    } catch (err) {
        console.error("Error en DB:", err);
        res.status(500).json({ error: err.message }); 
    }
};
const db = require('../../db/kpop-app/db-k');

const Kpop = {
    // Obtener canciones mejor rankeadas
    getTopCanciones: () => {
        return db.execute(`
            SELECT c.nombre, AVG(r.puntuacion) as promedio 
            FROM canciones c 
            JOIN rankings r ON c.id_cancion = r.id_cancion 
            GROUP BY c.id_cancion ORDER BY promedio DESC`);
    },
    // Añadir ranking
    addRanking: (id_cancion, puntuacion) => {
        // Si la tabla tiene el índice UNIQUE (id_cancion)
        return db.execute(`
            INSERT INTO rankings (id_cancion, puntuacion, fecha_ranking) 
            VALUES (?, ?, CURRENT_TIMESTAMP) 
            ON DUPLICATE KEY UPDATE 
                puntuacion = VALUES(puntuacion), 
                fecha_ranking = CURRENT_TIMESTAMP
        `, [id_cancion, puntuacion]);
    },

    addArtista: (data) => {
    // Agregamos id_padre a la consulta y al array de valores
        return db.execute(
            'INSERT INTO artistas (nombre, num_integrantes, es_grupo, id_padre) VALUES (?, ?, ?, ?)', 
            [data.nombre, data.num_integrantes, data.es_grupo, data.id_padre]
        );
    },
    addAlbum: (data) => {
        // Si 'fecha' viene vacío, usa NULL o una fecha por defecto
        const fecha = data.fecha || null; 
        return db.execute(
            'INSERT INTO albumes (nombre, fecha_lanzamiento, tipo_album, id_artista) VALUES (?, ?, ?, ?)', 
            [data.nombre, fecha, data.tipo, data.id_artista]
        );
    },
    addCancion: (data) => {
        return db.execute('INSERT INTO canciones (nombre, duracion_segundos, id_album) VALUES (?, ?, ?)', 
        [data.nombre, data.duracion, data.id_album]);
    },
    getGrupos: () => {
        return db.execute('SELECT id_artista, nombre FROM artistas WHERE es_grupo = true');
    },
    getAllArtistas: () => {
        return db.execute('SELECT id_artista, nombre FROM artistas');
    },
    addCancion: (data) => {
        return db.execute(
            'INSERT INTO canciones (nombre, duracion_segundos, id_album) VALUES (?, ?, ?)', 
            [data.nombre, data.duracion, data.id_album]
        );
    },
    getAllAlbumes: () => {
        return db.execute('SELECT id_album, nombre FROM albumes');
    },
    addColaboracion: (data) => {
    // data contendrá { id_artista, id_cancion, id_album }
        return db.execute(
            'INSERT INTO colaboraciones (id_artista, id_cancion, id_album) VALUES (?, ?, ?)', 
            [data.id_artista, data.id_cancion || null, data.id_album || null]
        );
    },
    getAllCanciones: () => {
        return db.execute('SELECT id_cancion, nombre FROM canciones');
    },
    getCatalogoCompleto: () => {
        return db.execute(`
            SELECT 
                art.nombre as artista, 
                alb.nombre as album, 
                can.id_cancion, 
                can.nombre as cancion, 
                (SELECT AVG(puntuacion) FROM rankings WHERE id_cancion = can.id_cancion) as promedio,
                (SELECT puntuacion FROM rankings WHERE id_cancion = can.id_cancion ORDER BY fecha_ranking DESC LIMIT 1) as voto_personal
            FROM artistas art
            JOIN albumes alb ON art.id_artista = alb.id_artista
            JOIN canciones can ON alb.id_album = can.id_album
            GROUP BY can.id_cancion
            ORDER BY artista, album
        `);
    },
};
module.exports = Kpop;
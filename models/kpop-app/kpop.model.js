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
        return db.execute('INSERT INTO rankings (id_cancion, puntuacion) VALUES (?, ?)', [id_cancion, puntuacion]);
    },

    addArtista: (data) => {
        return db.execute('INSERT INTO artistas (nombre, num_integrantes, es_grupo) VALUES (?, ?, ?)', 
        [data.nombre, data.num_integrantes, data.es_grupo]);
    },
    addAlbum: (data) => {
        return db.execute('INSERT INTO albumes (nombre, fecha_lanzamiento, tipo_album, id_artista) VALUES (?, ?, ?, ?)', 
        [data.nombre, data.fecha, data.tipo, data.id_artista]);
    },
    addCancion: (data) => {
        return db.execute('INSERT INTO canciones (nombre, duracion_segundos, id_album) VALUES (?, ?, ?)', 
        [data.nombre, data.duracion, data.id_album]);
    }
};
module.exports = Kpop;
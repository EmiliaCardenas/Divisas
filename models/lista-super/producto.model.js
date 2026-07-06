const db = require('../../db/lista-super/db');

const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM producto');
  return rows;
};

const getAllConCategoria = async () => {
  // Ahora seleccionamos también el id_categoria
  const query = `
    SELECT p.id_producto, p.nombre as nombre_producto, 
           c.nombre as nombre_categoria, c.id_categoria 
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    ORDER BY c.nombre;
  `;
  const [rows] = await db.query(query);
  return rows;
};

// Nueva función para insertar
const create = async (nombre, id_categoria, id_unidad) => {
  const [result] = await db.query(
    'INSERT INTO producto (nombre, id_categoria, id_unidad) VALUES (?, ?, ?)',
    [nombre, id_categoria, id_unidad]
  );
  return result.insertId;
};

// Nueva función para obtener unidades (para el select del modal)
const getUnidades = async () => {
  const [rows] = await db.query('SELECT * FROM unidades');
  return rows;
};

module.exports = { getAll, create, getAllConCategoria, getUnidades };
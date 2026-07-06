const db = require('../../db/lista-super/db');

const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM producto');
  return rows;
};

const create = async (data) => {
  const [result] = await db.query(
    'INSERT INTO producto (nombre, id_categoria, id_unidad) VALUES (?, ?, ?)',
    [data.nombre, data.id_categoria, data.id_unidad]
  );
  return result.insertId;
};

const getAllConCategoria = async () => {
  const query = `
    SELECT p.id_producto, p.nombre as nombre_producto, c.nombre as nombre_categoria 
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    ORDER BY c.nombre;
  `;
  const [rows] = await db.query(query);
  return rows;
};

module.exports = { getAll, create, getAllConCategoria };
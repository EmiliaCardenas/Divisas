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

module.exports = { getAll, create };
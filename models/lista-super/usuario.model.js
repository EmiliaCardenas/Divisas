const db = require('../../db/lista-super/db');

const getAllUsuarios = async () => {
  const [rows] = await db.query('SELECT * FROM usuario');
  return rows;
};

module.exports = { getAllUsuarios };
const db = require('../../db/lista-super/db');

// Obtener usuarios
const getAllUsuarios = async () => {
  const [rows] = await db.query('SELECT * FROM usuario');
  return rows;
};

module.exports = { getAllUsuarios };
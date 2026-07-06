const db = require('../../db/lista-super/db');

const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM usuario');
  return rows;
};
module.exports = { getAll };
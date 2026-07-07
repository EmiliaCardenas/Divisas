/*
const mysql = require('mysql2/promise');
require('dotenv').config(); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

module.exports = pool;
*/

const mysql = require('mysql2/promise');
const { URL } = require('url');

// 1. Parsear la URL
const dbUrl = new URL(process.env.DATABASE_URL);

// 2. Crear el pool
const db = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1),
  port: dbUrl.port,
  ssl: {
    rejectUnauthorized: false
  }
});

// 3. LA PRUEBA (Ponla justo aquí)
db.query('SELECT 1')
  .then(() => console.log('✅ ¡Conexión a la base de datos establecida con éxito!'))
  .catch(err => console.error('❌ Error fatal al conectar a la base de datos:', err));

module.exports = db;
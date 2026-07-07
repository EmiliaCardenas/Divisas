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

// models/lista-super/producto.model.js
const getConPermanencia = async () => {
  const query = `
    SELECT p.id_producto, p.nombre, c.nombre as nombre_categoria, c.id_categoria,
           IFNULL(perm.es_permanente, 0) as es_permanente
    FROM producto p
    JOIN categoria c ON p.id_categoria = c.id_categoria
    LEFT JOIN permanente perm ON p.id_producto = perm.id_producto
    ORDER BY c.nombre;
  `;
  const [rows] = await db.query(query);
  return rows;
};

const togglePermanente = async (id_producto, es_permanente) => {
  // Utilizamos REPLACE o INSERT ... ON DUPLICATE KEY UPDATE
  const query = `
    INSERT INTO permanente (id_producto, es_permanente) 
    VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE es_permanente = ?
  `;
  return await db.query(query, [id_producto, es_permanente, es_permanente]);
};

// Obtener solo los que son permanentes
const getProductosPermanentes = async () => {
  const query = `
    SELECT p.id_producto, p.nombre as nombre_producto, c.nombre as nombre_categoria, c.id_categoria 
    FROM producto p
    JOIN permanente perm ON p.id_producto = perm.id_producto
    JOIN categoria c ON p.id_categoria = c.id_categoria
    WHERE perm.es_permanente = TRUE;
  `;
  const [rows] = await db.query(query);
  return rows;
};


const getFechasHistorial = async () => {
  const [rows] = await db.query('SELECT DISTINCT fecha FROM lista ORDER BY fecha DESC');
  return rows;
};

// Obtener una lista específica por fecha
// models/lista-super/producto.model.js

const getListaPorFecha = async (fecha) => {
  // Asegúrate de que los nombres de las tablas y columnas coincidan exactamente con tu BD
  const query = `
    SELECT l.id_lista, l.id_producto, l.cantidad, p.nombre as nombre_producto, 
           c.nombre as nombre_categoria, IFNULL(m.marcado, 0) as marcado
    FROM lista l
    INNER JOIN producto p ON l.id_producto = p.id_producto
    INNER JOIN categoria c ON l.id_categoria = c.id_categoria
    LEFT JOIN marca m ON l.id_lista = m.id_lista
    WHERE l.fecha = ?
  `;
  try {
    const [rows] = await db.query(query, [fecha]);
    return rows;
  } catch (error) {
    console.error("Error detallado en SQL:", error); // Esto te dirá el problema real
    throw error;
  }
};

// Marcar/Desmarcar producto
const guardarListaCompleta = async (productos) => {
  const fecha = new Date().toISOString().slice(0, 10);
  
  await Promise.all(productos.map(p => {
    // Ya no necesitamos enviar id_prodcuto_lista, la BD lo hace solo (AUTO_INCREMENT)
    return db.query(
      'INSERT INTO lista (id_producto, id_categoria, fecha, cantidad) VALUES (?, ?, ?, ?)',
      [p.id_producto, p.id_categoria, fecha, p.cantidad || 1]
    );
  }));
};

// 2. Asegurar que toggleMarcado usa correctamente la columna id_lista
const toggleMarcado = async (id_lista, marcado, id_usuario) => {
  // Primero, obtenemos el id_prodcuto_lista necesario para la tabla marca
  // Basándonos en el id_lista que recibimos
  const query = `
    INSERT INTO marca (id_lista, id_prodcuto_lista, marcado, id_usuario)
    SELECT ?, id_prodcuto_lista, ?, ?
    FROM lista
    WHERE id_lista = ?
    ON DUPLICATE KEY UPDATE marcado = ?
  `;
  
  // Enviamos los parámetros necesarios
  // id_lista (1), marcado (2), id_usuario (3), id_lista (4 para el WHERE), marcado (5 para el update)
  return await db.query(query, [id_lista, marcado, id_usuario, id_lista, marcado]);
};

module.exports = { getAll, create, getAllConCategoria, getUnidades, 
    togglePermanente, getConPermanencia, guardarListaCompleta, getProductosPermanentes,
getListaPorFecha, toggleMarcado, getFechasHistorial };
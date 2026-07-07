const db = require('../../db/lista-super/db');

// Obtener todos los productos
const getAll = async () => {
  const [rows] = await db.query('SELECT * FROM producto');
  return rows;
};

// Obtener las categorias ligadas al producto
const getAllConCategoria = async () => {
  const query = `
    SELECT c.id_categoria, c.nombre as nombre_categoria, 
           p.id_producto, p.nombre as nombre_producto, 
           u.nombre as nombre_unidad
    FROM categoria c
    LEFT JOIN producto p ON c.id_categoria = p.id_categoria
    LEFT JOIN unidades u ON p.id_unidad = u.id_unidad
    ORDER BY c.nombre;
  `;
  const [rows] = await db.query(query);
  return rows;
};

// Crear nuevo producto
const create = async (nombre, id_categoria, id_unidad) => {
  const [result] = await db.query(
    'INSERT INTO producto (nombre, id_categoria, id_unidad) VALUES (?, ?, ?)',
    [nombre, id_categoria, id_unidad]
  );
  return result.insertId;
};

// Obtener unidades de medida
const getUnidades = async () => {
  const [rows] = await db.query('SELECT * FROM unidades');
  return rows;
};

// Obtener productos permanentes
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

// Cambio en su pertenencia
const togglePermanente = async (id_producto, es_permanente) => {
  const query = `
    INSERT INTO permanente (id_producto, es_permanente) 
    VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE es_permanente = ?
  `;
  return await db.query(query, [id_producto, es_permanente, es_permanente]);
};

// Obtener solo los productos permanentes
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

// Fechas en el historial
const getFechasHistorial = async () => {
  const [rows] = await db.query('SELECT DISTINCT fecha FROM lista ORDER BY fecha DESC');
  return rows;
};

// Listas agrupadas en la fecha
const getListaPorFecha = async (fecha) => {
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
    console.error("Error detallado en SQL:", error);
    throw error;
  }
};

// Marcar/Desmarcar producto
const guardarListaCompleta = async (productos) => {
  const fecha = new Date().toISOString().slice(0, 10);
  
  await Promise.all(productos.map(p => {
    return db.query(
      'INSERT INTO lista (id_producto, id_categoria, fecha, cantidad) VALUES (?, ?, ?, ?)',
      [p.id_producto, p.id_categoria, fecha, p.cantidad || 1]
    );
  }));
};

// Cambio al marcar/desmarcar
const toggleMarcado = async (id_lista, marcado, id_usuario) => {
  const query = `
    INSERT INTO marca (id_lista, id_prodcuto_lista, marcado, id_usuario)
    SELECT ?, id_prodcuto_lista, ?, ?
    FROM lista
    WHERE id_lista = ?
    ON DUPLICATE KEY UPDATE marcado = ?
  `;
  return await db.query(query, [id_lista, marcado, id_usuario, id_lista, marcado]);
};

module.exports = { getAll, create, getAllConCategoria, getUnidades, 
    togglePermanente, getConPermanencia, guardarListaCompleta, getProductosPermanentes,
getListaPorFecha, toggleMarcado, getFechasHistorial };
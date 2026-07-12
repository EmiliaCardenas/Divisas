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
    -- EXCLUIMOS LOS TEMPORALES AQUÍ:
    LEFT JOIN producto_temporal pt ON p.id_producto = pt.id_producto
    WHERE pt.id_producto IS NULL
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
    LEFT JOIN producto_temporal pt ON p.id_producto = pt.id_producto
    WHERE pt.id_producto IS NULL                                   
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
    SELECT p.id_producto, p.nombre as nombre_producto, c.nombre as nombre_categoria, p.id_categoria,
           u.nombre as nombre_unidad 
    FROM producto p
    JOIN permanente perm ON p.id_producto = perm.id_producto
    JOIN categoria c ON p.id_categoria = c.id_categoria
    LEFT JOIN unidades u ON p.id_unidad = u.id_unidad
    -- EXCLUIMOS TEMPORALES PARA QUE NO APAREZCAN AQUÍ
    LEFT JOIN producto_temporal pt ON p.id_producto = pt.id_producto
    WHERE perm.es_permanente = TRUE 
    AND pt.id_producto IS NULL; 
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
           c.nombre as nombre_categoria, IFNULL(m.marcado, 0) as marcado,
           u_user.color as color_usuario_que_marco,
           u_user.nombre as nombre_usuario_que_marco,
           un.nombre as nombre_unidad  -- <--- AGREGA ESTA LÍNEA
    FROM lista l
    INNER JOIN producto p ON l.id_producto = p.id_producto
    INNER JOIN categoria c ON l.id_categoria = c.id_categoria
    LEFT JOIN unidades un ON p.id_unidad = un.id_unidad -- <--- AGREGA ESTE JOIN
    LEFT JOIN marca m ON l.id_lista = m.id_lista
    LEFT JOIN usuario u_user ON m.id_usuario = u_user.id_usuario
    WHERE l.fecha = ?
  `;
  const [rows] = await db.query(query, [fecha]);
  return rows;
};

// Guardar una nueva lista
const marcarComoTemporal = async (id_producto) => {
  await db.query('INSERT IGNORE INTO producto_temporal (id_producto) VALUES (?)', [id_producto]);
};

const guardarListaCompleta = async (productos) => {
  const fecha = new Date().toISOString().slice(0, 10);
  
  for (const p of productos) {
    let idProductoFinal = p.id_producto;

    if (typeof p.id_producto === 'string' && p.id_producto.startsWith('temp_')) {
      // Creamos el producto
      idProductoFinal = await create(p.nombre_producto, p.id_categoria, 1);
      // LO MARCAMOS PARA QUE NO SALGA EN EL CATÁLOGO OFICIAL
      await marcarComoTemporal(idProductoFinal);
    }

    if (!idProductoFinal || !p.id_categoria || p.cantidad <= 0) continue;

    const [existente] = await db.query(
      'SELECT id_prodcuto_lista FROM lista WHERE id_producto = ? AND fecha = ?',
      [idProductoFinal, fecha]
    );

    if (existente && existente.length > 0) {
      await db.query(
        'UPDATE lista SET cantidad = ? WHERE id_prodcuto_lista = ?',
        [p.cantidad, existente[0].id_prodcuto_lista]
      );
    } else {
      const randomBigIntId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      await db.query(
        `INSERT INTO lista (id_prodcuto_lista, id_producto, id_categoria, fecha, cantidad) VALUES (?, ?, ?, ?, ?)`,
        [randomBigIntId, idProductoFinal, p.id_categoria, fecha, p.cantidad]
      );
    }
  }
};

// Cambio al marcar/desmarcar
const toggleMarcado = async (id_lista, marcado, id_usuario) => {
  const query = `
    INSERT INTO marca (id_lista, id_prodcuto_lista, marcado, id_usuario)
    SELECT ?, id_prodcuto_lista, ?, ?
    FROM lista
    WHERE id_lista = ?
    ON DUPLICATE KEY UPDATE 
      marcado = VALUES(marcado),
      id_usuario = VALUES(id_usuario)
  `;
  return await db.query(query, [id_lista, marcado, id_usuario, id_lista]);
};

// Editar la cantidad
const updateCantidad = async (id_lista, cantidad) => {
  return await db.query('UPDATE lista SET cantidad = ? WHERE id_lista = ?', [cantidad, id_lista]);
};

// Quitar productos de la lista
const removerDeLista = async (id_lista) => {
  await db.query('DELETE FROM marca WHERE id_lista = ?', [id_lista]);
  return await db.query('DELETE FROM lista WHERE id_lista = ?', [id_lista]);
};

// Eliminar toda la lista
const eliminarTodaLaLista = async (fecha) => {
  await db.query(`
    DELETE m FROM marca m
    INNER JOIN lista l ON m.id_lista = l.id_lista
    WHERE l.fecha = ?
  `, [fecha]);
  return await db.query('DELETE FROM lista WHERE fecha = ?', [fecha]);
};

const eliminarProductoCatalogo = async (id_producto) => {
  return await db.query('DELETE FROM producto WHERE id_producto = ?', [id_producto]);
};

module.exports = { getAll, create, getAllConCategoria, getUnidades, 
    togglePermanente, getConPermanencia, guardarListaCompleta, getProductosPermanentes,
getListaPorFecha, toggleMarcado, getFechasHistorial, updateCantidad, removerDeLista,
eliminarTodaLaLista, eliminarProductoCatalogo, marcarComoTemporal };
const Usuario = require('../../models/lista-super/usuario.model');
const Producto = require('../../models/lista-super/producto.model');

// Metodo de seleccionar al inicio
const getInicio = async (req, res) => {
  try {
    const usuarios = await Usuario.getAllUsuarios();
    res.status(200).json({ success: true, usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lsita general de los productos
const getListaPorUsuario = async (req, res) => {
  try {
    const productos = await Producto.getAllConCategoria();
    
    const productosAgrupados = productos.reduce((acc, curr) => {
      if (!acc[curr.nombre_categoria]) {
        acc[curr.nombre_categoria] = [];
      }
      acc[curr.nombre_categoria].push(curr);
      return acc;
    }, {});

    res.status(200).json({ success: true, productos: productosAgrupados });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Añadir nuevo producto
const addProducto = async (req, res) => {
  try {
    const { nombre, id_categoria, id_unidad } = req.body;
    const idProducto = await Producto.create(nombre, id_categoria, id_unidad);
    res.status(201).json({ success: true, id_producto: idProducto });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener unidades de medida
const getUnidades = async (req, res) => {
  try {
    const unidades = await Producto.getUnidades();
    res.status(200).json({ success: true, unidades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener productos permanentes
const getProductosPermanencia = async (req, res) => {
  try {
    const data = await Producto.getConPermanencia();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Editar permanencia
const updatePermanente = async (req, res) => {
  try {
    const { id_producto, es_permanente } = req.body;
    await Producto.togglePermanente(id_producto, es_permanente);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lista basica con permanentes
const getListaActiva = async (req, res) => {
  try {
    const productos = await Producto.getProductosPermanentes();
    res.status(200).json({ success: true, productos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Guardar una nueva lista
const guardarLista = async (req, res) => {
  try {
    const { productos } = req.body;
    
    if (!productos || productos.length === 0) {
      throw new Error("No hay productos para guardar");
    }
    await Producto.guardarListaCompleta(productos);
    res.status(201).json({ success: true, message: "Lista guardada con éxito" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener el historial por fecha
const getHistorialFechas = async (req, res) => {
  try {
    const fechas = await Producto.getFechasHistorial();
    res.status(200).json({ success: true, fechas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener toda la lista dependiendo de su fecha
const getListaPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    const productos = await Producto.getListaPorFecha(fecha);
    res.status(200).json({ success: true, productos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cambio en marcar/desmarcar
const updateMarcado = async (req, res) => {
  try {
    const { id_lista, marcado, id_usuario } = req.body;
    await Producto.toggleMarcado(id_lista, marcado, id_usuario);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getInicio, getListaPorUsuario, addProducto, getUnidades,
     updatePermanente, getProductosPermanencia, getListaActiva, guardarLista,
    updateMarcado, getListaPorFecha,getHistorialFechas };
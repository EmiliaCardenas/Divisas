const Usuario = require('../../models/lista-super/usuario.model');
const Producto = require('../../models/lista-super/producto.model');

const getInicio = async (req, res) => {
  try {
    const usuarios = await Usuario.getAllUsuarios();
    res.status(200).json({ success: true, usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getListaPorUsuario = async (req, res) => {
  try {
    const productos = await Producto.getAllConCategoria();
    
    // Agrupar por categoría
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

module.exports = { getInicio, getListaPorUsuario };
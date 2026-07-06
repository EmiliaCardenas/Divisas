const Producto = require('../../models/lista-super/producto.model');

const get_datos = async (req, res) => {
  try {
    const productos = await Producto.getAll();
    return res.status(200).json({
      success: true,
      data: productos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error.message
    });
  }
};

module.exports = { get_datos };
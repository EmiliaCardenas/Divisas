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
    const { id_usuario } = req.params;
    const productos = await Producto.getAll(); 
    res.status(200).json({ success: true, productos, usuario_actual: id_usuario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getInicio, getListaPorUsuario };
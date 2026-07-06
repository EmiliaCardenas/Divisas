const db = require('../../db/lista-super/db'); 

const get_datos = async (req, res) => {
  try {

    const [rows] = await db.query('SELECT * FROM producto');
    
    return res.status(200).json({
      success: true,
      message: "Conexión exitosa a la DB",
      data: rows
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al conectar a la base de datos",
      error: error.message
    });
  }
};

module.exports = { get_datos };
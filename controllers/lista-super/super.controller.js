const get_datos = async (req, res) => {
  try {
    // Aquí puedes añadir lógica futura, como consultas a base de datos
    return res.status(200).json({
      success: true,
      message: "¡Conexión exitosa con el servidor!",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message
    });
  }
};

module.exports = { get_datos };
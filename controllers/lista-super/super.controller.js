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

// Lista general de los productos
const getListaPorUsuario = async (req, res) => {
  try {
    const todos = await Producto.getAllConCategoria();
    const productosAgrupados = todos.reduce((acc, curr) => {
      if (!acc[curr.nombre_categoria]) {
        acc[curr.nombre_categoria] = {
          id_categoria: curr.id_categoria, 
          productos: []
        };
      }
      
      if (curr.id_producto) {
        acc[curr.nombre_categoria].productos.push(curr);
      }
      
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
    console.error("Error SQL:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Editar la lista ya hecha
const updateLista = async (req, res) => {
  const { productos } = req.body;
  try {
    for (let p of productos) {
      const resultado = await Producto.updateCantidad(p.id_lista, p.cantidad);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar producto de la lista
const eliminarDeLista = async (req, res) => {
  try {
    const { id_lista } = req.params;
    await Producto.removerDeLista(id_lista);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar toda la lista
const eliminarListaCompleta = async (req, res) => {
  try {
    const { fecha } = req.params;
    await Producto.eliminarTodaLaLista(fecha);
    res.status(200).json({ success: true, message: "Lista eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const eliminarProductoCatalogo = async (req, res) => {
  try {
    const { id_producto } = req.params;
    await Producto.eliminarProductoCatalogo(id_producto);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo eliminar el producto" });
  }
};

module.exports = { getInicio, getListaPorUsuario, addProducto, getUnidades,
     updatePermanente, getProductosPermanencia, getListaActiva, guardarLista,
    updateMarcado, getListaPorFecha,getHistorialFechas, updateLista, eliminarDeLista,
   eliminarListaCompleta, eliminarProductoCatalogo  };
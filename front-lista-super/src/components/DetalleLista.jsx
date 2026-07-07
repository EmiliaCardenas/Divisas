import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Ham, PiggyBank, Drumstick, Beef, Apple, Carrot, Fish, 
  CupSoda, Milk, Croissant, Wheat, PersonStanding, Shapes, BrushCleaning, Trash2 } from 'lucide-react';

const iconMap = {
  'Salchichonería': <Ham size={20} />,
  'Despensa': <Shapes size={20} />,
  'Lácteos y huevos': <Milk size={20} />,
  'Higiene': <BrushCleaning size={20} />,
  'Bebidas': <CupSoda size={20} />,
  'Panadería': <Croissant size={20} />,
  'Fruta': <Apple size={20} />,
  'Verdura': <Carrot size={20} />,
  'Tortillas': <Wheat size={20} />,
  'Carne': <Beef size={20} />,
  'Pollo': <Drumstick size={20} />,
  'Cerdo': <PiggyBank size={20} />,
  'Pescado': <Fish size={20} />,
  'Otros': <PersonStanding size={20} />
};

export default function DetalleLista() {
  const { fecha } = useParams();
  const [productos, setProductos] = useState([]);
  
  const usuario = JSON.parse(localStorage.getItem('usuarioSeleccionado') || '{}');
  const fechaFormateada = fecha.split('T')[0];
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    axios.get(`/api/super/lista-por-fecha/${fechaFormateada}`)
      .then(res => setProductos(res.data.productos))
      .catch(err => console.error("Error al cargar:", err));
  }, [fechaFormateada]);

  const agruparPorCategoria = (lista) => {
    return lista.reduce((acc, p) => {
      const cat = p.nombre_categoria || "Otros";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    }, {});
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  const eliminarProducto = async (id_lista) => {
    try {
      await axios.delete(`/api/super/eliminar-producto/${id_lista}`);
      setProductos(productos.filter(p => p.id_lista !== id_lista));
      mostrarMensaje("Producto eliminado correctamente", 'exito');
    } catch (err) {
      console.error("Error al eliminar en BD:", err);
      mostrarMensaje("No se pudo eliminar el producto", 'error');
    }
  };

  const eliminarTodaLaLista = async () => {
    try {
      await axios.delete(`/api/super/eliminar-lista-completa/${fechaFormateada}`);
      setProductos([]); 
      setEditando(false);
      mostrarMensaje("Lista eliminada correctamente", 'exito');
    } catch (err) {
      console.error("Error al eliminar la lista completa:", err);
      mostrarMensaje("No se pudo eliminar la lista completa", 'error');
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      await axios.post('/api/super/actualizar-lista', { 
        productos: productos,
        fecha: fechaFormateada 
      });
      setEditando(false);
      mostrarMensaje("Lista actualizada correctamente", 'exito');
    } catch (err) {
      console.error("Error al guardar:", err);
      mostrarMensaje("Error al actualizar la lista", 'error');
    }
  };

  const toggleMarcar = (p) => {
    const nuevoEstado = !p.marcado;
    axios.post('/api/super/marcar', {
      id_lista: p.id_lista,
      marcado: nuevoEstado,
      id_usuario: usuario.id_usuario
    }).then(() => {
      setProductos(productos.map(item => 
        item.id_lista === p.id_lista ? { 
          ...item, 
          marcado: nuevoEstado, 
          color_usuario_que_marco: nuevoEstado ? usuario.color : null,
          nombre_usuario_que_marco: nuevoEstado ? usuario.nombre : null
        } : item
      ));
    });
  };


  const productosAgrupados = agruparPorCategoria(productos);

  return (
    <>
      <div style={{ marginBottom: '25px', textAlign: 'center' }}>
        <h1 style={{ color: '#5a554a', fontSize: '32px', margin: '0 0 10px 0' }}>
          Lista del {fechaFormateada}
        </h1>
        <button 
          onClick={() => setEditando(!editando)}
          style={{ 
            backgroundColor: editando ? '#d1ccc0' : '#706b5e', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '8px 16px', 
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {editando ? 'Cancelar edición' : 'Editar'}
        </button>
      </div>
      
      {Object.entries(productosAgrupados).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5a554a', marginBottom: '5px' }}>
            <div style={{ backgroundColor: '#706b5e', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {iconMap[cat] || <Shapes size={20} />}
            </div>
            <h2 style={{ fontSize: '20px', margin: 0 }}>{cat}</h2>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid #d1ccc0' }}>
            {items.map(p => (
              <li key={p.id_lista} style={{ padding: '8px 4px', borderBottom: '1px solid #d1ccc0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  color: p.marcado ? (p.color_usuario_que_marco || '#8c8c8c') : '#5a554a', 
                  textDecoration: p.marcado ? 'line-through' : 'none',
                  fontWeight: '500'
                }}>
                  {p.nombre_producto}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {editando ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="number" 
                        defaultValue={p.cantidad}
                        style={{ width: '50px', padding: '4px', borderRadius: '4px', border: '1px solid #d1ccc0' }}
                        onChange={(e) => {
                          const nuevaCantidad = parseInt(e.target.value, 10); 
                          setProductos(productos.map(item => 
                            item.id_lista === p.id_lista ? {...item, cantidad: nuevaCantidad} : item
                          ));
                        }}
                      />
                      <button 
                        onClick={() => eliminarProducto(p.id_lista)}
                        style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.9rem', color: '#8c8c8c' }}>({p.cantidad})</span>
                  )}

                  {!editando && (
                    <button 
                      onClick={() => toggleMarcar(p)} 
                      style={{ 
                        backgroundColor: p.marcado ? (p.color_usuario_que_marco || '#706b5e') : '#706b5e', 
                        color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' 
                      }}
                    >
                      {p.marcado ? 'Desmarcar' : 'Marcar'}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {editando && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleGuardarEdicion}
            style={{ flex: 2, padding: '15px', backgroundColor: '#5a554a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Guardar Cambios
          </button>
          <button 
            onClick={eliminarTodaLaLista}
            style={{ flex: 1, padding: '15px', backgroundColor: '#b91c1c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
            title="Eliminar lista completa"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )}

      {mensaje.texto && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          textAlign: 'center',
          borderRadius: '8px',
          backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'exito' ? '#155724' : '#721c24',
          border: mensaje.tipo === 'exito' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
        }}>
          {mensaje.texto}
        </div>
      )}
    </>
  );
}
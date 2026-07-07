import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalAgregarProducto from './ModalAgregarProducto';

import { 
  Ham, PiggyBank, Drumstick, Beef, Apple, Carrot, Fish, 
  CupSoda, Milk, Croissant, Wheat, PersonStanding, Shapes, BrushCleaning,
} from 'lucide-react';

// Mapeo de categorías a iconos
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

export default function ListaProductos({}) {
  const [productosAgrupados, setProductosAgrupados] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);

  const cargarProductos = () => {
    axios.get(`/api/super/lista`)
      .then(res => {
        setProductosAgrupados(res.data.productos || {});
      })
      .catch(err => console.error("Error al cargar productos:", err));
  };

  useEffect(() => {
    cargarProductos();
  }, [])

  const abrirModal = (nombreCategoria, idCategoria) => {
    setCategoriaSeleccionada({ nombre: nombreCategoria, id: idCategoria });
    setIsModalOpen(true);
  };

  const obtenerProductosFiltrados = () => {
    const filtrados = {};
    Object.entries(productosAgrupados).forEach(([cat, data]) => {
      const productosFiltrados = data.productos.filter(p => 
        p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
      );
      if (productosFiltrados.length > 0) {
        filtrados[cat] = { ...data, productos: productosFiltrados };
      }
    });
    return filtrados;
  };

  const listaFiltrada = obtenerProductosFiltrados();

  const eliminarProducto = async (id_producto) => {
    if (cargando) return;
    setCargando(true);
    try {
      await axios.delete(`/api/super/eliminar-producto-catalogo/${id_producto}`);
      cargarProductos(); 
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el producto");
    } finally {
      setCargando(false);
    }
  };

  return (
    <> 
      <h1 style={{ color: '#5a554a', marginBottom: '25px', fontSize: '32px', textAlign: 'center', fontFamily: 'inherit' }}>
        Todos los productos
      </h1>

      <button 
        onClick={() => setEditando(!editando)}
        style={{ 
          backgroundColor: editando ? '#d1ccc0' : '#706b5e', 
          color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', 
          cursor: 'pointer', marginBottom: '10px' 
        }}
      >
        {editando ? 'Finalizar edición' : 'Editar catálogo'}
      </button>
      
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '8px',
          border: '1px solid #d1ccc0',
          fontSize: '16px',
          boxSizing: 'border-box'
        }}
      />

      {Object.entries(productosAgrupados).map(([nombreCategoria, data]) => {
        const productosFiltrados = data.productos.filter(p => 
          p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
        );
        if (busqueda && productosFiltrados.length === 0) return null;

        return (
          <div key={nombreCategoria} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5a554a' }}>
                <div style={{ backgroundColor: '#706b5e', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {iconMap[nombreCategoria] || <Shapes size={20} />}
                </div>
                <h2 style={{ fontSize: '20px', margin: 0 }}>{nombreCategoria}</h2>
              </div>
              
              <button 
                onClick={() => abrirModal(nombreCategoria, data.id_categoria)}
                style={{ backgroundColor: '#706b5e', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                +
              </button>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid #d1ccc0' }}>
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map(p => (
                  <li key={p.id_producto} style={{ padding: '8px 4px', borderBottom: '1px solid #d1ccc0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>{p.nombre_producto}</span>
                      <span style={{ fontSize: '0.85em', color: '#8c8c8c', marginLeft: '5px' }}>- {p.nombre_unidad}</span>
                    </div>
                    
                    {editando && (
                      <button 
                        onClick={() => eliminarProducto(p.id_producto)}
                        disabled={cargando}
                        style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <li style={{ padding: '8px 4px', color: '#ccc', fontStyle: 'italic' }}>Sin productos</li>
              )}
            </ul>
          </div>
        );
      })}

      {isModalOpen && (
        <ModalAgregarProducto 
          categoria={categoriaSeleccionada} 
          onClose={() => setIsModalOpen(false)}
          onProductoAgregado={cargarProductos}
        />
      )}
    </>
  );
}
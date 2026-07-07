import { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarProducto from './ModalAgregarProducto';

import { 
  Ham, PiggyBank, Drumstick, Beef, Apple, Carrot, Fish, 
  CupSoda, Milk, Croissant, Wheat, PersonStanding, Shapes, BrushCleaning,
} from 'lucide-react';

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

export default function ListaPermanentes() {
  const [productosAgrupados, setProductosAgrupados] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const cargar = () => {
    axios.get('http://localhost:3000/api/super/productos-permanencia')
      .then(res => {
        const unicos = Array.from(new Map(res.data.data.map(item => [item.id_producto, item])).values());
        
        const agrupado = unicos.reduce((acc, curr) => {
          if (!acc[curr.nombre_categoria]) acc[curr.nombre_categoria] = [];
          acc[curr.nombre_categoria].push(curr);
          return acc;
        }, {});
        setProductosAgrupados(agrupado);
      });
  };

  useEffect(() => { cargar(); }, []);

  const handleToggle = async (id_producto, estadoActual) => {
    setProductosAgrupados(prev => {
      const nuevoEstado = { ...prev };
      for (const cat in nuevoEstado) {
        nuevoEstado[cat] = nuevoEstado[cat].map(p => 
          p.id_producto === id_producto ? { ...p, es_permanente: !estadoActual } : p
        );
      }
      return nuevoEstado;
    });
    try {
      await axios.post('http://localhost:3000/api/super/toggle-permanente', {
        id_producto, 
        es_permanente: !estadoActual
      });
    } catch (err) {
      console.error("Error al actualizar:", err);
      cargar();
    }
  };

  return (
    <>
      <h1 style={{ color: '#5a554a', marginBottom: '25px', fontSize: '32px', textAlign: 'center', fontFamily: 'inherit' }}>
        Gestión de Permanentes
      </h1>

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

      {Object.keys(productosAgrupados).map(cat => {
        const productosFiltrados = productosAgrupados[cat].filter(p => 
          p.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );

        if (busqueda && productosFiltrados.length === 0) return null;

        return (
          <div key={cat} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5a554a' }}>
              <div style={{ 
                backgroundColor: '#706b5e', color: 'white', borderRadius: '50%', 
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {iconMap[cat] ? iconMap[cat] : <Shapes size={20} />}
              </div>
              <h2 style={{ fontSize: '20px', margin: 0 }}>{cat}</h2>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid #d1ccc0' }}>
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map(p => (
                  <li key={p.id_producto} style={{ 
                    padding: '8px 4px', borderBottom: '1px solid #d1ccc0', color: '#5a554a',
                    display: 'flex', alignItems: 'center', gap: '10px' 
                  }}>
                    <input 
                      type="checkbox" 
                      checked={!!p.es_permanente} 
                      onChange={() => handleToggle(p.id_producto, p.es_permanente)} 
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: '500' }}>{p.nombre}</span>
                  </li>
                ))
              ) : (
                <li style={{ padding: '8px 4px', color: '#ccc', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  Sin productos en esta categoría
                </li>
              )}
            </ul>
          </div>
        );
      })}

      {isModalOpen && (
        <ModalAgregarProducto 
          categoria={categoriaSeleccionada} 
          onClose={() => setIsModalOpen(false)} 
          onProductoAgregado={cargar} 
        />
      )}
    </>
  );
}
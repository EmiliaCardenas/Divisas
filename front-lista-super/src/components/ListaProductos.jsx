
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalAgregarProducto from './ModalAgregarProducto';
import FondoLayout from './vizual/FondoLayout';

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
  const navigate = useNavigate();

  const cargarProductos = () => {
    axios.get(`http://localhost:3000/api/super/lista`)
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

  return (
    <FondoLayout alignTop={true}> 
      <h1 style={{ color: '#5a554a', marginBottom: '25px', fontSize: '32px', textAlign: 'center', fontFamily: 'inherit' }}>
        Todos los productos
      </h1>
      
      {Object.keys(productosAgrupados).map(categoria => (
        <div key={categoria} style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '5px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5a554a' }}>
              {iconMap[categoria]} {/* Aquí se inyecta el icono */}
              <h2 style={{ fontSize: '20px', margin: 0 }}>{categoria}</h2>
            </div>
            
            <button 
              onClick={() => abrirModal(categoria, productosAgrupados[categoria].length > 0 ? productosAgrupados[categoria][0].id_categoria : null)}
              style={{
                backgroundColor: '#706b5e',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                fontSize: '18px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </button>
          </div>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            borderTop: '1px solid #d1ccc0' 
          }}>
            {productosAgrupados[categoria].map(p => (
              <li key={p.id_producto} style={{ 
              padding: '8px 4px', 
              borderBottom: '1px solid #d1ccc0',
              color: '#5a554a',
              display: 'flex',        
              justifyContent: 'flex-start',
              alignItems: 'baseline',
              gap: '5px' 
            }}>
              <span style={{ fontWeight: '500' }}>{p.nombre_producto}</span>
              <span style={{ 
                fontSize: '0.85em', 
                color: '#8c8c8c', 
                fontWeight: 'normal'
              }}>
                - {p.nombre_unidad}
              </span>
            </li>
            ))}
          </ul>
        </div>
      ))}

      {isModalOpen && (
        <ModalAgregarProducto 
          categoria={categoriaSeleccionada} 
          onClose={() => setIsModalOpen(false)}
          onProductoAgregado={cargarProductos}
        />
      )}
    </FondoLayout>
  );
}
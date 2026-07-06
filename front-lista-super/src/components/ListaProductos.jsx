import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalAgregarProducto from './ModalAgregarProducto'; 

export default function ListaProductos({}) {
  const [productosAgrupados, setProductosAgrupados] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const navigate = useNavigate();

 const cargarProductos = () => {
    // La URL ya no incluye el id
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
    <section>
      <h1>Todos los productos</h1>
      
      {Object.keys(productosAgrupados).map(categoria => (
        <div key={categoria} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ color: '#2c3e50' }}>{categoria}</h2>
            <button onClick={() => abrirModal(categoria, productosAgrupados[categoria][0].id_categoria)}>
                +
            </button>
          </div>
          
          <ul style={{ borderBottom: '2px solid #eee' }}>
            {productosAgrupados[categoria].map(p => (
              <li key={p.id_producto}>{p.nombre_producto}</li>
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
    </section>
  );
}
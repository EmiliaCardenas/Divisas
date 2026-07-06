import { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarProducto from './ModalAgregarProducto';

export default function ListaPermanentes() {
  const [productosAgrupados, setProductosAgrupados] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const cargar = () => {
    axios.get('http://localhost:3000/api/super/productos-permanencia')
      .then(res => {
        // Agrupamos por categoría igual que en ListaProductos
        const agrupado = res.data.data.reduce((acc, curr) => {
          if (!acc[curr.nombre_categoria]) acc[curr.nombre_categoria] = [];
          acc[curr.nombre_categoria].push(curr);
          return acc;
        }, {});
        setProductosAgrupados(agrupado);
      });
  };

  useEffect(() => { cargar(); }, []);

  const handleToggle = (id_producto, estadoActual) => {
    axios.post('http://localhost:3000/api/super/toggle-permanente', {
      id_producto, es_permanente: !estadoActual
    }).then(() => cargar());
  };

  const abrirModal = (nombre, id) => {
    setCategoriaSeleccionada({ nombre, id });
    setIsModalOpen(true);
  };

  return (
    <section>
      <h1>Gestión de Permanentes</h1>
      {Object.keys(productosAgrupados).map(cat => (
        <div key={cat} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ color: '#2c3e50' }}>{cat}</h2>
            <button onClick={() => abrirModal(cat, productosAgrupados[cat][0].id_categoria)}>+</button>
          </div>
          <ul>
            {productosAgrupados[cat].map(p => (
              <li key={p.id_producto}>
                <input type="checkbox" checked={!!p.es_permanente} 
                       onChange={() => handleToggle(p.id_producto, p.es_permanente)} />
                {p.nombre}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {isModalOpen && (
        <ModalAgregarProducto 
          categoria={categoriaSeleccionada} 
          onClose={() => setIsModalOpen(false)} 
          onProductoAgregado={cargar} 
        />
      )}
    </section>
  );
}
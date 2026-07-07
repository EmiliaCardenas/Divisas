import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function DetalleLista() {
  const { fecha } = useParams();
  const [productos, setProductos] = useState([]);
  
  // Recuperar usuario del localStorage
  const usuario = JSON.parse(localStorage.getItem('usuarioSeleccionado') || '{}');
  const fechaFormateada = fecha.split('T')[0];

  useEffect(() => {
    axios.get(`http://localhost:3000/api/super/lista-por-fecha/${fechaFormateada}`)
      .then(res => setProductos(res.data.productos))
      .catch(err => console.error("Error al cargar:", err));
  }, [fechaFormateada]);

  // Función para agrupar (misma lógica que usaste antes)
  const agruparPorCategoria = (lista) => {
    return lista.reduce((acc, p) => {
      const cat = p.nombre_categoria || "Sin categoría";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    }, {});
  };

  const toggleMarcar = (p) => {
    if (!usuario.id_usuario) return alert("Error: Usuario no identificado");
    
    const nuevoEstado = !p.marcado;
    axios.post('http://localhost:3000/api/super/marcar', {
      id_lista: p.id_lista,
      marcado: nuevoEstado,
      id_usuario: usuario.id_usuario // ID dinámico
    }).then(() => {
      setProductos(productos.map(item => 
        item.id_lista === p.id_lista ? {...item, marcado: nuevoEstado} : item
      ));
    });
  };

  const productosAgrupados = agruparPorCategoria(productos);

  return (
    <section>
      <h1>Lista del {fechaFormateada}</h1>
      <p>Usuario: <strong>{usuario.nombre}</strong></p>
      
      {Object.keys(productosAgrupados).map(cat => (
        <div key={cat} style={{ marginBottom: '20px' }}>
          <h3>{cat}</h3>
          <ul>
            {productosAgrupados[cat].map(p => (
              <li key={p.id_lista} style={{ textDecoration: p.marcado ? 'line-through' : 'none' }}>
                {p.nombre_producto} ({p.cantidad})
                <button onClick={() => toggleMarcar(p)} style={{ marginLeft: '10px' }}>
                  {p.marcado ? 'Desmarcar' : 'Marcar'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
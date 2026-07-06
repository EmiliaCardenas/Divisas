import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ListaProductos({ idUsuario }) {
  const [productosAgrupados, setProductosAgrupados] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!idUsuario) {
      navigate('/');
      return;
    }

    axios.get(`http://localhost:3000/api/super/lista/${idUsuario}`)
      .then(res => {
        // El servidor ya envía el objeto agrupado, así que lo guardamos directamente.
        // Accedemos a 'res.data.productos' que es donde está tu objeto.
        const datosRecibidos = res.data.productos || {};
        
        console.log("Datos listos para mostrar:", datosRecibidos);
        setProductosAgrupados(datosRecibidos);
      })
      .catch(err => console.error("Error al cargar productos:", err));
  }, [idUsuario, navigate]);

  return (
    <section>
      <h1>Todos los productos</h1>
      
      {/* Iteramos sobre las categorías (las llaves del objeto) */}
      {Object.keys(productosAgrupados).map(categoria => (
        <div key={categoria} style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #eee' }}>
            {categoria}
          </h2>
          <ul>
            {productosAgrupados[categoria].map(p => (
              <li key={p.id_producto}>{p.nombre_producto}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
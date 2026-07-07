import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function HistorialListas({ idUsuario }) {
  const [fechas, setFechas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtenemos las fechas únicas desde el servidor
    axios.get('http://localhost:3000/api/super/historial-fechas')
      .then(res => setFechas(res.data.fechas))
      .catch(err => console.error("Error cargando historial:", err));
  }, []);

  return (
    <section>
      <h1>Historial de Listas</h1>
      <p>Selecciona una fecha para ver los detalles de tu compra:</p>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {fechas.map((item) => (
          <li key={item.fecha} style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => navigate(`/historial/${item.fecha.split('T')[0]}`)}
              style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
              Lista del {new Date(item.fecha).toLocaleDateString()}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
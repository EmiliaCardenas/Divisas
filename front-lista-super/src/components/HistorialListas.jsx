import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar } from 'lucide-react'; 

export default function HistorialListas() {
  const [fechas, setFechas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/super/historial-fechas')
      .then(res => setFechas(res.data.fechas))
      .catch(err => console.error("Error cargando historial:", err));
  }, []);

  return (
    <>
      <h1 style={{ color: '#5a554a', fontSize: '32px', marginBottom: '25px', textAlign: 'center' }}>
        Historial de Listas
      </h1>
      
      <div style={{ borderTop: '1px solid #d1ccc0', paddingTop: '10px' }}>
        {fechas.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {fechas.map((item) => (
              <li key={item.fecha} style={{ marginBottom: '10px' }}>
                <button 
                  onClick={() => navigate(`/historial/${item.fecha.split('T')[0]}`)}
                  style={{ 
                    width: '100%',
                    padding: '15px', 
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    border: '1px solid #d1ccc0',
                    borderRadius: '8px',
                    color: '#5a554a',
                    fontSize: '16px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f7f7f5'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
                >
                  <Calendar size={18} />
                  Lista del {new Date(item.fecha).toLocaleDateString()}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: '#8c8c8c', fontStyle: 'italic' }}>
            No hay listas en el historial.
          </p>
        )}
      </div>
    </>
  );
}
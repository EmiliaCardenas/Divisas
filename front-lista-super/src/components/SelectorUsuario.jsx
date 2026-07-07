import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SelectorUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [seleccion, setSeleccion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/super/usuarios')
      .then(res => setUsuarios(res.data.usuarios || []))
      .catch(err => console.error("Error al cargar usuarios:", err));
  }, []);

  const handleEntrar = () => {
    if (seleccion) {
      localStorage.setItem('usuarioSeleccionado', seleccion);
      navigate('/historial');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f2ed', // Fondo arena
      fontFamily: "'Segoe UI', sans-serif",
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff', // Tarjeta blanca
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #e0ddd5',
        boxSizing: 'border-box',
      }}>
        <h1 style={{ color: '#5a554a', marginBottom: '25px', fontSize: '32px', textAlign: 'center', fontFamily: 'inherit' }}>
          ¡Lista Super!
        </h1>
        
        <select 
          onChange={(e) => setSeleccion(e.target.value)} 
          defaultValue=""
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid #d1ccc0',
            backgroundColor: '#faf9f6',
            color: '#5a554a',
            fontSize: '16px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          <option value="" disabled>Seleccione un usuario...</option>
          {usuarios.map(u => (
            <option key={u.id_usuario} value={JSON.stringify(u)}>
              {u.nombre}
            </option>
          ))}
        </select>

        <button 
          onClick={handleEntrar}
          disabled={!seleccion}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: seleccion ? '#706b5e' : '#a0a0a0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: seleccion ? 'pointer' : 'not-allowed',
            transition: 'background 0.3s ease',
            fontFamily: 'inherit'
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
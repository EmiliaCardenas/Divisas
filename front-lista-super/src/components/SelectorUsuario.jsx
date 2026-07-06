import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SelectorUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/super/usuarios')
      .then(res => setUsuarios(res.data.usuarios || []))
      .catch(err => console.error("Error al cargar usuarios:", err));
  }, []);

  const handleSelect = (usuario) => {
    // Guardamos el objeto completo del usuario en localStorage
    localStorage.setItem('usuarioSeleccionado', JSON.stringify(usuario));
    navigate('/historial'); // Redirigimos al historial como querías
  };

  return (
    <section>
      <h1>Selecciona tu usuario</h1>
      {usuarios.map(u => (
        <button key={u.id_usuario} onClick={() => handleSelect(u)}>
          {u.nombre}
        </button>
      ))}
    </section>
  );
}
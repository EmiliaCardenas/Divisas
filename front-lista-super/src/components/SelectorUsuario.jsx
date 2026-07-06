import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SelectorUsuario({ setUsuariosGlobal }) {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/super/usuarios')
      .then(res => setUsuarios(res.data.usuarios || []))
      .catch(err => console.error("Error al cargar usuarios:", err));
  }, []);

  const handleSelect = (id) => {
    setUsuariosGlobal(id);
    navigate('/lista');
  };

  return (
    <section>
      <h1>Selecciona tu usuario</h1>
      {usuarios.map(u => (
        <button key={u.id_usuario} onClick={() => handleSelect(u.id_usuario)}>
          {u.nombre}
        </button>
      ))}
    </section>
  );
}
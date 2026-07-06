import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ListaProductos({ idUsuario }) {
  const [lista, setLista] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!idUsuario) {
      navigate('/');
      return;
    }
    axios.get(`http://localhost:3000/api/super/lista/${idUsuario}`)
      .then(res => setLista(res.data.productos || []))
      .catch(err => console.error("Error al cargar productos:", err));
  }, [idUsuario, navigate]);

  return (
    <section>
      <h1>Lista de Compras</h1>
      <ul>
        {lista.map(p => <li key={p.id_producto}>{p.nombre}</li>)}
      </ul>
      <button onClick={() => navigate('/')}>Cambiar usuario</button>
    </section>
  );
}
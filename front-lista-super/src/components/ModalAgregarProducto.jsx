import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ModalAgregarProducto({ categoria, onClose, onProductoAgregado }) {
  const [nombre, setNombre] = useState('');
  const [idUnidad, setIdUnidad] = useState('');
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/super/unidades')
      .then(res => {
        if (res.data && Array.isArray(res.data.unidades)) {
          setUnidades(res.data.unidades);
        }
      })
      .catch(err => console.error("Error al cargar unidades:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/super/productos', {
        nombre,
        id_categoria: categoria.id,
        id_unidad: idUnidad
      });
      onProductoAgregado();
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.4)', 
      backdropFilter: 'blur(5px)', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        width: '90%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <h3 style={{ color: '#5a554a', margin: 0 }}>Agregar a {categoria.nombre}</h3>
        
        <input 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          placeholder="Nombre del producto" 
          required 
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1ccc0' }}
        />
        
        <select onChange={(e) => setIdUnidad(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1ccc0' }}>
          <option value="">Selecciona unidad</option>
          {unidades.map(u => <option key={u.id_unidad} value={u.id_unidad}>{u.nombre}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#706b5e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Guardar</button>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', backgroundColor: '#e0ddd5', color: '#5a554a', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
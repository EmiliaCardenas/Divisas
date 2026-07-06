import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ModalAgregarProducto({ categoria, onClose, onProductoAgregado }){
  const [nombre, setNombre] = useState('');
  const [idUnidad, setIdUnidad] = useState('');
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/super/unidades')
      .then(res => {
        // Accedemos a la propiedad '.unidades' que viene dentro de res.data
        if (res.data && Array.isArray(res.data.unidades)) {
          setUnidades(res.data.unidades);
        } else {
          console.error("El formato de los datos no es el esperado:", res.data);
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
      
      // Llamamos a la función para refrescar la lista y luego cerramos
      onProductoAgregado(); 
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit}>
        <h3>Agregar a {categoria.nombre}</h3>
        <input 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          placeholder="Nombre del producto" 
          required 
        />
        <select onChange={(e) => setIdUnidad(e.target.value)} required>
          <option value="">Selecciona unidad</option>
          {unidades.map(u => <option key={u.id_unidad} value={u.id_unidad}>{u.nombre}</option>)}
        </select>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}
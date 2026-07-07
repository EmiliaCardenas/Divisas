import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ModalAgregarProducto({ categoria, onClose, onProductoAgregado }) {
  const [nombre, setNombre] = useState('');
  const [idUnidad, setIdUnidad] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  useEffect(() => {
    axios.get('/api/super/unidades')
      .then(res => {
        if (res.data && Array.isArray(res.data.unidades)) {
          setUnidades(res.data.unidades);
        }
      })
      .catch(err => console.error("Error al cargar unidades:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!nombre.trim()) {
      setError('Escriba el nombre.');
      return;
    }
    if (!idUnidad) {
      setError('Selecciona una unidad.');
      return;
    }
    
    if (cargando) return; 

    setCargando(true);
    
    try {
      await axios.post('/api/super/productos', {
        nombre,
        id_categoria: categoria.id,
        id_unidad: idUnidad
      });
      onProductoAgregado();
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      setError('Ocurrió un error al guardar. Intenta de nuevo.');
      setCargando(false);
    }
  };

  const unidadSeleccionada = unidades.find(u => u.id_unidad == idUnidad);

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
      zIndex: 1000,
      padding: '20px', 
      boxSizing: 'border-box'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#ffffff',
        padding: '25px', 
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        width: '100%',     
        maxWidth: '320px', 
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        boxSizing: 'border-box'
      }}>
        <h3 style={{ color: '#5a554a', margin: 0, fontSize: '20px', textAlign: 'center' }}>
          Agregar a {categoria.nombre}
        </h3>
        
        <input 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          placeholder="Nombre del producto"  
          style={{ 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #d1ccc0',
            fontFamily: 'inherit',
            fontSize: '16px'
          }}
        />

        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setDropdownAbierto(!dropdownAbierto)}
            style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #d1ccc0',
              fontFamily: 'inherit',
              fontSize: '16px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: unidadSeleccionada ? '#000' : '#757575'
            }}
          >
            {unidadSeleccionada ? unidadSeleccionada.nombre : "Selecciona unidad"}
            <span style={{ fontSize: '12px', transform: dropdownAbierto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              ▼
            </span>
          </div>

          {dropdownAbierto && (
            <ul style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              margin: 0,
              marginTop: '4px',
              padding: 0,
              listStyle: 'none',
              backgroundColor: '#ffffff',
              border: '1px solid #d1ccc0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              maxHeight: '150px', 
              overflowY: 'auto',
              zIndex: 10,
              boxSizing: 'border-box'
            }}>
              {unidades.map(u => (
                <li 
                  key={u.id_unidad} 
                  onClick={() => {
                    setIdUnidad(u.id_unidad);
                    setDropdownAbierto(false);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #f5f2ed',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#5a554a'
                  }}
                >
                  {u.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && (
              <div style={{ 
                color: '#b91c1c', 
                backgroundColor: '#fee2e2', 
                padding: '8px', 
                borderRadius: '6px', 
                fontSize: '14px', 
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {error}
              </div>
            )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            type="submit" 
            disabled={cargando}
            style={{ 
              flex: 1, 
              padding: '12px', 
              backgroundColor: cargando ? '#b0aca0' : '#706b5e',
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: cargando ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', 
              fontSize: '15px',
              opacity: cargando ? 0.7 : 1 
            }}
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', backgroundColor: '#e0ddd5', color: '#5a554a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            Cancelar
          </button>
        </div>
      </form>

    </div>
    
  );
}
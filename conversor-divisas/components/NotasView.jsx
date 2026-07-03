import React, { useState } from 'react';

const NotasView = () => {
  const [notas, setNotas] = useState(() => JSON.parse(localStorage.getItem('mis_notas')) || []);

  const eliminarNota = (id) => {
    const nuevasNotas = notas.filter(n => n.id !== id);
    setNotas(nuevasNotas);
    localStorage.setItem('mis_notas', JSON.stringify(nuevasNotas));
  };

  return (
    <div className="card-container">
      <h2>Historial de Movimientos</h2>
      {notas.length === 0 && <p>No hay notas aún.</p>}
      
      {notas.map(n => (
        <div key={n.id} className="nota-item" style={{ 
          borderBottom: '2px solid #fce4ec', 
          padding: '15px 0', 
          marginBottom: '10px',
          position: 'relative' // Para posicionar el botón de borrar
        }}>
          {/* Botón Eliminar */}
          <button 
            onClick={() => eliminarNota(n.id)}
            style={{ position: 'absolute', right: 0, top: '10px', background: '#ffcdd2', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
          >
            ✕
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '25px' }}>
            <strong>{n.nombre}</strong>
            <small style={{ color: '#888' }}>{n.fecha}</small>
          </div>

          {n.desc && <p style={{ margin: '5px 0', fontStyle: 'italic' }}>{n.desc}</p>}

          {n.resumenTexto ? (
            <div style={{ background: '#fff5f8', padding: '5px', borderRadius: '5px', marginTop: '8px' }}>
              <code>{n.resumenTexto}</code>
            </div>
          ) : (
            <div style={{ marginTop: '8px' }}>
              <strong>Monto:</strong> {n.cantidad} {n.moneda}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotasView;
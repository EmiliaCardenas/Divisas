import React, { useState } from 'react';

const NotasView = () => {
  const [notas, setNotas] = useState(() => JSON.parse(localStorage.getItem('mis_notas')) || []);

  const toggleFavorito = (id) => {
    const nuevasNotas = notas.map(n => 
      n.id === id ? { ...n, esFavorito: !n.esFavorito } : n
    );
    setNotas(nuevasNotas);
    localStorage.setItem('mis_notas', JSON.stringify(nuevasNotas));
  };

  const eliminarNota = (id) => {
    const nuevasNotas = notas.filter(n => n.id !== id);
    setNotas(nuevasNotas);
    localStorage.setItem('mis_notas', JSON.stringify(nuevasNotas));
  };

  // Ordenamos: los favoritos (esFavorito: true) van primero
  const notasOrdenadas = [...notas].sort((a, b) => (b.esFavorito - a.esFavorito));

  return (
    <div className="card-container">
      <h2>Historial de Movimientos</h2>
      {notas.length === 0 && <p>No hay notas aún.</p>}
      
      {notasOrdenadas.map(n => (
        <div key={n.id} className={`nota-item ${n.esFavorito ? 'favorito' : ''}`} style={{ 
          borderBottom: '2px solid #fce4ec', 
          padding: '15px 0', 
          marginBottom: '10px',
          backgroundColor: n.esFavorito ? '#fff9c4' : 'transparent', // Resaltado visual
          position: 'relative'
        }}>
          {/* Botón Favorito */}
          <button 
            onClick={() => toggleFavorito(n.id)}
            style={{ position: 'absolute', right: '35px', top: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {n.esFavorito ? '★' : '☆'}
          </button>

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
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

  const notasOrdenadas = [...notas].sort((a, b) => Number(b.esFavorito) - Number(a.esFavorito));

  return (
    // CAMBIO: usamos notas-wrapper en lugar de tabla-container
    <div className="notas-wrapper">
      <h2 style={{ textAlign: 'center', color: 'var(--color-principal)' }}>Mis Notas</h2>
      {notas.length === 0 && <p style={{textAlign: 'center'}}>No hay notas aún.</p>}
      
      <div className="notas-grid">
        {notasOrdenadas.map(n => (
          <div 
            key={n.id} 
            className={`sticky-note ${n.esFavorito ? 'es-favorito' : ''}`} 
            >
            <div className="nota-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <strong style={{ color: 'var(--color-principal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {n.nombre}
                </strong>
              <div>
                <button onClick={() => toggleFavorito(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  {n.esFavorito ? '★' : '☆'}
                </button>
                <button onClick={() => eliminarNota(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '5px' }}>
                  ✕
                </button>
              </div>
            </div>
            
            {n.desc && <p style={{ fontStyle: 'italic', fontSize: '0.8rem', margin: '5px 0' }}>{n.desc}</p>}
            
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <div style={{ fontWeight: 'semibold', fontSize: '0.8rem' }}>
                {n.valorInicial} {n.monedaInicial} - {new Intl.NumberFormat('es-MX', { style: 'decimal' }).format(n.cantidad)} {n.moneda}
                </div>
                <small style={{ color: '#555', fontSize: '0.7rem' }}>{n.fecha}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotasView;
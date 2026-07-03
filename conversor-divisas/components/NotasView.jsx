import React, { useState } from 'react';

const NotasView = ({ t }) => {
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
      <h2 style={{ textAlign: 'center', color: 'var(--color-principal)' }}>{t.titulo}</h2>
      {notas.length === 0 && <p style={{textAlign: 'center'}}>{t.vacio}</p>}
      
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
                    {/* Estrella más grande y con mejor área de clic */}
                    <button 
                    onClick={() => toggleFavorito(n.id)} 
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '1.4rem', 
                        padding: '0 5px',
                        lineHeight: '1'
                    }}
                    >
                    {n.esFavorito ? '★' : '☆'}
                    </button>
                    
                    {/* Botón de eliminar también un poco más grande para coherencia */}
                    <button 
                    onClick={() => eliminarNota(n.id)} 
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        marginLeft: '5px',
                        fontSize: '1.2rem',
                        padding: '0 5px',
                        lineHeight: '1'
                    }}
                    >
                    ✕
                    </button>
                </div>
                </div>
            
            {n.desc && <p style={{ fontStyle: 'italic', fontSize: '0.8rem', margin: '0 0 8px 0' }}>{n.desc}</p>}
            <div style={{ marginTop: '2px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {n.valorInicial && n.monedaInicial ? (
                    // Caso: Conversión (muestra origen y destino)
                    <>
                        {n.valorInicial} {n.monedaInicial} ⮕ {new Intl.NumberFormat('es-MX', { style: 'decimal' }).format(n.cantidad)} {n.moneda}
                    </>
                    ) : (
                    // Caso: Ingreso o Gasto (muestra solo el monto)
                    <>
                        {new Intl.NumberFormat('es-MX', { style: 'decimal' }).format(n.cantidad)} {n.moneda}
                    </>
                    )}
                </div>
                <small style={{ color: '#555', fontSize: '0.7rem', display: 'block', marginTop: '2px' }}>{n.fecha}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotasView;
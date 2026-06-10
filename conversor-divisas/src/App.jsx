import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasas, setTasas] = useState({});
  const [monedas, setMonedas] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [de, setDe] = useState('USD');
  const [a, setA] = useState('MXN');
  const [resultado, setResultado] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3000/divisas')
      .then(res => {
        setTasas(res.data.conversion_rates);
        setMonedas(Object.keys(res.data.conversion_rates));
      });
  }, []);

  const convertir = () => {
    const res = (cantidad / tasas[de]) * tasas[a];
    setResultado(res.toFixed(2));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB', // Fondo gris muy suave
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      {/* Tarjeta principal con el estilo de tu Inventario */}
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '32px', // Estilo redondeado de tu inventario
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        width: '100%',
        maxWidth: '440px',
        border: '1px solid #F3F4F6'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: '#1F2937', 
          marginBottom: '2rem', 
          textAlign: 'center' 
        }}>
          Conversor Pro
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Campo Cantidad */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>
              Cantidad
            </label>
            <input 
              type="number" 
              value={cantidad} 
              onChange={(e) => setCantidad(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Grilla de Divisas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>De</label>
              <select onChange={(e) => setDe(e.target.value)} value={de} style={{ width: '100%', padding: '12px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                {monedas.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>A</label>
              <select onChange={(e) => setA(e.target.value)} value={a} style={{ width: '100%', padding: '12px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                {monedas.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={convertir}
            style={{
              width: '100%',
              backgroundColor: '#2563EB',
              color: 'white',
              padding: '14px',
              borderRadius: '16px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Convertir
          </button>
        </div>

        {/* Bloque de Resultado */}
        <div style={{ marginTop: '32px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '8px' }}>Resultado:</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', margin: 0 }}>
            {resultado} <span style={{ fontSize: '1.25rem', color: '#6B7280' }}>{a}</span>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default App;
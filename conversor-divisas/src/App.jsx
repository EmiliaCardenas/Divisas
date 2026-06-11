import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Conversor from '../components/Conversor';
import TablaValores from '../components/TablaValores';

function App() {
  const [tasas, setTasas] = useState({});
  const [cantidad, setCantidad] = useState(0);
  const [resultado, setResultado] = useState(0);
  const [de, setDe] = useState(() => localStorage.getItem('de') || 'USD');
  const [a, setA] = useState(() => localStorage.getItem('a') || 'MXN');

  useEffect(() => {
    axios.get('http://localhost:3000/divisas')
      .then(res => setTasas(res.data.conversion_rates));
  }, []);

  useEffect(() => {
    if (tasas[de] && tasas[a]) {
      setResultado(((cantidad / tasas[de].tasa) * tasas[a].tasa).toFixed(2));
    }
  }, [cantidad, de, a, tasas]);

  const swapDivisas = () => { setDe(a); setA(de); };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '440px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Conversor</h1>
        
        <Conversor {...{ cantidad, setCantidad, de, setDe, a, setA, swapDivisas, tasas }} />

        <div style={{ marginTop: '32px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>
            {parseFloat(resultado).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
            <span style={{ fontSize: '1.25rem' }}> {a}</span>
          </h2>
        </div>

        <TablaValores de={de} a={a} tasas={tasas} />
      </div>
    </div>
  );
}

export default App;
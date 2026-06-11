import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Conversor from '../components/Conversor';
import TablaValores from '../components/TablaValores';
import './App.css';

function App() {
  const [tasas, setTasas] = useState({});
  const [cantidad, setCantidad] = useState(0);
  const [resultado, setResultado] = useState(0);
  const [de, setDe] = useState(() => localStorage.getItem('de') || 'USD');
  const [a, setA] = useState(() => localStorage.getItem('a') || 'MXN');

  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'theme-rosa');

  useEffect(() => {
    axios.get('http://localhost:3000/divisas')
      .then(res => setTasas(res.data.conversion_rates));
  }, []);

  useEffect(() => {
    localStorage.setItem('tema', tema);
  }, [tema]);

  useEffect(() => {
    if (tasas[de] && tasas[a]) {
      setResultado(((cantidad / tasas[de].tasa) * tasas[a].tasa).toFixed(2));
    }
  }, [cantidad, de, a, tasas]);

  const swapDivisas = () => { setDe(a); setA(de); };

  return (
      <div className={`main-container ${tema}`}>
          <div className="theme-selector-wrapper">
            <select 
              className="field-style" 
              value={tema} 
              onChange={(e) => setTema(e.target.value)}
            >
              <option value="theme-rosa">Rosa</option>
              <option value="theme-azul">Azul</option>
              <option value="theme-amarillo">Amarillo</option>
              <option value="theme-morado">Morado</option>
              <option value="theme-rojo">Rojo</option>
            </select>
          </div>
        <div className="card-container">
          <h1 style={{ textAlign: 'center' }}>Foreign Exchange</h1>
          <Conversor {...{ cantidad, setCantidad, de, setDe, a, setA, swapDivisas, tasas }} />
          
          <div className="resultado-container">
            <h2 style={{ textAlign: 'center', fontSize:"24px" }} className="resultado-text">
              {parseFloat(resultado).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
              <span className="moneda"> {a}</span>
            </h2>
          </div>

          <TablaValores de={de} a={a} tasas={tasas} />
        </div>
      </div>
    );
}

export default App;
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
    // Aquí llamas a tu backend (asegúrate de que el backend corra en el 3000)
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
    <div className="App">
      <h1>Conversor Pro</h1>
      <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
      <select onChange={(e) => setDe(e.target.value)} value={de}>
        {monedas.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select onChange={(e) => setA(e.target.value)} value={a}>
        {monedas.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <button onClick={convertir}>Convertir</button>
      <h2>{resultado} {a}</h2>
    </div>
  );
}

export default App;
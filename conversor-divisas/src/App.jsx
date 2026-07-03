import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Conversor from '../components/Conversor';
import TablaValores from '../components/TablaValores';
import DesgloseImpuestos from '../components/DesgloseImpuestos';
import FinanzasView from '../components/FinanzasView';
import NotasView from '../components/NotasView';
import './App.css';

function App() {
  const [tasas, setTasas] = useState({});
  const [cantidad, setCantidad] = useState(0);
  const [resultado, setResultado] = useState(0);
  const [de, setDe] = useState(() => localStorage.getItem('de') || 'USD');
  const [a, setA] = useState(() => localStorage.getItem('a') || 'MXN');

  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'theme-rosa');
  const [vistaActual, setVistaActual] = useState('conversor');
  const [modalTemaOpen, setModalTemaOpen] = useState(false);

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
      {/* Selector de Tema Global */}
      <div className="theme-selector-wrapper">
        <select 
          className="field-style" 
          value={tema} 
          onChange={(e) => setTema(e.target.value)}
        >
          <option value="theme-amarillo">Amarillo</option>
          <option value="theme-azul">Azul</option>
          <option value="theme-blanco">Blanco</option>
          <option value="theme-morado">Morado</option>
          <option value="theme-naranja">Naranja</option>
          <option value="theme-rojo">Rojo</option>
          <option value="theme-rosa">Rosa</option>
          <option value="theme-verde">Verde</option>
        </select>
      </div>

      {/* Menú de Navegación (Corregido: usamos setVistaActual) */}
      <nav className="nav-menu">
        <button 
          className={vistaActual === 'conversor' ? 'active' : ''} 
          onClick={() => setVistaActual('conversor')}
        >
          Conversor
        </button>
        <button 
          className={vistaActual === 'finanzas' ? 'active' : ''} 
          onClick={() => setVistaActual('finanzas')}
        >
          Finanzas
        </button>
        <button 
          className={vistaActual === 'notas' ? 'active' : ''} 
          onClick={() => setVistaActual('notas')}
        >
          Notas
        </button>
        <button onClick={() => setModalTemaOpen(true)}>Temas</button>
      </nav>

      {modalTemaOpen && (
        <div className="modal-overlay" onClick={() => setModalTemaOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'var(--color-principal)', textAlign: 'center' }}>Seleccionar Tema</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {['theme-amarillo', 'theme-azul', 'theme-blanco', 'theme-morado', 
              'theme-naranja', 'theme-rojo', 'theme-rosa', 'theme-verde'].map(t => (
                <button key={t} className="swap-btn" onClick={() => { setTema(t); setModalTemaOpen(false); }}>
                  {t.replace('theme-', '').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenido Dinámico según vista (Corregido: usamos vistaActual) */}
      <div className="app-layout">
        {vistaActual === 'conversor' && (
          <>
            <div className="card-container">
              <h1 style={{ textAlign: 'center' }}>Cambio de divisas</h1>
              <Conversor {...{ cantidad, setCantidad, de, setDe, a, setA, swapDivisas, tasas, resultado }} />
              
              <div className="resultado-container">
                <h2 style={{ textAlign: 'center', fontSize: "26px" }} className="resultado-text">
                  {parseFloat(resultado).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                  <span className="moneda"> {a}</span>
                </h2>
              </div>
              <TablaValores de={de} a={a} tasas={tasas} />
            </div>
            <div className="card-container" style={{ maxWidth: '400px' }}>
              <DesgloseImpuestos monedaCodigo={a} montoBase={parseFloat(resultado)} />
            </div>
          </>
        )}

        {vistaActual === 'finanzas' && <FinanzasView tasas={tasas} />}
        {vistaActual === 'notas' && <NotasView />}
      </div>
    </div>
  );
}

export default App;
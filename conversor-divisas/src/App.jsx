import { useState, useEffect } from 'react';
import axios from 'axios';
import { i18n } from '../../utils/i18n';
import Conversor from '../components/Conversor';
import TablaValores from '../components/TablaValores';
import DesgloseImpuestos from '../components/DesgloseImpuestos';
import FinanzasView from '../components/FinanzasView';
import NotasView from '../components/NotasView';
import CalculadoraView from '../components/CalculadoraView';
import './App.css';

function App() {
  const [tasas, setTasas] = useState({});
  const [cantidad, setCantidad] = useState(0);
  const [de, setDe] = useState(() => localStorage.getItem('de') || 'USD');
  const [a, setA] = useState(() => localStorage.getItem('a') || 'MXN');
  const [vistaActual, setVistaActual] = useState('conversor');
  const [modalTemaOpen, setModalTemaOpen] = useState(false);
  const [config, setConfig] = useState(() => JSON.parse(localStorage.getItem('config')) || {
    tema: 'theme-rosa',
    idioma: 'es'
  });

  useEffect(() => {
    localStorage.setItem('config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    const fetchTasas = async () => {
      try {
        const res = await axios.get('http://localhost:3000/divisas');
        setTasas(res.data.conversion_rates);
      } catch (error) {
        console.error("Error cargando divisas:", error);
      }
    };
    fetchTasas();
  }, []);

  const t = i18n[config.idioma];
  const resultado = (tasas[de] && tasas[a]) 
    ? ((cantidad / tasas[de].tasa) * tasas[a].tasa).toFixed(2) 
    : 0;

  const swapDivisas = () => { setDe(a); setA(de); };

  const handleSaveNote = (data) => {
    const notas = JSON.parse(localStorage.getItem('mis_notas')) || [];
    localStorage.setItem('mis_notas', JSON.stringify([...notas, { ...data, id: Date.now() }]));
    alert("¡Guardado!");
  };

  return (
    <div className={`main-container ${config.tema}`}>
      {modalTemaOpen && (
        <div className="modal-overlay" onClick={() => setModalTemaOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'var(--color-principal)', textAlign: 'center' }}>{t.config.titulo}</h3>
            <label>{t.config.tema}</label>
            <div style={{ display: 'grid', gap: '5px', marginBottom: '15px' }}>
              {['theme-amarillo', 'theme-azul', 'theme-blanco', 'theme-morado', 'theme-naranja', 'theme-rojo', 'theme-rosa', 'theme-verde'].map(tema => (
                <button key={tema} className="swap-btn" onClick={() => { setConfig({...config, tema}); setModalTemaOpen(false); }}>
                  {tema.replace('theme-', '').toUpperCase()}
                </button>
              ))}
            </div>
            <label>{t.config.lang}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="swap-btn" onClick={() => { setConfig({...config, idioma: 'es'}); setModalTemaOpen(false); }}>Español</button>
              <button className="swap-btn" onClick={() => { setConfig({...config, idioma: 'en'}); setModalTemaOpen(false); }}>English</button>
            </div>
          </div>
        </div>
      )}
      
      {/* 2. Navegación */}
      <nav className="nav-menu">
        <button className={vistaActual === 'conversor' ? 'active' : ''} onClick={() => setVistaActual('conversor')}>{t.nav.conv}</button>
        <button className={vistaActual === 'finanzas' ? 'active' : ''} onClick={() => setVistaActual('finanzas')}>{t.nav.fin}</button>
        <button className={vistaActual === 'notas' ? 'active' : ''} onClick={() => setVistaActual('notas')}>{t.nav.not}</button>
        <button className={vistaActual === 'calc' ? 'active' : ''} onClick={() => setVistaActual('calc')}>{t.nav.calc}</button>
        <button onClick={() => setModalTemaOpen(true)}>{t.nav.cfg}</button>
      </nav>

      {/* 3. Contenido Principal */}
      <div className="app-layout">
        {vistaActual === 'conversor' && (
          <>
            <div className="card-container">
              <h1 style={{ textAlign: 'center' }}>{t.conv.titulo}</h1>
              <Conversor t={t} tema={config.tema}{...{ cantidad, setCantidad, de, setDe, a, setA, swapDivisas, tasas, resultado }} />
              <div className="resultado-container">
                <h2 style={{ textAlign: 'center', fontSize: "26px" }} className="resultado-text">
                  {parseFloat(resultado).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                  <span className="moneda"> {a}</span>
                </h2>
              </div>
              <TablaValores de={de} a={a} tasas={tasas} t={t.conv} />
            </div>
            <div className="card-container" style={{ maxWidth: '400px' }}>
              <DesgloseImpuestos monedaCodigo={a} montoBase={parseFloat(resultado)} t={t.conv} />
            </div>
          </>
        )}
        {vistaActual === 'finanzas' && <FinanzasView t={t} tema={config.tema} tasas={tasas} />}
        {vistaActual === 'notas' && <NotasView t={t.notas}/>}
        {vistaActual === 'calc' && <CalculadoraView t={t} tema={config.tema} tasas={tasas} onSaveNote={handleSaveNote} />}
      </div>
    </div>
  );
}

export default App;
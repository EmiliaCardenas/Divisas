import React, { useState, useEffect } from 'react';
import NotaModal from './NotaModal';

const FinanzasView = ({ t, tasas }) => {
  const [saldos, setSaldos] = useState(() => JSON.parse(localStorage.getItem('finanzas')) || { MXN: 0, USD: 0 });
  const [notas, setNotas] = useState(() => JSON.parse(localStorage.getItem('mis_notas')) || []);
  const [montoInput, setMontoInput] = useState('');
  const [monedaSeleccionada, setMonedaSeleccionada] = useState('MXN');
  const [monedaVista, setMonedaVista] = useState('MXN');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);

  const notasOrdenadas = [...notas].sort((a, b) => Number(b.esFavorito) - Number(a.esFavorito));

  useEffect(() => {
    localStorage.setItem('finanzas', JSON.stringify(saldos));
  }, [saldos]);

  const calcularSaldoTotalVista = () => {
    if (!tasas || Object.keys(tasas).length === 0) return 0;
    return Object.entries(saldos).reduce((total, [moneda, cantidad]) => {
      const tasaOrigen = tasas[moneda]?.tasa || 1;
      const tasaDestino = tasas[monedaVista]?.tasa || 1;
      return total + (cantidad / tasaOrigen) * tasaDestino;
    }, 0);
  };

  const guardarNotaFinanciera = (data) => {
    const valor = parseFloat(data.cantidad);
    setSaldos(prev => ({ ...prev, [data.moneda]: (prev[data.moneda] || 0) + valor }));
    
    const nuevaNota = { ...data, id: Date.now(), fecha: new Date().toLocaleDateString() };
    const nuevasNotas = [...notas, nuevaNota];
    setNotas(nuevasNotas);
    localStorage.setItem('mis_notas', JSON.stringify(nuevasNotas));
    setModalOpen(false);
  };

  const ajustarSaldoDesdeNota = (nota, esSuma) => {
    const factor = esSuma ? 1 : -1;
    setSaldos(prev => ({ 
        ...prev, 
        [nota.moneda]: (prev[nota.moneda] || 0) + (parseFloat(nota.cantidad) * factor) 
    }));
  };

  const prepararAccion = (esIngreso) => {
    setAccionPendiente(esIngreso ? 'Ingreso' : 'Gasto');
    setModalOpen(true);
  };

  return (
    <div className="finanzas-full-width">
      <div className="finanzas-wrapper">
        
        {/* Panel de Control */}
        <div className="finanzas-control">
          <h2 style={{ color: 'var(--color-principal)', textAlign: 'center', marginTop: 0 }}>
            {t.fin.titulo}: {calcularSaldoTotalVista().toFixed(2)} {monedaVista}
          </h2>
          
          <div className="select-wrapper" style={{ marginBottom: '20px' }}>
            <label>{t.fin.vista} </label>
            <select onChange={(e) => setMonedaVista(e.target.value)} value={monedaVista} className="field-style">
              {Object.keys(tasas || {}).map(cod => <option key={cod} value={cod}>{cod}</option>)}
            </select>
          </div>

          <div className="select-group">
            <input 
                type="text" 
                className="field-style" 
                value={montoInput}
                placeholder={t.conv.placeholder} 
                onChange={(e) => {
                    const valor = e.target.value.replace(',', '.');
                    if (/^[0-9]*\.?[0-9]*$/.test(valor)) setMontoInput(valor);
                }} 
            />
            <select onChange={(e) => setMonedaSeleccionada(e.target.value)} value={monedaSeleccionada} className="field-style">
              {Object.keys(tasas || {}).map(cod => <option key={cod} value={cod}>{cod}</option>)}
            </select>
          </div>

          <div className="select-group" style={{ marginTop: '15px' }}>
            <button className="swap-btn" onClick={() => prepararAccion(true)}>{t.fin.anyadir}</button>
            <button className="swap-btn" onClick={() => prepararAccion(false)}>{t.fin.restar}</button>
          </div>
        </div>

        {/* Historial */}
        <div className="historial-scroll-container">
          <h3 style={{ marginTop: 0, textAlign: 'center' }}>{t.fin.hist}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {notasOrdenadas.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px dashed var(--border-color)' }}>
                  <td style={{ padding: '10px 0' }}>
                    {n.esFavorito && <span style={{ marginRight: '5px' }}>★</span>}
                    {n.nombre}
                  </td>
                  <td className="resultado-celda">
                    {new Intl.NumberFormat('es-MX').format(n.cantidad)} {n.moneda}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => ajustarSaldoDesdeNota(n, true)} className="swap-btn" style={{ minHeight: '30px', padding: '0 10px' }}>+</button>
                    <button onClick={() => ajustarSaldoDesdeNota(n, false)} className="swap-btn" style={{ minHeight: '30px', padding: '0 10px', marginLeft: '5px' }}>-</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NotaModal 
        t={t.notas}
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={guardarNotaFinanciera}
        datoBase={{ 
          nombre: '', 
          cantidad: accionPendiente === 'Gasto' ? -Math.abs(parseFloat(montoInput) || 0) : Math.abs(parseFloat(montoInput) || 0), 
          moneda: monedaSeleccionada,
          resumenTexto: `${accionPendiente} de ${montoInput} ${monedaSeleccionada}`
        }} 
      />
    </div>
  );
};

export default FinanzasView;
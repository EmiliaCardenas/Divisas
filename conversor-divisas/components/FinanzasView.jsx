import React, { useState, useEffect } from 'react';
import NotaModal from './NotaModal';

const FinanzasView = ({ tasas }) => {
  const [saldos, setSaldos] = useState(() => JSON.parse(localStorage.getItem('finanzas')) || { MXN: 0, USD: 0 });
  const [notas, setNotas] = useState(() => JSON.parse(localStorage.getItem('mis_notas')) || []);
  const [montoInput, setMontoInput] = useState(0);
  const [monedaSeleccionada, setMonedaSeleccionada] = useState('MXN');
  const [monedaVista, setMonedaVista] = useState('MXN');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);

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

  // NUEVA FUNCIÓN: Interactuar con el saldo a partir de una nota existente
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
    <div className="finanzas-container">
      <h2>Saldo Total: {calcularSaldoTotalVista().toFixed(2)} {monedaVista}</h2>
      
      <div className="selector-vista" style={{marginBottom: '20px'}}>
        <label>Ver saldo total en: </label>
        <select onChange={(e) => setMonedaVista(e.target.value)} value={monedaVista}>
          {Object.keys(tasas || {}).map(cod => <option key={cod} value={cod}>{cod}</option>)}
        </select>
      </div>

      <div className="controls">
        <input type="number" onChange={(e) => setMontoInput(e.target.value)} placeholder="Monto" />
        <select onChange={(e) => setMonedaSeleccionada(e.target.value)} value={monedaSeleccionada}>
          {Object.keys(tasas || {}).map(cod => <option key={cod} value={cod}>{cod}</option>)}
        </select>
        
        <button onClick={() => prepararAccion(true)}>Añadir</button>
        <button onClick={() => prepararAccion(false)}>Restar</button>
      </div>

      <NotaModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={guardarNotaFinanciera}
        datoBase={{ 
          nombre: '', 
          cantidad: accionPendiente === 'Gasto' ? -Math.abs(montoInput) : Math.abs(montoInput), 
          moneda: monedaSeleccionada,
          resumenTexto: `${accionPendiente} de ${montoInput} ${monedaSeleccionada}`
        }} 
      />

      <h3>Historial de Notas</h3>
      <ul>
        {notas
            .sort((a, b) => (b.esFavorito - a.esFavorito)) // Ordena favoritos al inicio
            .map(n => (
                <li key={n.id} style={{ fontWeight: n.esFavorito ? 'bold' : 'normal' }}>
                {n.fecha} - {n.nombre}: {n.cantidad} {n.moneda}
                <button onClick={() => ajustarSaldoDesdeNota(n, true)}>+</button>
                <button onClick={() => ajustarSaldoDesdeNota(n, false)}>-</button>
                </li>
            ))}
      </ul>
    </div>
  );
};

export default FinanzasView;
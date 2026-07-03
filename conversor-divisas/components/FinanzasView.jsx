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
    // ENVOLVEMOS TODO EN card-container PARA QUE SE VEA COMO LOS DEMÁS
    <div className="card-container">
      <div className="finanzas-container">
        <h2 style={{ color: 'var(--color-principal)', textAlign: 'center' }}>
          Saldo Total: {calcularSaldoTotalVista().toFixed(2)} {monedaVista}
        </h2>
        
        <div className="select-wrapper" style={{ marginBottom: '20px' }}>
          <label>Ver saldo total en: </label>
          <select onChange={(e) => setMonedaVista(e.target.value)} value={monedaVista} className="field-style">
            {Object.keys(tasas || {}).map(cod => <option key={cod} value={cod}>{cod}</option>)}
          </select>
        </div>

        <div className="select-group">
          <input type="number" className="field-style" onChange={(e) => setMontoInput(e.target.value)} placeholder="Monto" />
          <select onChange={(e) => setMonedaSeleccionada(e.target.value)} value={monedaSeleccionada} className="field-style">
            {Object.keys(tasas || {}).map(cod => <option key={cod} value={cod}>{cod}</option>)}
          </select>
        </div>

        <div className="select-group" style={{ marginTop: '10px' }}>
          <button className="swap-btn" onClick={() => prepararAccion(true)} style={{ flex: 1 }}>Añadir</button>
          <button className="swap-btn" onClick={() => prepararAccion(false)} style={{ flex: 1 }}>Restar</button>
        </div>

        {/* Mantenemos tu tabla, que ahora heredará el estilo del card-container */}
        <div className="tabla-container">
          <h3>Historial de Notas</h3>
          <table style={{ width: '100%' }}>
            <tbody>
              {notas.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px dashed var(--border-color)' }}>
                  <td style={{ fontWeight: n.esFavorito ? 'bold' : 'normal', padding: '10px 0' }}>{n.nombre}</td>
                  <td className="resultado-celda">{n.cantidad} {n.moneda}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => ajustarSaldoDesdeNota(n, true)} className="swap-btn" style={{ minHeight: '30px', padding: '0 10px' }}>+</button>
                    <button onClick={() => ajustarSaldoDesdeNota(n, false)} className="swap-btn" style={{ minHeight: '30px', padding: '0 10px', marginLeft: '5px' }}>-</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>
    </div>
  );
};

export default FinanzasView;
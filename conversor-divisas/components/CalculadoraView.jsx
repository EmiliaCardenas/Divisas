import { useState } from 'react';
import NotaModal from './NotaModal';

const CalculadoraView = ({ t, tema, tasas}) => {
  const tc = t.calc;
  const [valor, setValor] = useState('');
  const [total, setTotal] = useState(0);
  const [moneda, setMoneda] = useState('MXN');
  const [monedaDestino, setMonedaDestino] = useState('MXN');
  const [divisaBloqueada, setDivisaBloqueada] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [historial, setHistorial] = useState([]);

  // Operaciones de suma y resta
  const operar = (tipo) => {
    const num = parseFloat(valor) || 0;
    if (num === 0) return;
    
    if (!divisaBloqueada) setDivisaBloqueada(true);
    const operacion = tipo === 'suma' ? num : -num;
    
    setTotal(prev => prev + operacion);
    setHistorial(prev => [...prev, `${tipo === 'suma' ? '+' : '-'} ${num}`]);
    setValor('');
  };

  // Limpiar valor total
  const limpiar = () => {
    setTotal(0);
    setDivisaBloqueada(false);
    setValor('');
    setHistorial([]);
  };

  const totalConvertido = tasas[moneda] && tasas[monedaDestino] 
    ? (total / tasas[moneda].tasa) * tasas[monedaDestino].tasa 
    : total;

  return (
    <>
    <div className="card-container">
      <h3>{tc.titulo}</h3>
      
      <input 
        type="number" 
        value={valor} 
        onChange={(e) => setValor(e.target.value)} 
        className="field-style" 
        placeholder="0.00"
        style={{ marginBottom: '15px' }} 
      />
      
      <select 
        onChange={(e) => setMoneda(e.target.value)} 
        value={moneda} 
        className="field-style" 
        disabled={divisaBloqueada}
      >
        {Object.keys(tasas).map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      
      {/* Botones */}
      <div style={{ display: 'flex', gap: '10px', margin: '10px 0', justifyContent: 'center' }}>
        <button className="swap-btn" onClick={() => operar('suma')}>{tc.suma}</button>
        <button className="swap-btn" onClick={() => operar('resta')}>{tc.resta}</button>
      </div>

      {/* Historial */}
      <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px', textAlign: 'center', minHeight: '20px' }}>
        {historial.join(' ')}
      </div>
      
      {/* Total en moneda origen */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '15px 0' }}>
        <h3 style={{ margin: 0 }}>{total.toFixed(2)} {moneda}</h3>
        <button className="swap-btn" onClick={limpiar}>{tc.limpiar}</button>
      </div>

      {/* Resultado Convertido */}
      <div style={{ margin: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>
            {tc.total}: {totalConvertido.toFixed(2)} {monedaDestino}
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem' }}>{tc.convertir}</span>
            <select 
            onChange={(e) => setMonedaDestino(e.target.value)} 
            value={monedaDestino} 
            className="field-style"
            style={{ width: '90px', padding: '4px' }} 
            >
            {Object.keys(tasas).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
      </div>
      
      <button onClick={() => setModalOpen(true)} className="field-style">{tc.guardar}</button>
      
      
    </div>
    <NotaModal 
        t={t.notas} 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={(data) => {
            const notas = JSON.parse(localStorage.getItem('mis_notas')) || [];
            localStorage.setItem('mis_notas', JSON.stringify([...notas, { ...data, id: Date.now() }]));
            setModalOpen(false);
        }}
        datoBase={{ 
          resumenTexto: `${total.toFixed(2)} ${moneda} = ${totalConvertido.toFixed(2)} ${monedaDestino}` 
        }}
        tema={tema}
      />
    </>
  );
};

export default CalculadoraView;
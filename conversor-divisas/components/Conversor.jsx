import { useState } from 'react';
import NotaModal from './NotaModal';

const Conversor = ({ t, cantidad, setCantidad, de, setDe, a, setA, swapDivisas, tasas, resultado }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const guardarConversion = (data) => {
    const notas = JSON.parse(localStorage.getItem('mis_notas')) || [];
    const nuevaNota = { ...data, id: Date.now(), fecha: new Date().toLocaleDateString() };
    localStorage.setItem('mis_notas', JSON.stringify([...notas, nuevaNota]));
  };

  const handleSwap = () => {
    swapDivisas();
    const nuevoValor = parseFloat(resultado).toFixed(2);
    setCantidad(nuevoValor);
  };

  return (
    <div className="conversor-container">
      <input 
        type="text"
        value={cantidad} 
        onChange={(e) => {
          const valor = e.target.value;
          if (/^[0-9]*[.]?[0-9]*$/.test(valor)) {
            setCantidad(valor);
          }
        }} 
        className="field-style"
        placeholder="0.00"
        maxLength={15} 
      />
      
      <div className="select-group" style={{ marginTop: '15px' }}>
        <select onChange={(e) => setDe(e.target.value)} value={de} className="field-style">
          {Object.entries(tasas).map(([cod, info]) => (
            <option key={cod} value={cod}>{cod} - {info.nombre}</option>
          ))}
        </select>
        
        <button onClick={handleSwap} className="swap-btn">⇅</button>
        
        <select onChange={(e) => setA(e.target.value)} value={a} className="field-style">
          {Object.entries(tasas).map(([cod, info]) => (
            <option key={cod} value={cod}>{cod} - {info.nombre}</option>
          ))}
        </select>
      </div>

      <button onClick={() => setModalOpen(true)} className="field-style" style={{ marginTop: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
        {t.conv.guardar}
      </button>
      
      <NotaModal 
        t={t.notas}
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={guardarConversion}
        datoBase={{ 
          nombre: "", 
          valorInicial: cantidad,
          monedaInicial: de,
          cantidad: resultado, 
          moneda: a,
          resumenTexto: `${cantidad} ${de} → ${resultado} ${a}`
        }}
      />
    </div>
  );
};

export default Conversor;
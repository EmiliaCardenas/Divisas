import React, { useState } from 'react';
import NotaModal from './NotaModal';

const Conversor = ({ cantidad, setCantidad, de, setDe, a, setA, swapDivisas, tasas, resultado }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const guardarConversion = (data) => {
    const notas = JSON.parse(localStorage.getItem('mis_notas')) || [];
    const nuevaNota = { ...data, id: Date.now(), fecha: new Date().toLocaleDateString() };
    localStorage.setItem('mis_notas', JSON.stringify([...notas, nuevaNota]));
  };

  // Función interna para manejar el intercambio completo
  const handleSwap = () => {
    // 1. Ejecutamos el swap de divisas original
    swapDivisas();
    
    // 2. Pasamos el resultado actual al input (convertido a string para el input)
    // Usamos parseFloat y toFixed para asegurar un formato limpio
    const nuevoValor = parseFloat(resultado).toFixed(2);
    setCantidad(nuevoValor);
  };

  return (
    <div className="conversor-container">
      <input 
        type="number" 
        value={cantidad} 
        onChange={(e) => setCantidad(e.target.value)} 
        className="field-style" 
      />
      
      <div className="select-group">
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

      <button onClick={() => setModalOpen(true)} className="save-note-btn">
        Guardar Conversión
      </button>
      
      <NotaModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={guardarConversion}
        datoBase={{ 
          nombre: ``, 
          cantidad: resultado, 
          moneda: a,
          resumenTexto: `de ${cantidad} ${de} a ${resultado} ${a}`
        }} 
      />
    </div>
  );
};

export default Conversor;
import React from 'react';

const Conversor = ({ cantidad, setCantidad, de, setDe, a, setA, swapDivisas, tasas, resultado }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>Cantidad</label>
        <input 
          type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '16px', border: '1px solid #E5E7EB', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>De</label>
          <select onChange={(e) => setDe(e.target.value)} value={de} style={{ width: '100%', padding: '12px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            {Object.entries(tasas).map(([cod, info]) => <option key={cod} value={cod}>{cod} - {info.nombre}</option>)}
          </select>
        </div>

        <button onClick={swapDivisas} style={{ padding: '12px', borderRadius: '50%', border: '1px solid #E5E7EB', backgroundColor: '#F3F4F6', cursor: 'pointer', minWidth: '45px' }}>⇄</button>

        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4B5563', marginBottom: '8px' }}>A</label>
          <select onChange={(e) => setA(e.target.value)} value={a} style={{ width: '100%', padding: '12px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            {Object.entries(tasas).map(([cod, info]) => <option key={cod} value={cod}>{cod} - {info.nombre}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Conversor;
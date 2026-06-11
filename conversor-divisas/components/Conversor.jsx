import React from 'react';

const fieldStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '20px',
  border: '2px solid #fce4ec', 
  backgroundColor: '#fff',
  fontFamily: 'inherit',
  fontSize: '1rem',
  outline: 'none',
  color: '#d81b60'
};

const Conversor = ({ cantidad, setCantidad, de, setDe, a, setA, swapDivisas, tasas }) => {
  return (
    <div className="conversor-container">
      <div>
        <label>Cantidad</label>
        <input 
          type="number" 
          value={cantidad} 
          onChange={(e) => setCantidad(e.target.value)} 
          className="field-style" 
        />
      </div>

      <div className="select-group">
        <div>
          <select onChange={(e) => setDe(e.target.value)} value={de} className="field-style">
            {Object.entries(tasas).map(([cod]) => <option key={cod} value={cod}>{cod}</option>)}
          </select>
        </div>

        <button onClick={swapDivisas} className="swap-btn">Switch</button>

        <div>
          <select onChange={(e) => setA(e.target.value)} value={a} className="field-style">
            {Object.entries(tasas).map(([cod]) => <option key={cod} value={cod}>{cod}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Conversor;
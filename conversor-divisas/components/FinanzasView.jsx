import React, { useState } from 'react';

const FinanzasView = () => {
  const [saldos, setSaldos] = useState(() => JSON.parse(localStorage.getItem('finanzas')) || { MXN: 0, USD: 0 });

  const modificarSaldo = (moneda, cantidad) => {
    const nuevosSaldos = { ...saldos, [moneda]: (saldos[moneda] || 0) + cantidad };
    setSaldos(nuevosSaldos);
    localStorage.setItem('finanzas', JSON.stringify(nuevosSaldos));
  };

  return (
    <div className="card-container">
      <h2>Mis Finanzas</h2>
      <div className="balance-display">MXN: {saldos.MXN} | USD: {saldos.USD}</div>
      <button onClick={() => modificarSaldo('MXN', -50)}>Comida Diario (-50 MXN)</button>
      <button onClick={() => modificarSaldo('USD', 20)}>Depósito (+20 USD)</button>
    </div>
  );
};
export default FinanzasView;
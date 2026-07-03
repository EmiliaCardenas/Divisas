import React, { useState } from 'react';
import NotaModal from './NotaModal';

const FinanzasView = () => {
  const [saldos, setSaldos] = useState(() => JSON.parse(localStorage.getItem('finanzas')) || { MXN: 0, USD: 0 });
  const [modalData, setModalData] = useState(null);

  const ejecutarGastoFinal = (data) => {
    const nuevosSaldos = { ...saldos, [data.moneda]: (saldos[data.moneda] || 0) + data.cantidad };
    setSaldos(nuevosSaldos);
    localStorage.setItem('finanzas', JSON.stringify(nuevosSaldos));

    const notas = JSON.parse(localStorage.getItem('mis_notas')) || [];
    localStorage.setItem('mis_notas', JSON.stringify([...notas, { ...data, id: Date.now(), fecha: new Date().toLocaleDateString() }]));
  };

  return (
    <div className="card-container">
      <h2>Mis Finanzas: {JSON.stringify(saldos)}</h2>
      <button onClick={() => setModalData({ moneda: 'MXN', cantidad: -50 })}>Gastar 50 MXN</button>
      <button onClick={() => setModalData({ moneda: 'USD', cantidad: 10 })}>Ingreso 10 USD</button>
      
      <NotaModal 
        isOpen={!!modalData} 
        onClose={() => setModalData(null)} 
        onSave={ejecutarGastoFinal}
        datoBase={{ 
            nombre: '', 
            cantidad: modalData?.cantidad, 
            moneda: modalData?.moneda 
        }} 
        />
    </div>
  );
};
export default FinanzasView;
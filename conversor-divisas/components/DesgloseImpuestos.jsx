import React from 'react';
import { impuestosData } from '../../utils/impuestosData';

const DesgloseImpuestos = ({ monedaCodigo, montoBase }) => {
  const config = impuestosData[monedaCodigo];
  if (!config) return <p>No tax data for {monedaCodigo}</p>;

  return (
    <div className="impuestos-container">
      <h3>Tax Breakdown</h3>
      {config.paises.map((pais) => {
        const valorNeto = montoBase / (1 + pais.iva / 100);
        const montoIva = montoBase - valorNeto;

        return (
          <div key={pais.nombre} style={{ marginBottom: '15px', background: 'white', padding: '10px', borderRadius: '15px' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{pais.nombre}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Base:</span>
              <span>{valorNeto.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>IVA ({pais.iva}%):</span>
              <span>{montoIva.toFixed(2)}</span>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-principal)', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>{montoBase.toFixed(2)} {monedaCodigo}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DesgloseImpuestos;
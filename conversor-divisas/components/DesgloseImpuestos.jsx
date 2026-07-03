import { impuestosData } from '../../utils/impuestosData';

const DesgloseImpuestos = ({ t, monedaCodigo, montoBase }) => {
  const config = impuestosData[monedaCodigo];
  
  if (!config) return <p>{t.noData}</p>;

  return (
    <div className="tabla-container">
      <h3 style={{ marginTop: 0 }}>{t.impuestosTitulo}</h3>
      {config.paises.map((pais) => {
        const valorNeto = montoBase / (1 + pais.iva / 100);
        const montoIva = montoBase - valorNeto;
        
        // Obtenemos el nombre traducido del diccionario 't.paises' usando el 'id' del país
        const nombrePaisTraducido = t.paises[pais.id] || pais.id;

        return (
          <div key={pais.id} style={{ marginBottom: '15px', background: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '20px' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--color-principal)' }}>
              {nombrePaisTraducido}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t.base}:</span> <span>{valorNeto.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>IVA ({pais.iva}%):</span> <span>{montoIva.toFixed(2)}</span>
            </div>
            <hr style={{ border: '0', borderTop: '1px dashed var(--border-color)', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--color-principal)' }}>
              <span>{t.total}:</span> <span>{montoBase.toFixed(2)} {monedaCodigo}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DesgloseImpuestos;
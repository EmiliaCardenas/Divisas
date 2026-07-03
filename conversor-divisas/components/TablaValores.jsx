const TablaValores = ({ de, a, tasas, t }) => {
  const valores = [1, 10, 100, 1000, 10000];

  if (!tasas || !tasas[de] || !tasas[a]) {
    return null; 
  }

  return (
    <div className="tabla-container">
      <h3>{t.tituloTabla || "Common conversions"}</h3>
      <table>
        <tbody>
          {valores.map(val => (
            <tr key={val}>
              <td style={{ padding: '10px', color: 'black' }}>
                {val.toLocaleString('en-US')} {de}
                </td>
                <td className="resultado-celda">
                {((val / tasas[de].tasa) * tasas[a].tasa)
                        .toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                        })
                    } {a}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaValores;
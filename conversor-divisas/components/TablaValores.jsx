import React from 'react';

const TablaValores = ({ de, a, tasas }) => {
  const valores = [1, 10, 100, 1000, 10000];
  
  // VALIDACIÓN: Si no hay tasas o los datos necesarios no existen, no renderices la tabla
  if (!tasas || !tasas[de] || !tasas[a]) {
    return null; // O puedes retornar un mensaje como <div>Cargando...</div>
  }

  return (
    <div className="tabla-container">
      <h3>Conversiones comunes</h3>
      <table>
        <tbody>
          {valores.map(val => (
            <tr key={val}>
              <td>{val} {de}</td>
              <td className="resultado-celda">
                {((val / tasas[de].tasa) * tasas[a].tasa).toFixed(2)} {a}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaValores;
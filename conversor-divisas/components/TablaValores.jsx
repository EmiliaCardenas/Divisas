import React from 'react';

const TablaValores = ({ de, a, tasas }) => {
  const valores = [1,10, 100, 1000, 10000];
  
  if (!tasas[de] || !tasas[a]) return null;

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ fontSize: '1rem', color: '#374151', marginBottom: '16px' }}>Conversiones rápidas ({de} a {a})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {valores.map(val => (
            <tr key={val} style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '12px 0', color: '#6B7280' }}>{val} {de}</td>
              <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '600' }}>
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
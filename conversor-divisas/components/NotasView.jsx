import React, { useState } from 'react';

const NotasView = () => {
  const [notas, setNotas] = useState(() => JSON.parse(localStorage.getItem('mis_notas')) || []);
  const [input, setInput] = useState('');

  const agregarNota = () => {
    const lista = [...notas, { id: Date.now(), texto: input }];
    setNotas(lista);
    localStorage.setItem('mis_notas', JSON.stringify(lista));
    setInput('');
  };

  return (
    <div className="card-container">
      <h2>Notas</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={agregarNota}>Añadir Nota</button>
      <ul>
        {notas.map(n => <li key={n.id}>{n.texto}</li>)}
      </ul>
    </div>
  );
};
export default NotasView;
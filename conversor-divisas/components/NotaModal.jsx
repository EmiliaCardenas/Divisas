import React, { useState } from 'react';

const NotaModal = ({ isOpen, onClose, onSave, datoBase }) => {
  const [nombre, setNombre] = useState(datoBase.nombre || '');
  const [desc, setDesc] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Guardar Nota</h3>
        
        {/* Resumen detallado */}
        <div className="resumen-box" style={{ background: '#f8f8f8', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
          {/* Si existe resumenTexto lo muestra, si no, muestra el formato básico */}
          <p><strong>Detalle:</strong> {datoBase.resumenTexto || `${datoBase.cantidad} ${datoBase.moneda}`}</p>
          <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
        </div>

        <input placeholder="Nombre (ej. Comida)" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input placeholder="Descripción (opcional)" value={desc} onChange={e => setDesc(e.target.value)} />
        
        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={() => { onSave({ ...datoBase, nombre, desc }); onClose(); }}>Guardar</button>
        </div>
      </div>
    </div>
  );
};
export default NotaModal;
import React, { useState } from 'react';

const NotaModal = ({ isOpen, onClose, onSave, datoBase, t = {}}) => {
  const [nombre, setNombre] = useState(datoBase.nombre || '');
  const [desc, setDesc] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ borderRadius: '30px' }}>
        <h3 style={{ marginTop: '0' }}>{t.tituloModal || "Save Note"}</h3>
        
        <div className="tabla-container" style={{ marginBottom: '15px' }}>
          <p><strong>{t.detalle || "Detail"}:</strong> {datoBase.resumenTexto || `${datoBase.cantidad} ${datoBase.moneda}`}</p>
          <p><strong>{t.fecha|| "Date"}:</strong> {new Date().toLocaleDateString()}</p>
        </div>

        <input 
          placeholder={t.placeholderNombre || "Name"}
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          className="field-style"
          style={{ marginBottom: '10px' }}
          maxLength={25}
        />
        <input 
          placeholder={t.placeholderDesc || "Description"}
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
          className="field-style"
          maxLength={50}
        />
        
        <div className="select-group" style={{ marginTop: '20px' }}>
          <button onClick={onClose} className="swap-btn" style={{ flex: 1 }}>{t.cancelar || "Cancel"}</button>
          <button onClick={() => { onSave({ ...datoBase, nombre, desc }); onClose(); }} className="swap-btn" style={{ flex: 1, backgroundColor: 'var(--color-principal)', color: 'white' }}>
            {t.guardar || "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotaModal;
import React, { useState } from 'react';

const NotaModal = ({ isOpen, onClose, onSave, datoBase, t = {} }) => {
  const [nombre, setNombre] = useState(datoBase.nombre || '');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState(false); // Estado para el error

  if (!isOpen) return null;

  const handleSave = () => {
    if (!nombre.trim()) {
      setError(true); // Activa el error si está vacío o solo espacios
      return;
    }
    onSave({ ...datoBase, nombre, desc });
    setNombre(''); // Limpiar para el siguiente uso
    setDesc('');
    setError(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ borderRadius: '30px' }}>
        <h3 style={{ marginTop: '0' }}>{t.tituloModal || "Save Note"}</h3>
        
        <div className="tabla-container" style={{ marginBottom: '15px' }}>
          <p><strong>{t.detalle || "Detail"}:</strong> {datoBase.resumenTexto || `${datoBase.cantidad} ${datoBase.moneda}`}</p>
          <p><strong>{t.fecha || "Date"}:</strong> {new Date().toLocaleDateString()}</p>
        </div>

        <input 
          placeholder={t.placeholderNombre || "Name"}
          value={nombre} 
          onChange={e => {
            setNombre(e.target.value);
            if (e.target.value.trim()) setError(false); // Quita el error al escribir
          }} 
          className="field-style"
          style={{ 
            marginBottom: '5px',
            borderColor: error ? 'red' : 'inherit' // Borde rojo si hay error
          }}
          maxLength={25}
        />
        {error && (
        <p style={{ color: 'red', fontSize: '0.75rem', margin: '0 0 10px 5px' }}>
            {t.errorNombre || "El nombre es requerido / Name is required"}
        </p>
        )}
        <input 
          placeholder={t.placeholderDesc || "Description"}
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
          className="field-style"
          maxLength={50}
        />
        
        <div className="select-group" style={{ marginTop: '20px' }}>
          <button onClick={onClose} className="swap-btn" style={{ flex: 1 }}>{t.cancelar || "Cancel"}</button>
          <button 
            onClick={handleSave} 
            className="swap-btn" 
            style={{ flex: 1, backgroundColor: 'var(--color-principal)', color: 'white' }}
          >
            {t.guardar || "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotaModal;
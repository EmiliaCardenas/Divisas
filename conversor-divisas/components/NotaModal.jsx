import { useState } from 'react';
import ReactDOM from 'react-dom';

const NotaModal = ({ isOpen, onClose, onSave, datoBase, t = {}, tema }) => {
  const [nombre, setNombre] = useState(datoBase.nombre || '');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  // Constante para guardar
  const handleSave = () => {
    if (!nombre.trim()) {
      setError(true);
      return;
    }
    
    onSave({ 
        ...datoBase, 
        nombre, 
        desc, 
        fechaCreacion: Date.now(),
        fecha: new Date().toLocaleDateString()
    });
    
    setNombre('');
    setDesc('');
    setError(false);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${tema}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderRadius: '30px' }}>
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
            if (e.target.value.trim()) setError(false);
          }} 
          className="field-style"
          style={{ 
            marginBottom: '5px',
            borderColor: error ? 'red' : 'inherit'
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
    </div>,
    document.body
  );
};

export default NotaModal;
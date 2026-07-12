import { useState, useEffect } from 'react';
import axios from 'axios';

import { 
  Ham, PiggyBank, Drumstick, Beef, Apple, Carrot, Fish, 
  CupSoda, Milk, Croissant, Wheat, PersonStanding, Shapes, BrushCleaning, Plus,
} from 'lucide-react';

const iconMap = {
  'Salchichonería': <Ham size={20} />,
  'Despensa': <Shapes size={20} />,
  'Lácteos y huevos': <Milk size={20} />,
  'Higiene': <BrushCleaning size={20} />,
  'Bebidas': <CupSoda size={20} />,
  'Panadería': <Croissant size={20} />,
  'Fruta': <Apple size={20} />,
  'Verdura': <Carrot size={20} />,
  'Tortillas': <Wheat size={20} />,
  'Carne': <Beef size={20} />,
  'Pollo': <Drumstick size={20} />,
  'Cerdo': <PiggyBank size={20} />,
  'Pescado': <Fish size={20} />,
  'Otros': <PersonStanding size={20} />
};

export default function ListaSuper() {
  const [listaActiva, setListaActiva] = useState(() => {
    const guardado = localStorage.getItem('listaSuperActiva');
    return guardado ? JSON.parse(guardado) : [];
  });
  const [catalogo, setCatalogo] = useState({});
  const [cargando, setCargando] = useState(false);
  const [inputsTemporales, setInputsTemporales] = useState({});
  

  useEffect(() => {
    localStorage.setItem('listaSuperActiva', JSON.stringify(listaActiva));
  }, [listaActiva]);

  useEffect(() => {
    axios.get('/api/super/lista')
      .then(res => setCatalogo(res.data.productos || {}));
    if (listaActiva.length === 0) {
      axios.get('/api/super/lista-activa')
        .then(res => setListaActiva(res.data.productos || []));
    }
  }, []);

  const agregarProducto = (producto) => {
    if (!listaActiva.find(p => p.id_producto === producto.id_producto)) {
      setListaActiva([...listaActiva, { 
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre_producto,
        id_categoria: producto.id_categoria,
        nombre_unidad: producto.nombre_unidad,
        cantidad: '' 
      }]);
    }
  };

  const agregarProductoTemporal = (idCategoria, nombreCat) => {
    const nombre = inputsTemporales[idCategoria];
    if (!nombre || nombre.trim() === '') return;

    const nuevoItem = {
      id_producto: `temp_${Date.now()}`,
      nombre_producto: nombre,
      id_categoria: idCategoria,
      nombre_categoria: nombreCat,
      nombre_unidad: 'Pieza(s)',
      cantidad: 1 
    };

    setListaActiva([...listaActiva, nuevoItem]);
    setInputsTemporales({ ...inputsTemporales, [idCategoria]: '' });
  };

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });


  const handleGuardarLista = async () => {
    if (cargando) return;
    const productosParaGuardar = listaActiva
      .map(p => ({ 
        ...p, 
        cantidad: parseFloat(p.cantidad),
        es_temporal: p.id_producto.toString().startsWith('temp_') 
      }))
      .filter(p => !isNaN(p.cantidad) && p.cantidad > 0); 

    if (productosParaGuardar.length === 0) {
      setMensaje({ texto: "Debes agregar al menos un producto con cantidad mayor a 0.", tipo: 'error' });
      return;
    }

    setCargando(true);
    setMensaje({ texto: '', tipo: '' }); 

    try {
      await axios.post('/api/super/guardar-lista', { productos: productosParaGuardar });
      
      setMensaje({ texto: "Lista guardada con éxito", tipo: 'exito' });
      setListaActiva([]); 
      localStorage.removeItem('listaSuperActiva'); 
      
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (err) {
      console.error("Error detallado:", err);
      setMensaje({ texto: "Error al guardar: Asegúrate de que el backend acepte nuevos productos.", tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const renderIcono = (cat) => (
    <div style={{ 
      backgroundColor: '#706b5e', color: 'white', borderRadius: '50%', 
      width: '32px', height: '32px', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', flexShrink: 0 
    }}>
      {iconMap[cat] || <Shapes size={20} />}
    </div>
  );

  const EstilosOcultarFlechas = () => (
    <style>{`
      .no-arrows::-webkit-outer-spin-button,
      .no-arrows::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .no-arrows {
        -moz-appearance: textfield;
      }
    `}</style>
  );

  return (
    <>
      <EstilosOcultarFlechas />
      <h1 style={{ color: '#5a554a', marginBottom: '25px', fontSize: '32px', textAlign: 'center' }}>
        Lista de Super
      </h1>

      {Object.entries(catalogo).map(([nombreCat, data]) => {
        const productosEnLista = listaActiva.filter(p => p.id_categoria === data.id_categoria);
        const productosOrdenados = [...productosEnLista].sort((a, b) => 
            a.nombre_producto.localeCompare(b.nombre_producto)
        );

        return (
          <div key={nombreCat} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
              {renderIcono(nombreCat)}
              <h2 style={{ fontSize: '20px', color: '#5a554a', margin: 0 }}>{nombreCat}</h2>
            </div>

            <div style={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
              <input 
                type="text"
                placeholder="Otro..."
                value={inputsTemporales[data.id_categoria] || ''}
                onChange={(e) => setInputsTemporales({ ...inputsTemporales, [data.id_categoria]: e.target.value })}
                onKeyDown={(e) => { if(e.key === 'Enter') agregarProductoTemporal(data.id_categoria, nombreCat); }}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1ccc0' }}
              />
              <button 
                onClick={() => agregarProductoTemporal(data.id_categoria, nombreCat)}
                style={{ padding: '0 15px', backgroundColor: '#706b5e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Plus size={20} />
              </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, borderTop: '1px solid #d1ccc0' }}>
              {productosOrdenados.length > 0 ? (
                productosOrdenados.map(p => (
                  <li key={p.id_producto} style={{ padding: '8px 4px', borderBottom: '1px solid #d1ccc0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#5a554a', fontWeight: '500' }}>{p.nombre_producto}</span>
                      <span style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>{p.nombre_unidad}</span>
                    </div>

                    <input 
                      type="number" 
                      step="0.001"
                      value={p.cantidad} 
                      placeholder="0"
                      className="no-arrows" 
                      style={{ width: '70px', padding: '4px', textAlign: 'center' }}
                      onChange={(e) => {
                        const val = e.target.value;
                        const regex = /^\d{0,3}(\.\d{0,3})?$/;
                        if (val === '' || regex.test(val)) {
                          setListaActiva(listaActiva.map(item => 
                            item.id_producto === p.id_producto ? { ...item, cantidad: val } : item
                          ));
                        }
                      }} 
                    />
                  </li>
                ))
              ) : (
                <li style={{ padding: '8px 4px', color: '#ccc', fontStyle: 'italic' }}>Sin productos en lista</li>
              )}
            </ul>

            <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
              <select 
                onChange={(e) => {
                  const prod = data.productos.find(p => p.id_producto === parseInt(e.target.value));
                  if(prod) agregarProducto(prod);
                  e.target.value = ""; 
                }}
                style={{
                  flex: 1, padding: '10px', backgroundColor: '#f9f8f4', 
                  color: '#5a554a', border: '1px dashed #706b5e',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
                  appearance: 'none', textAlign: 'center'
                }}
              >
                <option value="">+ Añadir a {nombreCat}</option>
                {data.productos
                  .filter(p => !listaActiva.find(lp => lp.id_producto === p.id_producto))
                  .sort((a,b) => a.nombre_producto.localeCompare(b.nombre_producto))
                  .map(p => (
                    <option key={p.id_producto} value={p.id_producto}>{p.nombre_producto}</option>
                  ))
                }
              </select>
            </div>
          </div>
        );
      })}

      <button 
        onClick={handleGuardarLista} 
        disabled={cargando}
        style={{ 
          width: '100%', padding: '15px', backgroundColor: cargando ? '#b0aca0' : '#5a554a', 
          color: 'white', border: 'none', borderRadius: '8px', cursor: cargando ? 'not-allowed' : 'pointer', 
          marginTop: '20px', opacity: cargando ? 0.7 : 1
        }}
      >
        {cargando ? 'Guardando...' : 'Finalizar y Guardar Lista'}
      </button>
      {mensaje.texto && (
        <div style={{
          marginTop: '15px', padding: '10px', textAlign: 'center', borderRadius: '8px',
          backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'exito' ? '#155724' : '#721c24',
          border: mensaje.tipo === 'exito' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
        }}>
          {mensaje.texto}
        </div>
      )}
    </>
  );
}
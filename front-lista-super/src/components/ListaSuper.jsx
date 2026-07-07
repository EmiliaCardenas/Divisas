import { useState, useEffect } from 'react';
import axios from 'axios';
import FondoLayout from './vizual/FondoLayout';

import { 
  Ham, PiggyBank, Drumstick, Beef, Apple, Carrot, Fish, 
  CupSoda, Milk, Croissant, Wheat, PersonStanding, Shapes, BrushCleaning,
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
  const [listaActiva, setListaActiva] = useState([]);
  const [catalogo, setCatalogo] = useState({});
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/api/super/lista-activa')
      .then(res => setListaActiva(res.data.productos || []));

    axios.get('http://localhost:3000/api/super/lista')
      .then(res => setCatalogo(res.data.productos || {}));
  }, []);

  const agruparPorCategoria = (lista) => {
    return lista.reduce((acc, p) => {
      const categoria = p.nombre_categoria || "Otros";
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(p);
      return acc;
    }, {});
  };

  const listaAgrupada = agruparPorCategoria(listaActiva);

  const agregarProducto = (producto) => {
    if (!listaActiva.find(p => p.id_producto === producto.id_producto)) {
      setListaActiva([...listaActiva, { 
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre_producto,
        id_categoria: producto.id_categoria,
        nombre_unidad: producto.nombre_unidad,
        cantidad: 1
      }]);
    }
  };

  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

const handleGuardarLista = async () => {
  const hoy = new Date().toISOString().slice(0, 10);

  try {
    const res = await axios.get(`http://localhost:3000/api/super/lista-por-fecha/${hoy}`);
    if (res.data.productos && res.data.productos.length > 0) {
      setMensaje({ texto: "Ya existe una lista guardada para el día de hoy.", tipo: 'error' });
      return; 
    }

    await axios.post('http://localhost:3000/api/super/guardar-lista', { productos: listaActiva });
    setMensaje({ texto: "Lista guardada con éxito", tipo: 'exito' });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);

  } catch (err) {
    console.error("Error:", err);
    setMensaje({ texto: "Error al verificar o guardar la lista", tipo: 'error' });
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

  return (
    <FondoLayout alignTop={true}>
      <h1 style={{ color: '#5a554a', marginBottom: '25px', fontSize: '32px', textAlign: 'center' }}>
        Lista de Super
      </h1>

      {/* Mi Lista Actual */}
      {Object.keys(listaAgrupada).map(cat => (
        <div key={cat} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
            {renderIcono(cat)}
            <h2 style={{ fontSize: '20px', color: '#5a554a', margin: 0 }}>{cat}</h2>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, borderTop: '1px solid #d1ccc0' }}>
            {listaAgrupada[cat].map(p => (
              <li key={p.id_producto} style={{ 
                padding: '8px 4px', 
                borderBottom: '1px solid #d1ccc0', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#5a554a', fontWeight: '500' }}>{p.nombre_producto}</span>
                  {p.nombre_unidad && (
                    <span style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>{p.nombre_unidad}</span>
                  )}
                </div>

                <input 
                  type="number" 
                  defaultValue={p.cantidad || 1} 
                  style={{ width: '50px', padding: '4px', borderRadius: '4px', border: '1px solid #d1ccc0' }}
                  onChange={(e) => {
                    const nuevaLista = listaActiva.map(item => 
                      item.id_producto === p.id_producto ? {...item, cantidad: parseInt(e.target.value)} : item
                    );
                    setListaActiva(nuevaLista);
                  }} 
                />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button 
        onClick={() => setMostrarCatalogo(!mostrarCatalogo)}
        style={{ width: '100%', padding: '10px', backgroundColor: '#706b5e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        {mostrarCatalogo ? 'Ocultar catálogo' : 'Agregar más productos'}
      </button>

      {/* Catálogo */}
      {mostrarCatalogo && (
        <div style={{ marginTop: '10px', borderTop: '2px solid #706b5e', paddingTop: '10px' }}>
          {Object.keys(catalogo).map(cat => (
            <div key={cat} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                {renderIcono(cat)}
                <h3 style={{ fontSize: '18px', color: '#5a554a', margin: 0 }}>{cat}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {catalogo[cat].productos.map(p => (
                  <li key={p.id_producto} style={{ padding: '5px 4px', display: 'flex', justifyContent: 'space-between' }}>
                    {p.nombre_producto}
                    <button onClick={() => agregarProducto(p)} style={{ backgroundColor: '#706b5e', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}>+</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleGuardarLista} style={{ width: '100%', padding: '15px', backgroundColor: '#5a554a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}>
        Finalizar y Guardar Lista
      </button>
      {mensaje.texto && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          textAlign: 'center',
          borderRadius: '8px',
          backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'exito' ? '#155724' : '#721c24',
          border: mensaje.tipo === 'exito' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
        }}>
          {mensaje.texto}
        </div>
      )}
    </FondoLayout>
  );
}
import { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Función para agrupar cualquier lista de productos por su categoría
  const agruparPorCategoria = (lista) => {
    return lista.reduce((acc, p) => {
      const categoria = p.nombre_categoria || "Sin categoría";
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(p);
      return acc;
    }, {});
  };

  const listaAgrupada = agruparPorCategoria(listaActiva);

  const agregarProducto = (producto) => {
    if (!listaActiva.find(p => p.id_producto === producto.id_producto)) {
        // Si el producto viene del catálogo, debería traer nombre_categoria
        setListaActiva([...listaActiva, { 
        ...producto, 
        cantidad: 1,
        nombre_categoria: producto.nombre_categoria // Asegurar consistencia
        }]);
    }
    };

  const handleGuardarLista = () => {
    axios.post('http://localhost:3000/api/super/guardar-lista', {
      productos: listaActiva
    }).then(() => alert("Lista guardada en historial"));
  };

  return (
    <section>
      <h1>Lista de Super</h1>

      {/* Lista actual agrupada */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Mi Lista Actual</h2>
        {Object.keys(listaAgrupada).map(categoria => (
          <div key={categoria} style={{ marginBottom: '15px' }}>
            <h4 style={{ color: '#555', marginBottom: '5px' }}>{categoria}</h4>
            <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
              {listaAgrupada[categoria].map(p => (
                <li key={p.id_producto} style={{ marginBottom: '5px' }}>
                  {p.nombre_producto} 
                  <input 
                    type="number" 
                    defaultValue={p.cantidad || 1} 
                    style={{ width: '50px', marginLeft: '10px' }}
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
      </div>

      <button onClick={() => setMostrarCatalogo(!mostrarCatalogo)}>
        {mostrarCatalogo ? 'Ocultar catálogo' : 'Agregar más productos'}
      </button>

      {/* Catálogo completo agrupado */}
      {mostrarCatalogo && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          {Object.keys(catalogo).map(categoria => (
            <div key={categoria} style={{ marginBottom: '15px' }}>
              <h3 style={{ color: '#2c3e50' }}>{categoria}</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {catalogo[categoria].map(p => (
                  <li key={p.id_producto} style={{ marginBottom: '5px' }}>
                    {p.nombre_producto}
                    <button onClick={() => agregarProducto(p)} style={{ marginLeft: '10px' }}>+</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleGuardarLista} style={{ marginTop: '20px', display: 'block' }}>
        Finalizar y Guardar Lista
      </button>
    </section>
  );
}
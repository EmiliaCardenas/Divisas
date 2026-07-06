import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import SelectorUsuario from './components/SelectorUsuario';
import ListaProductos from './components/ListaProductos';

function App() {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<SelectorUsuario setUsuariosGlobal={setUsuarioSeleccionado} />} 
        />
        <Route 
          path="/lista" 
          element={<ListaProductos idUsuario={usuarioSeleccionado} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
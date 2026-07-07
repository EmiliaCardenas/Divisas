import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import SelectorUsuario from './components/SelectorUsuario';
import ListaProductos from './components/ListaProductos';
import Layout from './components/Layout';
import HistorialListas from './components/HistorialListas';
import ListaPermanentes from './components/ListaPermanentes';
import ListaSuper from './components/ListaSuper';
import DetalleLista from './components/DetalleLista';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectorUsuario />} />
        
        <Route element={<Layout />}>
          <Route path="/historial" element={<HistorialListas />} />
          <Route path="/historial/:fecha" element={<DetalleLista />} />
          <Route path="/lista" element={<ListaProductos />} />
          <Route path="/permanentes" element={<ListaPermanentes />} />
          <Route path="/super" element={<ListaSuper />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
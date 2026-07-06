import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import SelectorUsuario from './components/SelectorUsuario';
import ListaProductos from './components/ListaProductos';
import Layout from './components/Layout';
import HistorialListas from './components/HistorialListas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectorUsuario />} />
        
        <Route element={<Layout />}>
          <Route path="/historial" element={<HistorialListas />} />
          <Route path="/lista" element={<ListaProductos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
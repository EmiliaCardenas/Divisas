import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import AdminPanel from './componentes/AdminPanel';
import VistaRankingCompleta from './componentes/RankingList';

axios.defaults.baseURL = 'http://localhost:3000'; 
//axios.defaults.baseURL = 'https://divisas-internacionales.onrender.com'; 

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Ver Ranking</Link> | <Link to="/admin">Administrar</Link>
      </nav>
      <Routes>
        <Route path="/" element={<VistaRankingCompleta />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
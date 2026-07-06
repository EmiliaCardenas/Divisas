import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet /> {/* Aquí se renderizarán Historial o ListaProductos */}
    </div>
  );
}
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/historial" style={{ marginRight: '15px' }}>Historial</Link>
      <Link to="/lista" style={{ marginRight: '15px' }}>Lista Actual</Link>
      <Link to="/permanentes">Gestionar Permanentes</Link>
    </nav>
  );
}
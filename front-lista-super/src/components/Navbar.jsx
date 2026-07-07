import { NavLink } from 'react-router-dom';
import { History, LayoutList, Pin, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const getLinkStyle = ({ isActive }) => ({
    ...linkStyle,
    backgroundColor: isActive ? '#e0ddd5' : 'transparent',
    color: isActive ? '#5a554a' : '#8c8c8c', 
  });

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '10px 15px', 
      borderRadius: '15px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
      border: '1px solid #e0ddd5', 
      marginBottom: '20px',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <NavLink to="/historial" style={getLinkStyle} title="Historial">
        <History size={24} />
      </NavLink>
      
      <NavLink to="/lista" style={getLinkStyle} title="Productos">
        <LayoutList size={24} />
      </NavLink>
      
      <NavLink to="/permanentes" style={getLinkStyle} title="Permanentes">
        <Pin size={24} />
      </NavLink>
      
      <NavLink to="/super" style={getLinkStyle} title="Nueva Lista">
        <ShoppingCart size={24} />
      </NavLink>
    </nav>
  );
}

const linkStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
  padding: '10px',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
};
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',  
      minHeight: '100vh',
      backgroundColor: '#f5f2ed',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Navbar />
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '30px', 
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #e0ddd5',
        boxSizing: 'border-box',
        flex: 1
      }}>
        <Outlet />
      </div>
      
    </div>
  );
}
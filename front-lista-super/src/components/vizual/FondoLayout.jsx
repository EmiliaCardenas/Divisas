export default function FondoLayout({ children, alignTop = false }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: alignTop ? 'flex-start' : 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f2ed',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #e0ddd5',
        marginTop: alignTop ? '20px' : '0' 
      }}>
        {children}
      </div>
    </div>
  );
}
export default function UnauthorizedPage({ userName, userRole, onLogout }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px'
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          textAlign: 'center',
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            backgroundColor: '#ffc107',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}
        >
          ⚠️
        </div>
        <h1 style={{ color: '#343a40', marginBottom: '15px', fontSize: '24px' }}>
          Access Denied
        </h1>
        <p style={{ color: '#6c757d', marginBottom: '10px', fontSize: '16px' }}>
          Hello, <strong>{userName}</strong>
        </p>
        <p style={{ color: '#6c757d', marginBottom: '25px', fontSize: '14px' }}>
          Your account role is <strong>{userRole}</strong>, which does not have permission to access the admin panel.
        </p>
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '6px',
            padding: '15px',
            marginBottom: '25px'
          }}
        >
          <p style={{ margin: 0, color: '#856404', fontSize: '14px' }}>
            Only users with <strong>admin</strong> role can access this area.
            Please contact your system administrator if you believe this is an error.
          </p>
        </div>
        <button
          onClick={onLogout}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

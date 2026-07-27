import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

const LoginScreen = () => {
  const { login } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('swastik123');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="login-screen-overlay">
      <div className="login-card">
        <div className="login-card-header">
          <div className="logo-icon">🏥</div>
          <h2>Swastik Pharmacy</h2>
          <p>Bidupur Bazar, Vaishali | Store Management Portal</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-card-body">
            <div className="login-credential-hint">
              <strong>🔑 Demo Credentials:</strong><br />
              Username: <code>admin</code> | Password: <code>swastik123</code>
            </div>

            <div className="form-group">
              <label>Username / Email *</label>
              <input 
                type="text" 
                required 
                placeholder="Enter username (e.g. admin)" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input 
                type="password" 
                required 
                placeholder="Enter password (e.g. swastik123)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
              🔓 Sign In to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;

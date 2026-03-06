const fs = require('fs');
const content = `import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const savedCredentials = JSON.parse(localStorage.getItem('savedCredentials') || '{}');
  
  const [formData, setFormData] = useState({
    email: savedCredentials.email || '',
    password: savedCredentials.password || '',
  });
  const [rememberMe, setRememberMe] = useState(!!savedCredentials.email);
  const [error, setError] = useState('');
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(formData, rememberMe);
      
      if (rememberMe) {
        localStorage.setItem('savedCredentials', JSON.stringify(formData));
      } else {
        localStorage.removeItem('savedCredentials');
      }
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleClearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('savedCredentials');
    window.location.href = '/login';
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>HouseHunt</h1>
          <p>Find your perfect home</p>
        </div>
        <div className="auth-card">
          <h2>Welcome Back</h2>
          {error && <div className="auth-alert auth-alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-input"
              />
            </div>
            <div className="form-group remember-me">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-text">Remember Me</span>
              </label>
            </div>
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
          <div className="auth-footer" style={{marginTop: '10px'}}>
            <button 
              onClick={handleClearSession}
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Clear saved session
            </button>
          </div>
      </div>
  );
};

export default Login;
`;
fs.writeFileSync('d:/HouseHunt/frontend/src/pages/Login.js', content);
console.log('File written successfully');

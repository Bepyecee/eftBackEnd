import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import messages from '../constants/messages';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await authService.login(username, password);
      navigate('/');
    } catch (err) {
      setError(messages.AUTH.INVALID_CREDENTIALS);
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{messages.AUTH.LOGIN_TITLE}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{messages.AUTH.USERNAME}:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={messages.AUTH.USERNAME_PLACEHOLDER}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{messages.AUTH.PASSWORD}:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={messages.AUTH.PASSWORD_PLACEHOLDER}
              required
            />
          </div>
          <button type="submit" className="login-button">
            {messages.AUTH.LOGIN_BUTTON}
          </button>
        </form>
        <div className="dev-credentials">
          <small>Dev credentials: admin / abc123</small>
        </div>
      </div>
    </div>
  );
}

export default Login;

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

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
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
        
        <div className="divider">
          <span>{messages.LOGIN.OR_DIVIDER}</span>
        </div>
        
        <button onClick={handleGoogleLogin} className="google-login-button">
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          {messages.LOGIN.GOOGLE_SIGN_IN}
        </button>
        
        <div className="dev-credentials">
          <small>{messages.LOGIN.DEV_CREDENTIALS}</small>
        </div>
      </div>
    </div>
  );
}

export default Login;

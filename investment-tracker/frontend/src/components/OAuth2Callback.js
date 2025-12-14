import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuth2Callback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      if (name) {
        localStorage.setItem('userName', name);
      }
      
      // Redirect to dashboard
      navigate('/');
    } else {
      // If no token, redirect to login with error
      navigate('/login?error=oauth_failed');
    }
  }, [location, navigate]);

  return (
    <div className="loading-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Processing authentication...</div>
    </div>
  );
}

export default OAuth2Callback;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import messages from '../constants/messages';
import './Navigation.css';

function Navigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>{messages.DASHBOARD.TITLE}</h1>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">{messages.NAV.HOME}</Link>
        </li>
        <li>
          <Link to="/etfs">{messages.NAV.ETFS}</Link>
        </li>
        <li>
          <Link to="/assets">{messages.NAV.ASSETS}</Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-button">
            {messages.AUTH.LOGOUT}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;

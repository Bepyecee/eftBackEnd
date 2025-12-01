import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import messages from '../constants/messages';
import './Navigation.css';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

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
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{messages.NAV.HOME}</Link>
        </li>
        <li>
          <Link to="/etfs" className={location.pathname === '/etfs' ? 'active' : ''}>{messages.NAV.ETFS}</Link>
        </li>
        <li>
          <Link to="/assets" className={location.pathname === '/assets' ? 'active' : ''}>{messages.NAV.ASSETS}</Link>
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

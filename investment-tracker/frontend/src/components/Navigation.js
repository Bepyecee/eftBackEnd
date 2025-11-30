import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
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
        <h1>Investment Tracker</h1>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/etfs">ETFs</Link>
        </li>
        <li>
          <Link to="/assets">Assets</Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;

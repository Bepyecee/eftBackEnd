import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import messages from '../constants/messages';
import './Dashboard.css';

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        console.log('Dashboard fetched user:', user);
        setCurrentUser(user);
      } catch (error) {
        console.error('Dashboard failed to fetch user:', error);
      }
    };
    
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>
          {currentUser 
            ? messages.DASHBOARD_EXTRA.WELCOME_USER(currentUser.name || currentUser.email) 
            : messages.DASHBOARD.WELCOME}
        </h1>
        <p>{messages.DASHBOARD.OVERVIEW}</p>
      </div>
      <div className="dashboard-cards">
        <Link to="/assets" className="dashboard-card">
          <h3>{messages.DASHBOARD.ASSET_CARD_TITLE}</h3>
          <p>{messages.DASHBOARD.ASSET_CARD_DESCRIPTION}</p>
          <span className="card-arrow">→</span>
        </Link>
        <Link to="/etfs" className="dashboard-card">
          <h3>{messages.DASHBOARD.ETF_CARD_TITLE}</h3>
          <p>{messages.DASHBOARD.ETF_CARD_DESCRIPTION}</p>
          <span className="card-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

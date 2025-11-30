import React from 'react';
import { Link } from 'react-router-dom';
import messages from '../constants/messages';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>{messages.DASHBOARD.WELCOME}</h2>
        <p>{messages.DASHBOARD.OVERVIEW}</p>
      </div>
      <div className="dashboard-cards">
        <Link to="/etfs" className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>{messages.DASHBOARD.ETF_CARD_TITLE}</h3>
          <p>{messages.DASHBOARD.ETF_CARD_DESCRIPTION}</p>
        </Link>
        <Link to="/assets" className="dashboard-card">
          <div className="card-icon">💰</div>
          <h3>{messages.DASHBOARD.ASSET_CARD_TITLE}</h3>
          <p>{messages.DASHBOARD.ASSET_CARD_DESCRIPTION}</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

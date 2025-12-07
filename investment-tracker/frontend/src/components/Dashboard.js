import React from 'react';
import { Link } from 'react-router-dom';
import messages from '../constants/messages';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{messages.DASHBOARD.WELCOME}</h1>
        <p>{messages.DASHBOARD.OVERVIEW}</p>
      </div>
      <div className="dashboard-cards">
        <Link to="/etfs" className="dashboard-card">
          <h3>{messages.DASHBOARD.ETF_CARD_TITLE}</h3>
          <p>{messages.DASHBOARD.ETF_CARD_DESCRIPTION}</p>
          <span className="card-arrow">→</span>
        </Link>
        <Link to="/assets" className="dashboard-card">
          <h3>{messages.DASHBOARD.ASSET_CARD_TITLE}</h3>
          <p>{messages.DASHBOARD.ASSET_CARD_DESCRIPTION}</p>
          <span className="card-arrow">→</span>
        </Link>
        <Link to="/tax-manager" className="dashboard-card">
          <h3>Tax Manager</h3>
          <p>Manage transaction snapshots and tax calculations</p>
          <span className="card-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

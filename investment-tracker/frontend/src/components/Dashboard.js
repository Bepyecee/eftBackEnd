import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome to Investment Tracker</h2>
        <p>Manage your ETFs and assets all in one place</p>
      </div>
      <div className="dashboard-cards">
        <Link to="/etfs" className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>ETFs</h3>
          <p>View and manage your Exchange-Traded Funds</p>
        </Link>
        <Link to="/assets" className="dashboard-card">
          <div className="card-icon">💰</div>
          <h3>Assets</h3>
          <p>Track your asset allocations and investments</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import etfService from '../services/etfService';
import messages from '../constants/messages';
import './EtfList.css';

function EtfList() {
  const [etfs, setEtfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadEtfs();
  }, []);

  const loadEtfs = async () => {
    try {
      setLoading(true);
      const data = await etfService.getAllEtfs();
      setEtfs(data);
      setError('');
    } catch (err) {
      setError(messages.ETF.LOAD_ERROR);
      console.error('Error loading ETFs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(messages.ETF.CONFIRM_DELETE)) {
      try {
        await etfService.deleteEtf(id);
        loadEtfs();
      } catch (err) {
        setError(messages.ETF.DELETE_ERROR);
        console.error('Error deleting ETF:', err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/etfs/edit/${id}`);
  };

  if (loading) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  return (
    <div className="etf-list-container">
      <div className="etf-list-header">
        <h2>{messages.ETF.LIST_TITLE}</h2>
        <button className="add-button" onClick={() => navigate('/etfs/new')}>
          {messages.ETF.ADD_NEW}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {etfs.length === 0 ? (
        <div className="empty-state">
          <p>{messages.ETF.NO_ETFS}</p>
        </div>
      ) : (
        <div className="etf-grid">
          {etfs.map((etf) => (
            <div key={etf.id} className="etf-card">
              <div className="etf-header">
                <h3>{etf.name}</h3>
                <span className={`priority priority-${etf.priority?.toLowerCase()}`}>
                  {etf.priority}
                </span>
              </div>
              <div className="etf-details">
                <div className="detail-row">
                  <span className="label">Ticker:</span>
                  <span className="value">{etf.ticker}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Type:</span>
                  <span className="value">{etf.type}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Risk:</span>
                  <span className="value">{etf.risk}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Current Value:</span>
                  <span className="value">€{etf.currentValue?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Invested:</span>
                  <span className="value">€{etf.investedAmount?.toLocaleString()}</span>
                </div>
              </div>
              <div className="etf-actions">
                <button className="edit-button" onClick={() => handleEdit(etf.id)}>
                  {messages.GENERIC.EDIT}
                </button>
                <button className="delete-button" onClick={() => handleDelete(etf.id)}>
                  {messages.GENERIC.DELETE}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EtfList;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import etfService from '../services/etfService';
import messages from '../constants/messages';
import './EtfList.css';

function EtfList() {
  const [etfs, setEtfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    loadEtfs();
  }, []);

  const loadEtfs = async () => {
    try {
      setLoading(true);
      const data = await etfService.getAllEtfs();
      // Ensure data is always an array
      setEtfs(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(messages.ETF.LOAD_ERROR);
      console.error('Error loading ETFs:', err);
      setEtfs([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const etf = etfs.find(e => e.id === id);
    if (etf && etf.transactions && etf.transactions.length > 0) {
      setError(`Cannot delete ${etf.name}. Please delete all ${etf.transactions.length} transaction(s) first.`);
      return;
    }

    if (window.confirm(messages.ETF.CONFIRM_DELETE)) {
      try {
        await etfService.deleteEtf(id);
        setError('');
        loadEtfs();
      } catch (err) {
        const errorMsg = err.response?.data?.message || messages.ETF.DELETE_ERROR;
        setError(errorMsg);
        console.error('Error deleting ETF:', err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/etfs/edit/${id}`);
  };

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (value) => {
    if (value == null) return '-';
    return `$${parseFloat(value).toFixed(2)}`;
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
        <div className="etf-table-container">
          <table className="etf-table">
            <thead>
              <tr>
                <th></th>
                <th>Ticker</th>
                <th>Name</th>
                <th>Type</th>
                <th>Market</th>
                <th>Risk</th>
                <th>TER</th>
                <th>Transactions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {etfs.map((etf) => (
                <React.Fragment key={etf.id}>
                  <tr className="etf-row">
                    <td>
                      <button 
                        className="expand-button"
                        onClick={() => toggleRow(etf.id)}
                        title={expandedRows.has(etf.id) ? 'Collapse' : 'Expand transactions'}
                      >
                        {expandedRows.has(etf.id) ? '−' : '+'}
                      </button>
                    </td>
                    <td className="ticker-cell">{etf.ticker}</td>
                    <td>{etf.name}</td>
                    <td>{etf.type}</td>
                    <td>{etf.marketConcentration}</td>
                    <td>
                      <span className={`risk-badge risk-${etf.risk?.toLowerCase()}`}>
                        {etf.risk}
                      </span>
                    </td>
                    <td>{etf.ter}%</td>
                    <td>{etf.transactions?.length || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-button-small" 
                          onClick={() => handleEdit(etf.id)}
                          title="Edit ETF"
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-button-small" 
                          onClick={() => handleDelete(etf.id)}
                          title="Delete ETF"
                          disabled={etf.transactions && etf.transactions.length > 0}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(etf.id) && (
                    <tr className="transactions-row">
                      <td colSpan="9">
                        <div className="transactions-container">
                          {!etf.transactions || etf.transactions.length === 0 ? (
                            <div className="no-transactions">
                              No transactions yet
                            </div>
                          ) : (
                            <table className="transactions-table">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Type</th>
                                  <th>Units</th>
                                  <th>Cost</th>
                                  <th>Fees</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {etf.transactions
                                  .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
                                  .map((transaction) => (
                                    <tr key={transaction.id}>
                                      <td>{formatDate(transaction.transactionDate)}</td>
                                      <td>
                                        <span className={`transaction-type ${transaction.transactionType?.toLowerCase()}`}>
                                          {transaction.transactionType}
                                        </span>
                                      </td>
                                      <td>{transaction.unitsPurchased}</td>
                                      <td>{formatCurrency(transaction.transactionCost)}</td>
                                      <td>{formatCurrency(transaction.transactionFees)}</td>
                                      <td className="total-cell">
                                        {formatCurrency(
                                          (parseFloat(transaction.transactionCost) || 0) + 
                                          (parseFloat(transaction.transactionFees) || 0)
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EtfList;

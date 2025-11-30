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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [transactionSortConfig, setTransactionSortConfig] = useState({});
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

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedEtfs = () => {
    if (!sortConfig.key) return etfs;

    const sorted = [...etfs].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle transaction count
      if (sortConfig.key === 'transactionCount') {
        aValue = a.transactions?.length || 0;
        bValue = b.transactions?.length || 0;
      }

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const getSortIndicator = (columnKey) => {
    if (sortConfig.key !== columnKey) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const handleTransactionSort = (etfId, key) => {
    const currentSort = transactionSortConfig[etfId];
    let direction = 'asc';
    if (currentSort?.key === key && currentSort?.direction === 'asc') {
      direction = 'desc';
    }
    setTransactionSortConfig({
      ...transactionSortConfig,
      [etfId]: { key, direction }
    });
  };

  const getSortedTransactions = (etfId, transactions) => {
    if (!transactions || transactions.length === 0) return [];
    
    const sortConfig = transactionSortConfig[etfId];
    if (!sortConfig?.key) {
      // Default: sort by date descending
      return [...transactions].sort((a, b) => 
        new Date(b.transactionDate) - new Date(a.transactionDate)
      );
    }

    const sorted = [...transactions].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date comparison
      if (sortConfig.key === 'transactionDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle null/undefined
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // String comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const getTransactionSortIndicator = (etfId, columnKey) => {
    const sortConfig = transactionSortConfig[etfId];
    if (!sortConfig || sortConfig.key !== columnKey) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (value) => {
    if (value == null) return '-';
    return `€${parseFloat(value).toFixed(2)}`;
  };

  if (loading) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  const sortedEtfs = getSortedEtfs();

  return (
    <div className="etf-list-container">
      <div className="etf-list-header">
        <h2>{messages.ETF.LIST_TITLE}</h2>
        <div className="header-actions">
          {expandedRows.size > 0 && (
            <button className="collapse-all-button" onClick={collapseAll}>
              Collapse All
            </button>
          )}
          <button className="add-button" onClick={() => navigate('/etfs/new')}>
            {messages.ETF.ADD_NEW}
          </button>
        </div>
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
                <th className="sortable" onClick={() => handleSort('ticker')}>
                  Ticker{getSortIndicator('ticker')}
                </th>
                <th className="sortable" onClick={() => handleSort('name')}>
                  Name{getSortIndicator('name')}
                </th>
                <th className="sortable" onClick={() => handleSort('type')}>
                  Type{getSortIndicator('type')}
                </th>
                <th className="sortable" onClick={() => handleSort('marketConcentration')}>
                  Market{getSortIndicator('marketConcentration')}
                </th>
                <th className="sortable" onClick={() => handleSort('risk')}>
                  Risk{getSortIndicator('risk')}
                </th>
                <th className="sortable" onClick={() => handleSort('ter')}>
                  TER{getSortIndicator('ter')}
                </th>
                <th className="sortable" onClick={() => handleSort('transactionCount')}>
                  Transactions{getSortIndicator('transactionCount')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEtfs.map((etf) => (
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
                    <td className="ticker-cell">
                      <a 
                        href={`https://www.justetf.com/en/find-etf.html?query=${etf.ticker}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ticker-link"
                        title={`View ${etf.ticker} on JustETF`}
                      >
                        {etf.ticker}
                      </a>
                    </td>
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
                                  <th className="sortable" onClick={() => handleTransactionSort(etf.id, 'transactionDate')}>
                                    Date{getTransactionSortIndicator(etf.id, 'transactionDate')}
                                  </th>
                                  <th className="sortable" onClick={() => handleTransactionSort(etf.id, 'transactionType')}>
                                    Type{getTransactionSortIndicator(etf.id, 'transactionType')}
                                  </th>
                                  <th className="sortable" onClick={() => handleTransactionSort(etf.id, 'unitsPurchased')}>
                                    Units{getTransactionSortIndicator(etf.id, 'unitsPurchased')}
                                  </th>
                                  <th className="sortable" onClick={() => handleTransactionSort(etf.id, 'transactionCost')}>
                                    Cost{getTransactionSortIndicator(etf.id, 'transactionCost')}
                                  </th>
                                  <th className="sortable" onClick={() => handleTransactionSort(etf.id, 'transactionFees')}>
                                    Fees{getTransactionSortIndicator(etf.id, 'transactionFees')}
                                  </th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getSortedTransactions(etf.id, etf.transactions)
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
                                <tr className="total-row">
                                  <td colSpan="2"><strong>TOTAL</strong></td>
                                  <td><strong>{etf.transactions.reduce((sum, t) => sum + (parseFloat(t.unitsPurchased) || 0), 0).toFixed(3)}</strong></td>
                                  <td><strong>{formatCurrency(etf.transactions.reduce((sum, t) => sum + (parseFloat(t.transactionCost) || 0), 0))}</strong></td>
                                  <td><strong>{formatCurrency(etf.transactions.reduce((sum, t) => sum + (parseFloat(t.transactionFees) || 0), 0))}</strong></td>
                                  <td className="total-cell"><strong>{formatCurrency(etf.transactions.reduce((sum, t) => sum + (parseFloat(t.transactionCost) || 0) + (parseFloat(t.transactionFees) || 0), 0))}</strong></td>
                                </tr>
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

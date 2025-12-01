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

  const getTypeDisplay = (type) => {
    const typeMap = {
      'EQUITY': messages.ETF.TYPE_EQUITY,
      'BOND': messages.ETF.TYPE_BOND,
    };
    return typeMap[type] || type;
  };

  const getMarketDisplay = (market) => {
    const marketMap = {
      'US': messages.ETF.MARKET_US,
      'US_TECH': messages.ETF.MARKET_US_TECH,
      'EUROPE': messages.ETF.MARKET_EUROPE,
      'EUROPE_TECH': messages.ETF.MARKET_EUROPE_TECH,
      'GLOBAL_DEVELOPED': messages.ETF.MARKET_GLOBAL_DEVELOPED,
      'GLOBAL_DEVELOPED_TECH': messages.ETF.MARKET_GLOBAL_DEVELOPED_TECH,
      'GLOBAL_INCL_EMERGING': messages.ETF.MARKET_GLOBAL_INCL_EMERGING,
      'CORPORATE': messages.ETF.MARKET_CORPORATE,
    };
    return marketMap[market] || market;
  };;

  const calculateSummaryData = () => {
    return etfs.map(etf => {
      const transactionCount = etf.transactions?.length || 0;
      const totalInvestment = (etf.transactions || []).reduce((sum, t) => 
        sum + (parseFloat(t.transactionCost) || 0) + (parseFloat(t.transactionFees) || 0), 0
      );
      const totalUnits = (etf.transactions || []).reduce((sum, t) => 
        sum + (parseFloat(t.unitsPurchased) || 0), 0
      );
      
      return {
        ticker: etf.ticker,
        name: etf.name,
        transactionCount,
        totalUnits,
        totalInvestment
      };
    }).filter(summary => summary.transactionCount > 0);
  };

  const getChartColors = (count) => {
    const colors = [
      '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
      '#00BCD4', '#FFEB3B', '#795548', '#607D8B', '#E91E63',
      '#3F51B5', '#8BC34A', '#FFC107', '#673AB7', '#FF5722'
    ];
    return colors.slice(0, count);
  };

  if (loading) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  const sortedEtfs = getSortedEtfs();
  const summaryData = calculateSummaryData();
  const totalPortfolioValue = summaryData.reduce((sum, item) => sum + item.totalInvestment, 0);

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
                <th className="sortable" onClick={() => handleSort('volatility')}>
                  Volatility{getSortIndicator('volatility')}
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
                    <td>{getTypeDisplay(etf.type)}</td>
                    <td>{getMarketDisplay(etf.marketConcentration)}</td>
                    <td>
                      <span className={`volatility-badge volatility-${etf.volatility?.toLowerCase()}`}>
                        {etf.volatility}
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

      {summaryData.length > 0 && (
        <>
          <div className="portfolio-summary-section">
            <h3>Portfolio Summary</h3>
            <div className="summary-content">
              <div className="summary-table-container">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Name</th>
                      <th>Transactions</th>
                      <th>Total Units</th>
                      <th>Total Investment</th>
                      <th>% of Portfolio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.map(item => (
                      <tr key={item.ticker}>
                        <td className="ticker-cell">
                          <a 
                            href={`https://www.justetf.com/en/find-etf.html?query=${item.ticker}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ticker-link"
                          >
                            {item.ticker}
                          </a>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.transactionCount}</td>
                        <td>{item.totalUnits.toFixed(3)}</td>
                        <td>{formatCurrency(item.totalInvestment)}</td>
                        <td>{((item.totalInvestment / totalPortfolioValue) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan="2"><strong>TOTAL</strong></td>
                      <td><strong>{summaryData.reduce((sum, item) => sum + item.transactionCount, 0)}</strong></td>
                      <td><strong>{summaryData.reduce((sum, item) => sum + item.totalUnits, 0).toFixed(3)}</strong></td>
                      <td><strong>{formatCurrency(totalPortfolioValue)}</strong></td>
                      <td><strong>100.0%</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="chart-container">
                <h4>Investment Distribution</h4>
                <svg viewBox="0 0 200 200" className="pie-chart">
                  {summaryData.map((item, index) => {
                    const colors = getChartColors(summaryData.length);
                    const percentage = (item.totalInvestment / totalPortfolioValue) * 100;
                    let cumulativePercentage = 0;
                    for (let i = 0; i < index; i++) {
                      cumulativePercentage += (summaryData[i].totalInvestment / totalPortfolioValue) * 100;
                    }
                    
                    const startAngle = (cumulativePercentage / 100) * 2 * Math.PI - Math.PI / 2;
                    const endAngle = ((cumulativePercentage + percentage) / 100) * 2 * Math.PI - Math.PI / 2;
                    
                    const x1 = 100 + 80 * Math.cos(startAngle);
                    const y1 = 100 + 80 * Math.sin(startAngle);
                    const x2 = 100 + 80 * Math.cos(endAngle);
                    const y2 = 100 + 80 * Math.sin(endAngle);
                    
                    const largeArcFlag = percentage > 50 ? 1 : 0;
                    
                    const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                    
                    return (
                      <g key={item.ticker}>
                        <path d={path} fill={colors[index]} stroke="white" strokeWidth="2" />
                      </g>
                    );
                  })}
                </svg>
                <div className="chart-legend">
                  {summaryData.map((item, index) => {
                    const colors = getChartColors(summaryData.length);
                    const percentage = ((item.totalInvestment / totalPortfolioValue) * 100).toFixed(1);
                    return (
                      <div key={item.ticker} className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: colors[index] }}></span>
                        <span className="legend-text">{item.ticker}: {percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EtfList;

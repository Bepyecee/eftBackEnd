import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import etfService from '../services/etfService';
import messages from '../constants/messages';
import './TaxManager.css';

function TaxManager() {
  const [etfs, setEtfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allTransactionsCollapsed, setAllTransactionsCollapsed] = useState(false);
  const [allTransactionsSortConfig, setAllTransactionsSortConfig] = useState({ key: 'transactionDate', direction: 'asc' });
  const [transactionFilters, setTransactionFilters] = useState({ tickers: [], startDate: '', endDate: '' });
  const [tickerDropdownOpen, setTickerDropdownOpen] = useState(false);

  useEffect(() => {
    loadEtfs();
  }, []);

  const loadEtfs = async () => {
    try {
      setLoading(true);
      const data = await etfService.getAllEtfs();
      setEtfs(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(messages.ETF.LOAD_ERROR);
      console.error('Error loading ETFs:', err);
      setEtfs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value) => {
    if (value == null) return '-';
    return `€${parseFloat(value).toFixed(2)}`;
  };

  const getAllTransactions = () => {
    const allTransactions = [];
    etfs.forEach(etf => {
      if (etf.transactions && etf.transactions.length > 0) {
        etf.transactions.forEach(transaction => {
          allTransactions.push({
            ...transaction,
            etfTicker: etf.ticker,
            etfName: etf.name,
            deemedDisposalDate: transaction.deemedDisposalDate
              ? transaction.deemedDisposalDate
              : new Date(new Date(transaction.transactionDate).setFullYear(new Date(transaction.transactionDate).getFullYear() + 8)).toISOString().split('T')[0]
          });
        });
      }
    });
    return allTransactions;
  };

  const getFilteredTransactions = () => {
    let transactions = getAllTransactions();
    
    // Filter by tickers (multi-select)
    if (transactionFilters.tickers.length > 0) {
      transactions = transactions.filter(t => 
        transactionFilters.tickers.includes(t.etfTicker)
      );
    }
    
    // Filter by start date
    if (transactionFilters.startDate) {
      transactions = transactions.filter(t => 
        new Date(t.transactionDate) >= new Date(transactionFilters.startDate)
      );
    }
    
    // Filter by end date
    if (transactionFilters.endDate) {
      transactions = transactions.filter(t => 
        new Date(t.transactionDate) <= new Date(transactionFilters.endDate)
      );
    }
    
    return transactions;
  };

  const getUniqueTickers = () => {
    const tickers = new Set();
    etfs.forEach(etf => {
      if (etf.transactions && etf.transactions.length > 0) {
        tickers.add(etf.ticker);
      }
    });
    return Array.from(tickers).sort();
  };

  const toggleTickerFilter = (ticker) => {
    const currentTickers = [...transactionFilters.tickers];
    const index = currentTickers.indexOf(ticker);
    if (index > -1) {
      currentTickers.splice(index, 1);
    } else {
      currentTickers.push(ticker);
    }
    setTransactionFilters({...transactionFilters, tickers: currentTickers});
  };

  const exportToExcel = () => {
    const allTransactions = getSortedAllTransactions();
    // Prepare data for export
    const exportData = allTransactions.map(transaction => ({
      'Date': formatDate(transaction.transactionDate),
      'Ticker': transaction.etfTicker,
      'ETF Name': transaction.etfName,
      'Units': transaction.unitsPurchased,
      'Price/Unit': transaction.unitsPurchased && transaction.transactionCost 
        ? (parseFloat(transaction.transactionCost) / parseFloat(transaction.unitsPurchased)).toFixed(2)
        : '0.00',
      'Cost': parseFloat(transaction.transactionCost || 0).toFixed(2),
      'Fees': parseFloat(transaction.transactionFees || 0).toFixed(2),
      'Total': ((parseFloat(transaction.transactionCost) || 0) + (parseFloat(transaction.transactionFees) || 0)).toFixed(2),
      'Deemed Disposal Date': formatDate(transaction.deemedDisposalDate)
    }));

    // Add totals row
    const totalUnits = allTransactions.reduce((sum, t) => sum + (parseFloat(t.unitsPurchased) || 0), 0);
    const totalCost = allTransactions.reduce((sum, t) => sum + (parseFloat(t.transactionCost) || 0), 0);
    const totalFees = allTransactions.reduce((sum, t) => sum + (parseFloat(t.transactionFees) || 0), 0);
    const grandTotal = totalCost + totalFees;

    exportData.push({
      'Date': '',
      'Ticker': '',
      'ETF Name': 'TOTAL',
      'Units': totalUnits.toFixed(3),
      'Price/Unit': '',
      'Cost': totalCost.toFixed(2),
      'Fees': totalFees.toFixed(2),
      'Total': grandTotal.toFixed(2),
      'Deemed Disposal Date': ''
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    // Generate filename with current date
    const date = new Date();
    const filename = `ETF_Transactions_${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);
  };

  const handleAllTransactionsSort = (key) => {
    let direction = 'asc';
    if (allTransactionsSortConfig.key === key && allTransactionsSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setAllTransactionsSortConfig({ key, direction });
  };

  const getSortedAllTransactions = () => {
    const allTransactions = getFilteredTransactions();
    if (!allTransactionsSortConfig.key) return allTransactions;

    return [...allTransactions].sort((a, b) => {
      let aValue = a[allTransactionsSortConfig.key];
      let bValue = b[allTransactionsSortConfig.key];

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) {
        return allTransactionsSortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return allTransactionsSortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getAllTransactionsSortIndicator = (key) => {
    if (allTransactionsSortConfig.key !== key) return ' ↕';
    return allTransactionsSortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  const allTransactions = getSortedAllTransactions();
  const totalTransactionCount = getAllTransactions().length;
  const filteredTransactionCount = allTransactions.length;

  return (
    <div className="tax-manager-container">
      {error && <div className="error-message">{error}</div>}

      {allTransactions.length > 0 && (
        <div className="all-transactions-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>ETF Transactions and Tax Deadlines</h3>
              <button 
                className="section-toggle-button"
                onClick={() => setAllTransactionsCollapsed(!allTransactionsCollapsed)}
                title={allTransactionsCollapsed ? 'Expand section' : 'Collapse section'}
              >
                {allTransactionsCollapsed ? '▼' : '▲'}
              </button>
              <div className="section-summary-inline">
                <span>
                  {filteredTransactionCount !== totalTransactionCount 
                    ? `${filteredTransactionCount} of ${totalTransactionCount} transactions` 
                    : `${totalTransactionCount} transaction${totalTransactionCount !== 1 ? 's' : ''}`
                  } with deemed disposal dates for tax planning.
                </span>
              </div>
            </div>
          </div>
          {!allTransactionsCollapsed && (
            <>
            <div className="transaction-filters">
              <div className="filter-group">
                <label>Tickers:</label>
                <div className="ticker-dropdown">
                  <button 
                    type="button"
                    className="ticker-dropdown-button"
                    onClick={() => setTickerDropdownOpen(!tickerDropdownOpen)}
                  >
                    {transactionFilters.tickers.length === 0 
                      ? 'Select tickers...' 
                      : `${transactionFilters.tickers.length} selected`
                    }
                    <span className="dropdown-arrow">{tickerDropdownOpen ? '▲' : '▼'}</span>
                  </button>
                  {tickerDropdownOpen && (
                    <div className="ticker-dropdown-menu">
                      {getUniqueTickers().map(ticker => (
                        <label key={ticker} className="ticker-dropdown-item">
                          <input
                            type="checkbox"
                            checked={transactionFilters.tickers.includes(ticker)}
                            onChange={() => toggleTickerFilter(ticker)}
                          />
                          <span>{ticker}</span>
                        </label>
                      ))}
                      {getUniqueTickers().length === 0 && (
                        <div className="no-tickers">No tickers available</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="filter-group">
                <label htmlFor="start-date-filter">From:</label>
                <input
                  id="start-date-filter"
                  type="date"
                  value={transactionFilters.startDate}
                  onChange={(e) => setTransactionFilters({...transactionFilters, startDate: e.target.value})}
                  className="filter-input"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="end-date-filter">To:</label>
                <input
                  id="end-date-filter"
                  type="date"
                  value={transactionFilters.endDate}
                  onChange={(e) => setTransactionFilters({...transactionFilters, endDate: e.target.value})}
                  className="filter-input"
                />
              </div>
              {(transactionFilters.tickers.length > 0 || transactionFilters.startDate || transactionFilters.endDate) && (
                <button 
                  className="clear-filters-button"
                  onClick={() => setTransactionFilters({ tickers: [], startDate: '', endDate: '' })}
                >
                  Clear Filters
                </button>
              )}
              <button 
                className="export-button"
                onClick={exportToExcel}
                disabled={allTransactions.length === 0}
                title="Export visible transactions to Excel"
              >
                Export to Excel
              </button>
            </div>
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleAllTransactionsSort('transactionDate')}>
                      Date{getAllTransactionsSortIndicator('transactionDate')}
                    </th>
                    <th className="sortable" onClick={() => handleAllTransactionsSort('etfTicker')}>
                      Ticker{getAllTransactionsSortIndicator('etfTicker')}
                    </th>
                    <th className="sortable" onClick={() => handleAllTransactionsSort('etfName')}>
                      ETF Name{getAllTransactionsSortIndicator('etfName')}
                    </th>
                    <th className="sortable" onClick={() => handleAllTransactionsSort('unitsPurchased')}>
                      Units{getAllTransactionsSortIndicator('unitsPurchased')}
                    </th>
                    <th className="sortable" onClick={() => handleAllTransactionsSort('pricePerUnit')}>
                      Price/Unit{getAllTransactionsSortIndicator('pricePerUnit')}
                    </th>
                    <th className="sortable" onClick={() => handleAllTransactionsSort('transactionCost')}>
                      Cost{getAllTransactionsSortIndicator('transactionCost')}
                    </th>
                    <th className="sortable" onClick={() => handleAllTransactionsSort('transactionFees')}>
                      Fees{getAllTransactionsSortIndicator('transactionFees')}
                    </th>
                    <th>Total</th>
                    <th className="sortable" onClick={() => handleAllTransactionsSort('deemedDisposalDate')}>
                      Deemed Disposal{getAllTransactionsSortIndicator('deemedDisposalDate')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allTransactions.map((transaction) => (
                    <tr key={`${transaction.etfTicker}-${transaction.id}`}>
                      <td>{formatDate(transaction.transactionDate)}</td>
                      <td className="ticker-cell">
                        <a 
                          href={`https://www.justetf.com/en/find-etf.html?query=${transaction.etfTicker}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ticker-link"
                        >
                          {transaction.etfTicker}
                        </a>
                      </td>
                      <td>{transaction.etfName}</td>
                      <td>{transaction.unitsPurchased}</td>
                      <td>{formatCurrency(
                        transaction.unitsPurchased && transaction.transactionCost 
                          ? parseFloat(transaction.transactionCost) / parseFloat(transaction.unitsPurchased)
                          : 0
                      )}</td>
                      <td>{formatCurrency(transaction.transactionCost)}</td>
                      <td>{formatCurrency(transaction.transactionFees)}</td>
                      <td className="total-cell">
                        {formatCurrency(
                          (parseFloat(transaction.transactionCost) || 0) + 
                          (parseFloat(transaction.transactionFees) || 0)
                        )}
                      </td>
                      <td>{formatDate(transaction.deemedDisposalDate)}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="3"><strong>TOTAL</strong></td>
                    <td><strong>{allTransactions.reduce((sum, t) => sum + (parseFloat(t.unitsPurchased) || 0), 0).toFixed(3)}</strong></td>
                    <td></td>
                    <td><strong>{formatCurrency(allTransactions.reduce((sum, t) => sum + (parseFloat(t.transactionCost) || 0), 0))}</strong></td>
                    <td><strong>{formatCurrency(allTransactions.reduce((sum, t) => sum + (parseFloat(t.transactionFees) || 0), 0))}</strong></td>
                    <td className="total-cell"><strong>{formatCurrency(allTransactions.reduce((sum, t) => sum + (parseFloat(t.transactionCost) || 0) + (parseFloat(t.transactionFees) || 0), 0))}</strong></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      )}

      {!loading && allTransactions.length === 0 && (
        <div className="empty-state">
          <p>No transactions found. Add transactions to your ETFs to see tax calculations.</p>
        </div>
      )}
    </div>
  );
}

export default TaxManager;

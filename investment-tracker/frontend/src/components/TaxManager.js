import React, { useState, useEffect } from 'react';
import etfService from '../services/etfService';
import messages from '../constants/messages';
import './TaxManager.css';

function TaxManager() {
  const [etfs, setEtfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taxCalculatorCollapsed, setTaxCalculatorCollapsed] = useState(false);
  const [taxCalculatorSortConfig, setTaxCalculatorSortConfig] = useState({ key: 'transactionDate', direction: 'asc' });

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

  const getAllTransactions = () => {
    const allTransactions = [];
    etfs.forEach(etf => {
      if (etf.transactions && etf.transactions.length > 0) {
        etf.transactions.forEach(transaction => {
          allTransactions.push({
            ...transaction,
            etfTicker: etf.ticker,
            etfName: etf.name
          });
        });
      }
    });
    return allTransactions;
  };

  const handleTaxCalculatorSort = (key) => {
    let direction = 'asc';
    if (taxCalculatorSortConfig.key === key && taxCalculatorSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setTaxCalculatorSortConfig({ key, direction });
  };

  const getTaxCalculatorSortIndicator = (key) => {
    if (taxCalculatorSortConfig.key !== key) return ' ↕';
    return taxCalculatorSortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  const allTransactions = getAllTransactions();

  return (
    <div className="tax-manager-container">
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && etfs.length > 0 && allTransactions.length > 0 && (
        <div className="tax-calculator-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>{messages.TAX_CALCULATOR.TITLE}</h3>
              <button 
                className="section-toggle-button"
                onClick={() => setTaxCalculatorCollapsed(!taxCalculatorCollapsed)}
                title={taxCalculatorCollapsed ? 'Expand section' : 'Collapse section'}
              >
                {taxCalculatorCollapsed ? '▼' : '▲'}
              </button>
              <div className="section-summary-inline">
                <span>
                  Deemed disposal dates for all {allTransactions.length} transaction{allTransactions.length !== 1 ? 's' : ''}. Tax event occurs 8 years after purchase.
                </span>
              </div>
            </div>
          </div>
          {!taxCalculatorCollapsed && (
            <div className="transactions-table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleTaxCalculatorSort('etfTicker')}>
                      Ticker{getTaxCalculatorSortIndicator('etfTicker')}
                    </th>
                    <th className="sortable" onClick={() => handleTaxCalculatorSort('transactionDate')}>
                      {messages.TAX_CALCULATOR.TRANSACTION_DATE}{getTaxCalculatorSortIndicator('transactionDate')}
                    </th>
                    <th className="sortable" onClick={() => handleTaxCalculatorSort('deemedDisposalDate')}>
                      {messages.TAX_CALCULATOR.DEEMED_DISPOSAL_DATE}{getTaxCalculatorSortIndicator('deemedDisposalDate')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...allTransactions]
                    .map(transaction => ({
                      ...transaction,
                      deemedDisposalDate: transaction.deemedDisposalDate
                        ? transaction.deemedDisposalDate
                        : new Date(new Date(transaction.transactionDate).setFullYear(new Date(transaction.transactionDate).getFullYear() + 8)).toISOString().split('T')[0]
                    }))
                    .sort((a, b) => {
                      let aValue = a[taxCalculatorSortConfig.key];
                      let bValue = b[taxCalculatorSortConfig.key];

                      if (taxCalculatorSortConfig.key === 'transactionDate' || taxCalculatorSortConfig.key === 'deemedDisposalDate') {
                        aValue = new Date(aValue).getTime();
                        bValue = new Date(bValue).getTime();
                      }

                      if (typeof aValue === 'string') {
                        return taxCalculatorSortConfig.direction === 'asc'
                          ? aValue.localeCompare(bValue)
                          : bValue.localeCompare(aValue);
                      }

                      return taxCalculatorSortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                    })
                    .map((transaction) => (
                      <tr key={`${transaction.etfTicker}-${transaction.id}`}>
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
                        <td>{formatDate(transaction.transactionDate)}</td>
                        <td>{formatDate(transaction.deemedDisposalDate)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
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

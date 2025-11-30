import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import transactionService from '../services/transactionService';
import messages from '../constants/messages';
import './EtfList.css';

function TransactionList() {
  const navigate = useNavigate();
  const { etfId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [etfId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactionsForEtf(etfId);
      setTransactions(data);
      setError('');
    } catch (err) {
      setError(messages.TRANSACTION.LOAD_ERROR);
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm(messages.TRANSACTION.CONFIRM_DELETE)) {
      try {
        await transactionService.deleteTransaction(etfId, transactionId);
        setTransactions(transactions.filter((t) => t.id !== transactionId));
      } catch (err) {
        setError(messages.TRANSACTION.DELETE_ERROR);
        console.error('Error deleting transaction:', err);
      }
    }
  };

  const handleAddTransaction = () => {
    navigate(`/etfs/${etfId}/transactions/new`);
  };

  const handleBack = () => {
    navigate('/etfs');
  };

  const calculateTotals = () => {
    let totalUnits = 0;
    let totalInvested = 0;

    transactions.forEach((transaction) => {
      const units = parseFloat(transaction.unitsPurchased) || 0;
      const cost = parseFloat(transaction.transactionCost) || 0;
      const fees = parseFloat(transaction.transactionFees) || 0;

      if (transaction.transactionType === 'BUY') {
        totalUnits += units;
        totalInvested += cost + fees;
      } else if (transaction.transactionType === 'SELL') {
        totalUnits -= units;
        totalInvested -= cost - fees;
      }
    });

    return { totalUnits, totalInvested };
  };

  if (loading) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  const { totalUnits, totalInvested } = calculateTotals();

  return (
    <div className="etf-list-container">
      <div className="list-header">
        <h2>{messages.TRANSACTION.LIST_TITLE}</h2>
        <div className="header-actions">
          <button className="back-button" onClick={handleBack}>
            {messages.GENERIC.BACK}
          </button>
          <button className="add-button" onClick={handleAddTransaction}>
            {messages.TRANSACTION.ADD_NEW}
          </button>
        </div>
      </div>

      <div className="transaction-summary">
        <div className="summary-item">
          <span className="summary-label">{messages.TRANSACTION.TOTAL_UNITS}:</span>
          <span className="summary-value">{totalUnits.toFixed(3)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{messages.TRANSACTION.TOTAL_INVESTED}:</span>
          <span className="summary-value">€{totalInvested.toFixed(2)}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {transactions.length === 0 ? (
        <div className="no-data">{messages.TRANSACTION.NO_TRANSACTIONS}</div>
      ) : (
        <div className="etf-grid">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="etf-card">
              <div className="etf-card-header">
                <h3>{new Date(transaction.transactionDate).toLocaleDateString()}</h3>
                <span className={`transaction-type-badge ${transaction.transactionType.toLowerCase()}`}>
                  {transaction.transactionType === 'BUY'
                    ? messages.TRANSACTION.TYPE_BUY
                    : messages.TRANSACTION.TYPE_SELL}
                </span>
              </div>
              <div className="etf-card-body">
                <div className="etf-info-row">
                  <span className="etf-label">{messages.TRANSACTION.UNITS_PURCHASED}:</span>
                  <span className="etf-value">{transaction.unitsPurchased}</span>
                </div>
                <div className="etf-info-row">
                  <span className="etf-label">{messages.TRANSACTION.TRANSACTION_COST}:</span>
                  <span className="etf-value">€{transaction.transactionCost}</span>
                </div>
                <div className="etf-info-row">
                  <span className="etf-label">{messages.TRANSACTION.TRANSACTION_FEES}:</span>
                  <span className="etf-value">€{transaction.transactionFees}</span>
                </div>
              </div>
              <div className="etf-card-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(transaction.id)}
                >
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

export default TransactionList;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import etfService from '../services/etfService';
import transactionService from '../services/transactionService';
import messages from '../constants/messages';
import './EtfForm.css';

function EtfForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    type: 'EQUITY',
    marketConcentration: 'GLOBAL_DEVELOPED',
    domicile: 'IRELAND',
    volatility: 'HIGH',
    ticker: '',
    ter: '',
    notes: '',
  });

  const [transactions, setTransactions] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransactionIndex, setEditingTransactionIndex] = useState(null);
  const [transactionFormData, setTransactionFormData] = useState({
    transactionDate: new Date().toISOString().split('T')[0],
    transactionType: 'BUY',
    unitsPurchased: '',
    transactionCost: '',
    transactionFees: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionSortConfig, setTransactionSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    if (isEditMode) {
      loadEtf();
      loadTransactions();
    }
  }, [id]);

  const loadTransactions = async () => {
    if (!id) return;
    try {
      const data = await transactionService.getTransactionsForEtf(id);
      setTransactions(data);
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
  };

  const loadEtf = async () => {
    try {
      setLoading(true);
      const data = await etfService.getEtfById(id);
      setFormData({
        name: data.name || '',
        type: data.type || 'EQUITY',
        marketConcentration: data.marketConcentration || 'GLOBAL_DEVELOPED',
        domicile: data.domicile || 'IRELAND',
        volatility: data.volatility || 'HIGH',
        ticker: data.ticker || '',
        ter: data.ter || '',
        notes: data.notes || '',
      });
      setError('');
    } catch (err) {
      setError(messages.ETF.LOAD_ERROR);
      console.error('Error loading ETF:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTransactionClick = () => {
    setShowTransactionForm(true);
    setEditingTransactionIndex(null);
    setTransactionFormData({
      transactionDate: new Date().toISOString().split('T')[0],
      transactionType: 'BUY',
      unitsPurchased: '',
      transactionCost: '',
      transactionFees: '',
    });
  };

  const handleSaveTransaction = async () => {
    if (!transactionFormData.unitsPurchased || !transactionFormData.transactionCost || !transactionFormData.transactionFees) {
      setError(messages.TRANSACTION.SAVE_ERROR);
      return;
    }

    const transaction = {
      ...transactionFormData,
      unitsPurchased: parseFloat(transactionFormData.unitsPurchased),
      transactionCost: parseFloat(transactionFormData.transactionCost),
      transactionFees: parseFloat(transactionFormData.transactionFees),
    };

    if (isEditMode) {
      // Save to backend immediately if editing existing ETF
      try {
        if (editingTransactionIndex !== null) {
          // Update existing transaction
          const existingTransaction = transactions[editingTransactionIndex];
          await transactionService.updateTransaction(id, existingTransaction.id, transaction);
        } else {
          // Create new transaction
          await transactionService.createTransaction(id, transaction);
        }
        await loadTransactions();
      } catch (err) {
        setError(messages.TRANSACTION.SAVE_ERROR);
        console.error('Error saving transaction:', err);
        return;
      }
    } else {
      // Store locally for new ETF
      if (editingTransactionIndex !== null) {
        const updatedTransactions = [...transactions];
        updatedTransactions[editingTransactionIndex] = transaction;
        setTransactions(updatedTransactions);
      } else {
        setTransactions([...transactions, transaction]);
      }
    }

    setShowTransactionForm(false);
    setEditingTransactionIndex(null);
  };

  const handleEditTransaction = (index) => {
    const transaction = transactions[index];
    setTransactionFormData({
      transactionDate: transaction.transactionDate,
      transactionType: transaction.transactionType,
      unitsPurchased: transaction.unitsPurchased.toString(),
      transactionCost: transaction.transactionCost.toString(),
      transactionFees: transaction.transactionFees.toString(),
    });
    setEditingTransactionIndex(index);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = async (index) => {
    if (!window.confirm(messages.TRANSACTION.CONFIRM_DELETE)) {
      return;
    }

    if (isEditMode) {
      // Delete from backend
      try {
        const transaction = transactions[index];
        await transactionService.deleteTransaction(id, transaction.id);
        await loadTransactions();
      } catch (err) {
        setError(messages.TRANSACTION.DELETE_ERROR);
        console.error('Error deleting transaction:', err);
      }
    } else {
      // Remove from local state
      setTransactions(transactions.filter((_, i) => i !== index));
    }
  };

  const handleCancelTransaction = () => {
    setShowTransactionForm(false);
    setEditingTransactionIndex(null);
  };

  const handleTransactionSort = (key) => {
    let direction = 'asc';
    if (transactionSortConfig.key === key && transactionSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setTransactionSortConfig({ key, direction });
  };

  const getSortedTransactions = () => {
    if (!transactionSortConfig.key) {
      return [...transactions].sort((a, b) => 
        new Date(b.transactionDate) - new Date(a.transactionDate)
      );
    }

    const sorted = [...transactions].sort((a, b) => {
      let aValue = a[transactionSortConfig.key];
      let bValue = b[transactionSortConfig.key];

      if (transactionSortConfig.key === 'transactionDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return transactionSortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return transactionSortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return transactionSortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const getTransactionSortIndicator = (columnKey) => {
    if (transactionSortConfig.key !== columnKey) return ' ↕';
    return transactionSortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      
      // Convert numeric fields from strings to numbers
      const submitData = {
        ...formData,
        ter: formData.ter ? parseFloat(formData.ter) : 0,
      };

      let etfId = id;
      if (isEditMode) {
        await etfService.updateEtf(id, submitData);
      } else {
        // Create ETF first, then save transactions
        const createdEtf = await etfService.createEtf(submitData);
        etfId = createdEtf.id;
        
        // Save all transactions for the new ETF
        if (transactions.length > 0) {
          for (const transaction of transactions) {
            await transactionService.createTransaction(etfId, transaction);
          }
        }
      }
      
      navigate('/etfs');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError(`An ETF with ticker "${formData.ticker}" already exists. Please use a different ticker.`);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(messages.ETF.SAVE_ERROR);
      }
      console.error('Error saving ETF:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/etfs');
  };

  if (loading && isEditMode) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  return (
    <div className="etf-form-container">
      <div className="form-header">
        <h2>{isEditMode ? messages.ETF.EDIT_TITLE : messages.ETF.CREATE_TITLE}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="etf-form">
        <div className="form-grid">
          {/* Row 1: Ticker Symbol and Name */}
          <div className="form-group">
            <label htmlFor="ticker">{messages.ETF.TICKER} *</label>
            {transactions.length > 0 ? (
              <a 
                href={`https://www.justetf.com/en/find-etf.html?query=${formData.ticker}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ticker-readonly-link"
                title={`View ${formData.ticker} on JustETF`}
              >
                {formData.ticker}
              </a>
            ) : (
              <input
                type="text"
                id="ticker"
                name="ticker"
                value={formData.ticker}
                onChange={handleChange}
                placeholder={messages.ETF.TICKER_PLACEHOLDER}
                required
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name">{messages.ETF.NAME} *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={messages.ETF.NAME_PLACEHOLDER}
              required
            />
          </div>

          {/* Row 2: Type, TER, and Volatility */}
          <div className="form-group">
            <label htmlFor="type">{messages.ETF.TYPE}</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="BOND">{messages.ETF.TYPE_BOND}</option>
              <option value="EQUITY">{messages.ETF.TYPE_EQUITY}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ter">{messages.ETF.TER} *</label>
            <input
              type="number"
              step="0.01"
              id="ter"
              name="ter"
              value={formData.ter}
              onChange={handleChange}
              placeholder={messages.ETF.TER_PLACEHOLDER}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="volatility">{messages.ETF.VOLATILITY} *</label>
            <select
              id="volatility"
              name="volatility"
              value={formData.volatility}
              onChange={handleChange}
              required
            >
              <option value="LOW">{messages.ETF.VOLATILITY_LOW}</option>
              <option value="MODERATE">{messages.ETF.VOLATILITY_MODERATE}</option>
              <option value="HIGH">{messages.ETF.VOLATILITY_HIGH}</option>
              <option value="VERY_HIGH">{messages.ETF.VOLATILITY_VERY_HIGH}</option>
            </select>
          </div>

          {/* Row 3: Domicile and Market Concentration */}
          <div className="form-group">
            <label htmlFor="domicile">{messages.ETF.DOMICILE} *</label>
            <select
              id="domicile"
              name="domicile"
              value={formData.domicile}
              onChange={handleChange}
              required
            >
              <option value="IRELAND">{messages.ETF.DOMICILE_IRELAND}</option>
              <option value="EUROPE">{messages.ETF.DOMICILE_EUROPE}</option>
              <option value="OTHER">{messages.ETF.DOMICILE_OTHER}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="marketConcentration">{messages.ETF.MARKET_CONCENTRATION} *</label>
            <select
              id="marketConcentration"
              name="marketConcentration"
              value={formData.marketConcentration}
              onChange={handleChange}
              required
            >
              <option value="US">{messages.ETF.MARKET_US}</option>
              <option value="US_TECH">{messages.ETF.MARKET_US_TECH}</option>
              <option value="EUROPE">{messages.ETF.MARKET_EUROPE}</option>
              <option value="EUROPE_TECH">{messages.ETF.MARKET_EUROPE_TECH}</option>
              <option value="GLOBAL_DEVELOPED">{messages.ETF.MARKET_GLOBAL_DEVELOPED}</option>
              <option value="GLOBAL_DEVELOPED_TECH">{messages.ETF.MARKET_GLOBAL_DEVELOPED_TECH}</option>
              <option value="GLOBAL_INCL_EMERGING">{messages.ETF.MARKET_GLOBAL_INCL_EMERGING}</option>
              <option value="CORPORATE">{messages.ETF.MARKET_CORPORATE}</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="notes">{messages.ETF.NOTES}</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder={messages.ETF.NOTES_PLACEHOLDER}
          />
        </div>

        {/* Transactions Section */}
        <div className="transactions-section">
          <div className="transactions-header">
            <h3>{messages.TRANSACTION.TITLE}</h3>
            <button
              type="button"
              className="add-transaction-button"
              onClick={handleAddTransactionClick}
            >
              {messages.TRANSACTION.ADD_NEW}
            </button>
          </div>

          {/* Transaction Form */}
          {showTransactionForm && (
            <div className="transaction-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="transactionDate">{messages.TRANSACTION.TRANSACTION_DATE} *</label>
                  <input
                    type="date"
                    id="transactionDate"
                    name="transactionDate"
                    value={transactionFormData.transactionDate}
                    onChange={handleTransactionChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="transactionType">{messages.TRANSACTION.TRANSACTION_TYPE} *</label>
                  <select
                    id="transactionType"
                    name="transactionType"
                    value={transactionFormData.transactionType}
                    onChange={handleTransactionChange}
                    required
                  >
                    <option value="BUY">{messages.TRANSACTION.TYPE_BUY}</option>
                    <option value="SELL">{messages.TRANSACTION.TYPE_SELL}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="unitsPurchased">{messages.TRANSACTION.UNITS_PURCHASED} *</label>
                  <input
                    type="number"
                    step="0.001"
                    id="unitsPurchased"
                    name="unitsPurchased"
                    value={transactionFormData.unitsPurchased}
                    onChange={handleTransactionChange}
                    placeholder={messages.TRANSACTION.UNITS_PURCHASED_PLACEHOLDER}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="transactionCost">{messages.TRANSACTION.TRANSACTION_COST} *</label>
                  <input
                    type="number"
                    step="0.01"
                    id="transactionCost"
                    name="transactionCost"
                    value={transactionFormData.transactionCost}
                    onChange={handleTransactionChange}
                    placeholder={messages.TRANSACTION.TRANSACTION_COST_PLACEHOLDER}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="transactionFees">{messages.TRANSACTION.TRANSACTION_FEES} *</label>
                  <input
                    type="number"
                    step="0.01"
                    id="transactionFees"
                    name="transactionFees"
                    value={transactionFormData.transactionFees}
                    onChange={handleTransactionChange}
                    placeholder={messages.TRANSACTION.TRANSACTION_FEES_PLACEHOLDER}
                    required
                  />
                </div>
              </div>

              <div className="transaction-form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelTransaction}
                >
                  {messages.GENERIC.CANCEL}
                </button>
                <button
                  type="button"
                  className="save-transaction-button"
                  onClick={handleSaveTransaction}
                >
                  {editingTransactionIndex !== null ? 'Update Transaction' : 'Save Transaction'}
                </button>
              </div>
            </div>
          )}

          {/* Transactions List */}
          {transactions.length > 0 && (
            <div className="transactions-list">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleTransactionSort('transactionDate')}>
                      {messages.TRANSACTION.TRANSACTION_DATE}{getTransactionSortIndicator('transactionDate')}
                    </th>
                    <th className="sortable" onClick={() => handleTransactionSort('transactionType')}>
                      {messages.TRANSACTION.TRANSACTION_TYPE}{getTransactionSortIndicator('transactionType')}
                    </th>
                    <th className="sortable" onClick={() => handleTransactionSort('unitsPurchased')}>
                      {messages.TRANSACTION.UNITS_PURCHASED}{getTransactionSortIndicator('unitsPurchased')}
                    </th>
                    <th className="sortable" onClick={() => handleTransactionSort('transactionCost')}>
                      {messages.TRANSACTION.TRANSACTION_COST}{getTransactionSortIndicator('transactionCost')}
                    </th>
                    <th className="sortable" onClick={() => handleTransactionSort('transactionFees')}>
                      {messages.TRANSACTION.TRANSACTION_FEES}{getTransactionSortIndicator('transactionFees')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedTransactions().map((transaction, index) => (
                    <tr key={index}>
                      <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`transaction-type-badge ${transaction.transactionType?.toLowerCase() || 'buy'}`}>
                          {transaction.transactionType === 'BUY'
                            ? messages.TRANSACTION.TYPE_BUY
                            : messages.TRANSACTION.TYPE_SELL}
                        </span>
                      </td>
                      <td>{transaction.unitsPurchased}</td>
                      <td>€{transaction.transactionCost}</td>
                      <td>€{transaction.transactionFees}</td>
                      <td>
                        <div className="transaction-actions">
                          <button
                            type="button"
                            className="edit-transaction-button"
                            onClick={() => handleEditTransaction(index)}
                          >
                            {messages.GENERIC.EDIT}
                          </button>
                          <button
                            type="button"
                            className="delete-transaction-button"
                            onClick={() => handleDeleteTransaction(index)}
                          >
                            {messages.GENERIC.DELETE}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="2"><strong>TOTAL</strong></td>
                    <td><strong>{transactions.reduce((sum, t) => sum + (parseFloat(t.unitsPurchased) || 0), 0).toFixed(3)}</strong></td>
                    <td><strong>€{transactions.reduce((sum, t) => sum + (parseFloat(t.transactionCost) || 0), 0).toFixed(2)}</strong></td>
                    <td><strong>€{transactions.reduce((sum, t) => sum + (parseFloat(t.transactionFees) || 0), 0).toFixed(2)}</strong></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            {messages.GENERIC.CANCEL}
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? messages.GENERIC.LOADING : messages.GENERIC.SAVE}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EtfForm;

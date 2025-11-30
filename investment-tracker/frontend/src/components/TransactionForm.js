import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import transactionService from '../services/transactionService';
import messages from '../constants/messages';
import './EtfForm.css';

function TransactionForm() {
  const navigate = useNavigate();
  const { etfId } = useParams();

  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().split('T')[0],
    transactionType: 'BUY',
    unitsPurchased: '',
    transactionCost: '',
    transactionFees: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const submitData = {
        transactionDate: formData.transactionDate,
        transactionType: formData.transactionType,
        unitsPurchased: parseFloat(formData.unitsPurchased),
        transactionCost: parseFloat(formData.transactionCost),
        transactionFees: parseFloat(formData.transactionFees),
      };

      await transactionService.createTransaction(etfId, submitData);
      navigate(`/etfs/${etfId}/transactions`);
    } catch (err) {
      setError(messages.TRANSACTION.SAVE_ERROR);
      console.error('Error saving transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/etfs/${etfId}/transactions`);
  };

  return (
    <div className="etf-form-container">
      <div className="form-header">
        <h2>{messages.TRANSACTION.CREATE_TITLE}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="etf-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="transactionDate">{messages.TRANSACTION.TRANSACTION_DATE} *</label>
            <input
              type="date"
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="transactionType">{messages.TRANSACTION.TRANSACTION_TYPE} *</label>
            <select
              id="transactionType"
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
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
              value={formData.unitsPurchased}
              onChange={handleChange}
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
              value={formData.transactionCost}
              onChange={handleChange}
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
              value={formData.transactionFees}
              onChange={handleChange}
              placeholder={messages.TRANSACTION.TRANSACTION_FEES_PLACEHOLDER}
              required
            />
          </div>
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

export default TransactionForm;

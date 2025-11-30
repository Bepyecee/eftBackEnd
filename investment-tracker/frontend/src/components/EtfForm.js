import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import etfService from '../services/etfService';
import messages from '../constants/messages';
import './EtfForm.css';

function EtfForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    priority: 'LOW',
    type: 'EQUITY',
    globalCoverage: '',
    domicile: '',
    risk: '',
    ticker: '',
    dividend: '',
    ter: '',
    notes: '',
    currentValue: '',
    investedAmount: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadEtf();
    }
  }, [id]);

  const loadEtf = async () => {
    try {
      setLoading(true);
      const data = await etfService.getEtfById(id);
      setFormData({
        name: data.name || '',
        priority: data.priority || 'LOW',
        type: data.type || 'EQUITY',
        globalCoverage: data.globalCoverage || '',
        domicile: data.domicile || '',
        risk: data.risk || '',
        ticker: data.ticker || '',
        dividend: data.dividend || '',
        ter: data.ter || '',
        notes: data.notes || '',
        currentValue: data.currentValue || '',
        investedAmount: data.investedAmount || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      
      // Convert numeric fields from strings to numbers
      const submitData = {
        ...formData,
        ter: formData.ter ? parseFloat(formData.ter) : 0,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : 0,
        investedAmount: formData.investedAmount ? parseFloat(formData.investedAmount) : 0,
      };

      if (isEditMode) {
        await etfService.updateEtf(id, submitData);
      } else {
        await etfService.createEtf(submitData);
      }
      
      navigate('/etfs');
    } catch (err) {
      setError(messages.ETF.SAVE_ERROR);
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

          <div className="form-group">
            <label htmlFor="ticker">{messages.ETF.TICKER} *</label>
            <input
              type="text"
              id="ticker"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              placeholder={messages.ETF.TICKER_PLACEHOLDER}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">{messages.ETF.PRIORITY}</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">{messages.ETF.PRIORITY_LOW}</option>
              <option value="MEDIUM">{messages.ETF.PRIORITY_MEDIUM}</option>
              <option value="HIGH">{messages.ETF.PRIORITY_HIGH}</option>
              <option value="VERY_HIGH">{messages.ETF.PRIORITY_VERY_HIGH}</option>
            </select>
          </div>

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
            <label htmlFor="globalCoverage">{messages.ETF.GLOBAL_COVERAGE}</label>
            <input
              type="text"
              id="globalCoverage"
              name="globalCoverage"
              value={formData.globalCoverage}
              onChange={handleChange}
              placeholder={messages.ETF.GLOBAL_COVERAGE_PLACEHOLDER}
            />
          </div>

          <div className="form-group">
            <label htmlFor="domicile">{messages.ETF.DOMICILE}</label>
            <input
              type="text"
              id="domicile"
              name="domicile"
              value={formData.domicile}
              onChange={handleChange}
              placeholder={messages.ETF.DOMICILE_PLACEHOLDER}
            />
          </div>

          <div className="form-group">
            <label htmlFor="risk">{messages.ETF.RISK}</label>
            <input
              type="text"
              id="risk"
              name="risk"
              value={formData.risk}
              onChange={handleChange}
              placeholder={messages.ETF.RISK_PLACEHOLDER}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dividend">{messages.ETF.DIVIDEND}</label>
            <input
              type="text"
              id="dividend"
              name="dividend"
              value={formData.dividend}
              onChange={handleChange}
              placeholder={messages.ETF.DIVIDEND_PLACEHOLDER}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ter">{messages.ETF.TER}</label>
            <input
              type="number"
              step="0.01"
              id="ter"
              name="ter"
              value={formData.ter}
              onChange={handleChange}
              placeholder={messages.ETF.TER_PLACEHOLDER}
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentValue">{messages.ETF.CURRENT_VALUE}</label>
            <input
              type="number"
              step="0.01"
              id="currentValue"
              name="currentValue"
              value={formData.currentValue}
              onChange={handleChange}
              placeholder={messages.ETF.CURRENT_VALUE_PLACEHOLDER}
            />
          </div>

          <div className="form-group">
            <label htmlFor="investedAmount">{messages.ETF.INVESTED_AMOUNT}</label>
            <input
              type="number"
              step="0.01"
              id="investedAmount"
              name="investedAmount"
              value={formData.investedAmount}
              onChange={handleChange}
              placeholder={messages.ETF.INVESTED_AMOUNT_PLACEHOLDER}
            />
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

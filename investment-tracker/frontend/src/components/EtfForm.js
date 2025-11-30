import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import etfService from '../services/etfService';
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
      setError('Failed to load ETF');
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
      setError(isEditMode ? 'Failed to update ETF' : 'Failed to create ETF');
      console.error('Error saving ETF:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/etfs');
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading ETF...</div>;
  }

  return (
    <div className="etf-form-container">
      <div className="form-header">
        <h2>{isEditMode ? 'Edit ETF' : 'Create New ETF'}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="etf-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ticker">Ticker *</label>
            <input
              type="text"
              id="ticker"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="VERY_HIGH">Very High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="BOND">Bond</option>
              <option value="EQUITY">Equity</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="globalCoverage">Global Coverage</label>
            <input
              type="text"
              id="globalCoverage"
              name="globalCoverage"
              value={formData.globalCoverage}
              onChange={handleChange}
              placeholder="e.g., Ireland, EU, US, Global"
            />
          </div>

          <div className="form-group">
            <label htmlFor="domicile">Domicile</label>
            <input
              type="text"
              id="domicile"
              name="domicile"
              value={formData.domicile}
              onChange={handleChange}
              placeholder="e.g., Ireland, Luxembourg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="risk">Risk Level</label>
            <input
              type="text"
              id="risk"
              name="risk"
              value={formData.risk}
              onChange={handleChange}
              placeholder="e.g., Low, Moderate, High, Very High"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dividend">Dividend</label>
            <input
              type="text"
              id="dividend"
              name="dividend"
              value={formData.dividend}
              onChange={handleChange}
              placeholder="e.g., Accumulating, Distributing"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ter">TER (Total Expense Ratio)</label>
            <input
              type="number"
              step="0.01"
              id="ter"
              name="ter"
              value={formData.ter}
              onChange={handleChange}
              placeholder="e.g., 0.15"
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentValue">Current Value (€)</label>
            <input
              type="number"
              step="0.01"
              id="currentValue"
              name="currentValue"
              value={formData.currentValue}
              onChange={handleChange}
              placeholder="e.g., 10000.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="investedAmount">Invested Amount (€)</label>
            <input
              type="number"
              step="0.01"
              id="investedAmount"
              name="investedAmount"
              value={formData.investedAmount}
              onChange={handleChange}
              placeholder="e.g., 9500.00"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Add any additional notes about this ETF..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update ETF' : 'Create ETF')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EtfForm;

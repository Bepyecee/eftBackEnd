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
    type: 'EQUITY',
    marketConcentration: 'GLOBAL_DEVELOPED',
    domicile: 'IRELAND',
    risk: 'HIGH',
    ticker: '',
    ter: '',
    notes: '',
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
        type: data.type || 'EQUITY',
        marketConcentration: data.marketConcentration || 'GLOBAL_DEVELOPED',
        domicile: data.domicile || 'IRELAND',
        risk: data.risk || 'HIGH',
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
            <label htmlFor="risk">{messages.ETF.RISK} *</label>
            <select
              id="risk"
              name="risk"
              value={formData.risk}
              onChange={handleChange}
              required
            >
              <option value="LOW">{messages.ETF.RISK_LOW}</option>
              <option value="MEDIUM">{messages.ETF.RISK_MEDIUM}</option>
              <option value="HIGH">{messages.ETF.RISK_HIGH}</option>
              <option value="VERY_HIGH">{messages.ETF.RISK_VERY_HIGH}</option>
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

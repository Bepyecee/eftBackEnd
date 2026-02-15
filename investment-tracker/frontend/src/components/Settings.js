import React, { useState, useEffect } from 'react';
import settingsService from '../services/settingsService';
import messages from '../constants/messages';
import { useTheme } from '../contexts/ThemeContext';
import './Settings.css';

function Settings() {
  const { theme, changeTheme } = useTheme();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    appearance: false,
    yahooFinance: false,
    logging: false,
    cache: false,
    tax: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setFormData(data);
      setError('');
    } catch (err) {
      setError(messages.SETTINGS.LOAD_ERROR);
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccess('');
      setError('');
      
      await settingsService.updateSettings(formData);
      setSuccess(messages.SETTINGS.SAVE_SUCCESS);
      await loadSettings();
    } catch (err) {
      setError(messages.SETTINGS.SAVE_ERROR);
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(settings);
    // Reset theme to match settings
    if (settings.theme && settings.theme !== theme) {
      changeTheme(settings.theme);
    }
    setSuccess('');
    setError('');
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    setFormData(prev => ({
      ...prev,
      theme: newTheme
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading && !settings) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>{messages.SETTINGS.TITLE}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>{messages.SETTINGS.APPEARANCE_TITLE}</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('appearance')}
                title={expandedSections.appearance ? messages.SETTINGS.COLLAPSE_TOOLTIP : messages.SETTINGS.EXPAND_TOOLTIP}
                type="button"
              >
                {expandedSections.appearance ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>{messages.SETTINGS.APPEARANCE_DESC}</span>
              </div>
            </div>
          </div>
          {expandedSections.appearance && (
            <>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>{messages.SETTINGS.THEME}</label>
                  <div className="theme-toggle">
                    <span className={`toggle-label ${theme === 'default' ? 'active' : ''}`}>{messages.SETTINGS.THEME_LIGHT}</span>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={theme === 'trading-terminal'} 
                        onChange={(e) => handleThemeChange(e.target.checked ? 'trading-terminal' : 'default')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className={`toggle-label ${theme === 'trading-terminal' ? 'active' : ''}`}>{messages.SETTINGS.THEME_DARK}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>{messages.SETTINGS.YAHOO_TITLE}</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('yahooFinance')}
                title={expandedSections.yahooFinance ? messages.SETTINGS.COLLAPSE_TOOLTIP : messages.SETTINGS.EXPAND_TOOLTIP}
                type="button"
              >
                {expandedSections.yahooFinance ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>{messages.SETTINGS.YAHOO_DESC}</span>
              </div>
            </div>
          </div>
          {expandedSections.yahooFinance && (
            <>
              <div className="form-grid">
            <div className="form-group">
              <label htmlFor="yahooFinanceTimeout">{messages.SETTINGS.YAHOO_TIMEOUT}</label>
              <input
                type="number"
                id="yahooFinanceTimeout"
                name="yahooFinanceTimeout"
                value={formData.yahooFinanceTimeout || ''}
                onChange={handleChange}
                min="1"
                max="60"
              />
            </div>

            <div className="form-group">
              <label htmlFor="yahooFinanceCacheExpirationMinutes">{messages.SETTINGS.YAHOO_CACHE_EXPIRY}</label>
              <input
                type="number"
                id="yahooFinanceCacheExpirationMinutes"
                name="yahooFinanceCacheExpirationMinutes"
                value={formData.yahooFinanceCacheExpirationMinutes || ''}
                onChange={handleChange}
                min="1"
                max="1440"
              />
            </div>

            <div className="form-group">
              <label htmlFor="yahooFinanceCacheMaxSize">{messages.SETTINGS.YAHOO_CACHE_MAX}</label>
              <input
                type="number"
                id="yahooFinanceCacheMaxSize"
                name="yahooFinanceCacheMaxSize"
                value={formData.yahooFinanceCacheMaxSize || ''}
                onChange={handleChange}
                min="10"
                max="1000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="yahooFinanceDefaultEuropeanSuffix">{messages.SETTINGS.YAHOO_SUFFIX}</label>
              <input
                type="text"
                id="yahooFinanceDefaultEuropeanSuffix"
                name="yahooFinanceDefaultEuropeanSuffix"
                value={formData.yahooFinanceDefaultEuropeanSuffix || ''}
                onChange={handleChange}
                placeholder={messages.SETTINGS.YAHOO_SUFFIX_PLACEHOLDER}
              />
            </div>
          </div>
            </>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>{messages.SETTINGS.LOGGING_TITLE}</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('logging')}
                title={expandedSections.logging ? messages.SETTINGS.COLLAPSE_TOOLTIP : messages.SETTINGS.EXPAND_TOOLTIP}
                type="button"
              >
                {expandedSections.logging ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>{messages.SETTINGS.LOGGING_DESC}</span>
              </div>
            </div>
          </div>
          {expandedSections.logging && (
            <>
              <div className="form-grid">
            <div className="form-group">
              <label htmlFor="loggingLevelRoot">{messages.SETTINGS.LOGGING_ROOT}</label>
              <select
                id="loggingLevelRoot"
                name="loggingLevelRoot"
                value={formData.loggingLevelRoot || ''}
                onChange={handleChange}
              >
                <option value="TRACE">TRACE</option>
                <option value="DEBUG">DEBUG</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="loggingLevelSpring">{messages.SETTINGS.LOGGING_SPRING}</label>
              <select
                id="loggingLevelSpring"
                name="loggingLevelSpring"
                value={formData.loggingLevelSpring || ''}
                onChange={handleChange}
              >
                <option value="TRACE">TRACE</option>
                <option value="DEBUG">DEBUG</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="loggingLevelApp">{messages.SETTINGS.LOGGING_APP}</label>
              <select
                id="loggingLevelApp"
                name="loggingLevelApp"
                value={formData.loggingLevelApp || ''}
                onChange={handleChange}
              >
                <option value="TRACE">TRACE</option>
                <option value="DEBUG">DEBUG</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>
          </div>
            </>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>{messages.SETTINGS.CACHE_TITLE}</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('cache')}
                title={expandedSections.cache ? messages.SETTINGS.COLLAPSE_TOOLTIP : messages.SETTINGS.EXPAND_TOOLTIP}
                type="button"
              >
                {expandedSections.cache ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>{messages.SETTINGS.CACHE_DESC}</span>
              </div>
            </div>
          </div>
          {expandedSections.cache && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="cacheType">{messages.SETTINGS.CACHE_TYPE}</label>
                  <select
                    id="cacheType"
                    name="cacheType"
                    value={formData.cacheType || ''}
                    onChange={handleChange}
                  >
                    <option value="caffeine">{messages.SETTINGS.CACHE_CAFFEINE}</option>
                    <option value="simple">{messages.SETTINGS.CACHE_SIMPLE}</option>
                    <option value="none">{messages.SETTINGS.CACHE_NONE}</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="caffeineSpec">{messages.SETTINGS.CACHE_SPEC}</label>
                  <input
                    type="text"
                    id="caffeineSpec"
                    name="caffeineSpec"
                    value={formData.caffeineSpec || ''}
                    onChange={handleChange}
                    placeholder={messages.SETTINGS.CACHE_SPEC_PLACEHOLDER}
                  />
                  <small>{messages.SETTINGS.CACHE_SPEC_HELP}</small>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>{messages.SETTINGS.TAX_TITLE}</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('tax')}
                title={expandedSections.tax ? messages.SETTINGS.COLLAPSE_TOOLTIP : messages.SETTINGS.EXPAND_TOOLTIP}
                type="button"
              >
                {expandedSections.tax ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>{messages.SETTINGS.TAX_DESC}</span>
              </div>
            </div>
          </div>
          {expandedSections.tax && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="etfExitTaxPercentage">{messages.SETTINGS.TAX_EXIT_PERCENTAGE}</label>
                  <input
                    type="number"
                    id="etfExitTaxPercentage"
                    name="etfExitTaxPercentage"
                    value={formData.etfExitTaxPercentage || ''}
                    onChange={handleChange}
                    placeholder="38.0"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <small>{messages.SETTINGS.TAX_EXIT_HELP}</small>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleReset} disabled={loading}>
            {messages.SETTINGS.RESET}
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? messages.SETTINGS.SAVING : messages.GENERIC.SAVE}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;

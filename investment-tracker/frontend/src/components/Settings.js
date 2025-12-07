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
      setError('Failed to load settings');
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
      setSuccess('Settings saved successfully! Some changes may require application restart.');
      await loadSettings();
    } catch (err) {
      setError('Failed to save settings');
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
    return <div className="loading">Loading settings...</div>;
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
              <h3>Appearance</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('appearance')}
                title={expandedSections.appearance ? 'Collapse section' : 'Expand section'}
                type="button"
              >
                {expandedSections.appearance ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>Customize the visual theme of the application.</span>
              </div>
            </div>
          </div>
          {expandedSections.appearance && (
            <>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Theme</label>
                  <div className="theme-toggle">
                    <span className={`toggle-label ${theme === 'default' ? 'active' : ''}`}>Light</span>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={theme === 'trading-terminal'} 
                        onChange={(e) => handleThemeChange(e.target.checked ? 'trading-terminal' : 'default')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className={`toggle-label ${theme === 'trading-terminal' ? 'active' : ''}`}>Dark</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>Yahoo Finance Configuration</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('yahooFinance')}
                title={expandedSections.yahooFinance ? 'Collapse section' : 'Expand section'}
                type="button"
              >
                {expandedSections.yahooFinance ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>Configure how the application fetches and caches stock prices from Yahoo Finance.</span>
              </div>
            </div>
          </div>
          {expandedSections.yahooFinance && (
            <>
              <div className="form-grid">
            <div className="form-group">
              <label htmlFor="yahooFinanceTimeout">API Timeout (seconds)</label>
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
              <label htmlFor="yahooFinanceCacheExpirationMinutes">Cache Expiration (minutes)</label>
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
              <label htmlFor="yahooFinanceCacheMaxSize">Cache Max Size</label>
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
              <label htmlFor="yahooFinanceDefaultEuropeanSuffix">Default European Suffix</label>
              <input
                type="text"
                id="yahooFinanceDefaultEuropeanSuffix"
                name="yahooFinanceDefaultEuropeanSuffix"
                value={formData.yahooFinanceDefaultEuropeanSuffix || ''}
                onChange={handleChange}
                placeholder=".DE"
              />
            </div>
          </div>
            </>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>Logging Configuration</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('logging')}
                title={expandedSections.logging ? 'Collapse section' : 'Expand section'}
                type="button"
              >
                {expandedSections.logging ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>Control the verbosity of application logging. Changes require application restart.</span>
              </div>
            </div>
          </div>
          {expandedSections.logging && (
            <>
              <div className="form-grid">
            <div className="form-group">
              <label htmlFor="loggingLevelRoot">Root Logging Level</label>
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
              <label htmlFor="loggingLevelSpring">Spring Framework Level</label>
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
              <label htmlFor="loggingLevelApp">Application Level</label>
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
              <h3>Cache Configuration</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('cache')}
                title={expandedSections.cache ? 'Collapse section' : 'Expand section'}
                type="button"
              >
                {expandedSections.cache ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>Configure caching behavior. Changes require application restart.</span>
              </div>
            </div>
          </div>
          {expandedSections.cache && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="cacheType">Cache Type</label>
                  <select
                    id="cacheType"
                    name="cacheType"
                    value={formData.cacheType || ''}
                    onChange={handleChange}
                  >
                    <option value="caffeine">Caffeine</option>
                    <option value="simple">Simple</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="caffeineSpec">Caffeine Specification</label>
                  <input
                    type="text"
                    id="caffeineSpec"
                    name="caffeineSpec"
                    value={formData.caffeineSpec || ''}
                    onChange={handleChange}
                    placeholder="maximumSize=100,expireAfterWrite=30m"
                  />
                  <small>Format: maximumSize=X,expireAfterWrite=Ym</small>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="settings-section">
          <div className="section-header">
            <div className="section-title-with-toggle">
              <h3>Tax Settings</h3>
              <button 
                className="section-toggle-button"
                onClick={() => toggleSection('tax')}
                title={expandedSections.tax ? 'Collapse section' : 'Expand section'}
                type="button"
              >
                {expandedSections.tax ? '▲' : '▼'}
              </button>
              <div className="section-summary-inline">
                <span>Configure tax calculation parameters.</span>
              </div>
            </div>
          </div>
          {expandedSections.tax && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="etfExitTaxPercentage">ETF Exit Tax Percentage (%)</label>
                  <input
                    type="number"
                    id="etfExitTaxPercentage"
                    name="etfExitTaxPercentage"
                    value={formData.etfExitTaxPercentage || ''}
                    onChange={handleChange}
                    placeholder="41.0"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <small>Percentage applied to calculate exit tax on ETF deemed/actual disposal</small>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleReset} disabled={loading}>
            Reset
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;

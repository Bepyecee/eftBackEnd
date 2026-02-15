import React, { useState, useEffect } from 'react';
import etfService from '../services/etfService';
import etfPriceService from '../services/etfPriceService';
import { axiosInstance } from '../services/authService';
import messages from '../constants/messages';
import './AssetList.css';

function AssetList() {
  const [allocationStrategyCollapsed, setAllocationStrategyCollapsed] = useState(false);
  const [portfolioVersionsCollapsed, setPortfolioVersionsCollapsed] = useState(false);
  const [portfolioVersions, setPortfolioVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [versionsSortConfig, setVersionsSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    loadPortfolioVersions();
    
    // Poll for new versions every 5 seconds
    const interval = setInterval(() => {
      loadPortfolioVersions();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPortfolioVersions = async () => {
    try {
      setLoadingVersions(true);
      console.log('Loading portfolio versions...');
      
      const response = await axiosInstance.get('/portfolio-snapshots');
      console.log('Loaded versions:', response.data);
      setPortfolioVersions(response.data);
    } catch (error) {
      console.error('Error loading portfolio versions:', error);
    } finally {
      setLoadingVersions(false);
    }
  };

  const generateExportIdentifier = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Get user email from localStorage or use default
    let userEmail = 'user';
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userEmail = payload.sub || 'user';
      }
    } catch (e) {
      console.error('Error extracting user email:', e);
    }
    
    // Remove @ and . from email
    const cleanEmail = userEmail.replace(/[@.]/g, '');
    
    return `${dateStr}_${cleanEmail}`;
  };

  const exportToJSON = async () => {
    try {
      const identifier = generateExportIdentifier();
      const exportDate = new Date().toISOString();
      
      // Fetch all portfolio data
      const [allEtfs, allAssets] = await Promise.all([
        etfService.getAllEtfs(),
        fetch('/api/assets', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.ok ? res.json() : []).catch(() => [])
      ]);

      // Get all transactions across all ETFs
      const allTransactionsData = [];
      for (const etf of allEtfs) {
        if (etf.transactions && etf.transactions.length > 0) {
          etf.transactions.forEach(transaction => {
            allTransactionsData.push({
              id: transaction.id,
              etfId: etf.id,
              etfTicker: etf.ticker,
              etfName: etf.name,
              transactionDate: transaction.transactionDate,
              transactionType: transaction.transactionType || 'BUY',
              unitsPurchased: parseFloat(transaction.unitsPurchased),
              transactionCost: parseFloat(transaction.transactionCost),
              transactionFees: parseFloat(transaction.transactionFees),
              deemedDisposalDate: transaction.deemedDisposalDate,
              createdAt: transaction.createdAt,
              updatedAt: transaction.updatedAt
            });
          });
        }
      }

      // Prepare ETF data with current prices
      const etfsWithPrices = await Promise.all(allEtfs.map(async (etf) => {
        let currentPrice = null;
        try {
          const priceData = await etfPriceService.getPrice(etf.ticker);
          if (priceData && priceData.price) {
            currentPrice = {
              price: parseFloat(priceData.price),
              currency: priceData.currency || 'EUR',
              lastUpdated: priceData.lastUpdated || new Date().toISOString()
            };
          }
        } catch (e) {
          console.warn(`Could not fetch price for ${etf.ticker}`, e);
        }

        return {
          id: etf.id,
          ticker: etf.ticker,
          name: etf.name,
          type: etf.type,
          domicile: etf.domicile,
          marketConcentration: etf.marketConcentration,
          volatility: etf.volatility,
          ter: parseFloat(etf.ter),
          yahooFinanceTicker: etf.yahooFinanceTicker || null,
          notes: etf.notes || null,
          createdAt: etf.createdAt,
          updatedAt: etf.updatedAt,
          currentPrice
        };
      }));

      // Calculate summary
      const totalInvested = allTransactionsData.reduce((sum, t) => sum + (parseFloat(t.transactionCost) || 0), 0);
      const totalFees = allTransactionsData.reduce((sum, t) => sum + (parseFloat(t.transactionFees) || 0), 0);
      
      let portfolioValue = null;
      try {
        portfolioValue = etfsWithPrices.reduce((sum, etf) => {
          if (etf.currentPrice) {
            const etfTransactions = allTransactionsData.filter(t => t.etfId === etf.id);
            const totalUnits = etfTransactions.reduce((s, t) => s + parseFloat(t.unitsPurchased), 0);
            return sum + (totalUnits * etf.currentPrice.price);
          }
          return sum;
        }, 0);
      } catch (e) {
        console.warn('Could not calculate portfolio value', e);
      }

      // Get user settings from localStorage or default
      const settings = {
        theme: localStorage.getItem('theme') || 'default',
        currency: 'EUR',
        dateFormat: 'YYYY-MM-DD',
        customSettings: {}
      };

      // Construct comprehensive export
      const portfolioExport = {
        schemaVersion: "1.0.0",
        metadata: {
          exportId: identifier,
          exportDate: exportDate,
          userEmail: identifier.split('_')[1].replace(/([a-z])([A-Z])/g, '$1@$2').replace(/([a-z])gmail/, '$1.gmail') || 'unknown',
          applicationVersion: "1.0.0",
          notes: ""
        },
        portfolio: {
          etfs: etfsWithPrices,
          transactions: allTransactionsData,
          assets: allAssets.map(asset => ({
            id: asset.id,
            name: asset.name,
            allocationPercentage: parseFloat(asset.allocationPercentage),
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt
          })),
          settings: settings
        },
        summary: {
          totalEtfs: etfsWithPrices.length,
          totalTransactions: allTransactionsData.length,
          totalAssets: allAssets.length,
          totalInvested: parseFloat(totalInvested.toFixed(2)),
          totalFees: parseFloat(totalFees.toFixed(2)),
          portfolioValue: portfolioValue ? parseFloat(portfolioValue.toFixed(2)) : null
        }
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(portfolioExport, null, 2);
      
      // Save to database
      try {
        await axiosInstance.post('/portfolio-snapshots/with-data', {
          versionId: identifier,
          portfolioJson: jsonString,
          triggerAction: 'MANUAL_EXPORT',
          changeDetails: messages.PORTFOLIO.MANUAL_EXPORT
        });
        
        // Reload versions list
        await loadPortfolioVersions();
      } catch (dbError) {
        console.error('Error saving to database:', dbError);
        // Continue with download even if database save fails
      }
      
      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with identifier
      const filename = `Portfolio_Export_${identifier}.json`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting portfolio:', error);
      alert(messages.PORTFOLIO.EXPORT_FAILED);
    }
  };

  const formatVersionDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatTriggerAction = (triggerAction) => {
    if (!triggerAction) return messages.PORTFOLIO.TRIGGER_ACTIONS.UNKNOWN;
    return messages.PORTFOLIO.TRIGGER_ACTIONS[triggerAction] || triggerAction;
  };

  const handleVersionsSort = (key) => {
    let direction = 'asc';
    if (versionsSortConfig.key === key && versionsSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setVersionsSortConfig({ key, direction });
  };

  const getSortedVersions = () => {
    if (!versionsSortConfig.key) return portfolioVersions;

    const sorted = [...portfolioVersions].sort((a, b) => {
      let aValue = a[versionsSortConfig.key];
      let bValue = b[versionsSortConfig.key];

      // Handle date comparison
      if (versionsSortConfig.key === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return versionsSortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return versionsSortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const getVersionsSortIndicator = (columnKey) => {
    if (versionsSortConfig.key !== columnKey) return ' ↕';
    return versionsSortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const downloadVersion = async (version) => {
    try {
      const portfolioData = JSON.parse(version.portfolioJson);
      const jsonString = JSON.stringify(portfolioData, null, 2);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Portfolio_Export_${version.versionId}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading version:', error);
      alert(messages.PORTFOLIO.DELETE_VERSION_FAILED);
    }
  };

  const deleteVersion = async (versionId) => {
    if (!window.confirm(messages.PORTFOLIO.DELETE_VERSION_CONFIRM)) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/portfolio-snapshots/${versionId}`);
      await loadPortfolioVersions();
    } catch (error) {
      console.error('Error deleting version:', error);
      alert(messages.PORTFOLIO.DELETE_VERSION_FAILED);
    }
  };

  return (
    <div className="asset-list-container">
      <div className="allocation-strategy-section">
        <div className="section-header">
          <div className="section-title-with-toggle">
            <h3>{messages.PORTFOLIO.ALLOCATION_TITLE}</h3>
            <button 
              className="section-toggle-button"
              onClick={() => setAllocationStrategyCollapsed(!allocationStrategyCollapsed)}
              title={allocationStrategyCollapsed ? messages.SETTINGS.EXPAND_TOOLTIP : messages.SETTINGS.COLLAPSE_TOOLTIP}
            >
              {allocationStrategyCollapsed ? '▼' : '▲'}
            </button>
            <div className="section-summary-inline">
              <span>{messages.PORTFOLIO.ALLOCATION_DESC}</span>
            </div>
          </div>
        </div>
        {!allocationStrategyCollapsed && (
          <div className="allocation-strategy-content">
            <div className="not-implemented-banner">
              <p>{messages.PORTFOLIO.CONTENT_COMING_SOON}</p>
            </div>
          </div>
        )}
      </div>

      <div className="allocation-strategy-section">
        <div className="section-header">
          <div className="section-title-with-toggle">
            <h3>{messages.PORTFOLIO.VERSIONS_TITLE}</h3>
            <button 
              className="section-toggle-button"
              onClick={() => setPortfolioVersionsCollapsed(!portfolioVersionsCollapsed)}
              title={portfolioVersionsCollapsed ? messages.SETTINGS.EXPAND_TOOLTIP : messages.SETTINGS.COLLAPSE_TOOLTIP}
            >
              {portfolioVersionsCollapsed ? '▼' : '▲'}
            </button>
            <div className="section-summary-inline">
              <span>{messages.PORTFOLIO.VERSIONS_DESC(portfolioVersions.length)}</span>
            </div>
          </div>
        </div>
        {!portfolioVersionsCollapsed && (
          <div className="allocation-strategy-content">
            <div className="portfolio-versions-content">
              {loadingVersions ? (
                <p>{messages.PORTFOLIO.LOADING_VERSIONS}</p>
              ) : portfolioVersions.length === 0 ? (
                <p>{messages.PORTFOLIO.NO_VERSIONS}</p>
              ) : (
                <table className="versions-table">
                  <thead>
                    <tr>
                      <th className="sortable" onClick={() => handleVersionsSort('versionId')}>
                        {messages.PORTFOLIO.VERSION_ID}{getVersionsSortIndicator('versionId')}
                      </th>
                      <th className="sortable" onClick={() => handleVersionsSort('createdAt')}>
                        {messages.PORTFOLIO.CREATED}{getVersionsSortIndicator('createdAt')}
                      </th>
                      <th className="sortable" onClick={() => handleVersionsSort('triggerAction')}>
                        {messages.PORTFOLIO.TRIGGER}{getVersionsSortIndicator('triggerAction')}
                      </th>
                      <th className="sortable" onClick={() => handleVersionsSort('changeDetails')}>
                        {messages.PORTFOLIO.DETAILS}{getVersionsSortIndicator('changeDetails')}
                      </th>
                      <th>{messages.PORTFOLIO.ACTIONS}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedVersions().map(version => (
                      <tr key={version.id}>
                        <td><code>{version.versionId}</code></td>
                        <td>{formatVersionDate(version.createdAt)}</td>
                        <td>{formatTriggerAction(version.triggerAction)}</td>
                        <td>{version.changeDetails || '-'}</td>
                        <td>
                          <button 
                            className="download-button-small"
                            onClick={() => downloadVersion(version)}
                            title={messages.PORTFOLIO.DOWNLOAD}
                          >
                            {messages.PORTFOLIO.DOWNLOAD}
                          </button>
                          <button 
                            className="delete-button-small"
                            onClick={() => deleteVersion(version.id)}
                            title={messages.GENERIC.DELETE}
                          >
                            {messages.GENERIC.DELETE}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssetList;

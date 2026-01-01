import React, { useState, useEffect } from 'react';
import etfService from '../services/etfService';
import etfPriceService from '../services/etfPriceService';
import { axiosInstance } from '../services/authService';
import './AssetList.css';

function AssetList() {
  const [allocationStrategyCollapsed, setAllocationStrategyCollapsed] = useState(false);
  const [managePortfolioCollapsed, setManagePortfolioCollapsed] = useState(false);
  const [portfolioVersionsCollapsed, setPortfolioVersionsCollapsed] = useState(false);
  const [portfolioVersions, setPortfolioVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

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
          changeDetails: 'Manual portfolio export'
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
      alert('Failed to export portfolio. Please try again.');
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
    if (!triggerAction) return 'Unknown';
    
    // Map enum values to user-friendly display names
    const displayNames = {
      'ETF_CREATED': 'ETF Created',
      'ETF_UPDATED': 'ETF Updated',
      'ETF_DELETED': 'ETF Deleted',
      'TRANSACTION_ADDED': 'Transaction Added',
      'TRANSACTION_UPDATED': 'Transaction Updated',
      'TRANSACTION_DELETED': 'Transaction Deleted',
      'ASSET_CREATED': 'Asset Created',
      'ASSET_UPDATED': 'Asset Updated',
      'ASSET_DELETED': 'Asset Deleted',
      'MANUAL_EXPORT': 'Manual Export'
    };
    
    return displayNames[triggerAction] || triggerAction;
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
      alert('Failed to download portfolio version.');
    }
  };

  const deleteVersion = async (versionId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio version?')) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/portfolio-snapshots/${versionId}`);
      await loadPortfolioVersions();
    } catch (error) {
      console.error('Error deleting version:', error);
      alert('Failed to delete portfolio version.');
    }
  };

  return (
    <div className="asset-list-container">
      <div className="allocation-strategy-section">
        <div className="section-header">
          <div className="section-title-with-toggle">
            <h3>Allocation Strategy</h3>
            <button 
              className="section-toggle-button"
              onClick={() => setAllocationStrategyCollapsed(!allocationStrategyCollapsed)}
              title={allocationStrategyCollapsed ? 'Expand section' : 'Collapse section'}
            >
              {allocationStrategyCollapsed ? '▼' : '▲'}
            </button>
            <div className="section-summary-inline">
              <span>Define your investment allocation strategy across different asset classes, risk profiles, and geographical regions.</span>
            </div>
          </div>
        </div>
        {!allocationStrategyCollapsed && (
          <div className="allocation-strategy-content">
            <div className="not-implemented-banner">
              <p>Content coming soon</p>
            </div>
          </div>
        )}
      </div>

      <div className="allocation-strategy-section">
        <div className="section-header">
          <div className="section-title-with-toggle">
            <h3>Manage Portfolio</h3>
            <button 
              className="section-toggle-button"
              onClick={() => setManagePortfolioCollapsed(!managePortfolioCollapsed)}
              title={managePortfolioCollapsed ? 'Expand section' : 'Collapse section'}
            >
              {managePortfolioCollapsed ? '▼' : '▲'}
            </button>
            <div className="section-summary-inline">
              <span>Export and manage your complete portfolio data.</span>
            </div>
          </div>
        </div>
        {!managePortfolioCollapsed && (
          <div className="allocation-strategy-content">
            <div className="manage-portfolio-content">
              <p>Export your complete portfolio including ETFs, transactions, assets, and settings.</p>
              <button 
                className="export-button"
                onClick={exportToJSON}
                title="Export complete portfolio snapshot including ETFs, transactions, assets, and settings"
              >
                Export Portfolio
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="allocation-strategy-section">
        <div className="section-header">
          <div className="section-title-with-toggle">
            <h3>Portfolio Versions</h3>
            <button 
              className="section-toggle-button"
              onClick={() => setPortfolioVersionsCollapsed(!portfolioVersionsCollapsed)}
              title={portfolioVersionsCollapsed ? 'Expand section' : 'Collapse section'}
            >
              {portfolioVersionsCollapsed ? '▼' : '▲'}
            </button>
            <div className="section-summary-inline">
              <span>View and manage historical portfolio snapshots ({portfolioVersions.length} versions)</span>
            </div>
          </div>
        </div>
        {!portfolioVersionsCollapsed && (
          <div className="allocation-strategy-content">
            <div className="portfolio-versions-content">
              {loadingVersions ? (
                <p>Loading versions...</p>
              ) : portfolioVersions.length === 0 ? (
                <p>No portfolio versions saved yet. Export your portfolio to create the first version.</p>
              ) : (
                <table className="versions-table">
                  <thead>
                    <tr>
                      <th>Version ID</th>
                      <th>Created</th>
                      <th>Trigger</th>
                      <th>Details</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioVersions.map(version => (
                      <tr key={version.id}>
                        <td><code>{version.versionId}</code></td>
                        <td>{formatVersionDate(version.createdAt)}</td>
                        <td>{formatTriggerAction(version.triggerAction)}</td>
                        <td>{version.changeDetails || '-'}</td>
                        <td>
                          <button 
                            className="download-button-small"
                            onClick={() => downloadVersion(version)}
                            title="Download this version"
                          >
                            Download
                          </button>
                          <button 
                            className="delete-button-small"
                            onClick={() => deleteVersion(version.id)}
                            title="Delete this version"
                          >
                            Delete
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

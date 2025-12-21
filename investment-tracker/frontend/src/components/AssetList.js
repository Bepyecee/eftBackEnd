import React, { useState } from 'react';
import etfService from '../services/etfService';
import etfPriceService from '../services/etfPriceService';
import messages from '../constants/messages';
import './AssetList.css';

function AssetList() {
  const [allocationStrategyCollapsed, setAllocationStrategyCollapsed] = useState(false);
  const [managePortfolioCollapsed, setManagePortfolioCollapsed] = useState(false);

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
                📋 Export Portfolio (JSON)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssetList;

import React, { useState } from 'react';
import messages from '../constants/messages';
import './AssetList.css';

function AssetList() {
  const [allocationStrategyCollapsed, setAllocationStrategyCollapsed] = useState(false);

  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <h2>{messages.ASSET.LIST_TITLE}</h2>
      </div>

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
    </div>
  );
}

export default AssetList;

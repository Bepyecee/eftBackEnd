import React from 'react';
import messages from '../constants/messages';
import './AssetList.css';

function AssetList() {
  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <h2>{messages.ASSET.LIST_TITLE}</h2>
      </div>

      <div className="not-implemented-banner">
        <h3>{messages.ASSET.NOT_IMPLEMENTED_TITLE}</h3>
        <p>{messages.ASSET.NOT_IMPLEMENTED_DESCRIPTION}</p>
      </div>
    </div>
  );
}

export default AssetList;

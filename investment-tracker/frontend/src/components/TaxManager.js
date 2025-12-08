import React, { useState, useEffect } from 'react';
import './TaxManager.css';

function TaxManager() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="tax-manager-container">
      <div className="empty-state">
        <h2>Tax Manager</h2>
        <p>Tax management features will be available here.</p>
        <p>Visit the ETFs page to view all transactions with deemed disposal dates.</p>
      </div>
    </div>
  );
}

export default TaxManager;

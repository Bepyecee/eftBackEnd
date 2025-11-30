import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assetService from '../services/assetService';
import './AssetList.css';

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await assetService.getAllAssets();
      setAssets(data);
      setError('');
    } catch (err) {
      setError('Failed to load assets');
      console.error('Error loading assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetService.deleteAsset(id);
        loadAssets();
      } catch (err) {
        setError('Failed to delete asset');
        console.error('Error deleting asset:', err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/assets/edit/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading Assets...</div>;
  }

  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <h2>Assets</h2>
        <button className="add-button" onClick={() => navigate('/assets/new')}>
          + Add Asset
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {assets.length === 0 ? (
        <div className="empty-state">
          <p>No assets found. Click "Add Asset" to create one.</p>
        </div>
      ) : (
        <div className="asset-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Allocation %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.name}</td>
                  <td>{asset.allocationPercentage}%</td>
                  <td className="actions">
                    <button className="edit-button" onClick={() => handleEdit(asset.id)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(asset.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AssetList;

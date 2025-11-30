import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assetService from '../services/assetService';
import messages from '../constants/messages';
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
      setError(messages.ASSET.LOAD_ERROR);
      console.error('Error loading assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(messages.ASSET.CONFIRM_DELETE)) {
      try {
        await assetService.deleteAsset(id);
        loadAssets();
      } catch (err) {
        setError(messages.ASSET.DELETE_ERROR);
        console.error('Error deleting asset:', err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/assets/edit/${id}`);
  };

  if (loading) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <h2>{messages.ASSET.LIST_TITLE}</h2>
        <button className="add-button" onClick={() => navigate('/assets/new')}>
          {messages.ASSET.ADD_NEW}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {assets.length === 0 ? (
        <div className="empty-state">
          <p>{messages.ASSET.NO_ASSETS}</p>
        </div>
      ) : (
        <div className="asset-table">
          <table>
            <thead>
              <tr>
                <th>{messages.ASSET.NAME}</th>
                <th>{messages.ASSET.ALLOCATION}</th>
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
                      {messages.GENERIC.EDIT}
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(asset.id)}>
                      {messages.GENERIC.DELETE}
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

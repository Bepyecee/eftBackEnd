import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import assetService from '../services/assetService';
import messages from '../constants/messages';
import './AssetForm.css';

function AssetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    allocationPercentage: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadAsset();
    }
  }, [id]);

  const loadAsset = async () => {
    try {
      setLoading(true);
      const data = await assetService.getAssetById(id);
      setFormData({
        name: data.name || '',
        allocationPercentage: data.allocationPercentage || '',
      });
      setError('');
    } catch (err) {
      setError(messages.ASSET.LOAD_ERROR);
      console.error('Error loading asset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        allocationPercentage: formData.allocationPercentage
          ? parseFloat(formData.allocationPercentage)
          : 0,
      };

      if (isEditMode) {
        await assetService.updateAsset(id, submitData);
      } else {
        await assetService.createAsset(submitData);
      }

      navigate('/assets');
    } catch (err) {
      setError(messages.ASSET.SAVE_ERROR);
      console.error('Error saving asset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/assets');
  };

  if (loading && isEditMode) {
    return <div className="loading">{messages.GENERIC.LOADING}</div>;
  }

  return (
    <div className="asset-form-container">
      <div className="form-header">
        <h2>{isEditMode ? messages.ASSET.EDIT_TITLE : messages.ASSET.CREATE_TITLE}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="asset-form">
        <div className="form-group">
          <label htmlFor="name">{messages.ASSET.NAME} *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={messages.ASSET.NAME_PLACEHOLDER}
          />
        </div>

        <div className="form-group">
          <label htmlFor="allocationPercentage">{messages.ASSET.ALLOCATION} *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            id="allocationPercentage"
            name="allocationPercentage"
            value={formData.allocationPercentage}
            onChange={handleChange}
            required
            placeholder={messages.ASSET.ALLOCATION_PLACEHOLDER}
          />
          <small>Enter a value between 0 and 100</small>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            {messages.GENERIC.CANCEL}
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? messages.GENERIC.LOADING : messages.GENERIC.SAVE}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssetForm;

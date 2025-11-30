import { axiosInstance } from './authService';

const assetService = {
  getAllAssets: async () => {
    const response = await axiosInstance.get('/assets');
    return response.data;
  },

  getAssetById: async (id) => {
    const response = await axiosInstance.get(`/assets/${id}`);
    return response.data;
  },

  createAsset: async (asset) => {
    const response = await axiosInstance.post('/assets', asset);
    return response.data;
  },

  updateAsset: async (id, asset) => {
    const response = await axiosInstance.put(`/assets/${id}`, asset);
    return response.data;
  },

  deleteAsset: async (id) => {
    await axiosInstance.delete(`/assets/${id}`);
  },
};

export default assetService;

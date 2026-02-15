import { axiosInstance } from './authService';

const settingsService = {
  getSettings: async () => {
    const response = await axiosInstance.get('/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await axiosInstance.put('/settings', settings);
    return response.data;
  },
};

export default settingsService;

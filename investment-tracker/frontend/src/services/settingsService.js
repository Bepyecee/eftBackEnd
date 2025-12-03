import axios from 'axios';

const API_URL = 'http://localhost:8080/api/settings';

const settingsService = {
  getSettings: async () => {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await axios.put(API_URL, settings, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};

export default settingsService;

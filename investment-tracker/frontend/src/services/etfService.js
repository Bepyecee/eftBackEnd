import { axiosInstance } from './authService';

const etfService = {
  getAllEtfs: async () => {
    const response = await axiosInstance.get('/etfs');
    return response.data;
  },

  getEtfById: async (id) => {
    const response = await axiosInstance.get(`/etfs/${id}`);
    return response.data;
  },

  createEtf: async (etf) => {
    const response = await axiosInstance.post('/etfs', etf);
    return response.data;
  },

  updateEtf: async (id, etf) => {
    const response = await axiosInstance.put(`/etfs/${id}`, etf);
    return response.data;
  },

  deleteEtf: async (id) => {
    await axiosInstance.delete(`/etfs/${id}`);
  },
};

export default etfService;

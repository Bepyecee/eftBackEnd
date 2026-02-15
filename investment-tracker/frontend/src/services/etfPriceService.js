import { axiosInstance } from './authService';

const etfPriceService = {
  getPrice: async (ticker) => {
    const response = await axiosInstance.get(`/etf-prices/${ticker}`);
    return response.data;
  },

  getAllPrices: async () => {
    const response = await axiosInstance.get('/etf-prices');
    return response.data;
  },

  refreshPrice: async (ticker) => {
    const response = await axiosInstance.post(`/etf-prices/refresh/${ticker}`);
    return response.data;
  },

  refreshAllPrices: async (tickers) => {
    const response = await axiosInstance.post('/etf-prices/refresh', tickers);
    return response.data;
  },
};

export default etfPriceService;

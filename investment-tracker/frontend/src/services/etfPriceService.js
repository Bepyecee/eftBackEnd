import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/etf-prices';

const etfPriceService = {
    // Get price for a specific ticker
    getPrice: async (ticker) => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/${ticker}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Get all cached prices
    getAllPrices: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_BASE_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Refresh price for a specific ticker
    refreshPrice: async (ticker) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/refresh/${ticker}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    // Refresh prices for multiple tickers
    refreshAllPrices: async (tickers) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/refresh`, tickers, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
};

export default etfPriceService;

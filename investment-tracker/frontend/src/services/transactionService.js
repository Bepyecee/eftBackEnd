import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const transactionService = {
  // Get all transactions for an ETF
  getTransactionsForEtf: async (etfId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/etfs/${etfId}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get a single transaction by ID
  getTransactionById: async (etfId, transactionId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/etfs/${etfId}/transactions/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Create a new transaction
  createTransaction: async (etfId, transaction) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/etfs/${etfId}/transactions`,
      transaction,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Update a transaction
  updateTransaction: async (etfId, transactionId, transaction) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_BASE_URL}/etfs/${etfId}/transactions/${transactionId}`,
      transaction,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // Delete a transaction
  deleteTransaction: async (etfId, transactionId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/etfs/${etfId}/transactions/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default transactionService;

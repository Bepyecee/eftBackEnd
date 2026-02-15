import { axiosInstance } from './authService';

const transactionService = {
  getTransactionsForEtf: async (etfId) => {
    const response = await axiosInstance.get(`/etfs/${etfId}/transactions`);
    return response.data;
  },

  getTransactionById: async (etfId, transactionId) => {
    const response = await axiosInstance.get(`/etfs/${etfId}/transactions/${transactionId}`);
    return response.data;
  },

  createTransaction: async (etfId, transaction) => {
    const response = await axiosInstance.post(`/etfs/${etfId}/transactions`, transaction);
    return response.data;
  },

  updateTransaction: async (etfId, transactionId, transaction) => {
    const response = await axiosInstance.put(
      `/etfs/${etfId}/transactions/${transactionId}`,
      transaction
    );
    return response.data;
  },

  deleteTransaction: async (etfId, transactionId) => {
    await axiosInstance.delete(`/etfs/${etfId}/transactions/${transactionId}`);
  },
};

export default transactionService;

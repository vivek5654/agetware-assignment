import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bankAPI = {
  createLoan: (loanData) => api.post('/loans', loanData),
  makePayment: (loanId, paymentData) => api.post(`/loans/${loanId}/payments`, paymentData),
  getLoanLedger: (loanId) => api.get(`/loans/${loanId}/ledger`),
  getCustomerOverview: (customerId) => api.get(`/customers/${customerId}/overview`),
  healthCheck: () => api.get('/health'),
};

import React, { useState } from 'react';
import { bankAPI } from '../services/api';

const LedgerView = () => {
  const [loanId, setLoanId] = useState('');
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLedger = async (e) => {
    e.preventDefault();
    if (!loanId.trim()) return;

    setLoading(true);
    setError('');
    setLedgerData(null);

    try {
      const response = await bankAPI.getLoanLedger(loanId);
      setLedgerData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch ledger data');
    }

    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentTypeIcon = (type) => {
    return type === 'EMI' ? '💳' : '💰';
  };

  const getProgressPercentage = () => {
    if (!ledgerData) return 0;
    return Math.round((ledgerData.amount_paid / ledgerData.total_amount) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loan Ledger</h2>
        <p className="text-gray-600">View complete transaction history and current status of a loan.</p>
      </div>

      {/* Search Form */}
      <form onSubmit={fetchLedger} className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan ID
          </label>
          <input
            type="text"
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
            placeholder="Enter loan ID to view ledger"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            } transition duration-150 ease-in-out`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              'View Ledger'
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 text-xl mr-2">❌</span>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Ledger Data */}
      {ledgerData && (
        <div className="space-y-6">
          {/* Loan Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">Customer ID</p>
                <p className="font-semibold text-gray-900">{ledgerData.customer_id}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">Loan ID</p>
                <p className="font-mono text-sm text-gray-900 break-all">{ledgerData.loan_id}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-lg font-bold text-indigo-600">₹{ledgerData.monthly_emi?.toLocaleString()}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Payment Progress</span>
                <span>{getProgressPercentage()}% completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">Principal Amount</p>
                <p className="text-xl font-bold text-blue-600">₹{ledgerData.principal?.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-purple-600">₹{ledgerData.total_amount?.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="text-xl font-bold text-green-600">₹{ledgerData.amount_paid?.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">Balance Amount</p>
                <p className="text-xl font-bold text-red-600">₹{ledgerData.balance_amount?.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {ledgerData.emis_left} EMIs remaining
              </span>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              <p className="text-sm text-gray-600">All payments made towards this loan</p>
            </div>

            {ledgerData.transactions && ledgerData.transactions.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {ledgerData.transactions.map((transaction, index) => (
                  <div key={transaction.transaction_id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">{getPaymentTypeIcon(transaction.type)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.type === 'EMI' ? 'EMI Payment' : 'Lump Sum Payment'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            ID: {transaction.transaction_id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'EMI' ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          ₹{transaction.amount?.toLocaleString()}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'EMI' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <span className="text-6xl text-gray-300">📋</span>
                <p className="mt-2 text-gray-500">No transactions found</p>
                <p className="text-sm text-gray-400">Payments will appear here once recorded</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LedgerView;

import React, { useState } from 'react';
import { bankAPI } from '../services/api';

const CustomerOverview = () => {
  const [customerId, setCustomerId] = useState('');
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const predefinedCustomers = [
    { id: 'CUST001', name: 'John Doe' },
    { id: 'CUST002', name: 'Jane Smith' },
    { id: 'CUST003', name: 'Alice Johnson' }
  ];

  const fetchOverview = async (e) => {
    e.preventDefault();
    if (!customerId.trim()) return;

    setLoading(true);
    setError('');
    setOverviewData(null);

    try {
      const response = await bankAPI.getCustomerOverview(customerId);
      setOverviewData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch customer overview');
    }

    setLoading(false);
  };

  const getTotalAmountBorrowed = () => {
    if (!overviewData?.loans) return 0;
    return overviewData.loans.reduce((sum, loan) => sum + loan.principal, 0);
  };

  const getTotalAmountPaid = () => {
    if (!overviewData?.loans) return 0;
    return overviewData.loans.reduce((sum, loan) => sum + loan.amount_paid, 0);
  };

  const getTotalOutstanding = () => {
    if (!overviewData?.loans) return 0;
    return overviewData.loans.reduce((sum, loan) => sum + (loan.total_amount - loan.amount_paid), 0);
  };

  const getLoanStatus = (loan) => {
    const remainingAmount = loan.total_amount - loan.amount_paid;
    if (remainingAmount <= 0) return { status: 'Paid Off', color: 'green' };
    if (loan.amount_paid === 0) return { status: 'New', color: 'blue' };
    return { status: 'Active', color: 'yellow' };
  };

  const getProgressPercentage = (loan) => {
    return Math.round((loan.amount_paid / loan.total_amount) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Overview</h2>
        <p className="text-gray-600">View all loans and financial summary for a specific customer.</p>
      </div>

      {/* Search Form */}
      <form onSubmit={fetchOverview} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="Enter customer ID (e.g., CUST001)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Quick Select</option>
                {predefinedCustomers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.id} - {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          } transition duration-150 ease-in-out`}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading Overview...
            </div>
          ) : (
            '📊 View Customer Overview'
          )}
        </button>
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

      {/* Customer Overview Data */}
      {overviewData && (
        <div className="space-y-6">
          {/* Customer Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Customer: {overviewData.customer_id}</h3>
                <p className="text-gray-600">Financial Portfolio Overview</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-indigo-100 text-indigo-800">
                  {overviewData.total_loans} {overviewData.total_loans === 1 ? 'Loan' : 'Loans'}
                </span>
              </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-1">Total Borrowed</p>
                <p className="text-2xl font-bold text-blue-600">₹{getTotalAmountBorrowed().toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{getTotalAmountPaid().toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">₹{getTotalOutstanding().toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Loans List */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Loans</h3>
              <p className="text-sm text-gray-600">Complete list of loans for this customer</p>
            </div>

            <div className="divide-y divide-gray-200">
              {overviewData.loans.map((loan, index) => {
                const loanStatus = getLoanStatus(loan);
                const progress = getProgressPercentage(loan);
                
                return (
                  <div key={loan.loan_id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">Loan #{index + 1}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            loanStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                            loanStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {loanStatus.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">{loan.loan_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{loan.emi_amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Monthly EMI</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Payment Progress</span>
                        <span>{progress}% completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Loan Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Principal</p>
                        <p className="font-semibold text-gray-900">₹{loan.principal.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                        <p className="font-semibold text-purple-600">₹{loan.total_amount.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Interest</p>
                        <p className="font-semibold text-orange-600">₹{loan.total_interest.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Paid</p>
                        <p className="font-semibold text-green-600">₹{loan.amount_paid.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">EMIs Left</p>
                        <p className="font-semibold text-blue-600">{loan.emis_left}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                📊 Export Report
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                💳 Make Payment
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                📄 View Statements
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOverview;

import React, { useState } from 'react';
import { bankAPI } from '../services/api';

const LoanForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [customerType, setCustomerType] = useState('existing');

  const existingCustomers = [
    { id: 'CUST001', name: 'John Doe' },
    { id: 'CUST002', name: 'Jane Smith' },
    { id: 'CUST003', name: 'Alice Johnson' }
  ];

  const generateCustomerId = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `CUST${timestamp}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCustomerTypeChange = (type) => {
    setCustomerType(type);
    if (type === 'existing') {
      setFormData(prev => ({ ...prev, customer_id: '', customer_name: '' }));
    } else {
      setFormData(prev => ({ ...prev, customer_id: '', customer_name: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let customerId = formData.customer_id;
      let customerName = '';
      
      if (customerType === 'new') {
        customerId = generateCustomerId();
        customerName = formData.customer_name;
      } else {
        customerName = existingCustomers.find(c => c.id === customerId)?.name || '';
      }

      const response = await bankAPI.createLoan({
        customer_id: customerId,
        customer_name: customerName,
        loan_amount: parseFloat(formData.loan_amount),
        loan_period_years: parseInt(formData.loan_period_years),
        interest_rate_yearly: parseFloat(formData.interest_rate_yearly)
      });
      
      setResult({
        ...response.data,
        customer_name: customerName
      });
      
      onSuccess(`Loan created successfully for ${customerType === 'new' ? customerName : 'existing customer'}!`, 'success');
      
      // Reset form
      setFormData({
        customer_id: '',
        customer_name: '',
        loan_amount: '',
        loan_period_years: '',
        interest_rate_yearly: ''
      });
      setCustomerType('existing');
    } catch (error) {
      onSuccess('Error creating loan: ' + (error.response?.data?.error || error.message), 'error');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Create New Loan
          </h2>
          <p className="text-gray-300 text-lg">
            Fill in the details to create a new loan for your customer
          </p>
        </div>
        
        {/* Main Form Card */}
        <div className="bg-gradient-to-tr from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Customer Type Selection */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-white mb-4">
                Customer Type
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="customerType"
                    value="existing"
                    checked={customerType === 'existing'}
                    onChange={() => handleCustomerTypeChange('existing')}
                    className="w-5 h-5 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-white font-medium">Existing Customer</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="customerType"
                    value="new"
                    checked={customerType === 'new'}
                    onChange={() => handleCustomerTypeChange('new')}
                    className="w-5 h-5 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-white font-medium">New Customer</span>
                </label>
              </div>
            </div>

            {/* Customer Selection/Input */}
            {customerType === 'existing' ? (
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">
                  Select Customer
                </label>
                <select 
                  name="customer_id" 
                  value={formData.customer_id} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Select a customer</option>
                  {existingCustomers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.id} - {customer.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Enter customer's full name"
                  className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <p className="text-sm text-gray-400">
                  💡 Customer ID will be auto-generated: CUST{Date.now().toString().slice(-6)}
                </p>
              </div>
            )}

            {/* Form Grid for Loan Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Loan Amount */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-lg">₹</span>
                  <input
                    type="number"
                    name="loan_amount"
                    value={formData.loan_amount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Loan Period */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">
                  Loan Period
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="loan_period_years"
                    value={formData.loan_period_years}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                    min="1"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">years</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">
                  Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="interest_rate_yearly"
                    value={formData.interest_rate_yearly}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                    min="0"
                    step="0.1"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">% / year</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Loan...
                </div>
              ) : (
                '🚀 Create Loan'
              )}
            </button>
          </form>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-gradient-to-tr from-green-800 to-green-900 rounded-3xl shadow-2xl border border-green-600 p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="text-6xl">🎉</div>
              <div className="ml-4">
                <h3 className="text-3xl font-bold text-white">Loan Created Successfully!</h3>
                <p className="text-green-200">Your loan has been processed and approved</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <p className="text-sm text-gray-400 uppercase tracking-wide">Loan ID</p>
                <p className="font-mono text-lg text-white break-all mt-2">{result.loan_id}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <p className="text-sm text-gray-400 uppercase tracking-wide">Customer</p>
                <p className="text-lg font-semibold text-white mt-2">
                  {result.customer_id} {result.customer_name && `- ${result.customer_name}`}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <p className="text-sm text-gray-400 uppercase tracking-wide">Total Amount Payable</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mt-2">
                  ₹{result.total_amount_payable?.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <p className="text-sm text-gray-400 uppercase tracking-wide">Monthly EMI</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mt-2">
                  ₹{result.monthly_emi?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanForm;

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Loan</h2>
        <p className="text-gray-600">Fill in the details to create a new loan for a customer.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Customer Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="customerType"
                value="existing"
                checked={customerType === 'existing'}
                onChange={() => handleCustomerTypeChange('existing')}
                className="mr-2 text-indigo-600 focus:ring-indigo-500"
              />
              Existing Customer
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="customerType"
                value="new"
                checked={customerType === 'new'}
                onChange={() => handleCustomerTypeChange('new')}
                className="mr-2 text-indigo-600 focus:ring-indigo-500"
              />
              New Customer
            </label>
          </div>
        </div>

        {/* Customer Selection/Input */}
        {customerType === 'existing' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Customer
            </label>
            <select 
              name="customer_id" 
              value={formData.customer_id} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter customer's full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              A unique customer ID will be generated automatically (CUST{Date.now().toString().slice(-6)})
            </p>
          </div>
        )}

        {/* Loan Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (₹)
          </label>
          <input
            type="number"
            name="loan_amount"
            value={formData.loan_amount}
            onChange={handleChange}
            placeholder="Enter loan amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            min="1"
          />
        </div>

        {/* Loan Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Period (Years)
          </label>
          <input
            type="number"
            name="loan_period_years"
            value={formData.loan_period_years}
            onChange={handleChange}
            placeholder="Enter loan period in years"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            min="1"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate (% per year)
          </label>
          <input
            type="number"
            name="interest_rate_yearly"
            value={formData.interest_rate_yearly}
            onChange={handleChange}
            placeholder="Enter interest rate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
            min="0"
            step="0.1"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
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
              Creating Loan...
            </div>
          ) : (
            'Create Loan'
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-green-600 text-2xl mr-2">✅</span>
            <h3 className="text-lg font-semibold text-green-800">Loan Created Successfully!</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Loan ID</p>
              <p className="font-mono text-sm text-gray-900 break-all">{result.loan_id}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-semibold text-gray-900">
                {result.customer_id} {result.customer_name && `- ${result.customer_name}`}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Total Amount Payable</p>
              <p className="text-xl font-bold text-indigo-600">
                ₹{result.total_amount_payable?.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="text-xl font-bold text-green-600">
                ₹{result.monthly_emi?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanForm;

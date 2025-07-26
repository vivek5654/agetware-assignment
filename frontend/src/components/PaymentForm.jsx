import React, { useState } from 'react';
import { bankAPI } from '../services/api';

const PaymentForm = ({ onSuccess }) => {
  const [loanId, setLoanId] = useState('');
  const [paymentType, setPaymentType] = useState('EMI');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await bankAPI.makePayment(loanId, {
        amount: parseFloat(amount),
        payment_type: paymentType
      });
      setResponse(res.data);
      onSuccess('Payment recorded successfully!', 'success');
    } catch (err) {
      onSuccess(
        'Error recording payment: ' + (err.response?.data?.error || err.message),
        'error'
      );
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Make a Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loan ID
          </label>
          <input
            type="text"
            value={loanId}
            onChange={e => setLoanId(e.target.value)}
            placeholder="Enter loan ID"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md
                       shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Type
          </label>
          <select
            value={paymentType}
            onChange={e => setPaymentType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md
                       shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="EMI">EMI</option>
            <option value="LUMP_SUM">Lump Sum</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter payment amount"
            min="1"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md
                       shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent
                     rounded-md shadow-sm text-sm font-medium text-white transition 
                     ${loading
                       ? 'bg-gray-400 cursor-not-allowed'
                       : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
        >
          {loading ? 'Recording…' : 'Record Payment'}
        </button>
      </form>

      {response && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p>
            <strong>Payment ID:</strong> {response.payment_id}
          </p>
          <p>
            <strong>Remaining Balance:</strong> ₹{response.remaining_balance.toLocaleString()}
          </p>
          <p>
            <strong>EMIs Left:</strong> {response.emis_left}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;

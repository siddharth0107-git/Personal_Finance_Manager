import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onSubmit: (transaction: Transaction) => void;
  onClose: () => void;
}

const categories = {
  income: ['Salary', 'Freelance', 'Investments', 'Rental', 'Business', 'Others'],
  expense: [
    'Housing',
    'Transportation',
    'Food',
    'Shopping',
    'Healthcare',
    'Entertainment',
    'Utilities',
    'Technology',
    'Others'
  ]
};

const TransactionForm: React.FC<TransactionFormProps> = ({ type, onSubmit, onClose }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[type][0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    const transaction: Transaction = {
      id: Date.now(),
      type,
      amount: Number(amount),
      category,
      date: new Date(),
      notes
    };

    onSubmit(transaction);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Add {type === 'income' ? 'Income' : 'Expense'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder="Add notes..."
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-lg transition-colors ${
            type === 'income'
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
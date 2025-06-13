import React, { useState } from 'react';
import { X, Target, AlertCircle } from 'lucide-react';

interface SavingsGoalModalProps {
  onClose: () => void;
  onSubmit: (amount: number) => void;
  walletBalance: number;
  currentGoal: number;
}

const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  onClose,
  onSubmit,
  walletBalance,
  currentGoal
}) => {
  const [amount, setAmount] = useState(currentGoal.toString());
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    const goalAmount = Number(amount);
    if (goalAmount < 1000) {
      setError('Minimum savings goal amount is ₹1,000');
      return;
    }

    onSubmit(goalAmount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Target className="h-6 w-6 text-amber-600 mr-2" />
            <h2 className="text-xl font-semibold">Set Savings Goal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter target amount"
            />
          </div>

          <div className="p-4 bg-amber-50 rounded-lg space-y-2">
            <div className="flex justify-between text-amber-700">
              <span>Current Wallet Balance:</span>
              <span className="font-medium">₹{walletBalance.toLocaleString()}</span>
            </div>
            {currentGoal > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Current Goal:</span>
                <span className="font-medium">₹{currentGoal.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center text-amber-700 mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Important Notes</span>
            </div>
            <ul className="text-sm text-amber-600 space-y-1 list-disc list-inside">
              <li>Your savings goal is linked to your wallet balance</li>
              <li>Transfer money to wallet to build your savings</li>
              <li>Minimum goal amount is ₹1,000</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Set Goal
          </button>
        </form>
      </div>
    </div>
  );
};

export default SavingsGoalModal;
import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface WalletTransferFormProps {
  balance: number;
  walletBalance: number;
  onSubmit: (amount: number, direction: 'toWallet' | 'toBalance') => void;
  onClose: () => void;
}

const WalletTransferForm: React.FC<WalletTransferFormProps> = ({
  balance,
  walletBalance,
  onSubmit,
  onClose
}) => {
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'toWallet' | 'toBalance'>('toWallet');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }

    const numAmount = Number(amount);
    if (direction === 'toWallet' && numAmount > balance) {
      setError('Insufficient balance');
      return;
    }
    if (direction === 'toBalance' && numAmount > walletBalance) {
      setError('Insufficient wallet balance');
      return;
    }

    onSubmit(numAmount, direction);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Transfer Money</h2>
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
            Transfer Direction
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setDirection('toWallet')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                direction === 'toWallet'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              To Wallet
            </button>
            <button
              type="button"
              onClick={() => setDirection('toBalance')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                direction === 'toBalance'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              To Balance
            </button>
          </div>
        </div>

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

        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Available {direction === 'toWallet' ? 'Balance' : 'in Wallet'}</p>
            <p className="text-lg font-semibold">₹{(direction === 'toWallet' ? balance : walletBalance).toLocaleString()}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
          <div className="text-right">
            <p className="text-sm text-gray-600">After Transfer</p>
            <p className="text-lg font-semibold">
              ₹{(direction === 'toWallet' 
                ? balance - (Number(amount) || 0)
                : walletBalance - (Number(amount) || 0)
              ).toLocaleString()}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Transfer Money
        </button>
      </form>
    </div>
  );
};

export default WalletTransferForm;
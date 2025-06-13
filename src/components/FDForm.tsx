import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { FDTransaction } from '../types';

interface FDFormProps {
  balance: number;
  fdTransactions: FDTransaction[];
  onSubmit: (fd: FDTransaction) => void;
  onClose: () => void;
}

const FDForm: React.FC<FDFormProps> = ({
  balance,
  fdTransactions,
  onSubmit,
  onClose
}) => {
  const [type, setType] = useState<'create' | 'break'>('create');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState<3 | 6 | 12>(3);
  const [selectedFD, setSelectedFD] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateMaturityAmount = (principal: number, tenureMonths: number) => {
    const rate = tenureMonths === 3 ? 0.06 : tenureMonths === 6 ? 0.07 : 0.08;
    return principal * (1 + rate * (tenureMonths / 12));
  };

  const getMaturityDate = (startDate: Date, tenureMonths: number) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + tenureMonths);
    return date;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'create') {
      if (!amount || isNaN(Number(amount))) {
        setError('Please enter a valid amount');
        return;
      }

      const numAmount = Number(amount);
      if (numAmount < 1000) {
        setError('Minimum FD amount is ₹1,000');
        return;
      }

      if (numAmount > balance) {
        setError('Insufficient balance');
        return;
      }

      onSubmit({
        id: Date.now(),
        type: 'create',
        amount: numAmount,
        tenure,
        startDate: new Date()
      });
    } else {
      if (!selectedFD) {
        setError('Please select an FD to break');
        return;
      }

      onSubmit({
        id: Date.now(),
        type: 'break',
        amount: 0,
        tenure: 3,
        startDate: new Date(),
        linkedToId: selectedFD
      });
    }
  };

  const getInterestRate = (months: number) => {
    switch (months) {
      case 3: return '6%';
      case 6: return '7%';
      case 12: return '8%';
      default: return '6%';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Fixed Deposit</h2>
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
            Action
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setType('create')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                type === 'create'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Create FD
            </button>
            <button
              type="button"
              onClick={() => setType('break')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                type === 'break'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Break FD
            </button>
          </div>
        </div>

        {type === 'create' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter amount (min. ₹1,000)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenure
              </label>
              <div className="flex gap-4">
                {[3, 6, 12].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setTenure(months as 3 | 6 | 12)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      tenure === months
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {months} Months
                    <div className="text-sm mt-1">
                      {getInterestRate(months)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {amount && (
              <div className="p-4 bg-amber-50 rounded-lg space-y-2">
                <div className="flex justify-between text-amber-700">
                  <span>Maturity Amount:</span>
                  <span className="font-medium">
                    ₹{calculateMaturityAmount(Number(amount), tenure).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Maturity Date:</span>
                  <span className="font-medium">
                    {getMaturityDate(new Date(), tenure).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center text-amber-700 mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Important Notes</span>
              </div>
              <ul className="text-sm text-amber-600 space-y-1 list-disc list-inside">
                <li>Minimum investment period is 3 months</li>
                <li>Early withdrawal before 3 months: No interest</li>
                <li>Interest rates: 3M (6%), 6M (7%), 12M (8%)</li>
              </ul>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select FD to Break
            </label>
            <div className="space-y-2">
              {fdTransactions.length === 0 ? (
                <p className="text-gray-500">No active FDs found</p>
              ) : (
                fdTransactions.map((fd) => {
                  const maturityDate = getMaturityDate(fd.startDate, fd.tenure);
                  const maturityAmount = calculateMaturityAmount(fd.amount, fd.tenure);

                  return (
                    <button
                      key={fd.id}
                      type="button"
                      onClick={() => setSelectedFD(fd.id)}
                      className={`w-full p-4 rounded-lg border ${
                        selectedFD === fd.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <p className="font-medium">₹{fd.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">
                            Started: {fd.startDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            Matures: {maturityDate.toLocaleDateString()}
                          </p>
                          <p className="text-sm text-emerald-600">
                            Final: ₹{maturityAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          {type === 'create' ? 'Create Fixed Deposit' : 'Break Fixed Deposit'}
        </button>
      </form>
    </div>
  );
};

export default FDForm;
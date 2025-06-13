import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';

interface RoundOffValueProps {
  onClose: () => void;
}

const RoundOffValue: React.FC<RoundOffValueProps> = ({ onClose }) => {
  const [value, setValue] = useState<string>('');
  const [roundedValue, setRoundedValue] = useState<number>(0);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      const rounded = Math.ceil(numValue / 10) * 10;
      setRoundedValue(rounded);
    } else {
      setRoundedValue(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Calculator className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Round Off Calculator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Value
            </label>
            <input
              type="number"
              value={value}
              onChange={handleValueChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter a number"
              step="0.01"
            />
          </div>

          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Rounded Value</div>
            <div className="text-3xl font-bold text-indigo-600">
              {roundedValue.toLocaleString()}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>This calculator rounds up to the nearest 10.</p>
            <p>Example: 123 → 130, 45.6 → 50</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundOffValue;
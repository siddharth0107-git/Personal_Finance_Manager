import React, { useState } from 'react';
import { PlusCircle, Wallet, TrendingDown, Save } from 'lucide-react';

interface MonthlyBudgetProps {
  onSave: (budgets: BudgetCategory[]) => void;
  initialBudgets?: BudgetCategory[];
}

export interface BudgetCategory {
  id: number;
  category: string;
  amount: number;
  spent: number;
}

const defaultCategories = [
  { id: 1, category: 'Housing', amount: 0, spent: 0 },
  { id: 2, category: 'Transportation', amount: 0, spent: 0 },
  { id: 3, category: 'Food', amount: 0, spent: 0 },
  { id: 4, category: 'Utilities', amount: 0, spent: 0 },
  { id: 5, category: 'Healthcare', amount: 0, spent: 0 },
  { id: 6, category: 'Entertainment', amount: 0, spent: 0 }
];

const MonthlyBudget: React.FC<MonthlyBudgetProps> = ({ onSave, initialBudgets }) => {
  const [budgets, setBudgets] = useState<BudgetCategory[]>(initialBudgets || defaultCategories);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const handleAddCategory = () => {
    if (newCategory && newAmount) {
      setBudgets([
        ...budgets,
        {
          id: Date.now(),
          category: newCategory,
          amount: Number(newAmount),
          spent: 0
        }
      ]);
      setNewCategory('');
      setNewAmount('');
    }
  };

  const handleUpdateAmount = (id: number, amount: string) => {
    setBudgets(budgets.map(budget => 
      budget.id === id ? { ...budget, amount: Number(amount) } : budget
    ));
  };

  const handleSave = () => {
    onSave(budgets);
  };

  const getTotalBudget = () => budgets.reduce((acc, curr) => acc + curr.amount, 0);
  const getTotalSpent = () => budgets.reduce((acc, curr) => acc + curr.spent, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Wallet className="h-6 w-6 mr-2 text-indigo-600" />
        Monthly Budget
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total Budget</div>
          <div className="text-2xl font-bold text-indigo-600">
            ₹{getTotalBudget().toLocaleString()}
          </div>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total Spent</div>
          <div className="text-2xl font-bold text-rose-600">
            ₹{getTotalSpent().toLocaleString()}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {budgets.map(budget => (
          <div key={budget.id} className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {budget.category}
              </label>
              <input
                type="number"
                value={budget.amount}
                onChange={(e) => handleUpdateAmount(budget.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter budget amount"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spent
              </label>
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                ₹{budget.spent.toLocaleString()}
              </div>
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                %
              </label>
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                {budget.amount ? ((budget.spent / budget.amount) * 100).toFixed(1) : '0'}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Category</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Category name"
          />
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Amount"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Save className="h-5 w-5 mr-2" />
        Save Budget
      </button>
    </div>
  );
};

export default MonthlyBudget;
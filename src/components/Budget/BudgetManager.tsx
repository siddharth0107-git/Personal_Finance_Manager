import React, { useState, useEffect } from 'react';
import { PieChart, AlertTriangle, TrendingUp, Settings, Plus } from 'lucide-react';
import { Budget } from '../../types/extended';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface BudgetManagerProps {
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent' | 'isExceeded'>) => void;
  onUpdateBudget: (id: string, updates: Partial<Budget>) => void;
  onDeleteBudget: (id: string) => void;
  monthlyExpenses: { category: string; amount: number }[];
  currentMonth: string;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
  monthlyExpenses,
  currentMonth
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [formData, setFormData] = useState({
    category: '',
    monthlyLimit: '',
    alertThreshold: '80'
  });

  const categories = [
    'Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare',
    'Entertainment', 'Shopping', 'Education', 'Insurance', 'Others'
  ];

  // Update budget spent amounts based on actual expenses
  useEffect(() => {
    const currentMonthBudgets = budgets.filter(b => b.month === selectedMonth);
    
    currentMonthBudgets.forEach(budget => {
      const categoryExpense = monthlyExpenses.find(e => e.category === budget.category);
      const spent = categoryExpense ? categoryExpense.amount : 0;
      const isExceeded = spent > budget.monthlyLimit;
      const isNearLimit = (spent / budget.monthlyLimit) * 100 >= budget.alertThreshold;

      if (budget.spent !== spent || budget.isExceeded !== isExceeded) {
        onUpdateBudget(budget.id, { spent, isExceeded });
        
        if (isExceeded && !budget.isExceeded) {
          toast.error(`Budget exceeded for ${budget.category}!`);
        } else if (isNearLimit && !isExceeded && spent > 0) {
          toast.error(`Warning: ${budget.category} budget is ${((spent / budget.monthlyLimit) * 100).toFixed(0)}% used`);
        }
      }
    });
  }, [monthlyExpenses, budgets, selectedMonth, onUpdateBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.monthlyLimit) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if budget already exists for this category and month
    const existingBudget = budgets.find(b => 
      b.category === formData.category && b.month === selectedMonth
    );

    if (existingBudget) {
      toast.error('Budget already exists for this category this month');
      return;
    }

    const budgetData = {
      category: formData.category,
      monthlyLimit: parseFloat(formData.monthlyLimit),
      month: selectedMonth,
      alertThreshold: parseFloat(formData.alertThreshold)
    };

    onAddBudget(budgetData);
    toast.success('Budget created successfully!');
    
    setFormData({ category: '', monthlyLimit: '', alertThreshold: '80' });
    setShowAddForm(false);
  };

  const currentMonthBudgets = budgets.filter(b => b.month === selectedMonth);
  const totalBudget = currentMonthBudgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpent = currentMonthBudgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getProgressColor = (percentage: number, alertThreshold: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= alertThreshold) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getProgressTextColor = (percentage: number, alertThreshold: number) => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= alertThreshold) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <PieChart className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Budget Manager</h2>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - 6 + i);
              const monthStr = format(date, 'yyyy-MM');
              return (
                <option key={monthStr} value={monthStr}>
                  {format(date, 'MMMM yyyy')}
                </option>
              );
            })}
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Budget
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600">Total Budget</span>
            <PieChart className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">
            ₹{totalBudget.toLocaleString()}
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-rose-600">Total Spent</span>
            <TrendingUp className="h-5 w-5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">
            ₹{totalSpent.toLocaleString()}
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-600">Remaining</span>
            <AlertTriangle className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            ₹{Math.max(0, totalBudget - totalSpent).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      {totalBudget > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Overall Budget Utilization</span>
            <span className={`font-semibold ${getProgressTextColor(budgetUtilization, 80)}`}>
              {budgetUtilization.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full ${getProgressColor(budgetUtilization, 80)}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Budget Categories */}
      <div className="space-y-4">
        <AnimatePresence>
          {currentMonthBudgets.map((budget) => {
            const percentage = budget.monthlyLimit > 0 ? (budget.spent / budget.monthlyLimit) * 100 : 0;
            const remaining = Math.max(0, budget.monthlyLimit - budget.spent);
            
            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  budget.isExceeded
                    ? 'border-red-200 bg-red-50'
                    : percentage >= budget.alertThreshold
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-emerald-200 bg-emerald-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-600">
                      Alert at {budget.alertThreshold}% usage
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ₹{budget.spent.toLocaleString()} / ₹{budget.monthlyLimit.toLocaleString()}
                    </div>
                    <div className={`text-sm font-medium ${getProgressTextColor(percentage, budget.alertThreshold)}`}>
                      {percentage.toFixed(1)}% used
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${getProgressColor(percentage, budget.alertThreshold)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    ₹{remaining.toLocaleString()} remaining
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const newLimit = prompt('Enter new budget limit:', budget.monthlyLimit.toString());
                        if (newLimit && !isNaN(parseFloat(newLimit))) {
                          onUpdateBudget(budget.id, { monthlyLimit: parseFloat(newLimit) });
                          toast.success('Budget limit updated!');
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this budget?')) {
                          onDeleteBudget(budget.id);
                          toast.success('Budget deleted!');
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {budget.isExceeded && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-700">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        Budget exceeded by ₹{(budget.spent - budget.monthlyLimit).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {currentMonthBudgets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No budgets set for {format(new Date(selectedMonth), 'MMMM yyyy')}</p>
          <p className="text-sm">Create budgets to track your spending limits</p>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">
              Add Budget for {format(new Date(selectedMonth), 'MMMM yyyy')}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Limit (₹) *
                </label>
                <input
                  type="number"
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Threshold (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.alertThreshold}
                  onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="80"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get notified when spending reaches this percentage
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ category: '', monthlyLimit: '', alertThreshold: '80' });
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Budget
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;
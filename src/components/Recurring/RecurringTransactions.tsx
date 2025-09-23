import React, { useState, useEffect } from 'react';
import { Repeat, Plus, Calendar, Clock, Play, Pause, Edit, Trash2 } from 'lucide-react';
import { RecurringTransaction } from '../../types/extended';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { addDays, addWeeks, addMonths, addYears, format, isAfter } from 'date-fns';

interface RecurringTransactionsProps {
  recurringTransactions: RecurringTransaction[];
  onAddRecurring: (transaction: Omit<RecurringTransaction, 'id' | 'nextDueDate' | 'lastProcessed'>) => void;
  onUpdateRecurring: (id: string, updates: Partial<RecurringTransaction>) => void;
  onDeleteRecurring: (id: string) => void;
  onProcessRecurring: (transaction: RecurringTransaction) => void;
}

const RecurringTransactions: React.FC<RecurringTransactionsProps> = ({
  recurringTransactions,
  onAddRecurring,
  onUpdateRecurring,
  onDeleteRecurring,
  onProcessRecurring
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: ''
  });

  const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Rental', 'Business', 'Others'],
    expense: ['Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare', 'Entertainment', 'Subscriptions', 'Insurance', 'Others']
  };

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  // Check for due recurring transactions
  useEffect(() => {
    const checkDueTransactions = () => {
      const now = new Date();
      recurringTransactions.forEach(transaction => {
        if (transaction.isActive && isAfter(now, transaction.nextDueDate)) {
          onProcessRecurring(transaction);
        }
      });
    };

    const interval = setInterval(checkDueTransactions, 60000); // Check every minute
    checkDueTransactions(); // Check immediately

    return () => clearInterval(interval);
  }, [recurringTransactions, onProcessRecurring]);

  const calculateNextDueDate = (startDate: Date, frequency: string): Date => {
    const now = new Date();
    let nextDate = new Date(startDate);

    while (nextDate <= now) {
      switch (frequency) {
        case 'daily':
          nextDate = addDays(nextDate, 1);
          break;
        case 'weekly':
          nextDate = addWeeks(nextDate, 1);
          break;
        case 'monthly':
          nextDate = addMonths(nextDate, 1);
          break;
        case 'yearly':
          nextDate = addYears(nextDate, 1);
          break;
      }
    }

    return nextDate;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transactionData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      frequency: formData.frequency,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      isActive: true
    };

    if (editingTransaction) {
      onUpdateRecurring(editingTransaction.id, {
        ...transactionData,
        nextDueDate: calculateNextDueDate(transactionData.startDate, transactionData.frequency)
      });
      toast.success('Recurring transaction updated!');
      setEditingTransaction(null);
    } else {
      onAddRecurring(transactionData);
      toast.success('Recurring transaction created!');
    }

    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      frequency: 'monthly',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: ''
    });
    setShowAddForm(false);
  };

  const toggleActive = (id: string, isActive: boolean) => {
    onUpdateRecurring(id, { isActive: !isActive });
    toast.success(isActive ? 'Recurring transaction paused' : 'Recurring transaction activated');
  };

  const getDaysUntilNext = (nextDueDate: Date): number => {
    const now = new Date();
    const diffTime = nextDueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Repeat className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold">Recurring Transactions</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Recurring
        </button>
      </div>

      {/* Recurring Transactions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {recurringTransactions.map((transaction) => {
            const daysUntilNext = getDaysUntilNext(transaction.nextDueDate);
            
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  transaction.isActive
                    ? 'border-purple-200 bg-purple-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {transaction.type}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {transaction.description}
                      </span>
                      <span className="text-sm text-gray-500">
                        {transaction.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="capitalize">{transaction.frequency}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {daysUntilNext > 0 
                            ? `${daysUntilNext} days until next`
                            : 'Due now'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Next: {format(transaction.nextDueDate, 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleActive(transaction.id, transaction.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          transaction.isActive
                            ? 'text-purple-600 hover:bg-purple-100'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {transaction.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction);
                          setFormData({
                            type: transaction.type,
                            amount: transaction.amount.toString(),
                            category: transaction.category,
                            description: transaction.description,
                            frequency: transaction.frequency,
                            startDate: format(transaction.startDate, 'yyyy-MM-dd'),
                            endDate: transaction.endDate ? format(transaction.endDate, 'yyyy-MM-dd') : ''
                          });
                          setShowAddForm(true);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => onDeleteRecurring(transaction.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {recurringTransactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Repeat className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No recurring transactions set up yet</p>
          <p className="text-sm">Add recurring income or expenses to automate your finances</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingTransaction ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      formData.type === 'income'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      formData.type === 'expense'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select category</option>
                  {categories[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Monthly rent, Salary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>{freq.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTransaction(null);
                    setFormData({
                      type: 'expense',
                      amount: '',
                      category: '',
                      description: '',
                      frequency: 'monthly',
                      startDate: format(new Date(), 'yyyy-MM-dd'),
                      endDate: ''
                    });
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingTransaction ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Summary Stats */}
      {recurringTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              ₹{recurringTransactions
                .filter(t => t.type === 'income' && t.isActive)
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Income</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-600">
              ₹{recurringTransactions
                .filter(t => t.type === 'expense' && t.isActive)
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Expenses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {recurringTransactions.filter(t => t.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Recurring</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringTransactions;
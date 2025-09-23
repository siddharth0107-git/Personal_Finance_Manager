import React, { useState, useEffect } from 'react';
import { Target, Plus, Calendar, TrendingUp, Award, Edit, Trash2 } from 'lucide-react';
import { Goal } from '../../types/extended';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
  currentBalance: number;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  currentBalance
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    targetDate: '',
    category: 'Savings',
    description: ''
  });

  const categories = ['Savings', 'Investment', 'Emergency Fund', 'Vacation', 'Education', 'Home', 'Car', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount || !formData.targetDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goalData = {
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      targetDate: new Date(formData.targetDate),
      category: formData.category,
      description: formData.description,
      isCompleted: false
    };

    if (editingGoal) {
      onUpdateGoal(editingGoal.id, goalData);
      toast.success('Goal updated successfully!');
      setEditingGoal(null);
    } else {
      onAddGoal(goalData);
      toast.success('Goal created successfully!');
    }

    setFormData({ title: '', targetAmount: '', targetDate: '', category: 'Savings', description: '' });
    setShowAddForm(false);
  };

  const handleAddMoney = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    if (amount > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }

    const newAmount = goal.currentAmount + amount;
    const isCompleted = newAmount >= goal.targetAmount;

    onUpdateGoal(goalId, { 
      currentAmount: newAmount,
      isCompleted 
    });

    if (isCompleted && !goal.isCompleted) {
      toast.success('🎉 Congratulations! Goal achieved!');
    } else {
      toast.success(`₹${amount.toLocaleString()} added to goal`);
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Target className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold">Financial Goals</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <AnimatePresence>
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal);
            const daysRemaining = getDaysRemaining(goal.targetDate);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                  goal.isCompleted 
                    ? 'border-emerald-200 bg-emerald-50' 
                    : 'border-gray-200 bg-white hover:border-indigo-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-500">{goal.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingGoal(goal);
                        setFormData({
                          title: goal.title,
                          targetAmount: goal.targetAmount.toString(),
                          targetDate: goal.targetDate.toISOString().split('T')[0],
                          category: goal.category,
                          description: goal.description || ''
                        });
                        setShowAddForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-indigo-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>₹{goal.currentAmount.toLocaleString()}</span>
                    <span>₹{goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className={`h-3 rounded-full ${
                        goal.isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {!goal.isCompleted && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const amount = prompt('Enter amount to add:');
                        if (amount && !isNaN(parseFloat(amount))) {
                          handleAddMoney(goal.id, parseFloat(amount));
                        }
                      }}
                      className="flex-1 py-2 px-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
                    >
                      Add Money
                    </button>
                  </div>
                )}

                {goal.isCompleted && (
                  <div className="flex items-center justify-center py-2 text-emerald-600">
                    <Award className="h-5 w-5 mr-2" />
                    <span className="font-medium">Goal Achieved!</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add/Edit Goal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Emergency Fund"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date *
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingGoal(null);
                    setFormData({ title: '', targetAmount: '', targetDate: '', category: 'Savings', description: '' });
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Goals Summary */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {goals.filter(g => g.isCompleted).length}
            </div>
            <div className="text-sm text-gray-600">Completed Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {goals.filter(g => !g.isCompleted).length}
            </div>
            <div className="text-sm text-gray-600">Active Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              ₹{goals.reduce((sum, g) => sum + g.currentAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Saved</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;
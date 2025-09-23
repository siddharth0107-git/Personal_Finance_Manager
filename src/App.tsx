import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { 
  Wallet, CreditCard, TrendingDown, 
  Menu, User, BarChart2, History, FileText, 
  Info, Settings, LogOut, Plus, TrendingUp,
  ArrowRightLeft, LineChart, Calculator, Bell,
  DollarSign, PieChart, Shield, AlertCircle,
  Banknote, Building, ShoppingBag, Coffee, Car,
  Briefcase, Gift, Heart, Home, Laptop, X, Trash2, 
  Check, XCircle, Book, Target, Repeat, Download
} from 'lucide-react';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import TransactionForm from './components/TransactionForm';
import TransactionHistory from './components/TransactionHistory';
import Navigation from './components/Navigation';
import StatCard from './components/StatCard';
import WalletTransferForm from './components/WalletTransferForm';
import TopCompanies from './components/TopCompanies';
import ProfilePage from './components/Profile/ProfilePage';
import GoalTracker from './components/Goals/GoalTracker';
import RecurringTransactions from './components/Recurring/RecurringTransactions';
import BudgetManager from './components/Budget/BudgetManager';
import CashFlowForecast from './components/CashFlow/CashFlowForecast';
import DataExport from './components/Export/DataExport';
import { Transaction, NavItem } from './types';
import { Goal, RecurringTransaction, Budget, Loan } from './types/extended';
import { addDays, addWeeks, addMonths, addYears, isAfter } from 'date-fns';
import toast from 'react-hot-toast';

const navItems: NavItem[] = [
  { icon: User, label: 'Profile' },
  { icon: Target, label: 'Goals' },
  { icon: Repeat, label: 'Recurring' },
  { icon: PieChart, label: 'Budgets' },
  { icon: TrendingUp, label: 'Forecast' },
  { icon: Download, label: 'Export' },
  { icon: LineChart, label: 'Stock Market' },
  { icon: History, label: 'History' },
  { icon: Shield, label: 'Security' },
  { icon: FileText, label: 'Terms' },
  { icon: Info, label: 'About' },
  { icon: Settings, label: 'Settings' },
  { icon: LogOut, label: 'Logout' }
];

const EXPENSE_CATEGORIES = [
  { name: 'Housing', icon: Home },
  { name: 'Transportation', icon: Car },
  { name: 'Food', icon: Coffee },
  { name: 'Shopping', icon: ShoppingBag },
  { name: 'Healthcare', icon: Heart },
  { name: 'Entertainment', icon: Gift },
  { name: 'Utilities', icon: Building },
  { name: 'Technology', icon: Laptop },
  { name: 'Education', icon: Book },
  { name: 'Insurance', icon: Shield },
  { name: 'Personal Care', icon: User },
  { name: 'Others', icon: DollarSign }
];

const CHART_COLORS = [
  '#10B981', '#F43F5E', '#3B82F6', '#F59E0B', '#8B5CF6',
  '#EC4899', '#14B8A6', '#6366F1', '#64748B', '#DC2626',
  '#059669', '#7C3AED'
];

const generateDemoTransactions = () => {
  const transactions: Transaction[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  // Monthly salary transactions
  for (let date = new Date(oneYearAgo); date <= now; date.setMonth(date.getMonth() + 1)) {
    transactions.push({
      id: Date.now() + Math.random(),
      type: 'income',
      amount: 85000,
      category: 'Salary',
      date: new Date(date),
      notes: 'Monthly salary'
    });
  }

  // Freelance income (random months)
  for (let date = new Date(oneYearAgo); date <= now; date.setMonth(date.getMonth() + 1)) {
    if (Math.random() < 0.4) {
      transactions.push({
        id: Date.now() + Math.random(),
        type: 'income',
        amount: Math.floor(Math.random() * 30000) + 20000,
        category: 'Freelance',
        date: new Date(date),
        notes: 'Freelance project payment'
      });
    }
  }

  // Regular monthly expenses
  for (let date = new Date(oneYearAgo); date <= now; date.setMonth(date.getMonth() + 1)) {
    // Rent
    transactions.push({
      id: Date.now() + Math.random(),
      type: 'expense',
      amount: 25000,
      category: 'Housing',
      date: new Date(date),
      notes: 'Monthly rent'
    });

    // Utilities
    transactions.push({
      id: Date.now() + Math.random(),
      type: 'expense',
      amount: Math.floor(Math.random() * 2000) + 3000,
      category: 'Utilities',
      date: new Date(date),
      notes: 'Electricity and water bills'
    });

    // Internet
    transactions.push({
      id: Date.now() + Math.random(),
      type: 'expense',
      amount: 1499,
      category: 'Technology',
      date: new Date(date),
      notes: 'Internet subscription'
    });
  }

  // Daily/weekly expenses for the current month
  const currentMonth = new Date();
  currentMonth.setDate(1);
  while (currentMonth <= now) {
    // Food expenses (3-4 times a week)
    if (Math.random() < 0.5) {
      transactions.push({
        id: Date.now() + Math.random(),
        type: 'expense',
        amount: Math.floor(Math.random() * 500) + 200,
        category: 'Food',
        date: new Date(currentMonth),
        notes: 'Lunch/Dinner'
      });
    }

    // Transportation
    if (Math.random() < 0.3) {
      transactions.push({
        id: Date.now() + Math.random(),
        type: 'expense',
        amount: Math.floor(Math.random() * 300) + 100,
        category: 'Transportation',
        date: new Date(currentMonth),
        notes: 'Fuel/Taxi'
      });
    }

    // Shopping (1-2 times a week)
    if (Math.random() < 0.2) {
      transactions.push({
        id: Date.now() + Math.random(),
        type: 'expense',
        amount: Math.floor(Math.random() * 3000) + 1000,
        category: 'Shopping',
        date: new Date(currentMonth),
        notes: 'Clothing/Accessories'
      });
    }

    // Entertainment (weekends)
    if (currentMonth.getDay() === 0 || currentMonth.getDay() === 6) {
      if (Math.random() < 0.4) {
        transactions.push({
          id: Date.now() + Math.random(),
          type: 'expense',
          amount: Math.floor(Math.random() * 2000) + 500,
          category: 'Entertainment',
          date: new Date(currentMonth),
          notes: 'Movies/Dining out'
        });
      }
    }

    currentMonth.setDate(currentMonth.getDate() + 1);
  }

  // Quarterly expenses
  for (let date = new Date(oneYearAgo); date <= now; date.setMonth(date.getMonth() + 3)) {
    // Insurance
    transactions.push({
      id: Date.now() + Math.random(),
      type: 'expense',
      amount: 5000,
      category: 'Insurance',
      date: new Date(date),
      notes: 'Health insurance premium'
    });
  }

  // Random one-time expenses
  const oneTimeExpenses = [
    { category: 'Technology', min: 20000, max: 80000, notes: ['New laptop', 'Smartphone upgrade', 'Gaming console'] },
    { category: 'Healthcare', min: 2000, max: 10000, notes: ['Medical checkup', 'Dental work', 'Eye examination'] },
    { category: 'Personal Care', min: 1000, max: 5000, notes: ['Haircut and spa', 'Gym membership', 'Personal grooming'] },
    { category: 'Education', min: 15000, max: 50000, notes: ['Online course', 'Professional certification', 'Workshop registration'] }
  ];

  oneTimeExpenses.forEach(expense => {
    if (Math.random() < 0.7) {
      transactions.push({
        id: Date.now() + Math.random(),
        type: 'expense',
        amount: Math.floor(Math.random() * (expense.max - expense.min)) + expense.min,
        category: expense.category,
        date: new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime())),
        notes: expense.notes[Math.floor(Math.random() * expense.notes.length)]
      });
    }
  });

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

interface InsufficientFundsModalProps {
  amount: number;
  balance: number;
  walletBalance: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const InsufficientFundsModal: React.FC<InsufficientFundsModalProps> = ({
  amount,
  balance,
  walletBalance,
  onConfirm,
  onCancel
}) => {
  const shortfall = amount - balance;
  const canUseWallet = walletBalance >= shortfall;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4 text-red-600 flex items-center">
          <AlertCircle className="h-6 w-6 mr-2" />
          Insufficient Funds
        </h3>
        <p className="text-gray-700 mb-4">
          You don't have enough balance for this transaction.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between mb-2">
            <span>Transaction Amount:</span>
            <span className="font-semibold">₹{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Current Balance:</span>
            <span className="font-semibold">₹{balance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shortfall:</span>
            <span className="font-semibold text-red-600">₹{shortfall.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Wallet Balance:</span>
            <span className="font-semibold">₹{walletBalance.toLocaleString()}</span>
          </div>
        </div>
        {canUseWallet ? (
          <>
            <p className="mb-4 text-gray-700">
              Would you like to deduct the extra amount (₹{shortfall.toLocaleString()}) from your wallet balance?
            </p>
            <div className="flex gap-4">
              <button
                onClick={onConfirm}
                className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                <Check className="h-5 w-5 mr-2" />
                Yes, Use Wallet
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-gray-700">
              You don't have sufficient funds in your wallet either. The transaction cannot be processed.
            </p>
            <button
              onClick={onCancel}
              className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [showStockMarket, setShowStockMarket] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
  const [showBudgets, setShowBudgets] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCategoryPieChart, setShowCategoryPieChart] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<Transaction | null>(null);
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>(generateDemoTransactions());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [balance, setBalance] = useState(150000);
  const [walletBalance, setWalletBalance] = useState(45000);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expensePercentage = monthlyIncome > 0 ? Math.min((monthlyExpenses / monthlyIncome) * 100, 100) : 0;
  const isExpenseHigh = expensePercentage >= 75;

  useEffect(() => {
    if (isExpenseHigh) {
      addNotification('⚠️ Warning: Your expenses are more than 75% of your income');
    }
  }, [isExpenseHigh]);

  const categoryExpenses = EXPENSE_CATEGORIES.map(category => {
    const amount = monthlyTransactions
      .filter(t => t.type === 'expense' && t.category === category.name)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return {
      name: category.name,
      value: amount
    };
  }).filter(cat => cat.value > 0);

  // Get last 7 days of expenses
  const last7DaysExpenses = monthlyTransactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return t.type === 'expense' && diffDays <= 7;
    })
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const dailyExpensesData = Object.entries(last7DaysExpenses)
    .map(([date, amount]) => ({
      date,
      amount
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev]);
  };

  const handleTransaction = (transaction: Transaction) => {
    if (transaction.type === 'expense' && transaction.amount > balance) {
      setPendingTransaction(transaction);
      setShowInsufficientFundsModal(true);
      return;
    }

    processTransaction(transaction);
  };

  const processTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    
    if (transaction.type === 'expense') {
      setBalance(prev => prev - transaction.amount);
      const category = transaction.category.toLowerCase();
      if (category === 'food' && transaction.amount > 500) {
        addNotification('💡 Tip: Consider home-cooked meals to save on food expenses');
      } else if (category === 'entertainment' && transaction.amount > 1000) {
        addNotification('💡 Tip: Look for free or low-cost entertainment options');
      }
    } else {
      setBalance(prev => prev + transaction.amount);
      if (transaction.amount > 5000) {
        addNotification('💡 Tip: Consider saving a portion of your income');
      }
    }
    setShowIncomeForm(false);
    setShowExpenseForm(false);
    setPendingTransaction(null);
  };

  const handleInsufficientFundsConfirm = () => {
    if (pendingTransaction) {
      const shortfall = pendingTransaction.amount - balance;
      setWalletBalance(prev => prev - shortfall);
      processTransaction(pendingTransaction);
    }
    setShowInsufficientFundsModal(false);
  };

  const handleInsufficientFundsCancel = () => {
    setPendingTransaction(null);
    setShowInsufficientFundsModal(false);
    addNotification('❌ Transaction cancelled due to insufficient funds');
  };

  const handleRemoveTransaction = (transactionId: number) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    
    if (transaction.type === 'expense') {
      setBalance(prev => prev + transaction.amount);
    } else {
      setBalance(prev => prev - transaction.amount);
    }

    addNotification(`✅ Transaction removed successfully`);
  };

  const handleWalletTransfer = (amount: number, direction: 'toWallet' | 'toBalance') => {
    if (direction === 'toWallet') {
      if (amount > balance) {
        addNotification('❌ Transfer failed: Insufficient balance');
        return;
      }
      setBalance(prev => prev - amount);
      setWalletBalance(prev => prev + amount);
      addNotification('✅ Money transferred to wallet successfully');
    } else {
      if (amount > walletBalance) {
        addNotification('❌ Transfer failed: Insufficient wallet balance');
        return;
      }
      setWalletBalance(prev => prev - amount);
      setBalance(prev => prev + amount);
      addNotification('✅ Money transferred to main balance successfully');
    }
    setShowWalletForm(false);
  };

  const handleNavItemClick = (label: string) => {
    if (label === 'Profile') {
      setShowProfile(true);
    } else if (label === 'Goals') {
      setShowGoals(true);
    } else if (label === 'Recurring') {
      setShowRecurring(true);
    } else if (label === 'Budgets') {
      setShowBudgets(true);
    } else if (label === 'Forecast') {
      setShowForecast(true);
    } else if (label === 'Export') {
      setShowExport(true);
    } else if (label === 'Stock Market') {
      setShowStockMarket(true);
    } else if (label === 'Logout') {
      setIsLoggedIn(false);
    }
    setIsNavOpen(false);
  };

  // Goal management functions
  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  // Recurring transaction functions
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

  const handleAddRecurring = (recurringData: Omit<RecurringTransaction, 'id' | 'nextDueDate' | 'lastProcessed'>) => {
    const newRecurring: RecurringTransaction = {
      ...recurringData,
      id: Date.now().toString(),
      nextDueDate: calculateNextDueDate(recurringData.startDate, recurringData.frequency)
    };
    setRecurringTransactions(prev => [...prev, newRecurring]);
  };

  const handleUpdateRecurring = (id: string, updates: Partial<RecurringTransaction>) => {
    setRecurringTransactions(prev => prev.map(recurring => 
      recurring.id === id ? { ...recurring, ...updates } : recurring
    ));
  };

  const handleDeleteRecurring = (id: string) => {
    setRecurringTransactions(prev => prev.filter(recurring => recurring.id !== id));
  };

  const handleProcessRecurring = (recurring: RecurringTransaction) => {
    // Create a new transaction from recurring
    const newTransaction: Transaction = {
      id: Date.now(),
      type: recurring.type,
      amount: recurring.amount,
      category: recurring.category,
      date: new Date(),
      notes: `${recurring.description} (Auto-generated)`
    };

    // Process the transaction
    processTransaction(newTransaction);

    // Update the recurring transaction's next due date
    const nextDueDate = calculateNextDueDate(recurring.nextDueDate, recurring.frequency);
    handleUpdateRecurring(recurring.id, {
      nextDueDate,
      lastProcessed: new Date()
    });

    toast.success(`Recurring ${recurring.type} processed: ${recurring.description}`);
  };

  // Budget management functions
  const handleAddBudget = (budgetData: Omit<Budget, 'id' | 'spent' | 'isExceeded'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: Date.now().toString(),
      spent: 0,
      isExceeded: false
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const handleUpdateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === id ? { ...budget, ...updates } : budget
    ));
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  // Calculate monthly expenses by category for budget tracking
  const monthlyExpensesByCategory = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ category: t.category, amount: t.amount });
      }
      return acc;
    }, [] as { category: string; amount: number }[]);

  const AnalysisModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthlyData = monthNames.map((month, index) => {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

      return {
        month,
        income,
        expenses,
        savings: Math.max(0, income - expenses)
      };
    });

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Monthly Analysis</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#F43F5E" name="Expenses" />
                <Bar dataKey="savings" fill="#6366F1" name="Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyData.slice(currentMonth - 2, currentMonth + 1).map((data, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{data.month}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-600">Income:</span>
                    <span className="font-medium">₹{data.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-600">Expenses:</span>
                    <span className="font-medium">₹{data.expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-indigo-600">Savings:</span>
                    <span className="font-medium">₹{data.savings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Toaster position="top-right" />
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="p-2 rounded-md hover:bg-indigo-50 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </button>
              <div className="ml-4">
                <h1 className="text-lg font-bold text-gray-800">
                  Personal Finance Manager
                </h1>
                <p className="text-sm text-gray-500">
                  Track, Save, Grow – Your Money, Your Control!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-md hover:bg-indigo-50 transition-colors relative"
                >
                  <Bell className="h-5 w-5 text-gray-700" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-4 max-h-96 overflow-y-auto">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        <button
                          onClick={() => setNotifications([])}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="space-y-2">
                        {notifications.map((notification, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded-lg text-sm animate-fade-in">
                            {notification}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Navigation 
        items={navItems} 
        isOpen={isNavOpen} 
        onClose={() => setIsNavOpen(false)}
        onItemClick={handleNavItemClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Current Balance"
            value={`₹${balance.toLocaleString()}`}
            icon={CreditCard}
            className="from-blue-500 to-indigo-600"
          />
          <StatCard
            title="Wallet Balance"
            value={`₹${walletBalance.toLocaleString()}`}
            icon={Wallet}
            className="from-emerald-500 to-teal-600"
          />
          <div onClick={() => setShowCategoryPieChart(true)} className="cursor-pointer">
            <StatCard
              title="Monthly Overview"
              value={`₹${monthlyExpenses.toLocaleString()}`}
              icon={TrendingDown}
              className="from-rose-500 to-pink-600"
              subtitle={`${((monthlyExpenses / monthlyIncome) * 100).toFixed(1)}% of income`}
            />
          </div>
          <StatCard
            title="Monthly Income"
            value={`₹${monthlyIncome.toLocaleString()}`}
            icon={TrendingUp}
            className="from-amber-500 to-orange-600"
            subtitle={`${monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1) : '0'}% savings rate`}
          />
        </div>

        {isExpenseHigh && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div className="text-red-700">
              Warning: Your expenses are more than 75% of your income
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => setShowIncomeForm(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Add Income
          </button>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="flex items-center px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 transition-colors shadow-md"
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Add Expense
          </button>
          <button
            onClick={() => setShowWalletForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Transfer Money
          </button>
          <button
            onClick={() => setShowAnalysis(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-emerald-600">Income: ₹{monthlyIncome.toLocaleString()}</span>
                <span className="text-gray-300">|</span>
                <span className="text-rose-600">Expenses: ₹{monthlyExpenses.toLocaleString()}</span>
              </div>
            </div>
            <TransactionHistory 
              transactions={transactions} 
              onRemove={handleRemoveTransaction}
            />
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                No transactions yet. Start by adding income or expenses!
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie
                    data={[
                      { name: 'Income', value: monthlyIncome },
                      { name: 'Expenses', value: monthlyExpenses }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#F43F5E" />
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                </RechartsChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Last 7 Days Expenses</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyExpensesData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: '#6B7280' }}
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Expenses']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="url(#expenseGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F43F5E" />
                        <stop offset="100%" stopColor="#FB7185" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        
        </div>

        {showCategoryPieChart && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Expense Analysis</h2>
                <button
                  onClick={() => setShowCategoryPieChart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsChart>
                        <Pie
                          data={categoryExpenses}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryExpenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => `₹${value.toLocaleString()}`}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                      </RechartsChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <h3 className="text-lg font-medium mb-4">Category Details</h3>
                  <div className="space-y-4">
                    {categoryExpenses.map((category, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-rose-600 font-medium">
                            ₹{category.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${(category.value / monthlyExpenses) * 100}%`,
                                backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                              }}
                            />
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {((category.value / monthlyExpenses) * 100).toFixed(1)}% of total expenses
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(showIncomeForm || showExpenseForm) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <TransactionForm 
              type={showIncomeForm ? 'income' : 'expense'}
              onSubmit={handleTransaction} 
              onClose={() => {
                setShowIncomeForm(false);
                setShowExpenseForm(false);
              }} 
            />
          </div>
        )}

        {showWalletForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <WalletTransferForm
              balance={balance}
              walletBalance={walletBalance}
              onSubmit={handleWalletTransfer}
              onClose={() => setShowWalletForm(false)}
            />
          </div>
        )}

        {showInsufficientFundsModal && pendingTransaction && (
          <InsufficientFundsModal
            amount={pendingTransaction.amount}
            balance={balance}
            walletBalance={walletBalance}
            onConfirm={handleInsufficientFundsConfirm}
            onCancel={handleInsufficientFundsCancel}
          />
        )}

        {showStockMarket && (
          <TopCompanies onClose={() => setShowStockMarket(false)} />
        )}

        {showProfile && (
          <ProfilePage onClose={() => setShowProfile(false)} />
        )}

        {showGoals && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Financial Goals</h2>
                  <button
                    onClick={() => setShowGoals(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <GoalTracker
                  goals={goals}
                  onAddGoal={handleAddGoal}
                  onUpdateGoal={handleUpdateGoal}
                  onDeleteGoal={handleDeleteGoal}
                  currentBalance={balance}
                />
              </div>
            </div>
          </div>
        )}

        {showRecurring && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Recurring Transactions</h2>
                  <button
                    onClick={() => setShowRecurring(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <RecurringTransactions
                  recurringTransactions={recurringTransactions}
                  onAddRecurring={handleAddRecurring}
                  onUpdateRecurring={handleUpdateRecurring}
                  onDeleteRecurring={handleDeleteRecurring}
                  onProcessRecurring={handleProcessRecurring}
                />
              </div>
            </div>
          </div>
        )}

        {showBudgets && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Budget Manager</h2>
                  <button
                    onClick={() => setShowBudgets(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <BudgetManager
                  budgets={budgets}
                  onAddBudget={handleAddBudget}
                  onUpdateBudget={handleUpdateBudget}
                  onDeleteBudget={handleDeleteBudget}
                  monthlyExpenses={monthlyExpensesByCategory}
                  currentMonth={`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`}
                />
              </div>
            </div>
          </div>
        )}

        {showForecast && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Cash Flow Forecast</h2>
                  <button
                    onClick={() => setShowForecast(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <CashFlowForecast
                  recurringTransactions={recurringTransactions}
                  currentBalance={balance}
                  walletBalance={walletBalance}
                />
              </div>
            </div>
          </div>
        )}

        {showExport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Export Data</h2>
                  <button
                    onClick={() => setShowExport(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <DataExport
                  transactions={transactions}
                  budgets={budgets}
                  goals={goals}
                  loans={loans}
                />
              </div>
            </div>
          </div>
        )}

        {showAnalysis && <AnalysisModal onClose={() => setShowAnalysis(false)} />}
      </main>
    </div>
  );
}
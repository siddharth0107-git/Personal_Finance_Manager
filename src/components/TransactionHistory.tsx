import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { 
  Trash2, ChevronDown, ChevronRight, Filter, Calendar,
  Home, Car, Coffee, ShoppingBag, Heart, Gift, Building, Laptop,
  Book, Shield, User, DollarSign, Briefcase, Coins, Store, Printer
} from 'lucide-react';
import PrintPreview from './PrintPreview';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onRemove: (id: number) => void;
}

const categoryIcons = {
  'Housing': Home,
  'Transportation': Car,
  'Food': Coffee,
  'Shopping': ShoppingBag,
  'Healthcare': Heart,
  'Entertainment': Gift,
  'Utilities': Building,
  'Technology': Laptop,
  'Education': Book,
  'Insurance': Shield,
  'Personal Care': User,
  'Others': DollarSign,
  'Salary': Briefcase,
  'Freelance': Coins,
  'Business': Store,
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, onRemove }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const availableMonths = useMemo(() => {
    const months = new Set(
      transactions.map(t => {
        const date = new Date(t.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
    );
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      
      const monthMatch = transactionMonth === selectedMonth;
      const typeMatch = selectedType === 'all' || transaction.type === selectedType;
      
      return monthMatch && typeMatch;
    });
  }, [transactions, selectedMonth, selectedType]);

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((groups, transaction) => {
      const category = transaction.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }, [filteredTransactions]);

  const categoryTotals = useMemo(() => {
    return Object.entries(groupedTransactions).reduce((totals, [category, categoryTransactions]) => {
      totals[category] = categoryTransactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
      return totals;
    }, {} as Record<string, number>);
  }, [groupedTransactions]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const formatMonthYear = (dateString: string) => {
    const [year, month] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-700 dark:text-gray-200">Filters</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPrintPreview(true)}
              className="flex items-center px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Statement
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredTransactions.length} transactions
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-sm px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:text-gray-200"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>
                  {formatMonthYear(month)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 text-sm font-medium ${
                selectedType === 'all'
                  ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-3 py-1 text-sm font-medium ${
                selectedType === 'income'
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-3 py-1 text-sm font-medium ${
                selectedType === 'expense'
                  ? 'bg-rose-600 dark:bg-rose-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Expense
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(groupedTransactions).map(([category, categoryTransactions]) => {
          const IconComponent = (categoryIcons as any)[category] || DollarSign;
          
          return (
            <div key={category} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  {expandedCategories.includes(category) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  )}
                  <div className="flex items-center">
                    <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{category}</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({categoryTransactions.length} transactions)
                  </span>
                </div>
                <span className={`font-semibold ${
                  categoryTotals[category] >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {categoryTotals[category] >= 0 ? '+' : ''}
                  ₹{Math.abs(categoryTotals[category]).toLocaleString()}
                </span>
              </button>

              {expandedCategories.includes(category) && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {categoryTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.notes || 'No notes'}</p>
                          <div className="flex items-center space-x-4">
                            <p className={`font-medium ${
                              transaction.type === 'income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}₹
                              {transaction.amount.toLocaleString()}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(transaction.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                            >
                              <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(groupedTransactions).length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            No transactions found for the selected filters
          </div>
        )}
      </div>

      {showPrintPreview && (
        <PrintPreview
          transactions={filteredTransactions}
          onClose={() => setShowPrintPreview(false)}
          selectedMonth={formatMonthYear(selectedMonth)}
        />
      )}
    </div>
  );
};

export default TransactionHistory;
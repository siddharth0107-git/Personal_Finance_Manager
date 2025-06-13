import React, { useState, useEffect } from 'react';
import { RefreshCw, Filter, Calendar, Download, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  accountName: string;
  type: 'credit' | 'debit';
}

interface TransactionSyncProps {
  onSync: (transactions: Transaction[]) => void;
}

const TransactionSync: React.FC<TransactionSyncProps> = ({ onSync }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    // Simulate initial transaction fetch
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo transactions
      const demoTransactions: Transaction[] = [
        {
          id: '1',
          date: '2024-03-15',
          description: 'Salary Credit',
          amount: 75000,
          category: 'Income',
          accountName: 'HDFC Bank',
          type: 'credit'
        },
        {
          id: '2',
          date: '2024-03-14',
          description: 'Amazon Shopping',
          amount: 2499,
          category: 'Shopping',
          accountName: 'ICICI Bank',
          type: 'debit'
        },
        // Add more demo transactions as needed
      ];

      setTransactions(demoTransactions);
      setLastSync(new Date());
      onSync(demoTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'credit') return transaction.type === 'credit';
    if (filter === 'debit') return transaction.type === 'debit';
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Bank Transactions</h2>
        <button
          onClick={fetchTransactions}
          disabled={isLoading}
          className="flex items-center px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {lastSync && (
        <p className="text-sm text-gray-500 mb-4">
          Last synced: {lastSync.toLocaleString()}
        </p>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm px-2 py-1 border rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Transactions</option>
            <option value="credit">Credits Only</option>
            <option value="debit">Debits Only</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm px-2 py-1 border rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.map(transaction => (
          <div
            key={transaction.id}
            className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.accountName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹
                  {transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{transaction.category}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            No transactions found for the selected filters
          </div>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button className="flex items-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Download className="h-4 w-4 mr-1" />
            Export Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionSync;
import React from 'react';
import { X, Printer } from 'lucide-react';
import { Transaction } from '../types';

interface PrintPreviewProps {
  transactions: Transaction[];
  onClose: () => void;
  selectedMonth: string;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ transactions, onClose, selectedMonth }) => {
  const handlePrint = () => {
    window.print();
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[210mm] my-4 print:shadow-none print:rounded-none print:my-0">
        <div className="p-8 print:p-4">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Monthly Statement</h2>
            <div className="flex gap-4">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Printer className="h-5 w-5 mr-2" />
                Print
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="print:text-black max-w-[190mm] mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 print:text-black">Monthly Transaction Statement</h1>
              <p className="text-gray-600 dark:text-gray-400 print:text-gray-600">{selectedMonth}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg print:bg-white print:border">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                <p className="text-xl font-bold text-emerald-600">₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg print:bg-white print:border">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                <p className="text-xl font-bold text-rose-600">₹{totalExpenses.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg print:bg-white print:border">
                <p className="text-sm text-gray-600 dark:text-gray-400">Net Balance</p>
                <p className="text-xl font-bold text-indigo-600">₹{(totalIncome - totalExpenses).toLocaleString()}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 print:border-black">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400 print:text-black">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400 print:text-black">Category</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400 print:text-black">Description</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400 print:text-black">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 print:hover:bg-white">
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 print:text-black">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 print:text-black">
                        {transaction.category}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 print:text-black">
                        {transaction.notes || '-'}
                      </td>
                      <td className={`px-4 py-2 text-sm font-medium text-right ${
                        transaction.type === 'income' 
                          ? 'text-emerald-600 dark:text-emerald-400 print:text-emerald-800' 
                          : 'text-rose-600 dark:text-rose-400 print:text-rose-800'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹
                        {transaction.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 text-center print:text-black">
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
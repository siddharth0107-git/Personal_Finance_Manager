import React, { useState } from 'react';
import { Receipt, ArrowUpRight, ArrowDownRight, FileText, Download } from 'lucide-react';

interface GSTEntry {
  id: number;
  type: 'input' | 'output';
  amount: number;
  gstAmount: number;
  date: Date;
  description: string;
  invoiceNumber: string;
}

const GSTTracker: React.FC = () => {
  const [entries, setEntries] = useState<GSTEntry[]>([
    {
      id: 1,
      type: 'input',
      amount: 50000,
      gstAmount: 9000,
      date: new Date(),
      description: 'Office Supplies',
      invoiceNumber: 'INV-001'
    },
    {
      id: 2,
      type: 'output',
      amount: 75000,
      gstAmount: 13500,
      date: new Date(),
      description: 'Consulting Services',
      invoiceNumber: 'INV-002'
    }
  ]);

  const totalInput = entries
    .filter(e => e.type === 'input')
    .reduce((sum, e) => sum + e.gstAmount, 0);

  const totalOutput = entries
    .filter(e => e.type === 'output')
    .reduce((sum, e) => sum + e.gstAmount, 0);

  const netGST = totalOutput - totalInput;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Receipt className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">GST Tracker</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-emerald-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-600">Input GST</span>
            <ArrowDownRight className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">
            ₹{totalInput.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-rose-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-rose-600">Output GST</span>
            <ArrowUpRight className="h-5 w-5 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-700">
            ₹{totalOutput.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-indigo-600">Net GST</span>
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-700">
            ₹{netGST.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Invoice</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">GST</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-500">
                  {entry.date.toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    entry.type === 'input'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {entry.type === 'input' ? 'Input' : 'Output'}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">{entry.description}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{entry.invoiceNumber}</td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                  ₹{entry.amount.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                  ₹{entry.gstAmount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
          <Receipt className="h-4 w-4 mr-2" />
          Add Entry
        </button>
      </div>
    </div>
  );
};

export default GSTTracker;
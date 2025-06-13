import React, { useMemo, useState } from 'react';
import { Transaction } from '../types';
import { BarChart2, TrendingUp, TrendingDown, Plus, X } from 'lucide-react';

interface ComparisonProps {
  transactions: Transaction[];
  onClose: () => void;
}

interface MonthlyTarget {
  month: string;
  incomeTarget: number;
  expenseTarget: number;
}

const Comparison: React.FC<ComparisonProps> = ({ transactions, onClose }) => {
  const [monthlyTargets, setMonthlyTargets] = useState<MonthlyTarget[]>([]);
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [incomeTarget, setIncomeTarget] = useState('');
  const [expenseTarget, setExpenseTarget] = useState('');

  const monthlyData = useMemo(() => {
    const data: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!data[monthKey]) {
        data[monthKey] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        data[monthKey].income += transaction.amount;
      } else {
        data[monthKey].expense += transaction.amount;
      }
    });

    return Object.entries(data)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 6)
      .reverse();
  }, [transactions]);

  const maxValue = useMemo(() => {
    const values = [
      ...monthlyData.flatMap(([_, data]) => [data.income, data.expense]),
      ...monthlyTargets.flatMap(target => [target.incomeTarget, target.expenseTarget])
    ];
    return Math.max(...values);
  }, [monthlyData, monthlyTargets]);

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonth || !incomeTarget || !expenseTarget) return;

    setMonthlyTargets(prev => {
      const existing = prev.findIndex(t => t.month === selectedMonth);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = {
          month: selectedMonth,
          incomeTarget: Number(incomeTarget),
          expenseTarget: Number(expenseTarget)
        };
        return updated;
      }
      return [...prev, {
        month: selectedMonth,
        incomeTarget: Number(incomeTarget),
        expenseTarget: Number(expenseTarget)
      }];
    });

    setShowTargetForm(false);
    setSelectedMonth('');
    setIncomeTarget('');
    setExpenseTarget('');
  };

  const getMonthTarget = (monthKey: string) => {
    return monthlyTargets.find(t => t.month === monthKey);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full mx-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <BarChart2 className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold">Monthly Comparison</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowTargetForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Set Monthly Target
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>

      {showTargetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Set Monthly Target</h3>
              <button
                onClick={() => setShowTargetForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddTarget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Month
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income Target (₹)
                </label>
                <input
                  type="number"
                  value={incomeTarget}
                  onChange={(e) => setIncomeTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter target income"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expense Target (₹)
                </label>
                <input
                  type="number"
                  value={expenseTarget}
                  onChange={(e) => setExpenseTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter target expense"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Set Target
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="grid grid-cols-6 gap-4 h-64">
          {monthlyData.map(([month, data]) => {
            const monthDate = new Date(month + '-01');
            const monthName = monthDate.toLocaleString('default', { month: 'short' });
            const year = monthDate.getFullYear();
            const target = getMonthTarget(month);

            return (
              <div key={month} className="flex flex-col justify-end space-y-2">
                <div className="relative h-full flex flex-col justify-end space-y-1">
                  <div
                    className="w-full bg-emerald-200 rounded-t"
                    style={{
                      height: `${(data.income / maxValue) * 100}%`,
                    }}
                  />
                  {target && (
                    <div
                      className="absolute w-full border-t-2 border-emerald-600 border-dashed"
                      style={{
                        bottom: `${(target.incomeTarget / maxValue) * 100}%`,
                      }}
                    />
                  )}
                  <div
                    className="w-full bg-rose-200 rounded-t"
                    style={{
                      height: `${(data.expense / maxValue) * 100}%`,
                    }}
                  />
                  {target && (
                    <div
                      className="absolute w-full border-t-2 border-rose-600 border-dashed"
                      style={{
                        bottom: `${(target.expenseTarget / maxValue) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{monthName}</div>
                  <div className="text-xs text-gray-500">{year}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-8">
          {monthlyData.map(([month, data]) => {
            const monthDate = new Date(month + '-01');
            const monthName = monthDate.toLocaleString('default', { month: 'long' });
            const savings = data.income - data.expense;
            const target = getMonthTarget(month);

            return (
              <div
                key={month}
                className="p-4 rounded-lg border border-gray-200 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{monthName}</h3>
                  <span className="text-sm text-gray-500">{monthDate.getFullYear()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-emerald-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>Income</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₹{data.income.toLocaleString()}</span>
                      {target && (
                        <div className="text-sm text-gray-500">
                          Target: ₹{target.incomeTarget.toLocaleString()}
                          <span className={`ml-2 ${data.income >= target.incomeTarget ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ({((data.income / target.incomeTarget) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-rose-600">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      <span>Expenses</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₹{data.expense.toLocaleString()}</span>
                      {target && (
                        <div className="text-sm text-gray-500">
                          Target: ₹{target.expenseTarget.toLocaleString()}
                          <span className={`ml-2 ${data.expense <= target.expenseTarget ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ({((data.expense / target.expenseTarget) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Savings</span>
                      <span className={`font-medium ${savings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ₹{savings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Comparison;
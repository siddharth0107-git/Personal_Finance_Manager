import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart3, AlertCircle } from 'lucide-react';
import { CashFlowForecast as CashFlowType, RecurringTransaction } from '../../types/extended';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { addMonths, format } from 'date-fns';
import { motion } from 'framer-motion';

interface CashFlowForecastProps {
  recurringTransactions: RecurringTransaction[];
  currentBalance: number;
  walletBalance: number;
}

const CashFlowForecast: React.FC<CashFlowForecastProps> = ({
  recurringTransactions,
  currentBalance,
  walletBalance
}) => {
  const [forecast, setForecast] = useState<CashFlowType[]>([]);
  const [forecastPeriod, setForecastPeriod] = useState(6); // months
  const [viewType, setViewType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    generateForecast();
  }, [recurringTransactions, currentBalance, walletBalance, forecastPeriod]);

  const generateForecast = () => {
    const forecastData: CashFlowType[] = [];
    let runningBalance = currentBalance + walletBalance;

    // Calculate monthly recurring amounts
    const monthlyIncome = recurringTransactions
      .filter(t => t.type === 'income' && t.isActive && t.frequency === 'monthly')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = recurringTransactions
      .filter(t => t.type === 'expense' && t.isActive && t.frequency === 'monthly')
      .reduce((sum, t) => sum + t.amount, 0);

    // Generate forecast for each month
    for (let i = 0; i < forecastPeriod; i++) {
      const forecastDate = addMonths(new Date(), i + 1);
      const monthStr = format(forecastDate, 'MMM yyyy');

      // Calculate projected amounts (with some variability for realism)
      const variabilityFactor = 0.1; // 10% variability
      const incomeVariability = 1 + (Math.random() - 0.5) * variabilityFactor;
      const expenseVariability = 1 + (Math.random() - 0.5) * variabilityFactor;

      const projectedIncome = monthlyIncome * incomeVariability;
      const projectedExpenses = monthlyExpenses * expenseVariability;
      
      runningBalance += projectedIncome - projectedExpenses;

      // Calculate confidence based on data availability and time distance
      const baseConfidence = recurringTransactions.length > 0 ? 85 : 50;
      const timeDecay = Math.max(0.3, 1 - (i * 0.1)); // Confidence decreases over time
      const confidence = Math.round(baseConfidence * timeDecay);

      forecastData.push({
        month: monthStr,
        projectedIncome,
        projectedExpenses,
        projectedBalance: runningBalance,
        confidence
      });
    }

    setForecast(forecastData);
  };

  const getBalanceColor = (balance: number) => {
    if (balance < 0) return 'text-red-600';
    if (balance < 10000) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-600';
    if (confidence >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const chartData = forecast.map(f => ({
    month: f.month,
    income: f.projectedIncome,
    expenses: f.projectedExpenses,
    balance: f.projectedBalance,
    net: f.projectedIncome - f.projectedExpenses
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-emerald-600 mr-2" />
          <h2 className="text-xl font-semibold">Cash Flow Forecast</h2>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
          </select>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewType('line')}
              className={`px-3 py-2 text-sm ${
                viewType === 'line'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setViewType('bar')}
              className={`px-3 py-2 text-sm ${
                viewType === 'bar'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600">Current Total</span>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">
            ₹{(currentBalance + walletBalance).toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-600">Monthly Income</span>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            ₹{recurringTransactions
              .filter(t => t.type === 'income' && t.isActive && t.frequency === 'monthly')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-rose-600">Monthly Expenses</span>
            <BarChart3 className="h-5 w-5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">
            ₹{recurringTransactions
              .filter(t => t.type === 'expense' && t.isActive && t.frequency === 'monthly')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Projected Balance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'line' ? (
              <LineChart data={chartData}>
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
                  formatter={(value: number, name: string) => [
                    `₹${value.toLocaleString()}`,
                    name === 'balance' ? 'Projected Balance' :
                    name === 'income' ? 'Projected Income' :
                    name === 'expenses' ? 'Projected Expenses' : 'Net Cash Flow'
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
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
                  formatter={(value: number, name: string) => [
                    `₹${value.toLocaleString()}`,
                    name === 'income' ? 'Projected Income' :
                    name === 'expenses' ? 'Projected Expenses' : 'Net Cash Flow'
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="income" fill="#10B981" />
                <Bar dataKey="expenses" fill="#EF4444" />
                <Bar dataKey="net" fill="#6366F1" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Month</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Income</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Expenses</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Net Flow</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Balance</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {forecast.map((month, index) => {
              const netFlow = month.projectedIncome - month.projectedExpenses;
              
              return (
                <motion.tr
                  key={month.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {month.month}
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-600 text-right">
                    ₹{month.projectedIncome.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-rose-600 text-right">
                    ₹{month.projectedExpenses.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${
                    netFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {netFlow >= 0 ? '+' : ''}₹{netFlow.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${
                    getBalanceColor(month.projectedBalance)
                  }`}>
                    ₹{month.projectedBalance.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      month.confidence >= 80
                        ? 'bg-emerald-100 text-emerald-700'
                        : month.confidence >= 60
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {month.confidence}%
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
          <h4 className="font-medium text-blue-900">Forecast Insights</h4>
        </div>
        <div className="text-sm text-blue-700 space-y-1">
          {forecast.length > 0 && (
            <>
              <p>
                • Your balance is projected to {forecast[forecast.length - 1].projectedBalance > currentBalance + walletBalance ? 'grow' : 'decline'} over the next {forecastPeriod} months
              </p>
              <p>
                • Average monthly net flow: ₹{(forecast.reduce((sum, f) => sum + (f.projectedIncome - f.projectedExpenses), 0) / forecast.length).toLocaleString()}
              </p>
              {forecast.some(f => f.projectedBalance < 0) && (
                <p className="text-red-600 font-medium">
                  ⚠️ Warning: Negative balance projected in some months. Consider adjusting your spending or increasing income.
                </p>
              )}
            </>
          )}
          <p>
            • Forecast accuracy depends on consistent recurring transactions and spending patterns
          </p>
        </div>
      </div>
    </div>
  );
};

export default CashFlowForecast;
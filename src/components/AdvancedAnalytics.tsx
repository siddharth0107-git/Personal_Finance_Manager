import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart as ChartBar, PieChart as PieChartIcon, TrendingUp, Calendar } from 'lucide-react';

interface AdvancedAnalyticsProps {
  transactions: any[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ transactions }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const processData = () => {
    const now = new Date();
    let filteredTransactions = transactions;

    // Filter based on timeframe
    if (timeframe === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredTransactions = transactions.filter(t => new Date(t.date) >= weekAgo);
    } else if (timeframe === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filteredTransactions = transactions.filter(t => new Date(t.date) >= monthAgo);
    } else {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filteredTransactions = transactions.filter(t => new Date(t.date) >= yearAgo);
    }

    // Process data based on chart type
    if (chartType === 'pie') {
      return filteredTransactions
        .reduce((acc: any, t: any) => {
          if (t.type === 'expense') {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
          }
          return acc;
        }, {});
    }

    // For line and bar charts
    return filteredTransactions.reduce((acc: any[], t: any) => {
      const date = new Date(t.date).toLocaleDateString();
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        if (t.type === 'expense') {
          existing.expenses += t.amount;
        } else {
          existing.income += t.amount;
        }
      } else {
        acc.push({
          date,
          expenses: t.type === 'expense' ? t.amount : 0,
          income: t.type === 'income' ? t.amount : 0
        });
      }
      
      return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const renderChart = () => {
    const data = processData();

    if (chartType === 'pie') {
      const pieData = Object.entries(data).map(([name, value]) => ({ name, value }));
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#4CAF50" />
            <Line type="monotone" dataKey="expenses" stroke="#f44336" />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="income" fill="#4CAF50" />
            <Bar dataKey="expenses" fill="#f44336" />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <ChartBar className="h-6 w-6 text-indigo-600 mr-2" />
          Advanced Analytics
        </h2>
        
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="border rounded-lg px-3 py-1"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg ${
                chartType === 'line' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'
              }`}
            >
              <TrendingUp className="h-5 w-5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg ${
                chartType === 'bar' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'
              }`}
            >
              <ChartBar className="h-5 w-5" />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`p-2 rounded-lg ${
                chartType === 'pie' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'
              }`}
            >
              <PieChartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {renderChart()}
    </div>
  );
};

export default AdvancedAnalytics;
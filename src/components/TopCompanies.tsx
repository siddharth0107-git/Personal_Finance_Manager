import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface Company {
  name: string;
  shareValue: number;
  previousValue: number;
  marketCap: string;
  change24h: number;
}

interface TopCompaniesProps {
  onClose: () => void;
}

const TopCompanies: React.FC<TopCompaniesProps> = ({ onClose }) => {
  const [companies, setCompanies] = useState<Company[]>([
    { name: 'Reliance', shareValue: 2450.75, previousValue: 2445.30, marketCap: '15.8L Cr', change24h: 0.8 },
    { name: 'TCS', shareValue: 3890.25, previousValue: 3880.15, marketCap: '14.2L Cr', change24h: 1.2 },
    { name: 'HDFC Bank', shareValue: 1680.50, previousValue: 1675.80, marketCap: '12.5L Cr', change24h: -0.5 },
    { name: 'Infosys', shareValue: 1520.30, previousValue: 1515.45, marketCap: '6.3L Cr', change24h: 0.9 },
    { name: 'HUL', shareValue: 2310.80, previousValue: 2305.60, marketCap: '5.4L Cr', change24h: -0.3 },
    { name: 'ICICI Bank', shareValue: 945.60, previousValue: 942.30, marketCap: '6.6L Cr', change24h: 1.5 },
    { name: 'Bharti Airtel', shareValue: 875.40, previousValue: 872.15, marketCap: '4.9L Cr', change24h: 0.7 },
    { name: 'SBI', shareValue: 625.90, previousValue: 622.45, marketCap: '5.6L Cr', change24h: 1.1 },
    { name: 'Bajaj Finance', shareValue: 6890.25, previousValue: 6880.50, marketCap: '4.2L Cr', change24h: -0.8 },
    { name: 'Asian Paints', shareValue: 3240.15, previousValue: 3235.80, marketCap: '3.1L Cr', change24h: 0.4 }
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCompanies((prevCompanies) => {
        return prevCompanies.map((company) => {
          const change = (Math.random() * 4 - 2) / 100; // -2% to +2%
          const newValue = company.shareValue * (1 + change);
          return {
            ...company,
            previousValue: company.shareValue,
            shareValue: Number(newValue.toFixed(2)),
            change24h: Number((company.change24h + (Math.random() - 0.5)).toFixed(2))
          };
        });
      });
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-7xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl mr-4">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Indian Stock Market</h2>
              <p className="text-gray-500 mt-1">Live stock prices of top Indian companies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="h-[400px] w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={companies}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Share Value']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="shareValue" 
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {companies.map((company, index) => {
            const isPositive = company.shareValue > company.previousValue;
            const changePercent = ((company.shareValue - company.previousValue) / company.previousValue * 100).toFixed(2);
            
            return (
              <div 
                key={index} 
                className="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                    company.change24h >= 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {company.change24h >= 0 ? '+' : ''}{company.change24h}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{company.shareValue.toLocaleString()}
                    </span>
                    <div className={`flex items-center ${
                      isPositive ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-sm font-medium">
                        {isPositive ? '+' : ''}{changePercent}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Market Cap: {company.marketCap}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Data updates every 2 seconds • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default TopCompanies;
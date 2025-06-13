import React from 'react';
import { Shield, Key, Lock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const SecurityDashboard: React.FC = () => {
  const securityChecks = [
    { name: 'Two-Factor Authentication', status: true, icon: Key },
    { name: 'Bank Account Encryption', status: true, icon: Lock },
    { name: 'Suspicious Activity Monitoring', status: true, icon: AlertTriangle },
    { name: 'Password Strength', status: false, icon: Shield },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">Security Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securityChecks.map((check, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg flex items-start space-x-4"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <check.icon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">{check.name}</h3>
                {check.status ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-500" />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {check.status ? 'Enabled and secure' : 'Action required'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h3 className="font-medium text-indigo-900 mb-2">Security Tips</h3>
        <ul className="space-y-2 text-sm text-indigo-700">
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Use a strong, unique password
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Enable two-factor authentication
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Regularly monitor your transactions
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Keep your contact information updated
          </li>
        </ul>
      </div>

      <button className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
        <Shield className="h-5 w-5 mr-2" />
        Review Security Settings
      </button>
    </div>
  );
};

export default SecurityDashboard;
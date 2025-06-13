import React, { useState } from 'react';
import { Wallet, Mail, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center relative">
      <div className="absolute inset-0 overflow-hidden">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className={`absolute rounded-full bg-blue-500/10 animate-float-${index + 1}`}
            style={{
              width: `${(index + 2) * 200}px`,
              height: `${(index + 2) * 200}px`,
              left: `${index * 25}%`,
              top: `${index * 20}%`,
              animationDelay: `${index * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-8 shadow-2xl shadow-blue-500/20 animate-bounce-in">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-4">
              <Wallet className="w-12 h-12 text-blue-500 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Personal Finance</h1>
            <p className="text-slate-400">Track your money effortlessly</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-900/70"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-900/70"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transform hover:scale-105 transition-all duration-200"
            >
              Login
            </button>
          </form>

          <div className="mt-6 flex justify-between text-sm">
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot Password?
            </a>
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
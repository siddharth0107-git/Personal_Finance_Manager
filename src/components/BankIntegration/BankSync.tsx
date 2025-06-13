import React, { useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Ban as Bank, Shield, RefreshCw, Link, AlertCircle } from 'lucide-react';

interface BankSyncProps {
  onSuccess: (publicToken: string, metadata: any) => void;
  onExit: () => void;
}

const BankSync: React.FC<BankSyncProps> = ({ onSuccess, onExit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = {
    token: 'your-link-token', // This should come from your backend
    onSuccess: (public_token: string, metadata: any) => {
      setIsLoading(true);
      try {
        onSuccess(public_token, metadata);
      } catch (err) {
        setError('Failed to link bank account. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onExit: () => {
      onExit();
    },
    onEvent: (eventName: string) => {
      console.log(eventName);
    },
  };

  const { open, ready } = usePlaidLink(config);

  const handleClick = useCallback(() => {
    if (ready) {
      open();
    }
  }, [ready, open]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Bank className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">Bank Account Integration</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="font-medium text-indigo-900">Secure Connection</h3>
          </div>
          <p className="text-sm text-indigo-700">
            Your banking information is encrypted and secure. We use Plaid to ensure
            safe and reliable connections to your financial institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-2">Auto-Import Transactions</h4>
            <p className="text-sm text-gray-600">
              Automatically sync and categorize your bank transactions
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-2">Real-time Updates</h4>
            <p className="text-sm text-gray-600">
              Get instant notifications for new transactions
            </p>
          </div>
        </div>

        <button
          onClick={handleClick}
          disabled={!ready || isLoading}
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
        >
          {isLoading ? (
            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Link className="h-5 w-5 mr-2" />
          )}
          {isLoading ? 'Connecting...' : 'Connect Bank Account'}
        </button>

        <p className="text-xs text-center text-gray-500">
          By connecting your account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default BankSync;
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, Smartphone, Copy, Check, RefreshCw } from 'lucide-react';

interface UPIPaymentProps {
  upiId: string;
  amount: number;
  onSuccess: () => void;
}

const UPIPayment: React.FC<UPIPaymentProps> = ({ upiId, amount, onSuccess }) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const upiLink = `upi://pay?pa=${upiId}&pn=Personal%20Finance%20Manager&am=${amount}&cu=INR`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <QrCode className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">UPI Payment</h2>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <QRCode value={upiLink} size={200} />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Scan with any UPI app to pay
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">₹{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">UPI ID:</span>
            <div className="flex items-center">
              <span className="font-mono mr-2">{upiId}</span>
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
          >
            {isProcessing ? (
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Smartphone className="h-5 w-5 mr-2" />
            )}
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>

          <button
            onClick={() => window.location.href = upiLink}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Open in UPI App
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Secured by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default UPIPayment;
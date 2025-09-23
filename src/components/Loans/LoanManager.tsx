import React, { useState } from 'react';
import { CreditCard, Plus, Calendar, TrendingDown, TrendingUp, Edit, Trash2, DollarSign } from 'lucide-react';
import { Loan, LoanPayment } from '../../types/extended';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';

interface LoanManagerProps {
  loans: Loan[];
  onAddLoan: (loan: Omit<Loan, 'id' | 'payments'>) => void;
  onUpdateLoan: (id: string, updates: Partial<Loan>) => void;
  onDeleteLoan: (id: string) => void;
  onAddPayment: (loanId: string, payment: Omit<LoanPayment, 'id'>) => void;
}

const LoanManager: React.FC<LoanManagerProps> = ({
  loans,
  onAddLoan,
  onUpdateLoan,
  onDeleteLoan,
  onAddPayment
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [formData, setFormData] = useState({
    type: 'taken' as 'given' | 'taken',
    amount: '',
    interestRate: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: '',
    borrowerLender: '',
    description: ''
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    type: 'both' as 'principal' | 'interest' | 'both'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.borrowerLender || !formData.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const loanData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      remainingAmount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate) || 0,
      startDate: new Date(formData.startDate),
      dueDate: new Date(formData.dueDate),
      borrowerLender: formData.borrowerLender,
      description: formData.description
    };

    if (editingLoan) {
      onUpdateLoan(editingLoan.id, loanData);
      toast.success('Loan updated successfully!');
      setEditingLoan(null);
    } else {
      onAddLoan(loanData);
      toast.success('Loan added successfully!');
    }

    setFormData({
      type: 'taken',
      amount: '',
      interestRate: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: '',
      borrowerLender: '',
      description: ''
    });
    setShowAddForm(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent, loanId: string) => {
    e.preventDefault();
    
    if (!paymentData.amount) {
      toast.error('Please enter payment amount');
      return;
    }

    const payment = {
      loanId,
      amount: parseFloat(paymentData.amount),
      date: new Date(),
      type: paymentData.type
    };

    onAddPayment(loanId, payment);
    
    // Update remaining amount
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      const newRemainingAmount = Math.max(0, loan.remainingAmount - payment.amount);
      onUpdateLoan(loanId, { remainingAmount: newRemainingAmount });
    }

    toast.success('Payment recorded successfully!');
    setPaymentData({ amount: '', type: 'both' });
    setShowPaymentForm(null);
  };

  const getDaysUntilDue = (dueDate: Date): number => {
    return differenceInDays(dueDate, new Date());
  };

  const getStatusColor = (loan: Loan) => {
    const daysUntilDue = getDaysUntilDue(loan.dueDate);
    if (loan.remainingAmount === 0) return 'text-emerald-600';
    if (daysUntilDue < 0) return 'text-red-600';
    if (daysUntilDue < 30) return 'text-amber-600';
    return 'text-blue-600';
  };

  const getStatusText = (loan: Loan) => {
    const daysUntilDue = getDaysUntilDue(loan.dueDate);
    if (loan.remainingAmount === 0) return 'Paid Off';
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue < 30) return `Due in ${daysUntilDue} days`;
    return 'Active';
  };

  const totalGiven = loans.filter(l => l.type === 'given').reduce((sum, l) => sum + l.remainingAmount, 0);
  const totalTaken = loans.filter(l => l.type === 'taken').reduce((sum, l) => sum + l.remainingAmount, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <CreditCard className="h-6 w-6 text-orange-600 mr-2" />
          <h2 className="text-xl font-semibold">Loan & Debt Manager</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Loan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-600">Money Lent</span>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            ₹{totalGiven.toLocaleString()}
          </div>
          <div className="text-sm text-emerald-600">
            {loans.filter(l => l.type === 'given' && l.remainingAmount > 0).length} active loans
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-rose-600">Money Borrowed</span>
            <TrendingDown className="h-5 w-5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">
            ₹{totalTaken.toLocaleString()}
          </div>
          <div className="text-sm text-rose-600">
            {loans.filter(l => l.type === 'taken' && l.remainingAmount > 0).length} active debts
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600">Net Position</span>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div className={`text-2xl font-bold ${
            totalGiven - totalTaken >= 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            ₹{Math.abs(totalGiven - totalTaken).toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">
            {totalGiven - totalTaken >= 0 ? 'Net Lender' : 'Net Borrower'}
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-4">
        <AnimatePresence>
          {loans.map((loan) => {
            const daysUntilDue = getDaysUntilDue(loan.dueDate);
            const progressPercentage = ((loan.amount - loan.remainingAmount) / loan.amount) * 100;
            
            return (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  loan.type === 'given'
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-rose-200 bg-rose-50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        loan.type === 'given'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {loan.type === 'given' ? 'Lent to' : 'Borrowed from'}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {loan.borrowerLender}
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(loan)}`}>
                        {getStatusText(loan)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-2">{loan.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Original Amount:</span>
                        <div className="font-semibold">₹{loan.amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Remaining:</span>
                        <div className="font-semibold">₹{loan.remainingAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Interest Rate:</span>
                        <div className="font-semibold">{loan.interestRate}% p.a.</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Due Date:</span>
                        <div className="font-semibold">{format(loan.dueDate, 'MMM dd, yyyy')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {loan.remainingAmount > 0 && (
                      <button
                        onClick={() => setShowPaymentForm(loan.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        Add Payment
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingLoan(loan);
                        setFormData({
                          type: loan.type,
                          amount: loan.amount.toString(),
                          interestRate: loan.interestRate.toString(),
                          startDate: format(loan.startDate, 'yyyy-MM-dd'),
                          dueDate: format(loan.dueDate, 'yyyy-MM-dd'),
                          borrowerLender: loan.borrowerLender,
                          description: loan.description
                        });
                        setShowAddForm(true);
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this loan?')) {
                          onDeleteLoan(loan.id);
                          toast.success('Loan deleted successfully!');
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Repayment Progress</span>
                    <span>{progressPercentage.toFixed(1)}% paid</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        loan.type === 'given' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Payment History */}
                {loan.payments && loan.payments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Payments</h4>
                    <div className="space-y-2">
                      {loan.payments.slice(-3).map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center text-sm">
                          <span>{format(payment.date, 'MMM dd, yyyy')}</span>
                          <span className="font-medium">₹{payment.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Form */}
                {showPaymentForm === loan.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <form onSubmit={(e) => handlePaymentSubmit(e, loan.id)} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={paymentData.amount}
                            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter amount"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Type
                          </label>
                          <select
                            value={paymentData.type}
                            onChange={(e) => setPaymentData({ ...paymentData, type: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="both">Principal + Interest</option>
                            <option value="principal">Principal Only</option>
                            <option value="interest">Interest Only</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Record Payment
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPaymentForm(null);
                            setPaymentData({ amount: '', type: 'both' });
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {loans.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No loans or debts recorded yet</p>
          <p className="text-sm">Add loans to track your lending and borrowing</p>
        </div>
      )}

      {/* Add/Edit Loan Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingLoan ? 'Edit Loan' : 'Add New Loan'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Type
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'given' })}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      formData.type === 'given'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Money Lent
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'taken' })}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      formData.type === 'taken'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Money Borrowed
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'given' ? 'Borrower Name' : 'Lender Name'} *
                </label>
                <input
                  type="text"
                  value={formData.borrowerLender}
                  onChange={(e) => setFormData({ ...formData, borrowerLender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (% per annum)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="12.0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Purpose of loan, terms, etc."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingLoan(null);
                    setFormData({
                      type: 'taken',
                      amount: '',
                      interestRate: '',
                      startDate: format(new Date(), 'yyyy-MM-dd'),
                      dueDate: '',
                      borrowerLender: '',
                      description: ''
                    });
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  {editingLoan ? 'Update Loan' : 'Add Loan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoanManager;
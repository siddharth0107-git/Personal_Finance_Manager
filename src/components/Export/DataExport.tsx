import React, { useState } from 'react';
import { Download, FileText, Table, Calendar, Filter } from 'lucide-react';
import { Transaction } from '../../types';
import { Budget, Goal, Loan } from '../../types/extended';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import toast from 'react-hot-toast';

interface DataExportProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  loans: Loan[];
}

const DataExport: React.FC<DataExportProps> = ({
  transactions,
  budgets,
  goals,
  loans
}) => {
  const [exportType, setExportType] = useState<'transactions' | 'budgets' | 'goals' | 'loans' | 'all'>('transactions');
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year' | 'all'>('month');
  const [isExporting, setIsExporting] = useState(false);

  const getFilteredTransactions = () => {
    if (dateRange === 'all') return transactions;

    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case 'month':
        startDate = startOfMonth(now);
        break;
      case 'quarter':
        startDate = startOfMonth(subMonths(now, 3));
        break;
      case 'year':
        startDate = startOfMonth(subMonths(now, 12));
        break;
      default:
        return transactions;
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const exportToCSV = (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = (data: any[], headers: string[], title: string, filename: string) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Add generation date
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 35);
    
    // Add table
    (doc as any).autoTable({
      startY: 45,
      head: [headers],
      body: data,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 8 }
    });
    
    doc.save(`${filename}.pdf`);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const timestamp = format(new Date(), 'yyyy-MM-dd');
      
      switch (exportType) {
        case 'transactions':
          const filteredTransactions = getFilteredTransactions();
          const transactionData = filteredTransactions.map(t => ({
            Date: format(new Date(t.date), 'yyyy-MM-dd'),
            Type: t.type,
            Category: t.category,
            Amount: t.amount,
            Notes: t.notes || ''
          }));
          
          if (format === 'csv') {
            exportToCSV(transactionData, `transactions-${timestamp}`);
          } else {
            exportToPDF(
              transactionData.map(t => [t.Date, t.Type, t.Category, `₹${t.Amount.toLocaleString()}`, t.Notes]),
              ['Date', 'Type', 'Category', 'Amount', 'Notes'],
              'Transaction History',
              `transactions-${timestamp}`
            );
          }
          break;

        case 'budgets':
          const budgetData = budgets.map(b => ({
            Month: b.month,
            Category: b.category,
            'Budget Limit': b.monthlyLimit,
            Spent: b.spent,
            'Alert Threshold': `${b.alertThreshold}%`,
            Status: b.isExceeded ? 'Exceeded' : 'Within Limit'
          }));
          
          if (format === 'csv') {
            exportToCSV(budgetData, `budgets-${timestamp}`);
          } else {
            exportToPDF(
              budgetData.map(b => [b.Month, b.Category, `₹${b['Budget Limit'].toLocaleString()}`, `₹${b.Spent.toLocaleString()}`, b['Alert Threshold'], b.Status]),
              ['Month', 'Category', 'Budget Limit', 'Spent', 'Alert Threshold', 'Status'],
              'Budget Report',
              `budgets-${timestamp}`
            );
          }
          break;

        case 'goals':
          const goalData = goals.map(g => ({
            Title: g.title,
            Category: g.category,
            'Target Amount': g.targetAmount,
            'Current Amount': g.currentAmount,
            'Target Date': format(new Date(g.targetDate), 'yyyy-MM-dd'),
            Progress: `${((g.currentAmount / g.targetAmount) * 100).toFixed(1)}%`,
            Status: g.isCompleted ? 'Completed' : 'In Progress'
          }));
          
          if (format === 'csv') {
            exportToCSV(goalData, `goals-${timestamp}`);
          } else {
            exportToPDF(
              goalData.map(g => [g.Title, g.Category, `₹${g['Target Amount'].toLocaleString()}`, `₹${g['Current Amount'].toLocaleString()}`, g['Target Date'], g.Progress, g.Status]),
              ['Title', 'Category', 'Target Amount', 'Current Amount', 'Target Date', 'Progress', 'Status'],
              'Goals Report',
              `goals-${timestamp}`
            );
          }
          break;

        case 'loans':
          const loanData = loans.map(l => ({
            Type: l.type,
            'Borrower/Lender': l.borrowerLender,
            'Original Amount': l.amount,
            'Remaining Amount': l.remainingAmount,
            'Interest Rate': `${l.interestRate}%`,
            'Start Date': format(new Date(l.startDate), 'yyyy-MM-dd'),
            'Due Date': format(new Date(l.dueDate), 'yyyy-MM-dd'),
            Description: l.description
          }));
          
          if (format === 'csv') {
            exportToCSV(loanData, `loans-${timestamp}`);
          } else {
            exportToPDF(
              loanData.map(l => [l.Type, l['Borrower/Lender'], `₹${l['Original Amount'].toLocaleString()}`, `₹${l['Remaining Amount'].toLocaleString()}`, l['Interest Rate'], l['Start Date'], l['Due Date'], l.Description]),
              ['Type', 'Borrower/Lender', 'Original Amount', 'Remaining Amount', 'Interest Rate', 'Start Date', 'Due Date', 'Description'],
              'Loans Report',
              `loans-${timestamp}`
            );
          }
          break;

        case 'all':
          // Create a comprehensive report
          if (format === 'pdf') {
            const doc = new jsPDF();
            
            // Title page
            doc.setFontSize(24);
            doc.text('Personal Finance Report', 20, 30);
            doc.setFontSize(14);
            doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 45);
            
            let yPosition = 70;
            
            // Summary
            doc.setFontSize(16);
            doc.text('Financial Summary', 20, yPosition);
            yPosition += 15;
            
            const totalIncome = getFilteredTransactions().filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const totalExpenses = getFilteredTransactions().filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const totalGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);
            
            doc.setFontSize(12);
            doc.text(`Total Income: ₹${totalIncome.toLocaleString()}`, 20, yPosition);
            doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`, 20, yPosition + 10);
            doc.text(`Net Income: ₹${(totalIncome - totalExpenses).toLocaleString()}`, 20, yPosition + 20);
            doc.text(`Goals Saved: ₹${totalGoals.toLocaleString()}`, 20, yPosition + 30);
            doc.text(`Active Goals: ${goals.filter(g => !g.isCompleted).length}`, 20, yPosition + 40);
            doc.text(`Active Budgets: ${budgets.length}`, 20, yPosition + 50);
            
            doc.save(`financial-report-${timestamp}.pdf`);
          } else {
            // Export all data as separate CSV files in a zip would require additional library
            // For now, export transactions as the main data
            const filteredTransactions = getFilteredTransactions();
            const allData = filteredTransactions.map(t => ({
              Date: format(new Date(t.date), 'yyyy-MM-dd'),
              Type: t.type,
              Category: t.category,
              Amount: t.amount,
              Notes: t.notes || ''
            }));
            exportToCSV(allData, `financial-data-${timestamp}`);
          }
          break;
      }
      
      toast.success(`Data exported successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getDataCount = () => {
    switch (exportType) {
      case 'transactions':
        return getFilteredTransactions().length;
      case 'budgets':
        return budgets.length;
      case 'goals':
        return goals.length;
      case 'loans':
        return loans.length;
      case 'all':
        return getFilteredTransactions().length + budgets.length + goals.length + loans.length;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Download className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold">Export Data</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Export Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Type
          </label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="transactions">Transactions</option>
            <option value="budgets">Budgets</option>
            <option value="goals">Goals</option>
            <option value="loans">Loans</option>
            <option value="all">All Data</option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setFormat('csv')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                format === 'csv'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Table className="h-4 w-4 mx-auto mb-1" />
              CSV
            </button>
            <button
              onClick={() => setFormat('pdf')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                format === 'pdf'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText className="h-4 w-4 mx-auto mb-1" />
              PDF
            </button>
          </div>
        </div>

        {/* Date Range (only for transactions) */}
        {exportType === 'transactions' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="month">This Month</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
        )}

        {/* Export Button */}
        <div className="flex items-end">
          <button
            onClick={handleExport}
            disabled={isExporting || getDataCount() === 0}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export ({getDataCount()} items)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Export Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Data Type:</span>
            <span className="ml-2 font-medium capitalize">{exportType}</span>
          </div>
          <div>
            <span className="text-gray-600">Format:</span>
            <span className="ml-2 font-medium uppercase">{format}</span>
          </div>
          {exportType === 'transactions' && (
            <div>
              <span className="text-gray-600">Date Range:</span>
              <span className="ml-2 font-medium capitalize">{dateRange}</span>
            </div>
          )}
          <div>
            <span className="text-gray-600">Records:</span>
            <span className="ml-2 font-medium">{getDataCount()} items</span>
          </div>
        </div>
        
        {getDataCount() === 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center text-amber-700">
              <Filter className="h-4 w-4 mr-2" />
              <span className="text-sm">No data available for the selected criteria</span>
            </div>
          </div>
        )}
      </div>

      {/* Export Options Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Export Information</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</p>
          <p>• PDF files are formatted for printing and professional presentation</p>
          <p>• All exported data includes timestamps and is ready for analysis</p>
          <p>• Large datasets may take a few moments to process</p>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
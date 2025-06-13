import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface FinancialReportsProps {
  transactions: any[];
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({
  transactions,
  balance,
  monthlyIncome,
  monthlyExpenses
}) => {
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'category'>('summary');
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');

  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const generateSummaryReport = () => {
    const doc = new jsPDF();
    const filteredTransactions = getFilteredTransactions();

    // Header
    doc.setFontSize(20);
    doc.text('Financial Summary Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Overview
    doc.setFontSize(16);
    doc.text('Account Overview', 20, 50);
    doc.setFontSize(12);
    doc.text(`Current Balance: ₹${balance.toLocaleString()}`, 20, 60);
    doc.text(`Monthly Income: ₹${monthlyIncome.toLocaleString()}`, 20, 70);
    doc.text(`Monthly Expenses: ₹${monthlyExpenses.toLocaleString()}`, 20, 80);

    // Transaction Summary
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    doc.setFontSize(16);
    doc.text('Transaction Summary', 20, 100);
    doc.setFontSize(12);
    doc.text(`Total Income: ₹${totalIncome.toLocaleString()}`, 20, 110);
    doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`, 20, 120);
    doc.text(`Net Change: ₹${(totalIncome - totalExpenses).toLocaleString()}`, 20, 130);

    doc.save('financial-summary.pdf');
  };

  const generateDetailedReport = () => {
    const doc = new jsPDF();
    const filteredTransactions = getFilteredTransactions();

    // Header
    doc.setFontSize(20);
    doc.text('Detailed Financial Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Transaction Table
    const tableData = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      `₹${t.amount.toLocaleString()}`,
      t.notes
    ]);

    (doc as any).autoTable({
      startY: 40,
      head: [['Date', 'Type', 'Category', 'Amount', 'Notes']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] }
    });

    doc.save('detailed-report.pdf');
  };

  const generateCategoryReport = () => {
    const doc = new jsPDF();
    const filteredTransactions = getFilteredTransactions();

    // Header
    doc.setFontSize(20);
    doc.text('Category Analysis Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Category Summary
    const categories = filteredTransactions.reduce((acc: any, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { count: 0, total: 0 };
      }
      acc[t.category].count++;
      acc[t.category].total += t.amount;
      return acc;
    }, {});

    const tableData = Object.entries(categories).map(([category, data]: [string, any]) => [
      category,
      data.count,
      `₹${data.total.toLocaleString()}`,
      `${((data.total / monthlyExpenses) * 100).toFixed(1)}%`
    ]);

    (doc as any).autoTable({
      startY: 40,
      head: [['Category', 'Transactions', 'Total Amount', '% of Expenses']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] }
    });

    doc.save('category-report.pdf');
  };

  const generateReport = () => {
    switch (reportType) {
      case 'summary':
        generateSummaryReport();
        break;
      case 'detailed':
        generateDetailedReport();
        break;
      case 'category':
        generateCategoryReport();
        break;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold">Financial Reports</h2>
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="border rounded-lg px-3 py-1"
            >
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="border rounded-lg px-3 py-1"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="category">Category Analysis</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <h3 className="font-medium text-indigo-900 mb-2">Summary Report</h3>
          <p className="text-sm text-indigo-600 mb-4">
            Overview of your financial status with key metrics and trends
          </p>
          <button
            onClick={() => {
              setReportType('summary');
              generateReport();
            }}
            className="flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Download Summary
          </button>
        </div>

        <div className="p-4 bg-emerald-50 rounded-lg">
          <h3 className="font-medium text-emerald-900 mb-2">Detailed Report</h3>
          <p className="text-sm text-emerald-600 mb-4">
            Comprehensive transaction history with detailed breakdowns
          </p>
          <button
            onClick={() => {
              setReportType('detailed');
              generateReport();
            }}
            className="flex items-center text-emerald-600 hover:text-emerald-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Download Details
          </button>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-medium text-purple-900 mb-2">Category Analysis</h3>
          <p className="text-sm text-purple-600 mb-4">
            Spending patterns and category-wise breakdown
          </p>
          <button
            onClick={() => {
              setReportType('category');
              generateReport();
            }}
            className="flex items-center text-purple-600 hover:text-purple-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Download Analysis
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Report Features</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Customizable date ranges for flexible reporting</li>
          <li>• Detailed transaction breakdowns and summaries</li>
          <li>• Category-wise analysis and trends</li>
          <li>• PDF format for easy sharing and printing</li>
          <li>• Visual charts and graphs included</li>
        </ul>
      </div>
    </div>
  );
};

export default FinancialReports;
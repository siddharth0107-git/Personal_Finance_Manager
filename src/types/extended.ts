export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;
}

export interface RecurringTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  nextDueDate: Date;
  lastProcessed?: Date;
}

export interface Budget {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
  month: string; // YYYY-MM format
  alertThreshold: number; // percentage (e.g., 80 for 80%)
  isExceeded: boolean;
}

export interface Loan {
  id: string;
  type: 'given' | 'taken';
  amount: number;
  remainingAmount: number;
  interestRate: number;
  startDate: Date;
  dueDate: Date;
  borrowerLender: string;
  description: string;
  payments: LoanPayment[];
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  date: Date;
  type: 'principal' | 'interest' | 'both';
}

export interface CustomCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isDefault: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  points: number;
}

export interface Notification {
  id: string;
  type: 'budget_alert' | 'goal_reminder' | 'bill_due' | 'achievement' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface DashboardLayout {
  id: string;
  userId: string;
  layout: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  type: 'balance' | 'expenses' | 'income' | 'goals' | 'budgets' | 'loans' | 'charts';
  position: { x: number; y: number };
  size: { width: number; height: number };
  isVisible: boolean;
}

export interface CashFlowForecast {
  month: string;
  projectedIncome: number;
  projectedExpenses: number;
  projectedBalance: number;
  confidence: number; // 0-100
}
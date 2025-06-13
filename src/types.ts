import { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date;
  notes: string;
}

export interface NavItem {
  icon: LucideIcon;
  label: string;
}

export interface FDTransaction {
  id: number;
  type: 'create' | 'break';
  amount: number;
  tenure: 3 | 6 | 12;
  startDate: Date;
  linkedToId?: number;
}
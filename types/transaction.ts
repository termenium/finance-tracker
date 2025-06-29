export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  createdAt: number;
}

export interface TransactionFormData {
  title: string;
  amount: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Other Income'
];

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other Expenses'
];
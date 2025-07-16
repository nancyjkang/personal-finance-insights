// User types for authentication
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  googleId: string;
}

// Transaction types based on Google Sheets structure
export interface Transaction {
  id: string;
  date: string;
  payerPayee: string;
  amount: number;
  account: string;
  category?: string;
  description?: string;
  tags?: string[];
}

// Account Settings types
export interface AccountSettings {
  accountName: string;
  initialBalance: number;
}

// Google Sheets API types
export interface GoogleSheetsData {
  transactions: Transaction[];
  accountSettings: AccountSettings[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Monthly Report types
export interface MonthlyReport {
  month: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  transactionCount: number;
}

// Transaction Category types
export interface TransactionCategory {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'transfer';
  color?: string;
  isDefault?: boolean;
}

// Filter and Search types
export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  account?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

// UI State types
export interface UIState {
  isLoading: boolean;
  error: string | null;
  selectedTransaction: Transaction | null;
}
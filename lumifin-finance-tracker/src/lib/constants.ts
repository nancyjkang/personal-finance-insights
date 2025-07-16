// Google Sheets configuration
export const GOOGLE_SHEETS_CONFIG = {
  SCOPES: [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
  TRANSACTIONS_RANGE: 'Transactions!A:G',
  ACCOUNT_SETTINGS_RANGE: 'Account Settings!A:B',
} as const;

// Default transaction categories
export const DEFAULT_CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Investment Returns',
    'Business Income',
    'Other Income',
  ],
  EXPENSE: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other Expenses',
  ],
  TRANSFER: ['Account Transfer', 'Savings Transfer', 'Investment Transfer'],
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd',
} as const;

// Currency configuration
export const CURRENCY_CONFIG = {
  SYMBOL: '$',
  LOCALE: 'en-US',
  CURRENCY_CODE: 'USD',
} as const;

// App configuration
export const APP_CONFIG = {
  NAME: 'Lumifin Finance Tracker',
  DESCRIPTION: 'Personal finance management with Google Sheets integration',
  VERSION: '1.0.0',
} as const;
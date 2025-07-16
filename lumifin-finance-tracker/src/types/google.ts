// Google Sheets API specific types
export interface GoogleSheetsConfig {
  spreadsheetId: string;
  transactionsRange: string;
  accountSettingsRange: string;
}

export interface GoogleSheetsRow {
  values: (string | number)[];
}

export interface GoogleSheetsResponse {
  values?: (string | number)[][];
  range: string;
  majorDimension: string;
}

export interface GoogleAuthCredentials {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

// Raw data from Google Sheets (before processing)
export interface RawTransactionData {
  Date: string;
  'Payer/Payee': string;
  Amount: string | number;
  Account: string;
  Category?: string;
  Description?: string;
  Tags?: string;
}

export interface RawAccountSettingsData {
  'Account Name': string;
  'Initial Balance ($)': string | number;
}
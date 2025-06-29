import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate } from './calculations';

export interface ExportOptions {
  includeHeaders: boolean;
  dateFormat: 'iso' | 'readable';
  currencyFormat: 'raw' | 'formatted';
  filterType?: 'all' | 'income' | 'expense';
  dateRange?: {
    start: string;
    end: string;
  };
}

export const exportToCSV = (
  transactions: Transaction[],
  options: ExportOptions = {
    includeHeaders: true,
    dateFormat: 'readable',
    currencyFormat: 'formatted'
  }
): void => {
  // Filter transactions based on options
  let filteredTransactions = [...transactions];

  // Filter by type
  if (options.filterType && options.filterType !== 'all') {
    filteredTransactions = filteredTransactions.filter(t => t.type === options.filterType);
  }

  // Filter by date range
  if (options.dateRange) {
    const startDate = new Date(options.dateRange.start);
    const endDate = new Date(options.dateRange.end);
    filteredTransactions = filteredTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  // Sort by date (newest first)
  filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Prepare CSV content
  const csvContent = generateCSVContent(filteredTransactions, options);

  // Generate filename
  const filename = generateFilename(options);

  // Download the file
  downloadCSV(csvContent, filename);
};

const generateCSVContent = (transactions: Transaction[], options: ExportOptions): string => {
  const rows: string[] = [];

  // Add headers if requested
  if (options.includeHeaders) {
    rows.push('Date,Title,Category,Type,Amount,Notes');
  }

  // Add transaction rows
  transactions.forEach(transaction => {
    const date = options.dateFormat === 'iso' 
      ? transaction.date 
      : formatDate(transaction.date);
    
    const amount = options.currencyFormat === 'formatted'
      ? formatCurrency(transaction.amount).replace('$', '')
      : transaction.amount.toString();

    // Escape commas and quotes in text fields
    const title = escapeCSVField(transaction.title);
    const category = escapeCSVField(transaction.category);
    const type = transaction.type;
    const notes = ''; // Placeholder for future notes field

    rows.push(`${date},${title},${category},${type},${amount},${notes}`);
  });

  return rows.join('\n');
};

const escapeCSVField = (field: string): string => {
  // If field contains comma, newline, or quote, wrap in quotes and escape internal quotes
  if (field.includes(',') || field.includes('\n') || field.includes('"')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

const generateFilename = (options: ExportOptions): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  const typeFilter = options.filterType && options.filterType !== 'all' 
    ? `_${options.filterType}` 
    : '';
  
  const dateRange = options.dateRange 
    ? `_${options.dateRange.start}_to_${options.dateRange.end}`
    : '';

  return `expenseflow_transactions${typeFilter}${dateRange}_${timestamp}.csv`;
};

const downloadCSV = (content: string, filename: string): void => {
  // Create blob with UTF-8 BOM for proper Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

// Quick export functions for common use cases
export const exportAllTransactions = (transactions: Transaction[]): void => {
  exportToCSV(transactions, {
    includeHeaders: true,
    dateFormat: 'readable',
    currencyFormat: 'formatted'
  });
};

export const exportIncomeOnly = (transactions: Transaction[]): void => {
  exportToCSV(transactions, {
    includeHeaders: true,
    dateFormat: 'readable',
    currencyFormat: 'formatted',
    filterType: 'income'
  });
};

export const exportExpensesOnly = (transactions: Transaction[]): void => {
  exportToCSV(transactions, {
    includeHeaders: true,
    dateFormat: 'readable',
    currencyFormat: 'formatted',
    filterType: 'expense'
  });
};

export const exportDateRange = (
  transactions: Transaction[], 
  startDate: string, 
  endDate: string
): void => {
  exportToCSV(transactions, {
    includeHeaders: true,
    dateFormat: 'readable',
    currencyFormat: 'formatted',
    dateRange: { start: startDate, end: endDate }
  });
};
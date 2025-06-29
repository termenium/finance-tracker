import { Transaction } from '@/types/transaction';

const STORAGE_KEY = 'expense-tracker-transactions';

export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    // Dispatch custom event for navbar updates
    window.dispatchEvent(new CustomEvent('transactionUpdate'));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    createdAt: Date.now()
  };
  
  const transactions = getTransactions();
  const updatedTransactions = [newTransaction, ...transactions];
  saveTransactions(updatedTransactions);
  
  return newTransaction;
};

export const updateTransaction = async (updatedTransaction: Transaction): Promise<Transaction> => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.map(t => 
    t.id === updatedTransaction.id ? updatedTransaction : t
  );
  saveTransactions(updatedTransactions);
  
  return updatedTransaction;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const transactions = getTransactions();
  const updatedTransactions = transactions.filter(t => t.id !== id);
  saveTransactions(updatedTransactions);
};

// For backward compatibility
export const loadTransactions = async (): Promise<Transaction[]> => {
  return getTransactions();
};
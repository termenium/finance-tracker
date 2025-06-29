'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '@/types/transaction';
import { addTransaction, updateTransaction, deleteTransaction, getTransactions } from '@/utils/storage';
import { SummaryCards } from '@/components/SummaryCards';
import { StatsCards } from '@/components/StatsCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { ImportExportModal } from '@/components/ImportExportModal';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedTransactions = getTransactions();
        setTransactions(savedTransactions);
        setFilteredTransactions(savedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddTransaction = async (formData: TransactionFormData) => {
    try {
      const newTransaction = await addTransaction({
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        date: formData.date
      });

      const updatedTransactions = [newTransaction, ...transactions.filter(t => t.id !== newTransaction.id)];
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    try {
      const updated = await updateTransaction(updatedTransaction);
      const updatedTransactions = transactions.map(t => t.id === updated.id ? updated : t);
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    if (activeTab === 'analytics') {
      setActiveTab('overview');
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      setFilteredTransactions(updatedTransactions);
      if (editingTransaction?.id === id) {
        setEditingTransaction(null);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleFiltersChange = (filtered: Transaction[]) => {
    setFilteredTransactions(filtered);
  };

  const handleImportComplete = (importedTransactions: Transaction[]) => {
    const updatedTransactions = [...importedTransactions, ...transactions];
    setTransactions(updatedTransactions);
    setFilteredTransactions(updatedTransactions);
    setShowImportModal(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2">Dashboard</h1>
              <p className="text-white/60 text-sm">
                Manage your income and expenses • {transactions.length} total transactions
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Import Button */}
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import CSV
              </button>

              {/* Tab Navigation */}
              <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'analytics'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden sm:inline">Analytics</span>
                  {transactions.length > 0 && (
                    <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      {transactions.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Edit Mode Indicator */}
          {editingTransaction && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg">
              <div className="flex items-center gap-2 text-white text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editing: {editingTransaction.title}</span>
                <button
                  onClick={handleCancelEdit}
                  className="ml-auto text-white hover:text-white/80 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Content based on active tab */}
        {activeTab === 'overview' ? (
          <>
            {/* Summary Cards */}
            <div className="mb-6 sm:mb-8">
              <SummaryCards transactions={transactions} />
            </div>

            {/* Stats Cards */}
            {transactions.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <StatsCards transactions={transactions} />
              </div>
            )}

            {/* Advanced Filters */}
            {transactions.length > 0 && (
              <div className="mb-6">
                <AdvancedFilters
                  transactions={transactions}
                  onFiltersChange={handleFiltersChange}
                  isOpen={showFilters}
                  onToggle={() => setShowFilters(!showFilters)}
                />
              </div>
            )}

            {/* Main Content - Improved Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-6">
                <TransactionForm 
                  onSubmit={handleAddTransaction}
                  onUpdate={handleUpdateTransaction}
                  onCancelEdit={handleCancelEdit}
                  initialTransaction={editingTransaction}
                />
              </div>
              
              <div>
                <TransactionList 
                  transactions={filteredTransactions} 
                  onDelete={handleDeleteTransaction}
                  onEdit={handleEditTransaction}
                />
              </div>
            </div>
          </>
        ) : (
          /* Analytics Tab */
          <div className="space-y-6 sm:space-y-8">
            {/* Summary Cards for Analytics */}
            <div className="mb-6 sm:mb-8">
              <SummaryCards transactions={transactions} />
            </div>
            
            {/* Stats Cards */}
            {transactions.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <StatsCards transactions={transactions} />
              </div>
            )}
            
            {/* Charts */}
            <AnalyticsCharts transactions={transactions} />
          </div>
        )}
      </div>

      {/* Import Modal */}
      <ImportExportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}
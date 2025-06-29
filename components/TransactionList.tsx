'use client';

import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate, sortTransactions } from '@/utils/calculations';
import { ExportButton } from './ExportButton';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = sortTransactions(filteredTransactions, sortBy);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this transaction?')) {
      setDeletingId(id);
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onDelete(id);
      setDeletingId(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    onEdit(transaction);
  };

  if (transactions.length === 0) {
    return (
      <div className="vercel-card rounded-xl p-12 text-center hover:bg-white/[0.02] transition-all duration-300 border border-white/5">
        <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
        <p className="text-sm text-white/60 max-w-sm mx-auto">
          Start by adding your first transaction using the form. Track your income and expenses to get insights into your spending patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="vercel-card rounded-xl overflow-hidden hover:bg-white/[0.01] transition-all duration-300 border border-white/5">
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex flex-col gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 vercel-input rounded-lg text-white placeholder-white/40 focus:outline-none text-sm transition-all duration-200 border border-white/10 focus:border-white/20"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                className="w-full px-4 py-3 vercel-input rounded-lg text-white focus:outline-none text-sm transition-all duration-200 appearance-none bg-transparent relative z-10 pr-10 border border-white/10 focus:border-white/20"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="all" style={{ backgroundColor: '#000', color: '#fff' }}>All Types</option>
                <option value="income" style={{ backgroundColor: '#000', color: '#fff' }}>💰 Income</option>
                <option value="expense" style={{ backgroundColor: '#000', color: '#fff' }}>💸 Expenses</option>
              </select>
            </div>
            
            <div className="relative flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'title')}
                className="w-full px-4 py-3 vercel-input rounded-lg text-white focus:outline-none text-sm transition-all duration-200 appearance-none bg-transparent relative z-10 pr-10 border border-white/10 focus:border-white/20"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="date" style={{ backgroundColor: '#000', color: '#fff' }}>📅 Sort by Date</option>
                <option value="amount" style={{ backgroundColor: '#000', color: '#fff' }}>💵 Sort by Amount</option>
                <option value="title" style={{ backgroundColor: '#000', color: '#fff' }}>📝 Sort by Title</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Transactions</h2>
            <span className="text-xs text-white/60">
              {filteredTransactions.length} of {transactions.length} transactions
            </span>
          </div>
          
          {/* Export Button */}
          <ExportButton transactions={filteredTransactions} />
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sortedTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={`p-4 sm:p-6 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-all duration-300 group ${
              deletingId === transaction.id ? 'opacity-50 scale-95' : ''
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    transaction.type === 'income' ? 'bg-white shadow-glow' : 'bg-white/60 shadow-glow'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate group-hover:text-white transition-colors duration-200">
                      {transaction.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                      <span className="hover:text-white/70 transition-colors duration-200">
                        {transaction.category}
                      </span>
                      <span>•</span>
                      <span className="hover:text-white/70 transition-colors duration-200">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium tabular-nums transition-all duration-200 text-white group-hover:scale-105`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="p-2 text-white/40 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/10 active-press"
                    aria-label={`Edit ${transaction.title}`}
                    title="Edit transaction"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deletingId === transaction.id}
                    className="p-2 text-white/40 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/10 active-press disabled:cursor-not-allowed"
                    aria-label={`Delete ${transaction.title}`}
                    title="Delete transaction"
                  >
                    {deletingId === transaction.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && transactions.length > 0 && (
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-medium mb-2">No results found</h3>
          <p className="text-sm text-white/60">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Transaction } from '@/types/transaction';

interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  } | null;
  amountRange: {
    min: number;
    max: number;
  } | null;
  categories: string[];
  types: ('income' | 'expense')[];
}

interface AdvancedFiltersProps {
  transactions: Transaction[];
  onFiltersChange: (filteredTransactions: Transaction[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function AdvancedFilters({ transactions, onFiltersChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: null,
    amountRange: null,
    categories: [],
    types: ['income', 'expense']
  });

  // Get unique categories from transactions
  const allCategories = Array.from(new Set(transactions.map(t => t.category))).sort();

  // Get amount range from transactions
  const amounts = transactions.map(t => t.amount);
  const minAmount = amounts.length > 0 ? Math.min(...amounts) : 0;
  const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 1000;

  const applyFilters = () => {
    let filtered = [...transactions];

    // Date range filter
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    // Amount range filter
    if (filters.amountRange) {
      filtered = filtered.filter(t => 
        t.amount >= filters.amountRange!.min && t.amount <= filters.amountRange!.max
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(t => filters.categories.includes(t.category));
    }

    // Type filter
    if (filters.types.length > 0 && filters.types.length < 2) {
      filtered = filtered.filter(t => filters.types.includes(t.type));
    }

    onFiltersChange(filtered);
  };

  const clearFilters = () => {
    setFilters({
      dateRange: null,
      amountRange: null,
      categories: [],
      types: ['income', 'expense']
    });
    onFiltersChange(transactions);
  };

  const updateDateRange = (field: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        start: field === 'start' ? value : prev.dateRange?.start || '',
        end: field === 'end' ? value : prev.dateRange?.end || ''
      }
    }));
  };

  const updateAmountRange = (field: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      amountRange: {
        min: field === 'min' ? value : prev.amountRange?.min || minAmount,
        max: field === 'max' ? value : prev.amountRange?.max || maxAmount
      }
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleType = (type: 'income' | 'expense') => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const hasActiveFilters = filters.dateRange || filters.amountRange || 
                          filters.categories.length > 0 || filters.types.length < 2;

  return (
    <div className="vercel-card rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium">Advanced Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filters Content */}
      {isOpen && (
        <div className="p-4 border-t border-white/10 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/60 mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => updateDateRange('start', e.target.value)}
                  className="w-full px-3 py-2 vercel-input rounded-md text-white focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => updateDateRange('end', e.target.value)}
                  className="w-full px-3 py-2 vercel-input rounded-md text-white focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Amount Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/60 mb-1">Min ($)</label>
                <input
                  type="number"
                  min={minAmount}
                  max={maxAmount}
                  value={filters.amountRange?.min || ''}
                  onChange={(e) => updateAmountRange('min', parseFloat(e.target.value) || minAmount)}
                  className="w-full px-3 py-2 vercel-input rounded-md text-white focus:outline-none text-sm"
                  placeholder={minAmount.toString()}
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">Max ($)</label>
                <input
                  type="number"
                  min={minAmount}
                  max={maxAmount}
                  value={filters.amountRange?.max || ''}
                  onChange={(e) => updateAmountRange('max', parseFloat(e.target.value) || maxAmount)}
                  className="w-full px-3 py-2 vercel-input rounded-md text-white focus:outline-none text-sm"
                  placeholder={maxAmount.toString()}
                />
              </div>
            </div>
          </div>

          {/* Transaction Types */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Transaction Types</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types.includes('income')}
                  onChange={() => toggleType('income')}
                  className="w-4 h-4 rounded border border-white/20 bg-white/10 text-green-500 focus:ring-green-500 focus:ring-1"
                />
                <span className="text-sm text-white/80">Income</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types.includes('expense')}
                  onChange={() => toggleType('expense')}
                  className="w-4 h-4 rounded border border-white/20 bg-white/10 text-red-500 focus:ring-red-500 focus:ring-1"
                />
                <span className="text-sm text-white/80">Expenses</span>
              </label>
            </div>
          </div>

          {/* Categories */}
          {allCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Categories</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {allCategories.map(category => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-3 h-3 rounded border border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-1"
                    />
                    <span className="text-xs text-white/80 truncate">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={applyFilters}
              className="flex-1 vercel-button font-medium py-2 px-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
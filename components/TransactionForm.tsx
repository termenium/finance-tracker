'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types/transaction';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onUpdate: (data: Transaction) => void;
  onCancelEdit?: () => void;
  initialTransaction?: Transaction | null;
}

export function TransactionForm({ onSubmit, onUpdate, onCancelEdit, initialTransaction }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialTransaction;

  // Initialize form data when editing
  useEffect(() => {
    if (initialTransaction) {
      setFormData({
        title: initialTransaction.title,
        amount: initialTransaction.amount.toString(),
        category: initialTransaction.category,
        type: initialTransaction.type,
        date: initialTransaction.date
      });
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        amount: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [initialTransaction]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (isEditing && initialTransaction) {
        // Update existing transaction
        const updatedTransaction: Transaction = {
          ...initialTransaction,
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          type: formData.type,
          date: formData.date
        };
        onUpdate(updatedTransaction);
      } else {
        // Add new transaction
        onSubmit(formData);
        // Reset form after adding
        setFormData({
          title: '',
          amount: '',
          category: '',
          type: 'expense',
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      setErrors({});
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleChange = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="vercel-card rounded-xl p-6 hover:bg-white/[0.02] transition-all duration-300 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-1">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <p className="text-sm text-white/60">
            {isEditing ? 'Update transaction details' : 'Enter your income or expense details'}
          </p>
        </div>
        {isEditing && (
          <button
            onClick={handleCancel}
            className="text-white/60 hover:text-white text-sm transition-colors duration-200 p-2 hover:bg-white/5 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-3 vercel-input rounded-lg text-white placeholder-white/40 focus:outline-none text-sm transition-all duration-200 border border-white/10 focus:border-white/20"
            placeholder="e.g., Coffee, Salary, Groceries..."
            disabled={isSubmitting}
          />
          {errors.title && <p className="text-red-400 text-xs mt-2 animate-slide-in-from-top">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-white/80 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">$</span>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-3 vercel-input rounded-lg text-white placeholder-white/40 focus:outline-none text-sm transition-all duration-200 border border-white/10 focus:border-white/20"
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </div>
          {errors.amount && <p className="text-red-400 text-xs mt-2 animate-slide-in-from-top">{errors.amount}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-white/80 mb-2">
              Type
            </label>
            <div className="relative">
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as 'income' | 'expense')}
                className="w-full px-4 py-3 vercel-input rounded-lg text-white focus:outline-none text-sm transition-all duration-200 appearance-none bg-transparent relative z-10 border border-white/10 focus:border-white/20"
                disabled={isSubmitting}
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="expense" style={{ backgroundColor: '#000', color: '#fff' }}>💸 Expense</option>
                <option value="income" style={{ backgroundColor: '#000', color: '#fff' }}>💰 Income</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 vercel-input rounded-lg text-white focus:outline-none text-sm transition-all duration-200 appearance-none bg-transparent relative z-10 border border-white/10 focus:border-white/20"
                disabled={isSubmitting}
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="" style={{ backgroundColor: '#000', color: '#fff' }}>Select category</option>
                {categories.map(category => (
                  <option key={category} value={category} style={{ backgroundColor: '#000', color: '#fff' }}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && <p className="text-red-400 text-xs mt-2 animate-slide-in-from-top">{errors.category}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-white/80 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-4 py-3 vercel-input rounded-lg text-white focus:outline-none text-sm transition-all duration-200 border border-white/10 focus:border-white/20"
            disabled={isSubmitting}
          />
          {errors.date && <p className="text-red-400 text-xs mt-2 animate-slide-in-from-top">{errors.date}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 vercel-button font-medium py-3 px-6 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/20 active-press transition-all duration-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  {isEditing ? 'Saving...' : 'Adding...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditing ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                  </svg>
                  {isEditing ? 'Save Changes' : 'Add Transaction'}
                </>
              )}
            </span>
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-white/20"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
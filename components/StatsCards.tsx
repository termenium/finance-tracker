'use client';

import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/calculations';

interface StatsCardsProps {
  transactions: Transaction[];
}

export function StatsCards({ transactions }: StatsCardsProps) {
  // Calculate various statistics
  const thisMonth = new Date();
  const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
  
  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === thisMonth.getMonth() && 
           transactionDate.getFullYear() === thisMonth.getFullYear();
  });

  const lastMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === lastMonth.getMonth() && 
           transactionDate.getFullYear() === lastMonth.getFullYear();
  });

  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthIncome = lastMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate percentage changes
  const incomeChange = lastMonthIncome > 0 
    ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 
    : 0;

  const expenseChange = lastMonthExpenses > 0 
    ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
    : 0;

  // Average transaction amount
  const avgTransaction = transactions.length > 0 
    ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
    : 0;

  // Most expensive transaction
  const maxTransaction = transactions.length > 0 
    ? Math.max(...transactions.map(t => t.amount)) 
    : 0;

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const stats = [
    {
      label: 'This Month Income',
      value: thisMonthIncome,
      change: incomeChange,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
      indicator: 'income-indicator'
    },
    {
      label: 'This Month Expenses',
      value: thisMonthExpenses,
      change: expenseChange,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
      indicator: 'expense-indicator'
    },
    {
      label: 'Average Transaction',
      value: avgTransaction,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      indicator: 'status-neutral'
    },
    {
      label: 'Largest Transaction',
      value: maxTransaction,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      indicator: 'status-neutral'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="vercel-card rounded-lg p-4 group hover:bg-white/[0.08] hover-lift transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/60 font-medium">{stat.label}</span>
            <div className={`w-6 h-6 rounded-md ${stat.indicator} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-lg font-bold text-white tabular-nums">
              {formatCurrency(stat.value)}
            </div>
            
            {stat.change !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-white">
                  {formatPercentage(stat.change)}
                </span>
                <span className="text-xs text-white/40">vs last month</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
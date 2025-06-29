'use client';

import { Transaction } from '@/types/transaction';
import { calculateTotals, formatCurrency } from '@/utils/calculations';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const { income, expenses, balance } = calculateTotals(transactions);

  const cards = [
    {
      label: 'Income',
      value: income,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
      indicator: 'income-indicator'
    },
    {
      label: 'Expenses',
      value: expenses,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
      indicator: 'expense-indicator'
    },
    {
      label: 'Balance',
      value: Math.abs(balance),
      prefix: balance >= 0 ? '+' : '-',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      indicator: balance >= 0 ? 'income-indicator' : 'expense-indicator'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="vercel-card rounded-lg p-6 group hover:bg-white/[0.08] hover-lift transition-all duration-300 will-change-transform"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/60 font-medium">{card.label}</span>
            <div className={`w-8 h-8 rounded-md ${card.indicator} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 will-change-transform`}>
              {card.icon}
            </div>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {card.prefix}{formatCurrency(card.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
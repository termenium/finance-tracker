'use client';

import { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/utils/calculations';
import { ExportButton } from './ExportButton';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { useState } from 'react';

interface AnalyticsChartsProps {
  transactions: Transaction[];
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface TrendData {
  date: string;
  balance: number;
  income: number;
  expenses: number;
}

// Monochromatic color palette
const COLORS = [
  '#ffffff', '#e5e5e5', '#cccccc', '#b3b3b3', '#999999',
  '#808080', '#666666', '#4d4d4d', '#333333', '#1a1a1a'
];

export function AnalyticsCharts({ transactions }: AnalyticsChartsProps) {
  const [activeChart, setActiveChart] = useState<'overview' | 'categories' | 'trends' | 'monthly'>('overview');

  // Process data for category breakdown
  const getCategoryData = (type: 'income' | 'expense'): CategoryData[] => {
    const categoryTotals = transactions
      .filter(t => t.type === type)
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Process data for monthly comparison
  const getMonthlyData = (): MonthlyData[] => {
    const monthlyTotals = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthName, income: 0, expenses: 0, balance: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[monthKey].income += transaction.amount;
      } else {
        acc[monthKey].expenses += transaction.amount;
      }
      
      acc[monthKey].balance = acc[monthKey].income - acc[monthKey].expenses;
      
      return acc;
    }, {} as Record<string, MonthlyData>);

    return Object.values(monthlyTotals).sort((a, b) => a.month.localeCompare(b.month));
  };

  // Process data for balance trends
  const getTrendData = (): TrendData[] => {
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let runningBalance = 0;
    const trendData: TrendData[] = [];
    
    // Group by date
    const dailyData = sortedTransactions.reduce((acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expenses += transaction.amount;
      }
      
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    // Create trend data
    Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, data]) => {
        runningBalance += data.income - data.expenses;
        trendData.push({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          balance: runningBalance,
          income: data.income,
          expenses: data.expenses
        });
      });

    return trendData;
  };

  const expenseCategories = getCategoryData('expense');
  const incomeCategories = getCategoryData('income');
  const monthlyData = getMonthlyData();
  const trendData = getTrendData();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalIncome - totalExpenses;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-2xl">
          <p className="text-white/80 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-white">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-2xl">
          <p className="text-white text-sm font-medium">{data.name}</p>
          <p className="text-sm text-white">
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <div className="vercel-card rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="font-medium mb-2">No Data to Visualize</h3>
        <p className="text-sm text-white/60">Add some transactions to see beautiful charts and insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Navigation */}
      <div className="vercel-card rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'categories', label: 'Categories', icon: '🥧' },
              { key: 'trends', label: 'Trends', icon: '📈' },
              { key: 'monthly', label: 'Monthly', icon: '📅' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveChart(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeChart === tab.key
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Export Button for Analytics */}
          <ExportButton transactions={transactions} className="ml-auto" />
        </div>
      </div>

      {/* Overview Charts */}
      {activeChart === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="vercel-card rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Financial Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Total Income</span>
                <span className="text-white font-medium">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Total Expenses</span>
                <span className="text-white font-medium">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Net Balance</span>
                  <span className="font-bold text-white">
                    {currentBalance >= 0 ? '+' : ''}{formatCurrency(currentBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Income vs Expenses Pie */}
          <div className="lg:col-span-2 vercel-card rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Income vs Expenses
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Income', value: totalIncome, color: '#ffffff' },
                    { name: 'Expenses', value: totalExpenses, color: '#808080' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Income', value: totalIncome, color: '#ffffff' },
                    { name: 'Expenses', value: totalExpenses, color: '#808080' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#ffffff' }}
                  formatter={(value) => <span style={{ color: '#ffffff' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {activeChart === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Categories */}
          {expenseCategories.length > 0 && (
            <div className="vercel-card rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                Expense Categories
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    wrapperStyle={{ color: '#ffffff', fontSize: '12px' }}
                    formatter={(value) => <span style={{ color: '#ffffff' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Income Categories */}
          {incomeCategories.length > 0 && (
            <div className="vercel-card rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Income Categories
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {incomeCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    wrapperStyle={{ color: '#ffffff', fontSize: '12px' }}
                    formatter={(value) => <span style={{ color: '#ffffff' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Trends */}
      {activeChart === 'trends' && trendData.length > 0 && (
        <div className="vercel-card rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Balance Trend Over Time
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#ffffff60"
                fontSize={12}
              />
              <YAxis 
                stroke="#ffffff60"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#ffffff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Comparison */}
      {activeChart === 'monthly' && monthlyData.length > 0 && (
        <div className="vercel-card rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Monthly Income vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="month" 
                stroke="#ffffff60"
                fontSize={12}
              />
              <YAxis 
                stroke="#ffffff60"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
                formatter={(value) => <span style={{ color: '#ffffff' }}>{value}</span>}
              />
              <Bar dataKey="income" fill="#ffffff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#808080" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
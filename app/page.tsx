'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getTransactions } from '@/utils/storage';
import { calculateTotals, formatCurrency } from '@/utils/calculations';

export default function Home() {
  const [stats, setStats] = useState({ transactions: 0, balance: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const transactions = getTransactions();
    const { balance } = calculateTotals(transactions);
    setStats({ transactions: transactions.length, balance });
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Smart Analytics',
      description: 'Beautiful charts and insights to understand your spending patterns'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Quick Actions',
      description: 'Add common transactions with one click using smart presets'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      title: 'Import & Export',
      description: 'Seamlessly import from CSV files and export your data anytime'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      ),
      title: 'Advanced Filters',
      description: 'Filter by date range, amount, category, and more for detailed analysis'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Privacy First',
      description: 'Your data stays local in your browser - no servers, no tracking'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Open Source',
      description: 'Completely free and open source - customize it to your needs'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-white/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          {/* Logo/Brand */}
          <div className="mb-8 sm:mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                ExpenseFlow
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-white/70 text-balance max-w-2xl mx-auto leading-relaxed px-4">
              The most beautiful and intuitive expense tracker. 
              <span className="text-white font-medium"> Track, analyze, and optimize</span> your finances with ease.
            </p>
          </div>

          {/* CTA Section */}
          <div className="space-y-4 sm:space-y-6 mb-12 sm:mb-16" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col items-center justify-center">
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25 w-full max-w-xs sm:w-auto"
              >
                <span className="relative z-10">
                  {stats.transactions > 0 ? 'Go to Dashboard' : 'Start Tracking'}
                </span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            
            <p className="text-sm text-white/50 px-4">
              ✨ No signup required • 🔒 Privacy first • 💾 Works offline • 🆓 Free forever
            </p>
          </div>

          {/* Stats Preview */}
          {isLoaded && stats.transactions > 0 && (
            <div className="vercel-card rounded-2xl p-6 sm:p-8 max-w-md mx-auto" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold mb-4 text-white/90">Your Progress</h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.transactions}</div>
                  <div className="text-sm text-white/60">Transactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-1 text-white">
                    {stats.balance >= 0 ? '+' : ''}{formatCurrency(stats.balance)}
                  </div>
                  <div className="text-sm text-white/60">Balance</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Everything you need to manage your finances</h2>
            <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto px-4">
              Powerful features designed to make expense tracking effortless and insightful
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group vercel-card rounded-xl p-6 sm:p-8 hover:bg-white/[0.08] transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="vercel-card rounded-2xl p-8 sm:p-12 bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to take control of your finances?</h2>
            <p className="text-base sm:text-lg text-white/60 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join thousands of users who have simplified their expense tracking with ExpenseFlow
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25"
            >
              Get Started Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-semibold">ExpenseFlow</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm text-white/60 text-center">
              <span>Built with Next.js & Tailwind CSS</span>
              <span className="hidden sm:inline">•</span>
              <span>Open Source</span>
              <span className="hidden sm:inline">•</span>
              <span>Privacy First</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getTransactions } from '@/utils/storage';
import { calculateTotals, formatCurrency } from '@/utils/calculations';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasTransactions, setHasTransactions] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === '/';
  const isDashboard = pathname === '/dashboard';

  // Update transaction data
  useEffect(() => {
    const updateData = () => {
      const transactions = getTransactions();
      const totals = calculateTotals(transactions);
      setHasTransactions(transactions.length > 0);
      setTransactionCount(transactions.length);
      setBalance(totals.balance);
    };

    updateData();
    
    // Listen for storage changes
    const handleStorageChange = () => updateData();
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for local updates
    window.addEventListener('transactionUpdate', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('transactionUpdate', handleStorageChange);
    };
  }, [pathname]);

  // Smart scroll behavior
  const updateScrollBehavior = useCallback(() => {
    const scrollY = window.scrollY;
    
    if (Math.abs(scrollY - lastScrollY.current) < 10) {
      ticking.current = false;
      return;
    }

    setIsVisible(scrollY < lastScrollY.current || scrollY < 100);
    setIsCompact(scrollY > 100);
    
    lastScrollY.current = scrollY;
    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollBehavior);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollBehavior]);

  // Command palette functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette (Cmd+K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setMobileMenuOpen(false);
        setFocusedIndex(-1);
      }

      // Arrow navigation in command palette
      if (showCommandPalette) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
          e.preventDefault();
          const routes = ['/', '/dashboard'];
          handleNavigation(routes[focusedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette, focusedIndex]);

  // Click outside to close command palette
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(event.target as Node)) {
        setShowCommandPalette(false);
      }
    };

    if (showCommandPalette) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCommandPalette]);

  const handleNavigation = async (href: string) => {
    if (href === pathname) return;
    
    setIsLoading(true);
    setShowCommandPalette(false);
    setMobileMenuOpen(false);
    
    // Preload the route
    router.prefetch(href);
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 150));
    
    router.push(href);
    setIsLoading(false);
  };

  const commandPaletteItems = [
    {
      label: 'Home',
      href: '/',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      shortcut: 'H'
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      shortcut: 'D',
      badge: transactionCount > 0 ? transactionCount : undefined
    }
  ];

  return (
    <>
      {/* Navbar */}
      <nav 
        className={`fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-40 transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } ${isCompact ? 'top-1 sm:top-2' : 'top-2 sm:top-4'}`}
      >
        <div className={`bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 ${
          isCompact ? 'shadow-lg' : 'shadow-2xl'
        }`}>
          {/* Noise texture overlay */}
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-[0.015] pointer-events-none bg-noise"></div>
          
          {/* Active page indicator line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className={`flex items-center justify-between transition-all duration-300 ${
              isCompact ? 'h-10 sm:h-12' : 'h-12 sm:h-16'
            }`}>
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center gap-2 group relative"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/');
                }}
              >
                <div className="relative">
                  <div className={`bg-white rounded-lg flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-all duration-300 ${
                    isCompact ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-8 sm:h-8'
                  }`}>
                    <svg className={`text-black transition-all duration-300 ${
                      isCompact ? 'w-3 h-3 sm:w-3 sm:h-3' : 'w-4 h-4 sm:w-5 sm:h-5'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  {/* Breathing animation for active state */}
                  {isHome && (
                    <div className="absolute inset-0 bg-white/20 rounded-lg animate-pulse"></div>
                  )}
                </div>
                <span className={`font-bold transition-all duration-300 ${
                  isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                }`}>
                  ExpenseFlow
                </span>
                {isLoading && (
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse ml-1"></div>
                )}
              </Link>

              {/* Navigation Links - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-1">
                <Link 
                  href="/" 
                  className={`text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 relative group ${
                    isHome 
                      ? 'text-white bg-white/10 shadow-inner' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/');
                  }}
                >
                  <span className="relative z-10">Home</span>
                  {!isHome && (
                    <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                  )}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </Link>
                
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 relative group flex items-center gap-2 ${
                    isDashboard 
                      ? 'text-white bg-white/10 shadow-inner' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard');
                  }}
                >
                  <span className="relative z-10">Dashboard</span>
                  {transactionCount > 0 && (
                    <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      {transactionCount}
                    </span>
                  )}
                  {!isDashboard && (
                    <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                  )}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </Link>

                {/* Balance indicator */}
                {hasTransactions && !isCompact && (
                  <div className="ml-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-xs font-medium text-white">
                      {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                    </span>
                  </div>
                )}
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-2">
                {/* Command palette trigger - Hidden on mobile */}
                <button
                  onClick={() => setShowCommandPalette(true)}
                  className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1.5 text-xs text-white/60 hover:text-white/80 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-200 group"
                  title="Open command palette (⌘K)"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden lg:inline">⌘K</span>
                </button>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 relative group"
                  aria-label="Toggle mobile menu"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 relative">
                    <span className={`absolute block w-4 sm:w-5 h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? 'rotate-45 top-1.5 sm:top-2' : 'top-0.5 sm:top-1'
                    }`}></span>
                    <span className={`absolute block w-4 sm:w-5 h-0.5 bg-current top-1.5 sm:top-2 transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}></span>
                    <span className={`absolute block w-4 sm:w-5 h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? '-rotate-45 top-1.5 sm:top-2' : 'top-2.5 sm:top-3'
                    }`}></span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${
              mobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="py-3 sm:py-4 border-t border-white/10 space-y-2">
                <Link
                  href="/"
                  className={`block px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isHome ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/');
                  }}
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className={`block px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                    isDashboard ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard');
                  }}
                >
                  <span>Dashboard</span>
                  {transactionCount > 0 && (
                    <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      {transactionCount}
                    </span>
                  )}
                </Link>
                {hasTransactions && (
                  <div className="px-3 sm:px-4 py-2 text-xs text-white/60">
                    Balance: <span className="text-white">
                      {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-32 px-4">
          <div 
            ref={commandPaletteRef}
            className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
            style={{ zIndex: 10000 }}
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-white/60">Quick Navigation</span>
                <div className="ml-auto flex items-center gap-1 text-xs text-white/40">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">ESC</kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              {commandPaletteItems.map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    focusedIndex === index || pathname === item.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="flex-1 font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs font-mono">
                      {item.shortcut}
                    </kbd>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
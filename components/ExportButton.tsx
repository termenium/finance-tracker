'use client';

import { useState, useRef, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { 
  exportToCSV, 
  exportAllTransactions, 
  exportIncomeOnly, 
  exportExpensesOnly,
  exportDateRange,
  ExportOptions 
} from '@/utils/csvExport';

interface ExportButtonProps {
  transactions: Transaction[];
  className?: string;
}

export function ExportButton({ transactions, className = '' }: ExportButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeHeaders: true,
    dateFormat: 'readable',
    currencyFormat: 'formatted',
    filterType: 'all'
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setShowAdvanced(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleExport = async (exportFunction: () => void) => {
    setIsExporting(true);
    
    try {
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      exportFunction();
      
      // Show success feedback
      setShowDropdown(false);
      setShowAdvanced(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAdvancedExport = async () => {
    await handleExport(() => exportToCSV(transactions, exportOptions));
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all duration-200 group ${className}`}
        disabled={isExporting}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {isExporting ? 'Exporting...' : 'Export CSV'}
        <svg className={`w-3 h-3 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Quick Export Options */}
          <div className="p-2 border-b border-white/10">
            <div className="text-xs text-white/60 px-2 py-1 font-medium">Quick Export</div>
            
            <button
              onClick={() => handleExport(() => exportAllTransactions(transactions))}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
              disabled={isExporting}
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1 text-left">
                <div className="font-medium">All Transactions</div>
                <div className="text-xs text-white/50">{transactions.length} records</div>
              </div>
            </button>

            <button
              onClick={() => handleExport(() => exportIncomeOnly(transactions))}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
              disabled={isExporting}
            >
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <div className="flex-1 text-left">
                <div className="font-medium">Income Only</div>
                <div className="text-xs text-white/50">
                  {transactions.filter(t => t.type === 'income').length} records
                </div>
              </div>
            </button>

            <button
              onClick={() => handleExport(() => exportExpensesOnly(transactions))}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
              disabled={isExporting}
            >
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
              <div className="flex-1 text-left">
                <div className="font-medium">Expenses Only</div>
                <div className="text-xs text-white/50">
                  {transactions.filter(t => t.type === 'expense').length} records
                </div>
              </div>
            </button>
          </div>

          {/* Advanced Options Toggle */}
          <div className="p-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Advanced Options
              </div>
              <svg className={`w-3 h-3 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Advanced Options Panel */}
            {showAdvanced && (
              <div className="mt-2 p-3 bg-white/5 rounded-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Filter Type */}
                <div>
                  <label className="block text-xs text-white/60 mb-1">Filter Type</label>
                  <select
                    value={exportOptions.filterType}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, 
                      filterType: e.target.value as 'all' | 'income' | 'expense' 
                    }))}
                    className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="all">All Transactions</option>
                    <option value="income">Income Only</option>
                    <option value="expense">Expenses Only</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-xs text-white/60 mb-1">Date Format</label>
                  <select
                    value={exportOptions.dateFormat}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, 
                      dateFormat: e.target.value as 'iso' | 'readable' 
                    }))}
                    className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="readable">Readable (Jan 15, 2024)</option>
                    <option value="iso">ISO Format (2024-01-15)</option>
                  </select>
                </div>

                {/* Currency Format */}
                <div>
                  <label className="block text-xs text-white/60 mb-1">Amount Format</label>
                  <select
                    value={exportOptions.currencyFormat}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, 
                      currencyFormat: e.target.value as 'raw' | 'formatted' 
                    }))}
                    className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="formatted">Formatted (1,234.56)</option>
                    <option value="raw">Raw Numbers (1234.56)</option>
                  </select>
                </div>

                {/* Include Headers */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeHeaders"
                    checked={exportOptions.includeHeaders}
                    onChange={(e) => setExportOptions(prev => ({ 
                      ...prev, 
                      includeHeaders: e.target.checked 
                    }))}
                    className="w-3 h-3 rounded border border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-1"
                  />
                  <label htmlFor="includeHeaders" className="text-xs text-white/80">
                    Include column headers
                  </label>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleAdvancedExport}
                  className="w-full mt-3 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                      </svg>
                      Export with Options
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
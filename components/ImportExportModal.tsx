'use client';

import { useState, useRef } from 'react';
import { Transaction } from '@/types/transaction';
import { addTransaction } from '@/utils/storage';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (transactions: Transaction[]) => void;
}

export function ImportExportModal({ isOpen, onClose, onImportComplete }: ImportExportModalProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResults(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('File is empty');
      }

      // Skip header if present
      const dataLines = lines[0].toLowerCase().includes('date') ? lines.slice(1) : lines;
      
      const importedTransactions: Transaction[] = [];
      const errors: string[] = [];

      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim();
        if (!line) continue;

        try {
          const columns = parseCSVLine(line);
          
          if (columns.length < 5) {
            errors.push(`Line ${i + 1}: Not enough columns`);
            continue;
          }

          const [date, title, category, type, amount] = columns;
          
          // Validate data
          if (!date || !title || !category || !type || !amount) {
            errors.push(`Line ${i + 1}: Missing required fields`);
            continue;
          }

          if (!['income', 'expense'].includes(type.toLowerCase())) {
            errors.push(`Line ${i + 1}: Invalid type "${type}". Must be "income" or "expense"`);
            continue;
          }

          const parsedAmount = parseFloat(amount.replace(/[,$]/g, ''));
          if (isNaN(parsedAmount) || parsedAmount <= 0) {
            errors.push(`Line ${i + 1}: Invalid amount "${amount}"`);
            continue;
          }

          // Parse date
          const parsedDate = new Date(date);
          if (isNaN(parsedDate.getTime())) {
            errors.push(`Line ${i + 1}: Invalid date "${date}"`);
            continue;
          }

          const transaction = await addTransaction({
            title: title.trim(),
            amount: parsedAmount,
            category: category.trim(),
            type: type.toLowerCase() as 'income' | 'expense',
            date: parsedDate.toISOString().split('T')[0]
          });

          importedTransactions.push(transaction);
        } catch (error) {
          errors.push(`Line ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setImportResults({
        success: importedTransactions.length,
        errors
      });

      if (importedTransactions.length > 0) {
        onImportComplete(importedTransactions);
      }
    } catch (error) {
      setImportResults({
        success: 0,
        errors: [error instanceof Error ? error.message : 'Failed to parse file']
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      'Date,Title,Category,Type,Amount',
      '2024-01-15,Coffee Shop,Food,expense,4.50',
      '2024-01-15,Salary,Salary,income,3000.00',
      '2024-01-16,Gas Station,Transport,expense,45.00',
      '2024-01-16,Freelance Project,Freelance,income,500.00'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expenseflow_sample.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Import Transactions</h2>
              <p className="text-sm text-white/60 mt-1">
                Upload a CSV file to import your transactions
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Choose CSV File
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/30 transition-colors duration-200">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isImporting}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer block"
              >
                <svg className="w-8 h-8 text-white/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-white/60">
                  {isImporting ? 'Processing...' : 'Click to upload CSV file'}
                </span>
              </label>
            </div>
          </div>

          {/* CSV Format Info */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white/80 mb-2">Expected CSV Format:</h3>
            <div className="text-xs text-white/60 space-y-1">
              <div>Date,Title,Category,Type,Amount</div>
              <div className="text-white/40">• Date: YYYY-MM-DD format</div>
              <div className="text-white/40">• Type: "income" or "expense"</div>
              <div className="text-white/40">• Amount: Numeric value</div>
            </div>
          </div>

          {/* Sample Download */}
          <button
            onClick={downloadSampleCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Sample CSV
          </button>

          {/* Import Results */}
          {importResults && (
            <div className="space-y-3">
              {importResults.success > 0 && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm font-medium">
                    ✓ Successfully imported {importResults.success} transactions
                  </p>
                </div>
              )}
              
              {importResults.errors.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm font-medium mb-2">
                    Errors ({importResults.errors.length}):
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {importResults.errors.slice(0, 5).map((error, index) => (
                      <p key={index} className="text-red-400 text-xs">
                        {error}
                      </p>
                    ))}
                    {importResults.errors.length > 5 && (
                      <p className="text-red-400/60 text-xs">
                        ... and {importResults.errors.length - 5} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isImporting && (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
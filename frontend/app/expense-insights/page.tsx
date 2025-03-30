// app/expense-insights/page.tsx
'use client';

import React, { useState } from 'react';
import CSVUploader from './components/CSVUploader';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import { Transaction } from './utils/csvParser';
import logger from './utils/logger';

export default function ExpenseInsightsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  const handleDataLoaded = (data: Transaction[]) => {
    logger.info(`Loaded ${data.length} transactions`);
    setTransactions(data);
    setIsDataLoaded(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Expense Insights</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload your financial data to gain valuable insights into your spending habits
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* CSV Uploader */}
          <CSVUploader onDataLoaded={handleDataLoaded} />

          {isDataLoaded && (
            <div className="grid grid-cols-1 gap-8">
              {/* Expense Charts */}
              <ExpenseChart transactions={transactions} />
              
              {/* Transaction List */}
              <TransactionList transactions={transactions} />
            </div>
          )}

          {!isDataLoaded && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No data available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload a CSV file to analyze your financial transactions.
              </p>
              <p className="mt-4 text-xs text-gray-500">
                Expected CSV format: Date, Description, Category, Amount
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
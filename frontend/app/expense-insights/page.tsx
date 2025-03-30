// app/expense-insights/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CSVUploader from './components/CSVUploader';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import { Transaction } from './utils/csvParser';
import logger from './utils/logger';

export default function ExpenseInsightsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'charts' | 'transactions'>('charts');
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Add page load animation
    setIsPageLoaded(true);
  }, []);

  const handleDataLoaded = (data: Transaction[]) => {
    logger.info(`Loaded ${data.length} transactions`);
    setTransactions(data);
    setIsDataLoaded(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <header className="bg-white shadow-md">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </motion.button>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-[#101828] to-[#101828]">
              Expense Insights
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Upload your financial data to gain valuable insights into your spending habits
            </p>
          </div>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Upload Your Transaction Data</h2>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block"
              >
                <CSVUploader onDataLoaded={handleDataLoaded} />
              </motion.div>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">Expected CSV Format:</h4>
                <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                  Date, Description, Category, Amount
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Example: 2023-01-15, Coffee Shop, Dining, -4.50
                </p>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {isDataLoaded ? (
              <motion.div
                key="data-loaded"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      onClick={() => setActiveTab('charts')}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        activeTab === 'charts' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Charts & Insights
                    </button>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        activeTab === 'transactions' 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Transactions
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'charts' ? (
                      <motion.div
                        key="charts"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ExpenseChart transactions={transactions} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="transactions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TransactionList transactions={transactions} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Data Summary</h3>
                    <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                      {transactions.length} Transactions
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-500 font-medium">Total Expenses</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${transactions.reduce((sum, tx) => sum + (tx.amount < 0 ? Math.abs(tx.amount) : 0), 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-500 font-medium">Total Income</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${transactions.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-500 font-medium">Date Range</p>
                      <p className="text-md font-bold text-gray-900">
                        {new Date(Math.min(...transactions.map(t => new Date(t.date).getTime()))).toLocaleDateString()} - {' '}
                        {new Date(Math.max(...transactions.map(t => new Date(t.date).getTime()))).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="no-data"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12 bg-white rounded-lg shadow-md"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No transactions yet</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  Upload your CSV file using the form above to visualize spending patterns and gain insights.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </motion.div>
  );
}
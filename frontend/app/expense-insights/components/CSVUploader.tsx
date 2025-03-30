// app/expense-insights/components/CSVUploader.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseCSV } from '../utils/csvParser';
import logger from '../utils/logger';
import { Transaction } from '../utils/csvParser';
import { CheckCircle2, FileSpreadsheet, Upload, AlertCircle, Loader2 } from 'lucide-react';

interface CSVUploaderProps {
  onDataLoaded: (transactions: Transaction[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetState = () => {
    setIsSuccess(false);
    setError(null);
    setUploadProgress(0);
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const simulateProgress = () => {
    resetState();
    // Simulate upload progress
    progressTimerRef.current = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 200);
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const completeUpload = useCallback((success: boolean) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    
    // Animate to 100%
    setUploadProgress(100);
    
    // Show success state after a delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(success);
    }, 500);
  }, []);

  const processFile = async (file: File) => {
    // Check if it's a CSV file
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      logger.error(`Invalid file type uploaded: ${file.type}`);
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    simulateProgress();
    
    try {
      logger.info(`Processing CSV file: ${file.name} (${file.size} bytes)`);
      const transactions = await parseCSV(file);
      logger.info(`Successfully processed ${transactions.length} transactions`);
      onDataLoaded(transactions);
      completeUpload(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      logger.error(`Error processing CSV: ${errorMessage}`, err instanceof Error ? err : null);
      setError(`Failed to parse CSV: ${errorMessage}`);
      completeUpload(false);
    }
  };

  const resetUploader = () => {
    setFileName('');
    setIsSuccess(false);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div 
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
            ${isDragging ? 'bg-blue-50 border-blue-400 scale-105' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'}
            ${isSuccess ? 'bg-green-50 border-green-300' : ''}
            ${error ? 'bg-red-50 border-red-300' : ''}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
          />
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-4"
              >
                <div className="relative h-32 w-32 mb-4">
                  {/* Background circle */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress circle with stroke-dasharray animation */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: uploadProgress / 100 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        transformOrigin: "center",
                        rotate: "-90deg",
                        transform: "rotate(-90deg)",
                      }}
                    />
                  </svg>
                  {/* Percentage in the middle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span 
                      className="text-xl font-bold text-blue-500"
                      key={Math.floor(uploadProgress)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {Math.floor(uploadProgress)}%
                    </motion.span>
                  </div>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="bg-blue-100 rounded-full h-2 w-full max-w-md overflow-hidden mb-4"
                >
                  <motion.div
                    className="bg-blue-500 h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-medium text-gray-700"
                >
                  Processing {fileName}...
                </motion.p>
              </motion.div>
            ) : isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8"
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200,
                    damping: 20,
                    duration: 0.8 
                  }}
                >
                  <CheckCircle2 className="h-20 w-20 text-green-500 mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  CSV Processed Successfully!
                </motion.h3>
                <motion.p 
                  className="text-green-600 font-medium mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {fileName} has been loaded
                </motion.p>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetUploader();
                  }}
                  className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Upload Another File
                </motion.button>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <AlertCircle className="h-20 w-20 text-red-500 mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Oops! Something went wrong
                </motion.h3>
                <motion.p 
                  className="text-red-600 font-medium mb-4 max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {error}
                </motion.p>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetUploader();
                  }}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-6"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: isDragging ? [0, -5, 5, -5, 0] : 0
                  }}
                  transition={{ 
                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    rotate: { duration: 0.5 }
                  }}
                  className="relative mb-6"
                >
                  {isDragging ? (
                    <Upload className="h-20 w-20 text-blue-500" />
                  ) : (
                    <FileSpreadsheet className="h-20 w-20 text-gray-400" />
                  )}
                  
                  {isDragging && (
                    <motion.div
                      className="absolute -inset-1 rounded-full"
                      animate={{ 
                        boxShadow: ["0 0 0 0px rgba(59, 130, 246, 0.3)", "0 0 0 10px rgba(59, 130, 246, 0)"]
                      }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 1.5
                      }}
                    />
                  )}
                </motion.div>
                
                <motion.h3 
                  className={`text-xl font-bold mb-2 ${isDragging ? 'text-blue-600' : 'text-gray-800'}`}
                  animate={{ scale: isDragging ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isDragging ? 'Drop Your CSV File Here' : 'Drag & Drop Your CSV File Here'}
                </motion.h3>
                
                <motion.p 
                  className="text-sm text-gray-500 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  or click to browse files
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <Upload size={18} />
                    Browse Files
                  </motion.button>
                </motion.div>
                
                {fileName && (
                  <motion.p 
                    className="text-sm font-medium text-blue-500 mt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    Selected: {fileName}
                  </motion.p>
                )}
                
                <motion.div
                  className="grid grid-cols-4 gap-4 mt-8 max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {['Date', 'Description', 'Category', 'Amount'].map((col, i) => (
                    <motion.div 
                      key={col}
                      className="bg-gray-100 p-2 rounded text-xs font-medium text-gray-600"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      {col}
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.p 
                  className="text-xs text-gray-400 mt-6 max-w-xs text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Upload your financial data to get AI-powered insights on your spending patterns and budget recommendations
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Floating confetti animation when upload is successful */}
        <AnimatePresence>
          {isSuccess && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute"
                  initial={{ 
                    x: "50%", 
                    y: "50%",
                    opacity: 1
                  }}
                  animate={{
                    x: `${50 + (Math.random() * 100 - 50)}%`,
                    y: [
                      "50%", 
                      `${Math.random() * 30 - 80}%`
                    ],
                    opacity: [1, 0]
                  }}
                  transition={{
                    duration: 1 + Math.random() * 1.5,
                    ease: "easeOut",
                  }}
                  style={{
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                    backgroundColor: [
                      "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", 
                      "#EC4899", "#06B6D4", "#6366F1"
                    ][Math.floor(Math.random() * 8)],
                    borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CSVUploader;
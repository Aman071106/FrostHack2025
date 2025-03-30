// app/expense-insights/components/CSVUploader.tsx
'use client';

import React, { useState, useRef } from 'react';
import { parseCSV } from '../utils/csvParser';
import logger from '../utils/logger';
import { Transaction } from '../utils/csvParser';

interface CSVUploaderProps {
  onDataLoaded: (transactions: Transaction[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFile = async (file: File) => {
    // Check if it's a CSV file
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      logger.error(`Invalid file type uploaded: ${file.type}`);
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info(`Processing CSV file: ${file.name} (${file.size} bytes)`);
      const transactions = await parseCSV(file);
      logger.info(`Successfully processed ${transactions.length} transactions`);
      onDataLoaded(transactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      logger.error(`Error processing CSV: ${errorMessage}`, err instanceof Error ? err : null);
      setError(`Failed to parse CSV: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv"
          onChange={handleFileChange}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p>Processing {fileName}...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <p className="text-lg font-medium mb-1">Drag & Drop your CSV file here</p>
            <p className="text-sm text-gray-500 mb-3">or click to browse files</p>
            
            {fileName && <p className="text-sm font-medium text-blue-500">Selected: {fileName}</p>}
            {error && <p className="text-sm font-medium text-red-500 mt-2">{error}</p>}
            
            <p className="text-xs text-gray-400 mt-4">Expected format: Date, Description, Category, Amount</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVUploader;
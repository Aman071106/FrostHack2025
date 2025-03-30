// app/expense-insights/utils/csvParser.ts

import logger from './logger';

// Define transaction interface
export interface Transaction {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
}

// Define category summary interface for chart data
export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

/**
 * Parses a CSV file and extracts transaction data
 * Expected CSV format: Date,Description,Category,Amount
 */
export const parseCSV = async (file: File): Promise<Transaction[]> => {
  logger.info(`Starting to parse CSV file: ${file.name}`);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        logger.debug('File loaded successfully, beginning parsing');
        const content = event.target?.result as string;
        
        if (!content) {
          throw new Error('File content is empty');
        }
        
        // Split the content into lines
        const lines = content.split('\n');
        
        // Check for header row
        const header = lines[0].trim().toLowerCase();
        if (!header.includes('date') || !header.includes('amount')) {
          logger.error('Invalid CSV format, missing required headers');
          throw new Error('Invalid CSV format: missing required headers (date, amount)');
        }
        
        // Parse header columns to determine indexes
        const headers = header.split(',');
        const dateIndex = headers.findIndex(h => h.includes('date'));
        const descIndex = headers.findIndex(h => h.includes('description'));
        const catIndex = headers.findIndex(h => h.includes('category'));
        const amountIndex = headers.findIndex(h => h.includes('amount'));
        
        // Parse data rows
        const transactions: Transaction[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue; // Skip empty lines
          
          const fields = line.split(',');
          
          try {
            // Basic validation
            if (fields.length < 3) {
              logger.warn(`Skipping invalid line ${i}: insufficient fields`);
              continue;
            }
            
            // Parse date
            const dateStr = fields[dateIndex];
            const date = new Date(dateStr);
            
            if (isNaN(date.getTime())) {
              logger.warn(`Invalid date at line ${i}: ${dateStr}`);
              continue;
            }
            
            // Parse amount, removing currency symbols if present
            const amountStr = fields[amountIndex].replace(/[^-0-9.]/g, '');
            const amount = parseFloat(amountStr);
            
            if (isNaN(amount)) {
              logger.warn(`Invalid amount at line ${i}: ${fields[amountIndex]}`);
              continue;
            }
            
            // Create transaction object
            const transaction: Transaction = {
              id: `tx-${i}-${Date.now()}`, // Generate unique ID for each transaction
              date,
              description: fields[descIndex] || 'Unknown',
              category: fields[catIndex] || 'Uncategorized',
              amount
            };
            
            transactions.push(transaction);
          } catch (err) {
            logger.warn(`Error parsing line ${i}: ${err instanceof Error ? err.message : String(err)}`);
          }
        }
        
        logger.info(`Successfully parsed ${transactions.length} transactions`);
        logger.debug('First few transactions:', transactions.slice(0, 3));
        
        resolve(transactions);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to parse CSV file: ${errorMessage}`, error instanceof Error ? error : null);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      logger.error('Error reading CSV file', error instanceof Error ? error : new Error('Unknown error'));
      reject(error);
    };
    
    // Start reading the file
    reader.readAsText(file);
  });
};

/**
 * Analyzes transactions and generates category summaries for charts
 */
export const generateCategorySummary = (transactions: Transaction[]): CategorySummary[] => {
  logger.info('Generating category summary from transactions');
  
  // Group transactions by category and sum amounts
  const categorySums: Record<string, number> = {};
  let totalAmount = 0;
  
  transactions.forEach(transaction => {
    const amount = Math.abs(transaction.amount); // Use absolute value for calculating proportions
    const category = transaction.category || 'Uncategorized';
    
    if (!categorySums[category]) {
      categorySums[category] = 0;
    }
    
    categorySums[category] += amount;
    totalAmount += amount;
  });
  
  // Convert to array with percentages
  const summary: CategorySummary[] = Object.entries(categorySums).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0
  }));
  
  // Sort by amount descending
  summary.sort((a, b) => b.amount - a.amount);
  
  logger.debug(`Generated summary for ${summary.length} categories`, summary);
  
  return summary;
};
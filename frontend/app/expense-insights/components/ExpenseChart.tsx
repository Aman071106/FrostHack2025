// app/expense-insights/components/ExpenseChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Transaction, CategorySummary, generateCategorySummary } from '../utils/csvParser';
import logger from '../utils/logger';

interface ExpenseChartProps {
    transactions: Transaction[];
}

interface ChartData {
    data: { name: string; value: number }[];
    colors: string[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
    const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
    const [chartData, setChartData] = useState<ChartData>({ data: [], colors: [] });
    const [activeIndex, setActiveIndex] = useState<number>(0);

    // Colors for the different categories in the pie chart
    const categoryColors = [
        '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af',
        '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
        '#10b981', '#059669', '#047857', '#065f46',
        '#f59e0b', '#d97706', '#b45309', '#92400e',
        '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'
    ];

    useEffect(() => {
        if (transactions.length === 0) {
            return;
        }

        logger.info('Generating chart data from transactions');

        try {
            // Generate category summary data
            const summary = generateCategorySummary(transactions);
            setCategorySummary(summary);

            // Prepare data for pie chart
            const pieData = summary.map((item, index) => ({
                name: item.category,
                value: Math.round(item.amount * 100) / 100
            }));

            // Assign colors for each category
            const pieColors = summary.map((_, index) =>
                categoryColors[index % categoryColors.length]
            );

            setChartData({
                data: pieData,
                colors: pieColors
            });

            logger.debug('Chart data generated successfully', { pieData });
        } catch (error) {
            logger.error('Error generating chart data', error instanceof Error ? error : null);
        }
    }, [transactions]);

    // Format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Calculate total expense and income
    const totalStats = transactions.reduce(
        (acc, tx) => {
            if (tx.amount < 0) {
                acc.expenses += Math.abs(tx.amount);
            } else {
                acc.income += tx.amount;
            }
            return acc;
        },
        { expenses: 0, income: 0 }
    );

    // Generate SVG for pie chart
    const renderPieChart = () => {
        if (chartData.data.length === 0) return null;

        const size = 250;
        const radius = size / 2;
        const centerX = radius;
        const centerY = radius;

        // Calculate total for percentage
        const total = chartData.data.reduce((sum, item) => sum + item.value, 0);

        // Generate pie slices
        let currentAngle = 0;
        const slices = chartData.data.map((item, index) => {
            const value = item.value;
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const angleSize = (percentage / 100) * 360;

            // Calculate slice coordinates
            const startAngle = currentAngle;
            const endAngle = currentAngle + angleSize;

            const startRadians = (startAngle - 90) * Math.PI / 180;
            const endRadians = (endAngle - 90) * Math.PI / 180;

            const startX = centerX + radius * Math.cos(startRadians);
            const startY = centerY + radius * Math.sin(startRadians);

            const endX = centerX + radius * Math.cos(endRadians);
            const endY = centerY + radius * Math.sin(endRadians);

            // Large arc flag is 1 if angle > 180 degrees
            const largeArcFlag = angleSize > 180 ? 1 : 0;

            // Create SVG path for slice
            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                'Z'
            ].join(' ');

            // Update current angle for next slice
            currentAngle += angleSize;

            const isActive = index === activeIndex;

            return (
                <path
                    key={index}
                    d={pathData}
                    fill={chartData.colors[index]}
                    stroke="#fff"
                    strokeWidth="2"
                    className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    style={{ cursor: 'pointer' }}
                />
            );
        });

        // Return the SVG with pie chart
        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {slices}
            </svg>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Expense Analysis</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Overview of your spending by category
                </p>
            </div>

            {transactions.length > 0 ? (
                <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Summary stats */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-lg font-medium text-gray-700 mb-4">Financial Summary</h4>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Income:</span>
                                    <span className="text-green-600 font-medium">{formatCurrency(totalStats.income)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Expenses:</span>
                                    <span className="text-red-600 font-medium">{formatCurrency(totalStats.expenses)}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                    <span className="text-gray-800 font-medium">Net Balance:</span>
                                    <span className={`font-medium ${totalStats.income - totalStats.expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(totalStats.income - totalStats.expenses)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-700 mb-3">Top Categories</h4>
                                <div className="space-y-3">
                                    {categorySummary.slice(0, 5).map((category, index) => (
                                        <div key={index} className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: chartData.colors[index] }}
                                            ></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">{category.category}</span>
                                                    <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                    <div
                                                        className="h-1.5 rounded-full"
                                                        style={{
                                                            width: `${category.percentage}%`,
                                                            backgroundColor: chartData.colors[index]
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pie chart */}
                        <div className="flex flex-col items-center justify-center p-4">
                            {renderPieChart()}

                            {/* Legend for currently selected slice */}
                            {chartData.data.length > 0 && (
                                <div className="mt-4 text-center">
                                    <div
                                        className="inline-block w-4 h-4 rounded-full mr-2"
                                        style={{ backgroundColor: chartData.colors[activeIndex] }}
                                    ></div>
                                    <span className="text-gray-800 font-medium">{chartData.data[activeIndex]?.name || 'N/A'}</span>
                                    <p className="text-lg font-semibold mt-1">
                                        {formatCurrency(chartData.data[activeIndex]?.value || 0)}
                                        <span className="text-sm text-gray-500 ml-2">
                                            {(() => {
                                                const total = chartData.data.reduce((sum, item) => sum + item.value, 0);
                                                return total > 0
                                                    ? `${Math.round((chartData.data[activeIndex]?.value || 0) / total * 1000) / 10}%`
                                                    : '0%';
                                            })()}
                                        </span>

                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="px-4 py-12 sm:px-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="mt-4 text-gray-600">
                        Upload a CSV file to see your expense analytics
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExpenseChart;
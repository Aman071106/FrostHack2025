// app/expense-insights/components/ExpenseChart.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
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
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const chartRef = useRef<SVGSVGElement>(null);

    // Enhanced gradient colors for more visual appeal
    const categoryColors = [
        { main: '#3b82f6', highlight: '#60a5fa' },
        { main: '#ef4444', highlight: '#f87171' },
        { main: '#10b981', highlight: '#34d399' },
        { main: '#f59e0b', highlight: '#fbbf24' },
        { main: '#8b5cf6', highlight: '#a78bfa' },
        { main: '#ec4899', highlight: '#f472b6' },
        { main: '#06b6d4', highlight: '#22d3ee' },
        { main: '#14b8a6', highlight: '#2dd4bf' },
        { main: '#f97316', highlight: '#fb923c' },
        { main: '#6366f1', highlight: '#818cf8' },
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
            const pieData = summary.map((item) => ({
                name: item.category,
                value: Math.round(item.amount * 100) / 100
            }));

            // Assign colors for each category
            const pieColors = summary.map((_, index) =>
                categoryColors[index % categoryColors.length].main
            );

            setChartData({
                data: pieData,
                colors: pieColors
            });

            // Trigger animation
            setIsAnimating(true);
            animateChart();

            logger.debug('Chart data generated successfully', { pieData });
        } catch (error) {
            logger.error('Error generating chart data', error instanceof Error ? error : null);
        }
    }, [transactions]);

    // Animation function
    const animateChart = () => {
        setAnimationProgress(0);
        let start: number | null = null;
        const duration = 1200; // 1.2 seconds for animation

        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            setAnimationProgress(progress);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(step);
    };

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

    // Animate pie slice on hover
    const handleMouseEnter = (index: number) => {
        setActiveIndex(index);
    };

    // Generate SVG for pie chart with animations
    const renderPieChart = () => {
        if (chartData.data.length === 0) return null;

        const size = 280;
        const radius = size / 2 - 20; // Slightly smaller to add padding
        const innerRadius = radius * 0.5; // For donut chart effect
        const centerX = size / 2;
        const centerY = size / 2;

        // Calculate total for percentage
        const total = chartData.data.reduce((sum, item) => sum + item.value, 0);

        // Generate pie slices
        let currentAngle = 0;
        const progress = isAnimating ? animationProgress : 1;

        const slices = chartData.data.map((item, index) => {
            const value = item.value;
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const angleSize = (percentage / 100) * 360 * progress;

            // Calculate slice coordinates
            const startAngle = currentAngle;
            const endAngle = currentAngle + angleSize;

            const startRadians = (startAngle - 90) * Math.PI / 180;
            const endRadians = (endAngle - 90) * Math.PI / 180;

            // Calculate inner and outer points
            const outerStartX = centerX + radius * Math.cos(startRadians);
            const outerStartY = centerY + radius * Math.sin(startRadians);
            const outerEndX = centerX + radius * Math.cos(endRadians);
            const outerEndY = centerY + radius * Math.sin(endRadians);
            
            const innerStartX = centerX + innerRadius * Math.cos(startRadians);
            const innerStartY = centerY + innerRadius * Math.sin(startRadians);
            const innerEndX = centerX + innerRadius * Math.cos(endRadians);
            const innerEndY = centerY + innerRadius * Math.sin(endRadians);

            // Large arc flag is 1 if angle > 180 degrees
            const largeArcFlag = angleSize > 180 ? 1 : 0;

            // Calculate offset for "pulled out" effect when active
            const isActive = index === activeIndex;
            const offsetFactor = isActive ? 0.08 : 0;
            const midAngleRadians = (startAngle + angleSize / 2 - 90) * Math.PI / 180;
            const offsetX = offsetFactor * radius * Math.cos(midAngleRadians);
            const offsetY = offsetFactor * radius * Math.sin(midAngleRadians);

            // Create SVG path for slice (donut shape)
            const pathData = [
                `M ${innerStartX + offsetX} ${innerStartY + offsetY}`,
                `L ${outerStartX + offsetX} ${outerStartY + offsetY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerEndX + offsetX} ${outerEndY + offsetY}`,
                `L ${innerEndX + offsetX} ${innerEndY + offsetY}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX + offsetX} ${innerStartY + offsetY}`,
                'Z'
            ].join(' ');

            // Update current angle for next slice
            currentAngle += angleSize;

            // Create gradient ID
            const gradientId = `pieGradient-${index}`;
            
            return (
                <g key={index}>
                    <defs>
                        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor={categoryColors[index % categoryColors.length].highlight} />
                            <stop offset="100%" stopColor={chartData.colors[index]} />
                        </radialGradient>
                    </defs>
                    <path
                        d={pathData}
                        fill={`url(#${gradientId})`}
                        stroke="#fff"
                        strokeWidth="2"
                        onMouseEnter={() => handleMouseEnter(index)}
                        className={`transition-all duration-300 ${isActive ? 'opacity-100 filter drop-shadow-lg' : 'opacity-80'}`}
                        style={{ cursor: 'pointer', transition: 'transform 0.3s ease-out' }}
                    />
                    {/* Show percentage label for larger slices */}
                    {percentage > 10 && (
                        <text
                            x={centerX + (radius * 0.75) * Math.cos(midAngleRadians) + offsetX}
                            y={centerY + (radius * 0.75) * Math.sin(midAngleRadians) + offsetY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#ffffff"
                            fontSize="12"
                            fontWeight="bold"
                            className="pie-label"
                            style={{ opacity: progress }}
                        >
                            {Math.round(percentage)}%
                        </text>
                    )}
                </g>
            );
        });

        // Add center circle with stats
        const centerCircle = (
            <g>
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={innerRadius - 5}
                    fill="#ffffff"
                    className="filter drop-shadow-sm"
                />
                <text
                    x={centerX}
                    y={centerY - 15}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="10"
                >
                    SELECTED
                </text>
                <text
                    x={centerX}
                    y={centerY + 5}
                    textAnchor="middle"
                    fill="#111827"
                    fontSize="13"
                    fontWeight="bold"
                >
                    {chartData.data[activeIndex]?.name || 'N/A'}
                </text>
                <text
                    x={centerX}
                    y={centerY + 25}
                    textAnchor="middle"
                    fill={chartData.colors[activeIndex] || '#000'}
                    fontSize="14"
                    fontWeight="bold"
                >
                    {total > 0 ? Math.round((chartData.data[activeIndex]?.value || 0) / total * 100) : 0}%
                </text>
            </g>
        );

        // Return the SVG with pie chart
        return (
            <svg ref={chartRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="filter drop-shadow-xl">
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <g className={isAnimating ? 'animate-spin' : ''} style={{ transformOrigin: 'center', animationDuration: '15s' }}>
                    {slices}
                </g>
                {!isAnimating && centerCircle}
            </svg>
        );
    };

    // Render stats ticker with animated counting effect
    const StatTicker = ({ label, value, color }: { label: string, value: string, color: string }) => {
        return (
            <div className="flex justify-between items-center group transition-all duration-300 hover:bg-gray-50 p-2 rounded">
                <span className="text-gray-600 group-hover:font-medium transition-all">{label}</span>
                <span className={`font-medium ${color} transition-all group-hover:scale-110`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {value}
                </span>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/5">
                <h3 className="text-xl font-bold leading-6 text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Expense Analysis
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Interactive visualization of your spending by category
                </p>
            </div>

            {transactions.length > 0 ? (
                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pie chart section */}
                        <div className="flex flex-col items-center justify-center p-4 order-2 lg:order-1">
                            <div className="relative">
                                {renderPieChart()}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent to-white/5 rounded-full"></div>
                            </div>

                            {/* Legend for selected slice */}
                            {chartData.data.length > 0 && (
                                <div className="mt-6 text-center p-3 bg-gray-50 rounded-lg w-full transform transition-all duration-300 hover:scale-105">
                                    <div className="flex items-center justify-center mb-2">
                                        <div
                                            className="w-4 h-4 rounded-full mr-2"
                                            style={{ backgroundColor: chartData.colors[activeIndex] }}
                                        ></div>
                                        <span className="text-gray-800 font-medium">{chartData.data[activeIndex]?.name || 'N/A'}</span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(chartData.data[activeIndex]?.value || 0)}
                                    </p>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {(() => {
                                            const total = chartData.data.reduce((sum, item) => sum + item.value, 0);
                                            return total > 0
                                                ? `${Math.round((chartData.data[activeIndex]?.value || 0) / total * 1000) / 10}% of total expenses`
                                                : '0% of total expenses';
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary stats section */}
                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm order-1 lg:order-2">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Financial Summary
                            </h4>

                            <div className="space-y-4">
                                <StatTicker 
                                    label="Total Income"
                                    value={formatCurrency(totalStats.income)}
                                    color="text-green-600"
                                />
                                <StatTicker 
                                    label="Total Expenses"
                                    value={formatCurrency(totalStats.expenses)}
                                    color="text-red-600"
                                />

                                <div className="border-t border-gray-200 pt-4">
                                    <StatTicker 
                                        label="Net Balance"
                                        value={formatCurrency(totalStats.income - totalStats.expenses)}
                                        color={totalStats.income - totalStats.expenses >= 0 ? 'text-green-600' : 'text-red-600'}
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                    </svg>
                                    Top Categories
                                </h4>
                                <div className="space-y-4">
                                    {categorySummary.slice(0, 5).map((category, index) => (
                                        <div 
                                            key={index} 
                                            className="rounded-lg p-3 transition-all duration-300 hover:bg-gray-50 cursor-pointer"
                                            onMouseEnter={() => setActiveIndex(index)}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: chartData.colors[index] }}
                                                    ></div>
                                                    <span className="text-sm text-gray-700 font-medium">{category.category}</span>
                                                </div>
                                                <span className="text-sm font-bold">{formatCurrency(category.amount)}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${isAnimating ? category.percentage * animationProgress : category.percentage}%`,
                                                        backgroundColor: chartData.colors[index]
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="mt-1 text-xs text-right text-gray-500">
                                                {category.percentage.toFixed(1)}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="px-6 py-12 text-center">
                    <div className="bg-gray-50 rounded-xl p-8 flex flex-col items-center animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-gray-600 text-lg mb-2">
                            No transaction data available
                        </p>
                        <p className="text-gray-500 text-sm">
                            Upload a CSV file to visualize your spending patterns
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseChart;
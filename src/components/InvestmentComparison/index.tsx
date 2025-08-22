import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { INVESTMENT_COMPARISONS } from '@/constants/ui';
import { motion } from 'framer-motion';

interface InvestmentComparisonProps {
  xirr: number;
  isLoading?: boolean;
}

const getBarColor = (name: string): string => {
  const colors: Record<string, string> = {
    'Your Chitti': '#8B5CF6', // A distinct purple
    'Large Cap Stocks': '#3B82F6', // Blue
    'Mid Cap Stocks': '#06B6D4', // Cyan
    'Small Cap Stocks': '#10B981', // Emerald
    'Gold': '#F59E0B', // Amber
    'Fixed Deposit': '#6B7280' // Gray
  };
  return colors[name] || '#8884d8'; // Default purple
};

const InvestmentComparison: React.FC<InvestmentComparisonProps> = ({ xirr, isLoading = false }) => {
  const data = useMemo(() => [
    {
      name: 'Your Chitti',
      returns: xirr * 100,
      icon: '🎯'
    },
    ...INVESTMENT_COMPARISONS.map(comp => ({
      name: comp.name,
      returns: comp.returnRate * 100,
      icon: comp.icon
    }))
  ].sort((a, b) => b.returns - a.returns), [xirr]);

  if (isLoading) {
    return (
      <div className="h-[300px] sm:h-[400px] md:h-[450px] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-lg w-full max-w-5xl mx-auto overflow-x-auto"
    >
      <h3 className="text-lg font-semibold mb-4 text-center">
        Compare your returns with popular investment options ✨
      </h3>
      <div className="min-w-[300px] md:min-w-0">
        <ResponsiveContainer width="100%" height={data.length * 50}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
            <XAxis 
              type="number" 
              domain={[0, 'auto']}
              tickFormatter={(value) => `${value}%`}
              className="text-xs md:text-sm"
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tickLine={false} 
              axisLine={false}
              tick={({ x, y, payload }) => {
                const entry = data.find(item => item.name === payload.value);
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text 
                      x={-5} 
                      y={0} 
                      dy={5} 
                      textAnchor="end" 
                      fill="#4A5568" 
                      fontSize={12}
                      fontWeight="bold"
                    >
                      <tspan>{entry?.icon} </tspan>
                      <tspan>{payload.value}</tspan>
                    </text>
                  </g>
                );
              }}
              width={120}
            />
            <Bar 
              dataKey="returns" 
              fill="#8884d8"
              barSize={20} 
              radius={[0, 10, 10, 0]}
              label={{
                position: 'right',
                formatter: (value: number) => `${value.toFixed(1)}%`,
                fill: '#4b5563',
                fontSize: 12,
                fontWeight: 600,
                dx: 4
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default InvestmentComparison; 
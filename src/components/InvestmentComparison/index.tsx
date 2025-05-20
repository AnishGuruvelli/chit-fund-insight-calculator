import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { INVESTMENT_COMPARISONS } from '@/constants/ui';
import { motion } from 'framer-motion';

interface InvestmentComparisonProps {
  xirr: number;
  isLoading?: boolean;
}

const getBarColor = (name: string) => {
  const colors = {
    'Your Chitti': 'url(#chittiGradient)',
    'Large Cap Stocks': 'url(#largeCapGradient)',
    'Mid Cap Stocks': 'url(#midCapGradient)',
    'Small Cap Stocks': 'url(#smallCapGradient)',
    'Gold': 'url(#goldGradient)',
    'Fixed Deposit': 'url(#fdGradient)'
  };
  return colors[name] || 'url(#defaultGradient)';
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
      className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-lg w-full max-w-5xl mx-auto"
    >
      <div className="h-[300px] sm:h-[400px] md:h-[450px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ 
              top: 10,
              right: 16,
              left: 16,
              bottom: 10
            }}
            barSize={30}
          >
            <defs>
              <linearGradient id="chittiGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="50%" stopColor="#e879f9" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
              <linearGradient id="largeCapGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="midCapGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="smallCapGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#a3e635" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fcd34d" />
              </linearGradient>
              <linearGradient id="fdGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6b7280" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="100%" stopColor="#d1d5db" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <XAxis 
              type="number" 
              domain={[0, 'auto']}
              tickFormatter={(value) => `${value}%`}
              fontSize={12}
              tick={{ fill: '#4b5563', fontWeight: 500 }}
              stroke="#e5e7eb"
              tickCount={5}
              axisLine={false}
              tickLine={false}
              padding={{ left: 0, right: 0 }}
              hide={window.innerWidth < 640} // Hide on mobile
            />
            <YAxis
              type="category"
              dataKey="name"
              width={window.innerWidth < 640 ? 100 : 120}
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  <text 
                    x={-8}
                    y={0} 
                    dy={4} 
                    textAnchor="end" 
                    fill="#4b5563"
                    fontSize={window.innerWidth < 640 ? 12 : 13}
                    className="font-medium"
                  >
                    <tspan fontSize={window.innerWidth < 640 ? 14 : 16}>{data[payload.index].icon}</tspan>{' '}
                    <tspan className="font-semibold">{payload.value}</tspan>
                  </text>
                </g>
              )}
              stroke="#e5e7eb"
            />
            <Bar
              dataKey="returns"
              fill={(entry) => getBarColor(entry.name)}
              radius={[4, 4, 4, 4]}
              label={{
                position: 'right',
                formatter: (value: number) => `${value.toFixed(1)}%`,
                fill: '#4b5563',
                fontSize: window.innerWidth < 640 ? 12 : 13,
                fontWeight: 600,
                dx: 4
              }}
              style={{ filter: 'url(#glow)' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 sm:mt-6 text-center px-2"
      >
        <motion.p 
          className="text-sm sm:text-base text-purple-600 font-medium"
          whileHover={{ scale: 1.05 }}
        >
          ✨ Compare your returns with popular investment options ✨
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(InvestmentComparison); 
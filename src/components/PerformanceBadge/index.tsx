import React from 'react';
import { PERFORMANCE_LEVELS } from '@/constants/ui';
import { motion } from 'framer-motion';

interface PerformanceBadgeProps {
  xirr: number;
}

const PerformanceBadge: React.FC<PerformanceBadgeProps> = ({ xirr }) => {
  const performance = PERFORMANCE_LEVELS.find(
    level => xirr >= level.threshold
  ) || PERFORMANCE_LEVELS[PERFORMANCE_LEVELS.length - 1];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`${performance.color} text-white rounded-lg p-6 shadow-lg`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{performance.icon}</span>
        <h3 className="text-xl font-bold">{performance.label}</h3>
      </div>
      
      <p className="text-white/90 mb-4">
        {performance.description}
      </p>
      
      <div className="text-2xl font-bold">
        {(xirr * 100).toFixed(2)}% XIRR
      </div>
      
      {xirr > 0.12 && (
        <div className="mt-4 text-sm bg-white/20 rounded p-2">
          💡 This beats most traditional investment options!
        </div>
      )}
    </motion.div>
  );
};

export default PerformanceBadge; 

import React from "react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChitFundResultsChartProps {
  cashFlows: { date: Date; amount: number }[];
}

const ChitFundResultsChart: React.FC<ChitFundResultsChartProps> = ({ cashFlows }) => {
  // Prepare chart data
  const chartData = cashFlows.map((cf) => ({
    date: format(cf.date, "MMM yy"),
    amount: cf.amount,
    // Add a flag for positive/negative amounts
    isPositive: cf.amount >= 0
  }));

  return (
    <div className="w-full h-40 mt-2">
      <h3 className="text-base font-medium mb-1">Cash Flow Chart</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 15 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            angle={-45} 
            textAnchor="end" 
            height={50}
            fontSize={8} 
          />
          <YAxis fontSize={8} />
          <RechartsTooltip 
            formatter={(value) => [`₹${parseFloat(value.toString()).toLocaleString()}`, "Amount"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Bar dataKey="amount" name="Amount">
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isPositive ? "#8B5CF6" : "#9333EA"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChitFundResultsChart;

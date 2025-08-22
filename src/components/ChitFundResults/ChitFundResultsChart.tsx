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
  ReferenceLine,
} from "recharts";

interface ChitFundResultsChartProps {
  cashFlows: { date: Date; amount: number }[];
}

const ChitFundResultsChart: React.FC<ChitFundResultsChartProps> = ({ cashFlows }) => {
  // Prepare chart data
  const chartData = cashFlows.map((cf) => ({
    date: format(cf.date, "MMM yy"),
    amount: cf.amount,
    isPositive: cf.amount >= 0,
    formattedAmount: `₹${Math.abs(cf.amount).toLocaleString()}`,
    type: cf.amount >= 0 ? "Received" : "Paid"
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ payload: { date: string; amount: number; isPositive: boolean; formattedAmount: string; type: string } }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">
            <span className={data.isPositive ? "text-green-600" : "text-purple-600"}>
              {data.type}: {data.formattedAmount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Cash Flow Chart</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-600 rounded-sm mr-1" />
            <span>Paid</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-1" />
            <span>Received</span>
          </div>
        </div>
      </div>
      
      <div className="h-40">
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
              tickMargin={5}
            />
            <YAxis 
              fontSize={8}
              tickFormatter={(value) => `₹${Math.abs(value / 1000)}K`}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            <Bar dataKey="amount" name="Amount">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isPositive ? "#22C55E" : "#7C3AED"} 
                  opacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChitFundResultsChart;

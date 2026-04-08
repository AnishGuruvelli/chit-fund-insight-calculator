import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { INVESTMENT_COMPARISONS } from "@/constants/ui";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvestmentComparisonProps {
  xirr: number;
  isLoading?: boolean;
  minimal?: boolean;
}

const getBarColor = (name: string): string => {
  const colors: Record<string, string> = {
    "Your Chitti": "#8B5CF6",
    "Large Cap Stocks": "#3B82F6",
    "Mid Cap Stocks": "#06B6D4",
    "Small Cap Stocks": "#10B981",
    Gold: "#F59E0B",
    "Fixed Deposit": "#6B7280",
  };
  return colors[name] || "#8884d8";
};

const InvestmentComparison: React.FC<InvestmentComparisonProps> = ({ xirr, isLoading = false, minimal = false }) => {
  const isMobile = useIsMobile();
  const axisTextColor = "hsl(var(--muted-foreground))";
  const valueTextColor = "hsl(var(--foreground))";
  const data = useMemo(
    () =>
      [
        {
          name: "Your Chitti",
          returns: xirr * 100,
          icon: "🎯",
        },
        ...INVESTMENT_COMPARISONS.map((comp) => ({
          name: comp.name,
          returns: comp.returnRate * 100,
          icon: comp.icon,
        })),
      ].sort((a, b) => b.returns - a.returns),
    [xirr]
  );
  // Use a stable top range so benchmarks remain readable even when your XIRR is very high.
  const maxReturn = Math.max(...data.map((d) => d.returns), 1);
  const chartUpperBound = Math.max(30, Math.ceil(maxReturn / 5) * 5);

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
      className={
        minimal
          ? "text-foreground p-0 w-full max-w-5xl mx-auto overflow-hidden min-w-0"
          : "bg-card text-foreground rounded-lg p-3 sm:p-4 md:p-6 shadow-lg border border-border w-full max-w-5xl mx-auto overflow-hidden min-w-0"
      }
    >
      <h3 className={`text-base sm:text-lg font-semibold mb-4 text-center leading-snug text-foreground ${minimal ? "mt-1" : ""}`}>
        Compare your returns with popular investment options ✨
      </h3>
      {isMobile ? (
        <div className="space-y-3">
          {data.map((entry) => {
            const widthPct = Math.max((entry.returns / chartUpperBound) * 100, 14);
            return (
              <div key={entry.name} className="space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-foreground truncate">
                    {entry.icon} {entry.name}
                  </span>
                  <span className="font-semibold tabular-nums text-foreground shrink-0">
                    {entry.returns.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${widthPct}%`, backgroundColor: getBarColor(entry.name) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full min-w-0">
          <ResponsiveContainer width="100%" height={data.length * 50}>
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 36 }}>
              <XAxis
                type="number"
                domain={[0, chartUpperBound]}
                ticks={[0, 5, 10, 15, 20, 25, 30, chartUpperBound].filter((v, i, arr) => arr.indexOf(v) === i)}
                tickFormatter={(value) => `${value}%`}
                className="text-xs"
              />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={({ x, y, payload }) => {
                  const entry = data.find((item) => item.name === payload.value);
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text x={-5} y={0} dy={5} textAnchor="end" fill={axisTextColor} fontSize={12} fontWeight="bold">
                        <tspan>{entry?.icon} </tspan>
                        <tspan>{payload.value}</tspan>
                      </text>
                    </g>
                  );
                }}
                width={130}
              />
              <Bar
                dataKey="returns"
                fill="#8884d8"
                barSize={20}
                radius={[0, 10, 10, 0]}
                label={{
                  position: "right",
                  formatter: (value: number) => `${value.toFixed(1)}%`,
                  fill: valueTextColor,
                  fontSize: 12,
                  fontWeight: 600,
                  dx: 4,
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="mt-4 text-xs text-center text-muted-foreground leading-relaxed max-w-2xl mx-auto">
        Reference rates are illustrative long-term averages, not live quotes or guarantees. Markets and bank rates change; use this chart for context, not as investment advice.
      </p>
    </motion.div>
  );
};

export default InvestmentComparison; 
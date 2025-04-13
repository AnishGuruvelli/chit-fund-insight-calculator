
import React from "react";
import { format } from "date-fns";
import { ArrowLeft, Share, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChitFundResultsProps {
  result: {
    xirr: number;
    cashFlows: { date: Date; amount: number }[];
  };
  inputData: {
    payableAmount: number;
    durationMonths: number;
    receivedAmount: number;
    startDate: Date;
    totalPaid: number;
  };
  onBack: () => void;
  onShare: () => void;
  onDownload: () => void;
}

const ChitFundResults: React.FC<ChitFundResultsProps> = ({
  result,
  inputData,
  onBack,
  onShare,
  onDownload,
}) => {
  const xirrPercentage = (result.xirr * 100).toFixed(2);
  const isPositive = result.xirr > 0;

  // Prepare chart data
  const chartData = result.cashFlows.map((cf) => ({
    date: format(cf.date, "MMM yy"),
    amount: cf.amount,
    // Add a flag for positive/negative amounts
    isPositive: cf.amount >= 0
  }));

  // Style the XIRR result based on value
  const getXirrStyle = () => {
    if (result.xirr >= 0.15) return "text-green-600";
    if (result.xirr >= 0.08) return "text-green-500";
    if (result.xirr >= 0) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="w-full shadow-lg border-purple-200/20 overflow-hidden animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Calculation Results</CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        <CardDescription className="text-white/90">
          IRR calculation based on your chit fund data
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 pb-3 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Extended Internal Rate of Return (XIRR)</h3>
          <div className={`text-5xl font-bold ${getXirrStyle()}`}>
            {xirrPercentage}%
          </div>
          <Badge variant={isPositive ? "default" : "destructive"} className="mt-2">
            {isPositive ? "Positive Return" : "Negative Return"}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Input Summary</h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-gray-500">Payable Amount Every Month:</div>
            <div className="text-right font-medium">₹{inputData.payableAmount.toLocaleString()}</div>
            
            <div className="text-gray-500">Duration:</div>
            <div className="text-right font-medium">{inputData.durationMonths} months</div>
            
            <div className="text-gray-500">Received Amount at the end:</div>
            <div className="text-right font-medium">₹{inputData.receivedAmount.toLocaleString()}</div>
            
            <div className="text-gray-500">Start Date:</div>
            <div className="text-right font-medium">{format(inputData.startDate, "PPP")}</div>
            
            <div className="text-gray-500">Total Amount Paid:</div>
            <div className="text-right font-medium">₹{inputData.totalPaid.toLocaleString()}</div>
          </div>
        </div>

        <div className="w-full h-48 mt-4">
          <h3 className="text-lg font-medium mb-2">Cash Flow Chart</h3>
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
                fontSize={10} 
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${parseFloat(value.toString()).toLocaleString()}`, "Amount"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar 
                dataKey="amount" 
                fill="#1E88E5"
                name="Amount"
              >
                {/* Use Cell components to color bars based on positive/negative values */}
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isPositive ? "#8B5CF6" : "#9333EA"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-4 space-x-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onShare}
        >
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChitFundResults;


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
import { ChitFundResult, ChitFundInputData } from "@/components/ChitFundCalculator/types";
import ChitFundResultsChart from "./ChitFundResultsChart";

interface ChitFundResultsProps {
  result: ChitFundResult;
  inputData: ChitFundInputData;
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
          <CardTitle className="text-xl font-bold">Calculation Results</CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </div>
        <CardDescription className="text-white/90">
          IRR calculation based on your chit fund data
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 pb-2 space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Extended Internal Rate of Return (XIRR)</h3>
          <div className={`text-4xl font-bold ${getXirrStyle()}`}>
            {xirrPercentage}%
          </div>
          <Badge variant={isPositive ? "default" : "destructive"} className="mt-1">
            {isPositive ? "Positive Return" : "Negative Return"}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-base font-medium">Input Summary</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
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

        <ChitFundResultsChart cashFlows={result.cashFlows} />
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-3 space-x-2">
        <Button
          variant="outline"
          className="flex-1 text-xs"
          onClick={onShare}
        >
          <Share className="h-3 w-3 mr-1" />
          Share
        </Button>
        <Button
          variant="outline"
          className="flex-1 text-xs"
          onClick={onDownload}
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChitFundResults;

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
import PerformanceBadge from "../PerformanceBadge";
import InvestmentComparison from "../InvestmentComparison";
import ShareResults from "../ShareResults";
import { XirrExplainer } from "@/components/XirrExplainer";
import { AnimatedXirr } from "@/components/AnimatedXirr";
import { ResultContextTip } from "@/components/ResultContextTip";

interface ChitFundResultsProps {
  result: ChitFundResult;
  inputData: ChitFundInputData;
  onBack: () => void;
  onShare: () => void;
  onDownload: () => void;
  /** Side-by-side compare: slimmer card without benchmark sections */
  compact?: boolean;
  schemeLabel?: string;
  backButtonLabel?: string;
}

const ChitFundResults: React.FC<ChitFundResultsProps> = ({
  result,
  inputData,
  onBack,
  onShare,
  onDownload,
  compact = false,
  schemeLabel,
  backButtonLabel = "Back",
}) => {
  const xirrPercentage = (result.xirr * 100).toFixed(2);
  const isPositive = result.xirr > 0;

  const getXirrAnalysis = () => {
    if (result.xirr >= 0.2) return { color: "text-green-600", message: "Excellent Return" };
    if (result.xirr >= 0.15) return { color: "text-green-500", message: "Good Return" };
    if (result.xirr >= 0.1) return { color: "text-yellow-500", message: "Moderate Return" };
    if (result.xirr >= 0.05) return { color: "text-yellow-600", message: "Low Return" };
    if (result.xirr >= 0) return { color: "text-orange-500", message: "Minimal Return" };
    return { color: "text-red-500", message: "Negative Return" };
  };

  const xirrAnalysis = getXirrAnalysis();

  const totalProfit = inputData.receivedAmount - inputData.totalPaid;
  const profitPercentage = ((totalProfit / inputData.totalPaid) * 100).toFixed(2);

  const shareData = {
    monthlyAmount: inputData.payableAmount,
    duration: inputData.durationMonths,
    receivedAmount: inputData.receivedAmount,
    xirr: result.xirr,
    appLink: typeof window !== "undefined" ? window.location.href : "",
  };

  const journeySummary = `You invested ₹${inputData.payableAmount.toLocaleString()} per month for ${inputData.durationMonths} months (₹${inputData.totalPaid.toLocaleString()} total), then received ₹${inputData.receivedAmount.toLocaleString()}.`;

  return (
    <Card className="w-full shadow-lg border-purple-200/20 dark:border-purple-900/40 overflow-hidden animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-t-lg">
        <div className="flex justify-between items-center gap-2">
          <CardTitle className="text-xl font-bold">
            {schemeLabel ? `${schemeLabel} — results` : "Calculation Results"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 shrink-0">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {backButtonLabel}
          </Button>
        </div>
        <CardDescription className="text-white/90">
          {compact ? "Key figures for this scheme" : "Detailed analysis of your chit fund investment"}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 pb-2 space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Extended Internal Rate of Return (XIRR)</h3>
          <div className={`text-4xl font-bold ${xirrAnalysis.color}`} aria-live="polite">
            <AnimatedXirr key={`${result.xirr}-${inputData.totalPaid}`} xirrDecimal={result.xirr} className={xirrAnalysis.color} />
          </div>
          <span className="sr-only">XIRR {xirrPercentage} percent</span>
          <Badge variant={isPositive ? "default" : "destructive"} className={`mt-1 ${xirrAnalysis.color}`}>
            {xirrAnalysis.message}
          </Badge>

          <div className="mt-2 text-sm">
            <span className={`font-medium ${totalProfit >= 0 ? "text-green-600" : "text-red-500"}`}>
              {totalProfit >= 0 ? "Profit" : "Loss"}: ₹{Math.abs(totalProfit).toLocaleString()}
            </span>
            <span className="text-muted-foreground ml-2">
              ({totalProfit >= 0 ? "+" : ""}
              {profitPercentage}%)
            </span>
          </div>
        </div>

        {!compact && <XirrExplainer />}

        <ResultContextTip xirr={result.xirr} />

        <Separator />

        <div className="space-y-3">
          <h3 className="text-base font-medium">Investment Summary</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-muted-foreground">Monthly Payment:</div>
            <div className="text-right font-medium">₹{inputData.payableAmount.toLocaleString()}</div>

            <div className="text-muted-foreground">Duration:</div>
            <div className="text-right font-medium">{inputData.durationMonths} months</div>

            <div className="text-muted-foreground">Total Investment:</div>
            <div className="text-right font-medium">₹{inputData.totalPaid.toLocaleString()}</div>

            <div className="text-muted-foreground">Amount Received:</div>
            <div className="text-right font-medium">₹{inputData.receivedAmount.toLocaleString()}</div>

            <div className="text-muted-foreground">Start Date:</div>
            <div className="text-right font-medium">{format(inputData.startDate, "PPP")}</div>

            <div className="text-muted-foreground">End Date:</div>
            <div className="text-right font-medium">
              {format(
                (() => {
                  const endDate = new Date(inputData.startDate);
                  endDate.setMonth(endDate.getMonth() + inputData.durationMonths - 1);
                  return endDate;
                })(),
                "PPP"
              )}
            </div>
          </div>
        </div>

        {!compact && <PerformanceBadge xirr={result.xirr} />}

        {!compact && <InvestmentComparison xirr={result.xirr} />}

        {!compact && <ShareResults data={shareData} />}

        <p className="text-sm text-center text-muted-foreground leading-relaxed px-1">{journeySummary}</p>

        <ChitFundResultsChart
          cashFlows={result.cashFlows}
          chartClassName={compact ? "h-40 min-h-[10rem] md:h-44" : undefined}
        />

        <div className="mt-4 text-xs text-muted-foreground">
          <p className="text-center">
            * XIRR considers the timing of cash flows to calculate the effective annual return rate
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 pb-3 space-x-2">
        <Button variant="outline" className="flex-1 text-xs" onClick={onShare}>
          <Share className="h-3 w-3 mr-1" />
          Share Results
        </Button>
        <Button variant="outline" className="flex-1 text-xs" onClick={onDownload}>
          <Download className="h-3 w-3 mr-1" />
          Download Data
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChitFundResults;

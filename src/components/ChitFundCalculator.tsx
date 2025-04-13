
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, HelpCircle, Share, Download } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ChitFundResults from "./ChitFundResults";

const ChitFundCalculator: React.FC = () => {
  const [payableAmount, setPayableAmount] = useState<string>("");
  const [durationMonths, setDurationMonths] = useState<string>("20");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{
    xirr: number;
    cashFlows: { date: Date; amount: number }[];
  } | null>(null);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);

  // Generate cash flows helper function
  const generateCashFlows = (
    monthlyPayment: number,
    lumpSumReceived: number,
    months: number,
    startDate: Date
  ): Array<{ amount: number; date: Date }> => {
    const flows: Array<{ amount: number; date: Date }> = [];

    // Add monthly negative payments
    for (let i = 0; i < months; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      flows.push({
        amount: -monthlyPayment,
        date,
      });
    }

    // Add positive lump sum at the end
    const finalDate = new Date(startDate);
    finalDate.setMonth(finalDate.getMonth() + months - 1);
    flows.push({
      amount: lumpSumReceived,
      date: finalDate,
    });

    return flows;
  };

  // Calculate XIRR using the Newton-Raphson method
  const calculateXIRR = (cashFlows: Array<{ amount: number; date: Date }>): number => {
    if (cashFlows.length < 2) {
      throw new Error("At least two cash flows are required");
    }

    // Extract values and dates
    const values = cashFlows.map(cf => cf.amount);
    const dates = cashFlows.map(cf => cf.date);

    // Convert dates to days from first date
    const dayDiffs: number[] = dates.map(date => {
      return (date.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24);
    });

    // Newton-Raphson method to find the root
    let guess = 0.1; // Initial guess
    const maxIterations = 100;
    const tolerance = 0.0000001;

    let iteration = 0;
    
    while (iteration < maxIterations) {
      // Evaluate function and derivative
      let f = 0;
      let df = 0;
      
      for (let i = 0; i < values.length; i++) {
        const dayDiff = dayDiffs[i];
        const factor = Math.pow(1 + guess, dayDiff);
        f += values[i] / factor;
        df -= (dayDiff * values[i]) / (factor * (1 + guess));
      }
      
      if (Math.abs(f) < tolerance) {
        // Converged to a solution
        break;
      }
      
      // Update guess using Newton-Raphson formula
      const newGuess = guess - f / df;
      
      if (Math.abs(newGuess - guess) < tolerance) {
        // Converged to a solution
        guess = newGuess;
        break;
      }
      
      guess = newGuess;
      iteration++;
    }

    // Convert from daily rate to annual rate
    return Math.pow(1 + guess, 365) - 1;
  };

  const handleCalculate = () => {
    try {
      // Form validation
      if (!payableAmount || !durationMonths || !receivedAmount) {
        toast.error("Please fill in all fields");
        return;
      }

      const payable = parseFloat(payableAmount);
      const duration = parseInt(durationMonths);
      const received = parseFloat(receivedAmount);

      if (isNaN(payable) || isNaN(duration) || isNaN(received)) {
        toast.error("Please enter valid numbers");
        return;
      }

      if (payable <= 0 || duration <= 0 || received <= 0) {
        toast.error("All values must be positive numbers");
        return;
      }

      setIsCalculating(true);
      
      // Calculate total paid amount
      const totalAmountPaid = payable * duration;
      setTotalPaid(totalAmountPaid);

      // Simulate a calculation delay for UX
      setTimeout(() => {
        try {
          // Generate cash flows
          const flows = generateCashFlows(payable, received, duration, startDate);
          console.log("Generated cash flows:", flows);
          
          // Calculate XIRR
          const xirrValue = calculateXIRR(flows);
          console.log("Calculated XIRR:", xirrValue);
          
          setResult({
            xirr: xirrValue,
            cashFlows: flows
          });
        } catch (error) {
          console.error("Calculation error:", error);
          toast.error("An error occurred during calculation");
        } finally {
          setIsCalculating(false);
        }
      }, 800);
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("An error occurred during calculation");
      setIsCalculating(false);
    }
  };

  const resetCalculation = () => {
    setResult(null);
    setTotalPaid(null);
  };

  const handleShare = () => {
    if (result) {
      const text = `Chit Fund XIRR: ${(result.xirr * 100).toFixed(2)}%
Total Paid: ₹${totalPaid?.toLocaleString()}
Payable Amount Every Month: ₹${payableAmount}
Duration: ${durationMonths} months
Received Amount at the end: ₹${receivedAmount}
Start Date: ${format(startDate, "PP")}`;

      if (navigator.share) {
        navigator.share({
          title: "Chit Fund XIRR Result",
          text: text,
        }).catch(err => {
          console.error("Share error:", err);
          toast.error("Couldn't share results");
        });
      } else {
        navigator.clipboard.writeText(text).then(() => {
          toast.success("Results copied to clipboard");
        });
      }
    }
  };

  const handleDownload = () => {
    if (result) {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Date,Cash Flow\n" 
        + result.cashFlows.map(cf => 
            `${format(cf.date, "yyyy-MM-dd")},${cf.amount.toFixed(2)}`
          ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "chit_fund_cash_flows.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Cash flow data downloaded");
    }
  };

  // Generate month options for every month from 1 to 60
  const monthOptions = [];
  for (let i = 1; i <= 60; i++) {
    monthOptions.push(
      <SelectItem key={i} value={i.toString()}>
        {i} months
      </SelectItem>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {!result ? (
        <Card className="w-full shadow-lg border-purple-200/20">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Chit Fund IRR Calculator</CardTitle>
            <CardDescription className="text-white/90">
              Calculate the Extended Internal Rate of Return (XIRR)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-3 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="payable-amount" className="text-sm font-medium">
                  Payable Amount Every Month
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60">
                      <p>Enter the amount you pay monthly for the chit fund.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="payable-amount"
                  placeholder="10000"
                  className="pl-8"
                  value={payableAmount}
                  onChange={(e) => setPayableAmount(e.target.value)}
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="duration" className="text-sm font-medium">
                  Duration in Months
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60">
                      <p>Select the total duration of the chit fund in months.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={durationMonths}
                onValueChange={setDurationMonths}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>{monthOptions}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="received-amount" className="text-sm font-medium">
                  Received Amount at the end
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60">
                      <p>Enter the amount you received or will receive from the chit fund at the end.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="received-amount"
                  placeholder="180000"
                  className="pl-8"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="start-date" className="text-sm font-medium">
                  Start Date
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="w-60">
                      <p>Select the date when you started the chit fund.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-4">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 transition-all transform hover:scale-[0.99] text-white py-6"
              onClick={handleCalculate}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Calculating...
                </>
              ) : (
                "Calculate XIRR"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <ChitFundResults 
          result={result} 
          onBack={resetCalculation} 
          onShare={handleShare}
          onDownload={handleDownload}
          inputData={{
            payableAmount: parseFloat(payableAmount),
            durationMonths: parseInt(durationMonths),
            receivedAmount: parseFloat(receivedAmount),
            startDate,
            totalPaid: totalPaid || 0
          }}
        />
      )}
    </div>
  );
};

export default ChitFundCalculator;

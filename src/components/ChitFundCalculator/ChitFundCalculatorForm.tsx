
import React from "react";
import { format } from "date-fns";
import { CalendarIcon, HelpCircle } from "lucide-react";
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

interface ChitFundCalculatorFormProps {
  payableAmount: string;
  setPayableAmount: (value: string) => void;
  durationMonths: string;
  setDurationMonths: (value: string) => void;
  receivedAmount: string;
  setReceivedAmount: (value: string) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  isCalculating: boolean;
  handleCalculate: () => void;
}

const ChitFundCalculatorForm: React.FC<ChitFundCalculatorFormProps> = ({
  payableAmount,
  setPayableAmount,
  durationMonths,
  setDurationMonths,
  receivedAmount,
  setReceivedAmount,
  startDate,
  setStartDate,
  isCalculating,
  handleCalculate
}) => {
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
  );
};

export default ChitFundCalculatorForm;

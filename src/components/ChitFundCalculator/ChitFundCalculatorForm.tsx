import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChittiTerms } from "@/types/ui";
import { format, subYears } from "date-fns";
import { CalendarIcon, HelpCircle } from "lucide-react";
import React from "react";

const QUICK_AMOUNTS = [5_000, 10_000, 25_000, 50_000, 100_000];

export type FormFieldKey = "payableAmount" | "durationMonths" | "receivedAmount" | "startDate";

export interface FormErrors {
  payableAmount?: string;
  durationMonths?: string;
  receivedAmount?: string;
  startDate?: string;
}

interface ChitFundCalculatorFormProps {
  terms: ChittiTerms;
  /** Short title when comparing two schemes (e.g. "Scheme A") */
  schemeHeader?: string;
  /** Prefix for input ids when multiple forms mount (accessibility) */
  fieldIdPrefix?: string;
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
  formErrors: FormErrors;
  onTryExample: () => void;
  onResetForm: () => void;
}

const ChitFundCalculatorForm: React.FC<ChitFundCalculatorFormProps> = ({
  terms,
  schemeHeader,
  fieldIdPrefix = "",
  payableAmount,
  setPayableAmount,
  durationMonths,
  setDurationMonths,
  receivedAmount,
  setReceivedAmount,
  startDate,
  setStartDate,
  isCalculating,
  handleCalculate,
  formErrors,
  onTryExample,
  onResetForm
}) => {
  const monthOptions = [];
  for (let i = 1; i <= 60; i++) {
    monthOptions.push(
      <SelectItem key={i} value={i.toString()}>
        {i} months
      </SelectItem>
    );
  }

  const pid = (s: string) => (fieldIdPrefix ? `${fieldIdPrefix}${s}` : s);

  return (
    <Card className="w-full shadow-lg border-purple-200/20 dark:border-purple-900/40">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-t-lg">
        <CardTitle className={schemeHeader ? "text-xl font-bold" : "text-2xl font-bold"}>
          {schemeHeader ?? "Smart math for smarter investments"}
        </CardTitle>
        <CardDescription className="text-white/90">
          {schemeHeader
            ? "Enter this scheme’s numbers, then calculate."
            : "Turn complex chit fund math into instant, shareable insights"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-3 space-y-4">
        <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
          <Button type="button" variant="secondary" size="sm" onClick={onTryExample}>
            Try example
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onResetForm}>
            Reset form
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={pid("payable-amount")} className="text-sm font-medium">
              {terms.monthlyPayment}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Help: monthly amount">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-60">
                  <p>{terms.tooltips.monthlyPayment}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant={payableAmount === String(amt) ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setPayableAmount(String(amt))}
              >
                ₹{(amt / 1000).toLocaleString()}k
              </Button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₹</span>
            <Input
              id={pid("payable-amount")}
              placeholder="e.g. 10000"
              className={cn("pl-8", formErrors.payableAmount && "border-destructive ring-destructive/20")}
              value={payableAmount}
              onChange={(e) => setPayableAmount(e.target.value)}
              type="number"
              min="0"
              aria-invalid={!!formErrors.payableAmount}
              aria-describedby={formErrors.payableAmount ? pid("err-payable") : undefined}
            />
          </div>
          {formErrors.payableAmount && (
            <p id={pid("err-payable")} className="text-sm text-destructive">
              {formErrors.payableAmount}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={pid("duration")} className="text-sm font-medium">
              {terms.duration}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Help: duration">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-60">
                  <p>{terms.tooltips.duration}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={durationMonths} onValueChange={setDurationMonths}>
            <SelectTrigger
              id={pid("duration")}
              className={cn(formErrors.durationMonths && "border-destructive")}
              aria-invalid={!!formErrors.durationMonths}
            >
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>{monthOptions}</SelectContent>
          </Select>
          {formErrors.durationMonths && (
            <p className="text-sm text-destructive">{formErrors.durationMonths}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={pid("received-amount")} className="text-sm font-medium">
              {terms.receivedAmount}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Help: final payout">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-60">
                  <p>{terms.tooltips.receivedAmount}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₹</span>
            <Input
              id={pid("received-amount")}
              placeholder="Expected lump sum"
              className={cn("pl-8", formErrors.receivedAmount && "border-destructive")}
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              type="number"
              min="0"
              aria-invalid={!!formErrors.receivedAmount}
            />
          </div>
          {formErrors.receivedAmount && (
            <p className="text-sm text-destructive">{formErrors.receivedAmount}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor={pid("start-date")} className="text-sm font-medium">
              {terms.startDate}
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label="Help: start date">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="w-60">
                  <p>{terms.tooltips.startDate}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setStartDate(new Date())}>
              Today
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setStartDate(subYears(new Date(), 1))}>
              1 year ago
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => setStartDate(subYears(new Date(), 2))}>
              2 years ago
            </Button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground",
                  formErrors.startDate && "border-destructive"
                )}
                id={pid("start-date")}
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
          {formErrors.startDate && (
            <p className="text-sm text-destructive">{formErrors.startDate}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 transition-all transform hover:scale-[0.99] text-white py-6 text-lg font-semibold"
          onClick={handleCalculate}
          disabled={isCalculating}
        >
          {isCalculating ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              {terms.loading}
            </>
          ) : (
            terms.calculate
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChitFundCalculatorForm;

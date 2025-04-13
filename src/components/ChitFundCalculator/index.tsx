
import React, { useState } from "react";
import { toast } from "sonner";
import { prepareChitFundData } from "@/utils/financialCalculations";
import ChitFundResults from "@/components/ChitFundResults";
import ChitFundCalculatorForm from "./ChitFundCalculatorForm";
import { ChitFundResult } from "./types";

const ChitFundCalculator: React.FC = () => {
  const [payableAmount, setPayableAmount] = useState<string>("");
  const [durationMonths, setDurationMonths] = useState<string>("20");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ChitFundResult | null>(null);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);

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
          // Use the utility function to calculate XIRR and prepare cash flows
          const result = prepareChitFundData(payable, duration, received, startDate);
          console.log("Calculation result:", result);
          
          setResult(result);
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
Start Date: ${startDate.toLocaleDateString()}`;

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
            `${new Date(cf.date).toISOString().split('T')[0]},${cf.amount.toFixed(2)}`
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

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {!result ? (
        <ChitFundCalculatorForm
          payableAmount={payableAmount}
          setPayableAmount={setPayableAmount}
          durationMonths={durationMonths}
          setDurationMonths={setDurationMonths}
          receivedAmount={receivedAmount}
          setReceivedAmount={setReceivedAmount}
          startDate={startDate}
          setStartDate={setStartDate}
          isCalculating={isCalculating}
          handleCalculate={handleCalculate}
        />
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

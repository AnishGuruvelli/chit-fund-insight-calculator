import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { prepareChitFundData } from "@/utils/financialCalculations";
import ChitFundResults from "@/components/ChitFundResults";
import ChitFundCalculatorForm from "./ChitFundCalculatorForm";
import { ChitFundResult } from "./types";

// Define a key for localStorage
const STORAGE_KEY = 'chitFundCalculator';

const ChitFundCalculator: React.FC = () => {
  // Initialize state with values from localStorage if they exist
  const [payableAmount, setPayableAmount] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.payableAmount || "";
    }
    return "";
  });

  const [durationMonths, setDurationMonths] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.durationMonths || "24";
    }
    return "24"; // Default to 24 months
  });

  const [receivedAmount, setReceivedAmount] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.receivedAmount || "";
    }
    return "";
  });

  const [startDate, setStartDate] = useState<Date>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.startDate ? new Date(parsed.startDate) : new Date();
    }
    return new Date();
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ChitFundResult | null>(null);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      payableAmount,
      durationMonths,
      receivedAmount,
      startDate: startDate.toISOString()
    }));
  }, [payableAmount, durationMonths, receivedAmount, startDate]);

  const handleCalculate = () => {
    try {
      // Form validation
      if (!payableAmount || !durationMonths || !receivedAmount) {
        toast.error("Please fill in all required fields");
        return;
      }

      const payable = parseFloat(payableAmount);
      const duration = parseInt(durationMonths);
      const received = parseFloat(receivedAmount);

      // Validate numeric values
      if (isNaN(payable) || isNaN(duration) || isNaN(received)) {
        toast.error("Please enter valid numbers for all fields");
        return;
      }

      // Validate positive values
      if (payable <= 0 || duration <= 0 || received <= 0) {
        toast.error("All values must be positive numbers");
        return;
      }

      // Calculate and validate total paid amount
      const totalAmountPaid = payable * duration;
      
      // Validate if received amount makes sense
      if (received <= totalAmountPaid * 0.5) {
        toast.error("Received amount seems too low. It should be more than half of the total paid amount.");
        return;
      }

      if (received >= totalAmountPaid * 2) {
        toast.error("Received amount seems unusually high. Please verify the amount.");
        return;
      }

      setIsCalculating(true);
      setTotalPaid(totalAmountPaid);

      // Simulate a calculation delay for UX
      setTimeout(() => {
        try {
          // Use the utility function to calculate XIRR and prepare cash flows
          const result = prepareChitFundData(payable, duration, received, startDate);
          
          // Validate XIRR result
          if (isNaN(result.xirr) || !isFinite(result.xirr)) {
            throw new Error("Invalid XIRR calculation result");
          }

          console.log("Calculation result:", result);
          setResult(result);
        } catch (error) {
          console.error("Calculation error:", error);
          toast.error("An error occurred during calculation. Please verify your inputs.");
        } finally {
          setIsCalculating(false);
        }
      }, 800);
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("An error occurred. Please try again with different values.");
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

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { prepareChitFundData } from "@/utils/financialCalculations";
import { validateSchemeInputs } from "@/utils/schemeValidation";
import ChitFundResults from "@/components/ChitFundResults";
import ChitFundCalculatorForm, { FormErrors } from "./ChitFundCalculatorForm";
import { SearchHistory } from "@/components/SearchHistory";
import { searchHistoryService } from "@/services/searchHistory";
import { ChitFundResult } from "./types";
import ChittiLingoToggle from "@/components/ChittiLingoToggle";
import { CHITTI_TERMS } from "@/constants/ui";
import { TwoSchemeCompareInsight } from "@/components/TwoSchemeCompareInsight";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "chitFundCalculator";
const LINGO_KEY = "chitx_lingo";
const COMPARE_MODE_KEY = "chitx_compare_mode";
const COMPARE_AB_KEY = "chitx_schemes_ab";

interface CompareSchemeState {
  payableAmount: string;
  durationMonths: string;
  receivedAmount: string;
  startDate: Date;
  formErrors: FormErrors;
  result: ChitFundResult | null;
  totalPaid: number | null;
  isCalculating: boolean;
}

function emptyCompareScheme(): CompareSchemeState {
  return {
    payableAmount: "",
    durationMonths: "20",
    receivedAmount: "",
    startDate: new Date(),
    formErrors: {},
    result: null,
    totalPaid: null,
    isCalculating: false,
  };
}

function parseStoredScheme(raw: Record<string, unknown> | undefined): CompareSchemeState {
  const base = emptyCompareScheme();
  if (!raw) return base;
  return {
    ...base,
    payableAmount: typeof raw.payableAmount === "string" ? raw.payableAmount : base.payableAmount,
    durationMonths: typeof raw.durationMonths === "string" ? raw.durationMonths : base.durationMonths,
    receivedAmount: typeof raw.receivedAmount === "string" ? raw.receivedAmount : base.receivedAmount,
    startDate: raw.startDate ? new Date(String(raw.startDate)) : base.startDate,
  };
}

function schemeToJSON(s: CompareSchemeState) {
  return {
    payableAmount: s.payableAmount,
    durationMonths: s.durationMonths,
    receivedAmount: s.receivedAmount,
    startDate: (s.startDate instanceof Date ? s.startDate : new Date(s.startDate)).toISOString(),
  };
}

const SCHEME_A_LABEL = "Scheme A";
const SCHEME_B_LABEL = "Scheme B";

const ChitFundCalculator: React.FC = () => {
  const [compareMode, setCompareMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COMPARE_MODE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const [schemeA, setSchemeA] = useState<CompareSchemeState>(() => {
    try {
      if (localStorage.getItem(COMPARE_MODE_KEY) !== "1") return emptyCompareScheme();
      const raw = localStorage.getItem(COMPARE_AB_KEY);
      if (!raw) return emptyCompareScheme();
      const j = JSON.parse(raw) as { a?: Record<string, unknown>; b?: Record<string, unknown> };
      return parseStoredScheme(j.a);
    } catch {
      return emptyCompareScheme();
    }
  });

  const [schemeB, setSchemeB] = useState<CompareSchemeState>(() => {
    try {
      if (localStorage.getItem(COMPARE_MODE_KEY) !== "1") return emptyCompareScheme();
      const raw = localStorage.getItem(COMPARE_AB_KEY);
      if (!raw) return emptyCompareScheme();
      const j = JSON.parse(raw) as { a?: Record<string, unknown>; b?: Record<string, unknown> };
      return parseStoredScheme(j.b);
    } catch {
      return emptyCompareScheme();
    }
  });

  const [isChittiLocal, setIsChittiLocal] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LINGO_KEY) === "local";
    } catch {
      return false;
    }
  });

  const [payableAmount, setPayableAmount] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as { payableAmount?: string };
      return parsed.payableAmount || "";
    }
    return "";
  });

  const [durationMonths, setDurationMonths] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as { durationMonths?: string };
      return parsed.durationMonths || "20";
    }
    return "20";
  });

  const [receivedAmount, setReceivedAmount] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as { receivedAmount?: string };
      return parsed.receivedAmount || "";
    }
    return "";
  });

  const [startDate, setStartDate] = useState<Date>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as { startDate?: string };
      return parsed.startDate ? new Date(parsed.startDate) : new Date();
    }
    return new Date();
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ChitFundResult | null>(null);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const terms = isChittiLocal ? CHITTI_TERMS.local : CHITTI_TERMS.formal;

  useEffect(() => {
    try {
      localStorage.setItem(LINGO_KEY, isChittiLocal ? "local" : "formal");
    } catch {
      /* ignore */
    }
  }, [isChittiLocal]);

  useEffect(() => {
    if (compareMode) {
      try {
        localStorage.setItem(
          COMPARE_AB_KEY,
          JSON.stringify({ a: schemeToJSON(schemeA), b: schemeToJSON(schemeB) })
        );
        localStorage.setItem(COMPARE_MODE_KEY, "1");
      } catch {
        /* ignore */
      }
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        payableAmount,
        durationMonths,
        receivedAmount,
        startDate: (startDate instanceof Date ? startDate : new Date(startDate)).toISOString(),
      })
    );
    try {
      localStorage.removeItem(COMPARE_MODE_KEY);
    } catch {
      /* ignore */
    }
  }, [compareMode, schemeA, schemeB, payableAmount, durationMonths, receivedAmount, startDate]);

  useEffect(() => {
    setFormErrors({});
  }, [payableAmount, durationMonths, receivedAmount, startDate]);

  useEffect(() => {
    setSchemeA((s) => ({ ...s, formErrors: {} }));
  }, [schemeA.payableAmount, schemeA.durationMonths, schemeA.receivedAmount, schemeA.startDate]);

  useEffect(() => {
    setSchemeB((s) => ({ ...s, formErrors: {} }));
  }, [schemeB.payableAmount, schemeB.durationMonths, schemeB.receivedAmount, schemeB.startDate]);

  const resetCalculation = () => {
    setResult(null);
    setTotalPaid(null);
  };

  const handleTryExample = () => {
    setPayableAmount("25000");
    setDurationMonths("20");
    setReceivedAmount("600000");
    setStartDate(new Date());
    setFormErrors({});
    resetCalculation();
    toast.message("Example values filled — tap calculate when ready.");
  };

  const handleResetForm = () => {
    setPayableAmount("");
    setDurationMonths("20");
    setReceivedAmount("");
    setStartDate(new Date());
    setFormErrors({});
    resetCalculation();
  };

  const handleCompareTryExample = (side: "a" | "b") => {
    const updater = side === "a" ? setSchemeA : setSchemeB;
    if (side === "a") {
      updater((s) => ({
        ...s,
        payableAmount: "25000",
        durationMonths: "20",
        receivedAmount: "600000",
        startDate: new Date(),
        formErrors: {},
        result: null,
        totalPaid: null,
      }));
    } else {
      updater((s) => ({
        ...s,
        payableAmount: "18000",
        durationMonths: "24",
        receivedAmount: "500000",
        startDate: new Date(),
        formErrors: {},
        result: null,
        totalPaid: null,
      }));
    }
    toast.message(`${side === "a" ? SCHEME_A_LABEL : SCHEME_B_LABEL}: example filled — calculate when ready.`);
  };

  const handleCompareReset = (side: "a" | "b") => {
    const updater = side === "a" ? setSchemeA : setSchemeB;
    updater(() => ({
      ...emptyCompareScheme(),
    }));
  };

  const toggleCompareMode = (enable: boolean) => {
    if (enable) {
      setSchemeA({
        ...emptyCompareScheme(),
        payableAmount,
        durationMonths,
        receivedAmount,
        startDate: new Date(startDate),
      });
      let bInit = emptyCompareScheme();
      try {
        const raw = localStorage.getItem(COMPARE_AB_KEY);
        if (raw) {
          const j = JSON.parse(raw) as { b?: Record<string, unknown> };
          if (j.b) bInit = parseStoredScheme(j.b);
        }
      } catch {
        /* ignore */
      }
      setSchemeB(bInit);
      setCompareMode(true);
      try {
        localStorage.setItem(COMPARE_MODE_KEY, "1");
      } catch {
        /* ignore */
      }
      toast.message("Compare two schemes side by side — calculate each column separately.");
    } else {
      setPayableAmount(schemeA.payableAmount);
      setDurationMonths(schemeA.durationMonths);
      setReceivedAmount(schemeA.receivedAmount);
      setStartDate(new Date(schemeA.startDate));
      setCompareMode(false);
      try {
        localStorage.removeItem(COMPARE_MODE_KEY);
      } catch {
        /* ignore */
      }
    }
  };

  const collectValidationErrors = useCallback((): FormErrors | null => {
    return validateSchemeInputs(payableAmount, durationMonths, receivedAmount, startDate);
  }, [payableAmount, durationMonths, receivedAmount, startDate]);

  const runCalculation = (
    payable: number,
    duration: number,
    received: number,
    date: Date,
    opts?: { skipHistory?: boolean }
  ) => {
    setIsCalculating(true);
    setTotalPaid(payable * duration);

    setTimeout(() => {
      try {
        const calcResult = prepareChitFundData(payable, duration, received, date);

        if (isNaN(calcResult.xirr) || !isFinite(calcResult.xirr)) {
          throw new Error("Invalid XIRR calculation result");
        }

        if (!opts?.skipHistory) {
          searchHistoryService.addEntry(calcResult.cashFlows, calcResult.xirr);
        }
        setResult(calcResult);
      } catch (error) {
        console.error("Calculation error:", error);
        toast.error("An error occurred during calculation. Please verify your inputs.");
      } finally {
        setIsCalculating(false);
      }
    }, 800);
  };

  const runCompareCalculation = (
    side: "a" | "b",
    payable: number,
    duration: number,
    received: number,
    date: Date,
    opts?: { skipHistory?: boolean }
  ) => {
    const setScheme = side === "a" ? setSchemeA : setSchemeB;
    setScheme((s) => ({ ...s, isCalculating: true }));

    setTimeout(() => {
      try {
        const calcResult = prepareChitFundData(payable, duration, received, date);
        if (isNaN(calcResult.xirr) || !isFinite(calcResult.xirr)) {
          throw new Error("Invalid XIRR calculation result");
        }
        if (!opts?.skipHistory) {
          searchHistoryService.addEntry(calcResult.cashFlows, calcResult.xirr);
        }
        setScheme((s) => ({
          ...s,
          isCalculating: false,
          result: calcResult,
          totalPaid: payable * duration,
        }));
      } catch (error) {
        console.error("Calculation error:", error);
        toast.error("An error occurred during calculation. Please verify your inputs.");
        setScheme((s) => ({ ...s, isCalculating: false }));
      }
    }, 800);
  };

  const handleCalculate = () => {
    const validation = collectValidationErrors();
    if (validation) {
      setFormErrors(validation);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const payable = parseFloat(payableAmount);
    const duration = parseInt(durationMonths, 10);
    const received = parseFloat(receivedAmount);
    runCalculation(payable, duration, received, startDate);
  };

  const handleCompareCalculate = (side: "a" | "b") => {
    const s = side === "a" ? schemeA : schemeB;
    const validation = validateSchemeInputs(
      s.payableAmount,
      s.durationMonths,
      s.receivedAmount,
      s.startDate
    );
    const setScheme = side === "a" ? setSchemeA : setSchemeB;
    if (validation) {
      setScheme((prev) => ({ ...prev, formErrors: validation }));
      toast.error(`Please fix ${side === "a" ? SCHEME_A_LABEL : SCHEME_B_LABEL}.`);
      return;
    }
    const payable = parseFloat(s.payableAmount);
    const duration = parseInt(s.durationMonths, 10);
    const received = parseFloat(s.receivedAmount);
    runCompareCalculation(side, payable, duration, received, s.startDate);
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
        navigator
          .share({
            title: "Chit Fund XIRR Result",
            text: text,
          })
          .catch((err) => {
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

  const handleShareCompare = (side: "a" | "b") => {
    const s = side === "a" ? schemeA : schemeB;
    if (!s.result) return;
    const text = `${side === "a" ? SCHEME_A_LABEL : SCHEME_B_LABEL} — XIRR: ${(s.result.xirr * 100).toFixed(2)}%
Total Paid: ₹${s.totalPaid?.toLocaleString()}
Monthly: ₹${s.payableAmount} | ${s.durationMonths} mo | Received: ₹${s.receivedAmount}`;

    if (navigator.share) {
      navigator.share({ title: "Chit Fund XIRR", text }).catch(() => {
        navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard"));
      });
    } else {
      navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard"));
    }
  };

  const handleDownload = () => {
    if (result) {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Date,Cash Flow\n" +
        result.cashFlows
          .map((cf) => `${new Date(cf.date).toISOString().split("T")[0]},${cf.amount.toFixed(2)}`)
          .join("\n");

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

  const handleDownloadCompare = (side: "a" | "b") => {
    const s = side === "a" ? schemeA : schemeB;
    if (!s.result) return;
    const slug = side === "a" ? "scheme_a" : "scheme_b";
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,Cash Flow\n" +
      s.result.cashFlows
        .map((cf) => `${new Date(cf.date).toISOString().split("T")[0]},${cf.amount.toFixed(2)}`)
        .join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `chit_fund_${slug}_cash_flows.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded");
  };

  const handleLoadHistoryEntry = (cashFlows: { date: Date; amount: number }[]) => {
    try {
      const monthlyPayment = Math.abs(cashFlows.find((cf) => cf.amount < 0)?.amount || 0);
      const duration = cashFlows.filter((cf) => cf.amount < 0).length;
      const recv = cashFlows.find((cf) => cf.amount > 0)?.amount || 0;
      const startDateRaw = cashFlows[0].date;
      const loadedStart = startDateRaw instanceof Date ? startDateRaw : new Date(startDateRaw);

      if (compareMode) {
        setSchemeA((prev) => ({
          ...prev,
          payableAmount: monthlyPayment.toString(),
          durationMonths: duration.toString(),
          receivedAmount: recv.toString(),
          startDate: loadedStart,
          result: null,
          totalPaid: null,
          formErrors: {},
        }));
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          runCompareCalculation("a", monthlyPayment, duration, recv, loadedStart, { skipHistory: true });
        }, 100);
        toast.message(`Loaded into ${SCHEME_A_LABEL}.`);
        return;
      }

      setPayableAmount(monthlyPayment.toString());
      setDurationMonths(duration.toString());
      setReceivedAmount(recv.toString());
      setStartDate(loadedStart);

      resetCalculation();

      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        runCalculation(monthlyPayment, duration, recv, loadedStart, { skipHistory: true });
      }, 100);
    } catch (error) {
      console.error("Error loading history entry:", error);
      toast.error("Failed to load calculation. Please try again.");
    }
  };

  const handleRefreshHistory = () => {
    setResult((prev) => (prev ? { ...prev } : null));
    setSchemeA((s) => (s.result ? { ...s } : s));
    setSchemeB((s) => (s.result ? { ...s } : s));
  };

  const bothCompareResults =
    compareMode && schemeA.result && schemeB.result && schemeA.totalPaid != null && schemeB.totalPaid != null;

  return (
    <div className="space-y-8 w-full min-w-0 max-w-full overflow-x-hidden">
      <ChittiLingoToggle isLocal={isChittiLocal} onToggle={setIsChittiLocal} />

      <div
        className="flex rounded-lg border border-border p-1 bg-muted/50 gap-1"
        role="group"
        aria-label="Calculator mode"
      >
        <Button
          type="button"
          variant={!compareMode ? "default" : "ghost"}
          className={cn("flex-1", !compareMode && "shadow-sm")}
          onClick={() => compareMode && toggleCompareMode(false)}
        >
          Single scheme
        </Button>
        <Button
          type="button"
          variant={compareMode ? "default" : "ghost"}
          className={cn("flex-1", compareMode && "shadow-sm")}
          onClick={() => !compareMode && toggleCompareMode(true)}
        >
          Compare two schemes
        </Button>
      </div>

      {!compareMode && (
        <>
          <ChitFundCalculatorForm
            terms={terms}
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
            formErrors={formErrors}
            onTryExample={handleTryExample}
            onResetForm={handleResetForm}
          />

          {result && (
            <ChitFundResults
              result={result}
              inputData={{
                payableAmount: parseFloat(payableAmount),
                durationMonths: parseInt(durationMonths, 10),
                receivedAmount: parseFloat(receivedAmount),
                startDate,
                totalPaid: totalPaid || 0,
              }}
              onBack={resetCalculation}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          )}
        </>
      )}

      {compareMode && (
        <>
          {bothCompareResults && (
            <TwoSchemeCompareInsight
              labelA={SCHEME_A_LABEL}
              labelB={SCHEME_B_LABEL}
              xirrA={schemeA.result!.xirr}
              xirrB={schemeB.result!.xirr}
              profitA={parseFloat(schemeA.receivedAmount) - schemeA.totalPaid!}
              profitB={parseFloat(schemeB.receivedAmount) - schemeB.totalPaid!}
              totalPaidA={schemeA.totalPaid!}
              totalPaidB={schemeB.totalPaid!}
            />
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8 items-start w-full min-w-0">
            <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
              <ChitFundCalculatorForm
                terms={terms}
                schemeHeader={SCHEME_A_LABEL}
                fieldIdPrefix="compare-a-"
                payableAmount={schemeA.payableAmount}
                setPayableAmount={(v) => setSchemeA((s) => ({ ...s, payableAmount: v }))}
                durationMonths={schemeA.durationMonths}
                setDurationMonths={(v) => setSchemeA((s) => ({ ...s, durationMonths: v }))}
                receivedAmount={schemeA.receivedAmount}
                setReceivedAmount={(v) => setSchemeA((s) => ({ ...s, receivedAmount: v }))}
                startDate={schemeA.startDate}
                setStartDate={(d) => setSchemeA((s) => ({ ...s, startDate: d }))}
                isCalculating={schemeA.isCalculating}
                handleCalculate={() => handleCompareCalculate("a")}
                formErrors={schemeA.formErrors}
                onTryExample={() => handleCompareTryExample("a")}
                onResetForm={() => handleCompareReset("a")}
              />
              {schemeA.result && (
                <ChitFundResults
                  key={`a-${schemeA.result.xirr}-${schemeA.totalPaid}`}
                  result={schemeA.result}
                  compact
                  schemeLabel={SCHEME_A_LABEL}
                  backButtonLabel="Clear"
                  inputData={{
                    payableAmount: parseFloat(schemeA.payableAmount),
                    durationMonths: parseInt(schemeA.durationMonths, 10),
                    receivedAmount: parseFloat(schemeA.receivedAmount),
                    startDate: schemeA.startDate,
                    totalPaid: schemeA.totalPaid || 0,
                  }}
                  onBack={() => setSchemeA((s) => ({ ...s, result: null, totalPaid: null }))}
                  onShare={() => handleShareCompare("a")}
                  onDownload={() => handleDownloadCompare("a")}
                />
              )}
            </div>

            <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
              <ChitFundCalculatorForm
                terms={terms}
                schemeHeader={SCHEME_B_LABEL}
                fieldIdPrefix="compare-b-"
                payableAmount={schemeB.payableAmount}
                setPayableAmount={(v) => setSchemeB((s) => ({ ...s, payableAmount: v }))}
                durationMonths={schemeB.durationMonths}
                setDurationMonths={(v) => setSchemeB((s) => ({ ...s, durationMonths: v }))}
                receivedAmount={schemeB.receivedAmount}
                setReceivedAmount={(v) => setSchemeB((s) => ({ ...s, receivedAmount: v }))}
                startDate={schemeB.startDate}
                setStartDate={(d) => setSchemeB((s) => ({ ...s, startDate: d }))}
                isCalculating={schemeB.isCalculating}
                handleCalculate={() => handleCompareCalculate("b")}
                formErrors={schemeB.formErrors}
                onTryExample={() => handleCompareTryExample("b")}
                onResetForm={() => handleCompareReset("b")}
              />
              {schemeB.result && (
                <ChitFundResults
                  key={`b-${schemeB.result.xirr}-${schemeB.totalPaid}`}
                  result={schemeB.result}
                  compact
                  schemeLabel={SCHEME_B_LABEL}
                  backButtonLabel="Clear"
                  inputData={{
                    payableAmount: parseFloat(schemeB.payableAmount),
                    durationMonths: parseInt(schemeB.durationMonths, 10),
                    receivedAmount: parseFloat(schemeB.receivedAmount),
                    startDate: schemeB.startDate,
                    totalPaid: schemeB.totalPaid || 0,
                  }}
                  onBack={() => setSchemeB((s) => ({ ...s, result: null, totalPaid: null }))}
                  onShare={() => handleShareCompare("b")}
                  onDownload={() => handleDownloadCompare("b")}
                />
              )}
            </div>
          </div>
        </>
      )}

      <SearchHistory onLoadEntry={handleLoadHistoryEntry} onRefresh={handleRefreshHistory} />
    </div>
  );
};

export default ChitFundCalculator;

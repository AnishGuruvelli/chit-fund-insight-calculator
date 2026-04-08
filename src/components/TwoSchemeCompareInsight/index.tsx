import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface TwoSchemeCompareInsightProps {
  labelA: string;
  labelB: string;
  xirrA: number;
  xirrB: number;
  profitA: number;
  profitB: number;
  totalPaidA: number;
  totalPaidB: number;
}

export function TwoSchemeCompareInsight({
  labelA,
  labelB,
  xirrA,
  xirrB,
  profitA,
  profitB,
  totalPaidA,
  totalPaidB,
}: TwoSchemeCompareInsightProps) {
  const pctA = xirrA * 100;
  const pctB = xirrB * 100;
  const winner = pctA > pctB ? "a" : pctB > pctA ? "b" : "tie";
  const diffPp = Math.abs(pctA - pctB);
  const betterLabel = winner === "a" ? labelA : winner === "b" ? labelB : null;
  const profitWinner =
    profitA > profitB ? "a" : profitB > profitA ? "b" : "tie";

  return (
    <Card className="border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-md">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
          <Scale className="h-4 w-4 text-primary shrink-0" aria-hidden />
          Head-to-head (this session)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3 min-w-0">
          <div className={cn("rounded-lg p-3 border", winner === "a" && "ring-2 ring-primary/50 bg-background")}>
            <div className="text-xs text-muted-foreground mb-1">{labelA}</div>
            <div className="text-lg font-bold tabular-nums">{pctA.toFixed(2)}%</div>
            <div className="text-xs text-muted-foreground">XIRR</div>
            <div className={cn("mt-2 text-xs font-medium", profitA >= 0 ? "text-green-600" : "text-red-600")}>
              {profitA >= 0 ? "Profit" : "Loss"} ₹{Math.abs(profitA).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">on ₹{totalPaidA.toLocaleString()} in</div>
          </div>
          <div className={cn("rounded-lg p-3 border", winner === "b" && "ring-2 ring-primary/50 bg-background")}>
            <div className="text-xs text-muted-foreground mb-1">{labelB}</div>
            <div className="text-lg font-bold tabular-nums">{pctB.toFixed(2)}%</div>
            <div className="text-xs text-muted-foreground">XIRR</div>
            <div className={cn("mt-2 text-xs font-medium", profitB >= 0 ? "text-green-600" : "text-red-600")}>
              {profitB >= 0 ? "Profit" : "Loss"} ₹{Math.abs(profitB).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">on ₹{totalPaidB.toLocaleString()} in</div>
          </div>
        </div>

        {winner !== "tie" && betterLabel && (
          <p className="text-sm flex items-start gap-2 text-foreground">
            <TrendingUp className="h-4 w-4 text-green-600 shrink-0 mt-0.5" aria-hidden />
            <span>
              <strong>{betterLabel}</strong> leads on XIRR by{" "}
              <strong className="tabular-nums">{diffPp.toFixed(2)}</strong> percentage points (not annualized
              difference in rupees — compare profit below if commitment sizes differ).
            </span>
          </p>
        )}
        {winner === "tie" && (
          <p className="text-sm text-muted-foreground">Both schemes show the same XIRR to two decimal places.</p>
        )}

        {profitWinner !== "tie" && profitWinner !== winner && (
          <p className="text-xs text-muted-foreground mt-2">
            Rupee profit can be higher on the other scheme if you committed more total cash — XIRR levels the playing field for timing of flows.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

interface ResultContextTipProps {
  xirr: number;
}

export function ResultContextTip({ xirr }: ResultContextTipProps) {
  if (xirr < 0) {
    return (
      <Alert className="border-orange-200 bg-orange-50 text-orange-950 dark:bg-orange-950/30 dark:text-orange-100 dark:border-orange-800 [&>svg]:text-orange-700 dark:[&>svg]:text-orange-300">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          This scenario shows a negative return after timing is considered. Double-check payout and duration, and compare with other options (FD, PPF, simple mutual funds) before committing.
        </AlertDescription>
      </Alert>
    );
  }

  if (xirr < 0.08) {
    return (
      <Alert className="border-amber-200 bg-amber-50 text-amber-950 dark:bg-amber-950/25 dark:text-amber-100 dark:border-amber-800">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          Returns are on the lower side. That can still be okay for discipline or social reasons — but for pure growth, you might also look at FDs (~6–7%), debt funds, or diversified equity for long horizons.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedXirrProps {
  /** XIRR as decimal, e.g. 0.152 for 15.2% */
  xirrDecimal: number;
  className?: string;
  durationMs?: number;
}

export function AnimatedXirr({ xirrDecimal, className, durationMs = 900 }: AnimatedXirrProps) {
  const target = xirrDecimal * 100;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return <span className={cn(className)}>{display.toFixed(2)}%</span>;
}

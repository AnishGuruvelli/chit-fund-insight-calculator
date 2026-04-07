import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Calculator, TrendingUp, Share2 } from "lucide-react";

const STORAGE_KEY = "chitx_v3_onboarding_dismissed";

const steps = [
  {
    title: "Enter your chit details",
    body: "Monthly amount, how long the scheme runs, what you expect to receive, and when you started (or will start) paying.",
    icon: Calculator,
  },
  {
    title: "See your real return (XIRR)",
    body: "We use the timing of every payment and your final payout so the rate reflects how your money actually behaved over time.",
    icon: TrendingUp,
  },
  {
    title: "Compare, save, and share",
    body: "Stack your result against FDs and equities, keep runs in history, and share or export when you want.",
    icon: Share2,
  },
];

export function FirstVisitOnboarding() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-full max-w-md rounded-xl bg-card border border-border shadow-xl p-6 relative"
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-3 top-3 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close introduction"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 id="onboarding-title" className="text-lg font-semibold pr-8 mb-1">
              Welcome to ChitX
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Three quick things you can do here:</p>
            <ul className="space-y-4 mb-6">
              {steps.map(({ title, body, icon: Icon }) => (
                <li key={title} className="flex gap-3">
                  <div className="shrink-0 rounded-lg bg-purple-100 dark:bg-purple-900/40 p-2 text-purple-700 dark:text-purple-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={dismiss}>
              Got it — let&apos;s calculate
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

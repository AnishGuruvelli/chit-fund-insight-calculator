import { XIRRBadges, ChittiLanguageOptions, InvestmentComparison, ShareTemplate, PerformanceLevel } from "@/types/ui";

export const XIRR_BADGES: XIRRBadges = {
  exceptional: {
    threshold: 0.25,
    label: "🔥 Phenomenal Returns!",
    color: "text-green-600"
  },
  excellent: {
    threshold: 0.20,
    label: "💫 Killer Returns!",
    color: "text-green-500"
  },
  good: {
    threshold: 0.15,
    label: "🎯 You Chit it Right!",
    color: "text-blue-500"
  },
  decent: {
    threshold: 0.12,
    label: "👍 Better than FD!",
    color: "text-yellow-500"
  },
  moderate: {
    threshold: 0.08,
    label: "😊 Steady Returns",
    color: "text-yellow-600"
  },
  low: {
    threshold: 0,
    label: "🤔 Could Be Better",
    color: "text-orange-500"
  }
};

export const CHITTI_TERMS: ChittiLanguageOptions = {
  formal: {
    monthlyPayment: "Monthly Investment 💸",
    duration: "Duration in Months 📅",
    receivedAmount: "Final Payout 💰",
    startDate: "First Payment Date 📅",
    calculate: "Show Me the Money! 💥"
  },
  local: {
    monthlyPayment: "Monthly Khaata 💸",
    duration: "Kitne Mahine 📅",
    receivedAmount: "Final Lifafa 💰",
    startDate: "Shuruat Ki Tareekh 📅",
    calculate: "Paisa Hi Paisa! 💥"
  }
};

export const INVESTMENT_COMPARISONS: InvestmentComparison[] = [
  {
    name: "Large Cap Stocks",
    returnRate: 0.12,
    description: "Top 100 companies by market cap",
    icon: "📈"
  },
  {
    name: "Mid Cap Stocks",
    returnRate: 0.15,
    description: "101-250 ranked companies",
    icon: "📊"
  },
  {
    name: "Small Cap Stocks",
    returnRate: 0.18,
    description: "Beyond top 250 companies",
    icon: "💹"
  },
  {
    name: "Gold",
    returnRate: 0.10,
    description: "Historical gold returns",
    icon: "💰"
  },
  {
    name: "Fixed Deposit",
    returnRate: 0.06,
    description: "Bank FD returns",
    icon: "🏦"
  }
];

export const WHATSAPP_SHARE_TEMPLATE: ShareTemplate = {
  title: "Chitti Calculator Results",
  message: `
🎯 My Chitti Calculator Results:
💰 Monthly Investment: ₹{amount}
📅 Duration: {months} months
💫 Final Amount: ₹{received}
🔥 Real Returns (XIRR): {xirr}%

Calculate yours: {appLink}
`,
  formatData: (data) => {
    return WHATSAPP_SHARE_TEMPLATE.message
      .replace("{amount}", data.monthlyAmount.toLocaleString())
      .replace("{months}", data.duration.toString())
      .replace("{received}", data.receivedAmount.toLocaleString())
      .replace("{xirr}", (data.xirr * 100).toFixed(2))
      .replace("{appLink}", data.appLink);
  }
};

export const PERFORMANCE_LEVELS: PerformanceLevel[] = [
  {
    threshold: 0.25,
    label: "Exceptional Returns",
    description: "Your chitti is outperforming most investment options!",
    color: "bg-green-600",
    icon: "🏆"
  },
  {
    threshold: 0.20,
    label: "Excellent Choice",
    description: "You're making your money work hard!",
    color: "bg-green-500",
    icon: "💫"
  },
  {
    threshold: 0.15,
    label: "Smart Investment",
    description: "Better returns than most traditional options",
    color: "bg-blue-500",
    icon: "🎯"
  },
  {
    threshold: 0.12,
    label: "Decent Returns",
    description: "You're beating fixed deposit rates",
    color: "bg-yellow-500",
    icon: "👍"
  },
  {
    threshold: 0.08,
    label: "Moderate Returns",
    description: "Consider exploring other options for better returns",
    color: "bg-yellow-600",
    icon: "😊"
  },
  {
    threshold: 0,
    label: "Low Returns",
    description: "Let's find ways to improve your returns",
    color: "bg-orange-500",
    icon: "🤔"
  }
];

export const INPUT_TOOLTIPS = {
  monthlyPayment: "How much do you pay each month towards your chitti? 💸",
  duration: "The total number of monthly payments you'll make 📅",
  receivedAmount: "The lump sum amount you receive at the end 💰",
  startDate: "When did/will you start paying? 📅"
};

export const BUTTON_STATES = {
  initial: "Show Me the Money! 💥",
  loading: "Crunching Numbers... 🔄",
  error: "Let's Try Again! 🔄"
};

export const SHARE_OPTIONS = {
  whatsapp: "Brag on WhatsApp 💪",
  general: "Share Your Success 🎯",
  download: "Download Details 📊"
}; 
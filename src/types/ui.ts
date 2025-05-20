export interface XIRRBadge {
  threshold: number;
  label: string;
  color: string;
}

export interface XIRRBadges {
  exceptional: XIRRBadge;
  excellent: XIRRBadge;
  good: XIRRBadge;
  decent: XIRRBadge;
  moderate: XIRRBadge;
  low: XIRRBadge;
}

export interface SummaryTemplate {
  template: string;
  condition: (xirr: number) => boolean;
}

export interface ChittiTerms {
  monthlyPayment: string;
  duration: string;
  receivedAmount: string;
  startDate: string;
  calculate: string;
}

export interface ChittiLanguageOptions {
  formal: ChittiTerms;
  local: ChittiTerms;
}

export interface InvestmentComparison {
  name: string;
  returnRate: number;
  description: string;
  icon: string;
}

export interface ShareTemplate {
  title: string;
  message: string;
  formatData: (data: ShareData) => string;
}

export interface ShareData {
  monthlyAmount: number;
  duration: number;
  receivedAmount: number;
  xirr: number;
  appLink: string;
}

export interface PerformanceLevel {
  threshold: number;
  label: string;
  description: string;
  color: string;
  icon: string;
} 
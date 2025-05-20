export interface InvestmentData {
  name: string;
  returns: number;
  icon: string;
  description?: string;
}

export interface InvestmentComparisonProps {
  xirr: number;
  isLoading?: boolean;
}

export interface InvestmentColor {
  name: string;
  gradient: {
    start: string;
    end: string;
  };
}

export const INVESTMENT_COLORS: Record<string, InvestmentColor> = {
  'Your Chitti': {
    name: 'chittiGradient',
    gradient: {
      start: '#9333ea',
      end: '#db2777'
    }
  },
  'Large Cap Stocks': {
    name: 'largeCapGradient',
    gradient: {
      start: '#3b82f6',
      end: '#06b6d4'
    }
  },
  'Mid Cap Stocks': {
    name: 'midCapGradient',
    gradient: {
      start: '#06b6d4',
      end: '#10b981'
    }
  },
  'Small Cap Stocks': {
    name: 'smallCapGradient',
    gradient: {
      start: '#10b981',
      end: '#84cc16'
    }
  },
  'Gold': {
    name: 'goldGradient',
    gradient: {
      start: '#f59e0b',
      end: '#fbbf24'
    }
  },
  'Fixed Deposit': {
    name: 'fdGradient',
    gradient: {
      start: '#6b7280',
      end: '#9ca3af'
    }
  }
}; 
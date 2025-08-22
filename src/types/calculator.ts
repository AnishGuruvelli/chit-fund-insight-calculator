export interface CashFlow {
  date: Date;
  amount: number;
}

export interface ChitFundCalculationResult {
  xirr: number;
  cashFlows: CashFlow[];
}

export interface ChitFundInputData {
  payableAmount: number;
  durationMonths: number;
  receivedAmount: number;
  startDate: Date;
}

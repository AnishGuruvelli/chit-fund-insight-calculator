
export interface ChitFundResult {
  xirr: number;
  cashFlows: { date: Date; amount: number }[];
}

export interface ChitFundInputData {
  payableAmount: number;
  durationMonths: number;
  receivedAmount: number;
  startDate: Date;
  totalPaid: number;
}

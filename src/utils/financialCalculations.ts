
/**
 * Calculates the XIRR (Extended Internal Rate of Return) for a series of cash flows
 * @param values Array of cash flow values (negative for outflows, positive for inflows)
 * @param dates Array of dates corresponding to each cash flow
 * @returns The calculated XIRR as a decimal (multiply by 100 for percentage)
 */
export function calculateXIRR(values: number[], dates: Date[]): number {
  if (values.length !== dates.length || values.length < 2) {
    throw new Error("Values and dates arrays must have the same length and contain at least 2 elements");
  }

  // Convert dates to days from first date
  const dayDiffs: number[] = dates.map(date => {
    return (date.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24);
  });

  // Newton-Raphson method to find the root
  let guess = 0.1; // Initial guess
  const maxIterations = 100;
  const tolerance = 0.0000001;

  let iteration = 0;
  
  while (iteration < maxIterations) {
    const [fx, dfx] = evaluateFunction(guess, values, dayDiffs);
    
    if (Math.abs(fx) < tolerance) {
      // Converged to a solution
      break;
    }
    
    // Update guess using Newton-Raphson formula
    const newGuess = guess - fx / dfx;
    
    if (Math.abs(newGuess - guess) < tolerance) {
      // Converged to a solution
      guess = newGuess;
      break;
    }
    
    guess = newGuess;
    iteration++;
  }

  // Convert from daily rate to annual rate
  return Math.pow(1 + guess, 365) - 1;
}

/**
 * Helper function for XIRR calculation
 * Evaluates the XIRR function and its derivative at a given rate
 */
function evaluateFunction(guess: number, values: number[], dayDiffs: number[]): [number, number] {
  let f = 0;
  let df = 0;

  for (let i = 0; i < values.length; i++) {
    const dayDiff = dayDiffs[i];
    const factor = Math.pow(1 + guess, dayDiff);
    f += values[i] / factor;
    df -= (dayDiff * values[i]) / (factor * (1 + guess));
  }

  return [f, df];
}

/**
 * Prepares the cash flow data for the XIRR calculation and chart display
 * @param payableAmount Monthly payment amount
 * @param durationMonths Total duration in months
 * @param receivedAmount Amount received (typically as a lump sum)
 * @param startDate Start date of the chit fund
 * @returns Object containing the XIRR and cash flow data
 */
export function prepareChitFundData(
  payableAmount: number,
  durationMonths: number,
  receivedAmount: number,
  startDate: Date
): { xirr: number; cashFlows: { date: Date; amount: number; }[] } {
  const cashFlows: { date: Date; amount: number }[] = [];
  const values: number[] = [];
  const dates: Date[] = [];

  // Generate monthly outflows (payments)
  for (let i = 0; i < durationMonths; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    
    // Add the monthly payment as a negative cash flow (outflow)
    cashFlows.push({ 
      date: new Date(date), 
      amount: -payableAmount 
    });
    values.push(-payableAmount);
    dates.push(new Date(date));
  }

  // Add the received amount as a positive cash flow (inflow)
  // Assuming it's received at the end of the chit fund period
  const receiveDate = new Date(startDate);
  receiveDate.setMonth(startDate.getMonth() + durationMonths - 1);
  
  cashFlows.push({ 
    date: new Date(receiveDate), 
    amount: receivedAmount 
  });
  values.push(receivedAmount);
  dates.push(new Date(receiveDate));

  // Calculate XIRR
  const xirr = calculateXIRR(values, dates);

  return {
    xirr,
    cashFlows
  };
}

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

  // Check if all values are the same - this would cause division by zero
  const allSameValue = values.every(v => v === values[0]);
  if (allSameValue) {
    return 0; // Return 0 instead of trying to calculate
  }

  // Convert dates to days from first date
  const dayDiffs: number[] = dates.map(date => {
    return (date.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24);
  });

  // Check if we have at least one positive and one negative value
  // Otherwise XIRR cannot be calculated
  const hasPositive = values.some(v => v > 0);
  const hasNegative = values.some(v => v < 0);
  
  if (!hasPositive || !hasNegative) {
    throw new Error("XIRR calculation requires at least one positive and one negative cash flow");
  }

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
    
    // Make sure dfx is not zero to avoid division by zero
    if (Math.abs(dfx) < tolerance) {
      // If derivative is too small, adjust guess slightly and try again
      guess = guess + 0.01;
      iteration++;
      continue;
    }
    
    // Update guess using Newton-Raphson formula
    const newGuess = guess - fx / dfx;
    
    if (Math.abs(newGuess - guess) < tolerance) {
      // Converged to a solution
      guess = newGuess;
      break;
    }
    
    // Check for invalid results
    if (isNaN(newGuess) || !isFinite(newGuess)) {
      // Try a different initial guess
      guess = guess * 0.5;
      iteration++;
      continue;
    }
    
    guess = newGuess;
    iteration++;
  }

  // Check for non-convergence
  if (iteration >= maxIterations) {
    console.warn("XIRR calculation did not converge");
    return 0;
  }

  // Convert from daily rate to annual rate
  const annualRate = Math.pow(1 + guess, 365) - 1;
  
  // Guard against unreasonable results
  if (isNaN(annualRate) || !isFinite(annualRate) || Math.abs(annualRate) > 1000) {
    console.warn("XIRR calculation resulted in an unreasonable value:", annualRate);
    return 0;
  }
  
  return annualRate;
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

  try {
    // Calculate XIRR
    const xirr = calculateXIRR(values, dates);
    console.log("Calculated XIRR:", xirr);
    
    return {
      xirr,
      cashFlows
    };
  } catch (error) {
    console.error("XIRR calculation error:", error);
    // Return a fallback value in case of error
    return {
      xirr: 0,
      cashFlows
    };
  }
}

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

  // Check if we have at least one positive and one negative value
  const hasPositive = values.some(v => v > 0);
  const hasNegative = values.some(v => v < 0);
  
  if (!hasPositive || !hasNegative) {
    throw new Error("XIRR calculation requires at least one positive and one negative cash flow");
  }

  // Convert dates to years from first date for better numerical stability
  const yearDiffs: number[] = dates.map(date => {
    return (date.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24 * 365);
  });

  // Calculate initial guess based on simple return
  const totalInflow = values.reduce((sum, v) => v > 0 ? sum + v : sum, 0);
  const totalOutflow = Math.abs(values.reduce((sum, v) => v < 0 ? sum + v : sum, 0));
  const maxYears = Math.max(...yearDiffs);
  
  // Use simple return to estimate initial rate
  const simpleReturn = (totalInflow / totalOutflow) - 1;
  const roughGuess = Math.pow(1 + simpleReturn, 1 / maxYears) - 1;

  // Set reasonable bounds for the search
  let lowerBound = -0.99; // -99% annual rate
  let upperBound = Math.min(100, Math.max(1, roughGuess * 10)); // Cap at 10000%

  // Binary search combined with Newton-Raphson for robustness
  const tolerance = 1e-7;
  const maxIterations = 50;

  let bestGuess = roughGuess;
  let bestError = Math.abs(evaluateFunction(bestGuess, values, yearDiffs)[0]);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Try Newton-Raphson step
    const [fx, dfx] = evaluateFunction(bestGuess, values, yearDiffs);
    
    if (Math.abs(fx) < tolerance) {
      // Converged to a solution
      return bestGuess;
    }

    // Calculate Newton-Raphson step
    let newGuess = bestGuess;
    if (Math.abs(dfx) > tolerance) {
      newGuess = bestGuess - fx / dfx;
    }

    // If Newton-Raphson gives a reasonable step, use it
    if (newGuess > lowerBound && newGuess < upperBound) {
      const newError = Math.abs(evaluateFunction(newGuess, values, yearDiffs)[0]);
      if (newError < bestError) {
        bestGuess = newGuess;
        bestError = newError;
        continue;
      }
    }

    // If Newton-Raphson fails, use bisection method
    const midPoint = (lowerBound + upperBound) / 2;
    const [fLow] = evaluateFunction(lowerBound, values, yearDiffs);
    const [fMid] = evaluateFunction(midPoint, values, yearDiffs);

    if (fLow * fMid <= 0) {
      upperBound = midPoint;
    } else {
      lowerBound = midPoint;
    }

    bestGuess = midPoint;
    bestError = Math.abs(fMid);

    // Check if we've converged
    if (Math.abs(upperBound - lowerBound) < tolerance) {
      return bestGuess;
    }
  }

  // If we haven't converged but have a reasonable guess, return it
  if (bestError < 0.01 && bestGuess > -1 && bestGuess < 100) {
    return bestGuess;
  }

  throw new Error("Failed to converge to a solution");
}

/**
 * Helper function for XIRR calculation
 * Evaluates the XIRR function and its derivative at a given rate
 */
function evaluateFunction(guess: number, values: number[], yearDiffs: number[]): [number, number] {
  let f = 0;
  let df = 0;

  for (let i = 0; i < values.length; i++) {
    const t = yearDiffs[i];
    const factor = Math.pow(1 + guess, t);
    f += values[i] / factor;
    df -= t * values[i] / (factor * (1 + guess));
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

  // Clone the start date to avoid modifying the original
  const baseDate = new Date(startDate);
  
  // Generate monthly outflows (payments)
  for (let i = 0; i < durationMonths; i++) {
    const paymentDate = new Date(baseDate);
    paymentDate.setMonth(baseDate.getMonth() + i);
    
    // Add the monthly payment as a negative cash flow (outflow)
    cashFlows.push({ 
      date: new Date(paymentDate), 
      amount: -payableAmount 
    });
    values.push(-payableAmount);
    dates.push(new Date(paymentDate));
  }

  // Add the received amount as a positive cash flow (inflow)
  // The received amount should be one month after the last payment
  const receiveDate = new Date(baseDate);
  receiveDate.setMonth(baseDate.getMonth() + durationMonths);
  
  cashFlows.push({ 
    date: new Date(receiveDate), 
    amount: receivedAmount 
  });
  values.push(receivedAmount);
  dates.push(new Date(receiveDate));

  try {
    // Calculate XIRR
    const xirr = calculateXIRR(values, dates);
    console.log("Cash flows:", values, dates.map(d => d.toISOString()));
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


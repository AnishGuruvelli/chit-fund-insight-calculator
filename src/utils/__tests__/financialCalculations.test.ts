import { calculateXIRR, prepareChitFundData } from '../financialCalculations';

describe('XIRR Calculations', () => {
  test('calculates XIRR correctly for simple case', () => {
    const values = [-1000, 1100];
    const dates = [
      new Date('2024-01-01'),
      new Date('2025-01-01')
    ];
    
    const xirr = calculateXIRR(values, dates);
    expect(xirr).toBeCloseTo(0.10, 2); // Should be approximately 10%
  });

  test('calculates XIRR correctly for chit fund example case', () => {
    const result = prepareChitFundData(
      10000, // monthly payment
      24, // duration
      300000, // received amount
      new Date('2024-01-01')
    );

    // For ₹240,000 total paid and ₹300,000 received over 2 years
    // XIRR should be around 22-23%
    expect(result.xirr).toBeGreaterThan(0.20);
    expect(result.xirr).toBeLessThan(0.25);
    
    // Verify cash flows
    expect(result.cashFlows).toHaveLength(25); // 24 payments + 1 receipt
    expect(result.cashFlows[0].amount).toBe(-10000); // First payment
    expect(result.cashFlows[24].amount).toBe(300000); // Final receipt
  });

  test('calculates XIRR correctly for high return case', () => {
    const values = [-100000, 150000];
    const dates = [
      new Date('2024-01-01'),
      new Date('2024-07-01')
    ];
    
    const xirr = calculateXIRR(values, dates);
    expect(xirr).toBeGreaterThan(1.0); // Should be over 100% annualized
    expect(xirr).toBeLessThan(2.0); // But less than 200%
  });

  test('calculates XIRR correctly for multiple payments', () => {
    // Test case: 4 monthly payments of 1000 each, followed by 4400 return
    // This represents a 10% total return over ~4 months
    const values = [-1000, -1000, -1000, -1000, 4400];
    const dates = [
      new Date('2024-01-01'),
      new Date('2024-02-01'),
      new Date('2024-03-01'),
      new Date('2024-04-01'),
      new Date('2024-05-01')
    ];
    
    const xirr = calculateXIRR(values, dates);
    // For 10% return over 4 months, annualized rate should be around 57-58%
    expect(xirr).toBeGreaterThan(0.55);
    expect(xirr).toBeLessThan(0.60);
  });

  test('handles edge cases correctly', () => {
    // Test with very small amounts
    const smallResult = prepareChitFundData(
      100, // small monthly payment
      12, // duration
      1300, // small received amount
      new Date('2024-01-01')
    );
    expect(smallResult.xirr).toBeGreaterThan(0);

    // Test with large amounts
    const largeResult = prepareChitFundData(
      100000, // large monthly payment
      24, // duration
      3000000, // large received amount
      new Date('2024-01-01')
    );
    expect(largeResult.xirr).toBeGreaterThan(0);
  });

  test('throws error for invalid inputs', () => {
    expect(() => {
      calculateXIRR([], []); // Empty arrays
    }).toThrow();

    expect(() => {
      calculateXIRR([1000], [new Date()]); // Single value
    }).toThrow();

    expect(() => {
      calculateXIRR([1000, 1000], [new Date()]); // Mismatched lengths
    }).toThrow();

    expect(() => {
      calculateXIRR([1000, 1000], [new Date(), new Date()]); // No negative values
    }).toThrow();
  });
}); 
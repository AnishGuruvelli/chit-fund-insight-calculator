import type { FormErrors } from "@/components/ChitFundCalculator/ChitFundCalculatorForm";

export function validateSchemeInputs(
  payableAmount: string,
  durationMonths: string,
  receivedAmount: string,
  startDate: Date
): FormErrors | null {
  const errors: FormErrors = {};

  if (!payableAmount?.trim()) {
    errors.payableAmount = "Enter your monthly amount.";
  } else {
    const payable = parseFloat(payableAmount);
    if (isNaN(payable) || payable <= 0) {
      errors.payableAmount = "Use a positive number.";
    }
  }

  if (!durationMonths?.trim()) {
    errors.durationMonths = "Choose how many months.";
  } else {
    const duration = parseInt(durationMonths, 10);
    if (isNaN(duration) || duration <= 0) {
      errors.durationMonths = "Invalid duration.";
    }
  }

  if (!receivedAmount?.trim()) {
    errors.receivedAmount = "Enter the expected final payout.";
  } else {
    const received = parseFloat(receivedAmount);
    if (isNaN(received) || received <= 0) {
      errors.receivedAmount = "Use a positive number.";
    }
  }

  if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) {
    errors.startDate = "Pick a valid start date.";
  }

  const payable = parseFloat(payableAmount);
  const duration = parseInt(durationMonths, 10);
  const received = parseFloat(receivedAmount);

  if (!isNaN(payable) && !isNaN(duration) && !isNaN(received) && payable > 0 && duration > 0 && received > 0) {
    const totalAmountPaid = payable * duration;
    if (received <= totalAmountPaid * 0.5) {
      errors.receivedAmount = "That payout looks too low versus what you pay in total.";
    }
    if (received >= totalAmountPaid * 2) {
      errors.receivedAmount = "That payout looks unusually high — please double-check.";
    }
  }

  return Object.keys(errors).length ? errors : null;
}

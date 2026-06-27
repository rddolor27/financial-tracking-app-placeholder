import {
  calculateNetWorth,
  calculateSavingsRate,
  calculateBudgetUtilization,
} from './financial';

describe('calculateNetWorth', () => {
  it('should sum positive balances', () => {
    const accounts = [
      { balance: 50000, type: 'savings' as const },
      { balance: 10000, type: 'checking' as const },
    ];
    expect(calculateNetWorth(accounts)).toBe(60000);
  });

  it('should subtract credit card (negative) balances', () => {
    const accounts = [
      { balance: 50000, type: 'savings' as const },
      { balance: -5000, type: 'credit_card' as const },
    ];
    expect(calculateNetWorth(accounts)).toBe(45000);
  });

  it('should return 0 for empty accounts', () => {
    expect(calculateNetWorth([])).toBe(0);
  });
});

describe('calculateSavingsRate', () => {
  it('should calculate savings rate', () => {
    expect(calculateSavingsRate(100000, 70000)).toBe(0.3);
  });

  it('should return 0 when income is 0', () => {
    expect(calculateSavingsRate(0, 0)).toBe(0);
  });

  it('should handle negative savings rate', () => {
    expect(calculateSavingsRate(50000, 60000)).toBe(-0.2);
  });
});

describe('calculateBudgetUtilization', () => {
  it('should calculate utilization percentage', () => {
    expect(calculateBudgetUtilization(4000, 5000)).toBe(0.8);
  });

  it('should handle over-budget', () => {
    expect(calculateBudgetUtilization(6000, 5000)).toBe(1.2);
  });

  it('should return 0 for zero budget', () => {
    expect(calculateBudgetUtilization(1000, 0)).toBe(0);
  });

  it('should return 0 for zero spent', () => {
    expect(calculateBudgetUtilization(0, 5000)).toBe(0);
  });
});

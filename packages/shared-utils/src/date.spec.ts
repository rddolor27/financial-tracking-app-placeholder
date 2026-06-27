import {
  formatDateLocal,
  getStartOfPeriod,
  getEndOfPeriod,
  isDateInRange,
} from './date';

describe('formatDateLocal', () => {
  it('should format UTC date to readable string', () => {
    const result = formatDateLocal('2026-06-28T12:00:00.000Z');
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/28/);
    expect(result).toMatch(/2026/);
  });

  it('should handle date-only strings', () => {
    const result = formatDateLocal('2026-06-28');
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/28/);
  });
});

describe('getStartOfPeriod', () => {
  it('should get start of month', () => {
    const result = getStartOfPeriod(new Date('2026-06-15'), 'monthly');
    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(5); // June
  });

  it('should get start of week (Monday)', () => {
    const result = getStartOfPeriod(new Date('2026-06-28'), 'weekly');
    expect(result.getDay()).toBe(1); // Monday
  });

  it('should get start of year', () => {
    const result = getStartOfPeriod(new Date('2026-06-15'), 'yearly');
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
  });
});

describe('getEndOfPeriod', () => {
  it('should get end of month', () => {
    const result = getEndOfPeriod(new Date('2026-06-15'), 'monthly');
    expect(result.getDate()).toBe(30); // June has 30 days
    expect(result.getMonth()).toBe(5);
  });

  it('should get end of year', () => {
    const result = getEndOfPeriod(new Date('2026-06-15'), 'yearly');
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(31);
  });
});

describe('isDateInRange', () => {
  it('should return true for date within range', () => {
    expect(isDateInRange('2026-06-15', '2026-06-01', '2026-06-30')).toBe(true);
  });

  it('should return false for date outside range', () => {
    expect(isDateInRange('2026-07-01', '2026-06-01', '2026-06-30')).toBe(false);
  });

  it('should include boundary dates', () => {
    expect(isDateInRange('2026-06-01', '2026-06-01', '2026-06-30')).toBe(true);
    expect(isDateInRange('2026-06-30', '2026-06-01', '2026-06-30')).toBe(true);
  });
});

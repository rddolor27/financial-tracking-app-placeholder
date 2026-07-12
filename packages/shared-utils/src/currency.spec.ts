import { formatCurrency, convertCurrency, parseCurrencyAmount, money } from './currency';

describe('formatCurrency', () => {
  it('should format PHP currency', () => {
    expect(formatCurrency(1234.5, 'PHP')).toBe('₱1,234.50');
  });

  it('should format USD currency', () => {
    expect(formatCurrency(1234.5, 'USD')).toBe('$1,234.50');
  });

  it('should format zero', () => {
    expect(formatCurrency(0, 'PHP')).toBe('₱0.00');
  });

  it('should format negative amounts', () => {
    const result = formatCurrency(-500.75, 'PHP');
    expect(result).toContain('500.75');
  });

  it('should format large numbers with commas', () => {
    expect(formatCurrency(1000000, 'PHP')).toBe('₱1,000,000.00');
  });
});

describe('convertCurrency', () => {
  const rates: Record<string, Record<string, number>> = {
    USD: { PHP: 56.5, EUR: 0.92 },
    PHP: { USD: 0.0177, EUR: 0.0163 },
    EUR: { USD: 1.087, PHP: 61.41 },
  };

  it('should convert USD to PHP', () => {
    const result = convertCurrency(100, 'USD', 'PHP', rates);
    expect(result).toBe(5650);
  });

  it('should return same amount for same currency', () => {
    const result = convertCurrency(100, 'PHP', 'PHP', rates);
    expect(result).toBe(100);
  });

  it('should return null if rate not found', () => {
    const result = convertCurrency(100, 'USD', 'GBP', rates);
    expect(result).toBeNull();
  });

  it('should convert EUR to PHP', () => {
    const result = convertCurrency(100, 'EUR', 'PHP', rates);
    expect(result).toBe(6141);
  });
});

describe('money', () => {
  it('prefixes the PHP symbol and groups thousands', () => {
    expect(money(248530)).toBe('₱248,530');
  });

  it('preserves decimals when present', () => {
    expect(money(248530.75)).toBe('₱248,530.75');
  });

  it('uses the symbol for a given currency', () => {
    expect(money(1200, 'USD')).toBe('$1,200');
  });

  it('renders the raw value (callers pass Math.abs and add their own sign)', () => {
    expect(money(-500)).toBe('₱-500');
  });

  it('formats zero', () => {
    expect(money(0)).toBe('₱0');
  });
});

describe('parseCurrencyAmount', () => {
  it('should parse amount string with commas', () => {
    expect(parseCurrencyAmount('1,234.56')).toBe(1234.56);
  });

  it('should parse plain number string', () => {
    expect(parseCurrencyAmount('100')).toBe(100);
  });

  it('should parse amount with currency symbol', () => {
    expect(parseCurrencyAmount('₱1,234.56')).toBe(1234.56);
  });

  it('should return null for invalid input', () => {
    expect(parseCurrencyAmount('not-a-number')).toBeNull();
  });
});

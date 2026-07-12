const CURRENCY_SYMBOLS: Record<string, string> = {
  PHP: '₱',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  KRW: '₩',
  CNY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  HKD: 'HK$',
};

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
  }
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, Record<string, number>>,
): number | null {
  if (fromCurrency === toCurrency) return amount;

  const rate = rates[fromCurrency]?.[toCurrency];
  if (rate === undefined) return null;

  return Math.round(amount * rate * 100) / 100;
}

export function parseCurrencyAmount(value: string): number | null {
  const cleaned = value.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] || currency;
}

/**
 * Compact money formatter used by the UI (matches the design handoff `money()`):
 * currency symbol + locale-grouped number, preserving any decimals.
 * Callers apply their own sign/color (e.g. `+`/`−`) around it.
 */
export function money(amount: number, currency = 'PHP'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return symbol + amount.toLocaleString('en-US');
}

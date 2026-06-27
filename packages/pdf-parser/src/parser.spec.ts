import { parseTransactionsFromText, ParsedTransaction } from './parser';

describe('parseTransactionsFromText', () => {
  it('should parse basic transaction lines', () => {
    const text = `
      06/15/2026  Grocery Store Purchase  -1,234.56
      06/16/2026  Salary Deposit  +50,000.00
      06/17/2026  Electric Bill Payment  -2,500.00
    `;

    const result = parseTransactionsFromText(text);
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it('should parse amounts with currency symbols', () => {
    const text = `06/15/2026  Grocery  PHP 1,234.56`;
    const result = parseTransactionsFromText(text);
    expect(result.length).toBeGreaterThanOrEqual(1);
    if (result.length > 0) {
      expect(result[0].amount).toBe(1234.56);
    }
  });

  it('should return empty array for no matches', () => {
    const result = parseTransactionsFromText('No transaction data here');
    expect(result).toEqual([]);
  });

  it('should detect debit/credit from signs', () => {
    const text = `
      06/15/2026  Purchase  -500.00
      06/16/2026  Deposit  +1000.00
    `;
    const result = parseTransactionsFromText(text);
    const debit = result.find((t) => t.type === 'expense');
    const credit = result.find((t) => t.type === 'income');
    expect(debit).toBeDefined();
    expect(credit).toBeDefined();
  });
});

describe('ParsedTransaction type', () => {
  it('should have required fields', () => {
    const tx: ParsedTransaction = {
      date: '2026-06-15',
      description: 'Test',
      amount: 100,
      type: 'expense',
    };
    expect(tx.date).toBe('2026-06-15');
    expect(tx.amount).toBe(100);
  });
});

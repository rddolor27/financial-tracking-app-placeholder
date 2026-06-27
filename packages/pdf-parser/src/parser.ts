export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  rawLine?: string;
}

// Pattern: date  description  [+/-]amount
const TRANSACTION_PATTERN =
  /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\s+(.+?)\s+([+-]?\s*(?:PHP|USD|EUR|₱|\$|€)?\s*[\d,]+\.?\d*)/gi;

export function parseTransactionsFromText(text: string): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    TRANSACTION_PATTERN.lastIndex = 0;
    const match = TRANSACTION_PATTERN.exec(trimmed);
    if (!match) continue;

    const [, dateStr, description, amountStr] = match;

    const cleanAmount = amountStr.replace(/[^\d.,\-+]/g, '').replace(/,/g, '');
    const amount = Math.abs(parseFloat(cleanAmount));

    if (isNaN(amount) || amount === 0) continue;

    const isIncome = amountStr.includes('+');

    const date = normalizeDate(dateStr);

    transactions.push({
      date,
      description: description.trim(),
      amount,
      type: isIncome ? 'income' : 'expense',
      rawLine: trimmed,
    });
  }

  return transactions;
}

function normalizeDate(dateStr: string): string {
  const parts = dateStr.split(/[\/\-]/);
  if (parts.length !== 3) return dateStr;

  let [month, day, year] = parts;
  if (year.length === 2) {
    year = `20${year}`;
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export interface ParseResult {
  transactions: ParsedTransaction[];
  confidence: number;
  rawText: string;
}

export function evaluateParseConfidence(
  transactions: ParsedTransaction[],
  totalLines: number,
): number {
  if (totalLines === 0) return 0;
  const ratio = transactions.length / totalLines;
  return Math.min(Math.round(ratio * 100) / 100, 1);
}

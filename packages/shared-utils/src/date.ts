import type { BudgetPeriod } from '@financial-tracker/shared-types';

export function formatDateLocal(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTimeLocal(utcDate: string): string {
  const date = new Date(utcDate);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStartOfPeriod(date: Date, period: BudgetPeriod): Date {
  const d = new Date(date);
  switch (period) {
    case 'weekly': {
      const day = d.getDay();
      const diff = day === 0 ? 6 : day - 1; // Monday = start of week
      d.setDate(d.getDate() - diff);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case 'monthly':
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d;
    case 'yearly':
      d.setMonth(0, 1);
      d.setHours(0, 0, 0, 0);
      return d;
  }
}

export function getEndOfPeriod(date: Date, period: BudgetPeriod): Date {
  const d = new Date(date);
  switch (period) {
    case 'weekly': {
      const start = getStartOfPeriod(d, 'weekly');
      start.setDate(start.getDate() + 6);
      start.setHours(23, 59, 59, 999);
      return start;
    }
    case 'monthly':
      d.setMonth(d.getMonth() + 1, 0); // Last day of current month
      d.setHours(23, 59, 59, 999);
      return d;
    case 'yearly':
      d.setMonth(11, 31);
      d.setHours(23, 59, 59, 999);
      return d;
  }
}

export function isDateInRange(
  dateStr: string,
  startStr: string,
  endStr: string,
): boolean {
  const date = new Date(dateStr).getTime();
  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();
  return date >= start && date <= end;
}

export function toUTCISOString(date: Date): string {
  return date.toISOString();
}

export function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function fromUnixTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

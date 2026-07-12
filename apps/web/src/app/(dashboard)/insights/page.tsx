'use client';

import { useState, useMemo } from 'react';
import {
  useSpendingByCategory,
  useIncomeVsExpense,
  useTrends,
  useSavingsRate,
  useCategories,
} from '@/lib/crud-hooks';
import { money } from '@financial-tracker/shared-utils';
import { Card, Kpi, Chip, SectionTitle, ProgressBar, EmptyState, CHART_COLORS } from '@/components/ui';
import { IncomeExpenseBars, AreaTrend } from '@/components/charts';

function getDateRange(period: string) {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  const d = new Date(now);
  if (period === 'week') d.setDate(d.getDate() - 7);
  else if (period === 'year') d.setFullYear(d.getFullYear() - 1);
  else d.setMonth(d.getMonth() - 6);
  return { start: d.toISOString().split('T')[0], end };
}

const PERIODS = [
  { value: 'week', label: '7D' },
  { value: 'month', label: '6M' },
  { value: 'year', label: '1Y' },
] as const;

export default function InsightsPage() {
  const [period, setPeriod] = useState('month');
  const { start, end } = useMemo(() => getDateRange(period), [period]);

  const { data: spending } = useSpendingByCategory(start, end);
  const { data: incomeExpense } = useIncomeVsExpense(start, end);
  const { data: trends } = useTrends(start, end);
  const { data: savings } = useSavingsRate(start, end);
  const { data: categories } = useCategories();

  const catMap = useMemo(() => {
    const m = new Map<string, { name: string; color: string }>();
    (categories ?? []).forEach((c) => m.set(c.id, { name: c.name, color: c.color }));
    return m;
  }, [categories]);

  // Group trends into per-month income/expense bars
  const barData = useMemo(() => {
    const byMonth = new Map<string, { income: number; expense: number }>();
    (trends ?? []).forEach((t) => {
      const row = byMonth.get(t.month) ?? { income: 0, expense: 0 };
      if (t.type === 'income') row.income += Number(t.total);
      else row.expense += Number(t.total);
      byMonth.set(t.month, row);
    });
    return [...byMonth.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, v]) => ({
        label: new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'short' }),
        ...v,
      }));
  }, [trends]);

  const trendArea = useMemo(
    () => barData.map((b) => ({ label: b.label, value: b.expense })),
    [barData],
  );

  const topCategories = useMemo(() => {
    const items = (spending ?? [])
      .map((s, i) => ({
        name: catMap.get(s.category_id)?.name ?? 'Uncategorized',
        value: Number(s.total),
        color: catMap.get(s.category_id)?.color || CHART_COLORS[i % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    const max = items[0]?.value ?? 1;
    return items.map((it) => ({ ...it, pct: (it.value / max) * 100 }));
  }, [spending, catMap]);

  const avgDaily = useMemo(() => {
    if (!incomeExpense) return 0;
    const days = Math.max(1, (new Date(end).getTime() - new Date(start).getTime()) / 86400000);
    return incomeExpense.expense / days;
  }, [incomeExpense, start, end]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div>
          <div className="font-bold text-[16px]">Insights</div>
          <div className="text-[12px] text-faint mt-0.5">Spending analytics</div>
        </div>
        <div className="flex-1" />
        <div className="flex gap-1 bg-canvas rounded-[9px] p-[3px]">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`text-[11.5px] font-semibold px-2.5 py-1.5 rounded-md transition-colors ${
                period === p.value ? 'text-ink' : 'text-faint'
              }`}
              style={period === p.value ? { background: '#2a2440' } : undefined}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Kpi
          label="Savings rate"
          value={savings ? `${Math.round(savings.rate)}%` : '—'}
          chip={<Chip variant="up">this period</Chip>}
        />
        <Kpi label="Avg daily spend" value={money(Math.round(avgDaily))} />
        <Kpi label="Income" value={incomeExpense ? money(incomeExpense.income) : '—'} valueClass="text-gain-light" />
        <Kpi label="Expenses" value={incomeExpense ? money(incomeExpense.expense) : '—'} valueClass="text-loss" />
      </div>

      {/* Income vs expenses */}
      <Card>
        <SectionTitle
          title="Income vs expenses"
          sub="By month"
          right={
            <div className="flex items-center gap-3.5 text-[12px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: CHART_COLORS[1] }} />
                Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: CHART_COLORS[0] }} />
                Expenses
              </span>
            </div>
          }
        />
        {barData.length > 0 ? <IncomeExpenseBars data={barData} /> : <EmptyState>No data for this period.</EmptyState>}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="font-bold text-[14.5px] mb-3.5">Spending trend</div>
          {trendArea.length > 0 ? (
            <AreaTrend data={trendArea} height={150} color={CHART_COLORS[1]} />
          ) : (
            <EmptyState>No trend data.</EmptyState>
          )}
        </Card>

        <Card>
          <div className="font-bold text-[14.5px] mb-3.5">Top categories</div>
          {topCategories.length === 0 ? (
            <EmptyState>No spending recorded.</EmptyState>
          ) : (
            <div className="flex flex-col gap-3">
              {topCategories.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span className="font-semibold">{c.name}</span>
                    <b className="mono">{money(c.value)}</b>
                  </div>
                  <ProgressBar pct={c.pct} color={c.color} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  useAccounts,
  useTransactions,
  useIncomeVsExpense,
  useSavingsRate,
  useSpendingByCategory,
  useTrends,
  useBudgets,
  useCategories,
  useGoals,
} from '@/lib/crud-hooks';
import { money } from '@financial-tracker/shared-utils';
import { Card, Kpi, Chip, ProgressBar, SectionTitle, IconBox, EmptyState, CHART_COLORS } from '@/components/ui';
import { Donut, DonutLegend, AreaTrend, type DonutSegment } from '@/components/charts';

const monthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const end = now.toISOString().split('T')[0];
  return { start, end };
};

const budgetColor = (pct: number) =>
  pct >= 100 ? 'var(--red)' : pct > 80 ? 'var(--amber)' : 'var(--green)';

export default function DashboardPage() {
  const { start, end } = monthRange();

  const { data: accountsData } = useAccounts();
  const { data: txData } = useTransactions({ limit: 5 });
  const { data: incomeExpense } = useIncomeVsExpense(start, end);
  const { data: savings } = useSavingsRate(start, end);
  const { data: spending } = useSpendingByCategory(start, end);
  const { data: trends } = useTrends(start, end);
  const { data: budgets } = useBudgets();
  const { data: categories } = useCategories();
  const { data: goals } = useGoals();

  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData]);
  const recent = txData?.data ?? [];
  const catMap = useMemo(() => {
    const m = new Map<string, { name: string; color: string; icon?: string }>();
    (categories ?? []).forEach((c) => m.set(c.id, { name: c.name, color: c.color, icon: c.icon }));
    return m;
  }, [categories]);
  const acctMap = useMemo(() => {
    const m = new Map<string, string>();
    accounts.forEach((a) => m.set(a.id, a.name));
    return m;
  }, [accounts]);

  const totalBalance = useMemo(
    () => accounts.reduce((s, a) => s + Number(a.balance), 0),
    [accounts],
  );

  // Spending donut segments (top categories + "Other")
  const donutSegments: DonutSegment[] = useMemo(() => {
    const items = (spending ?? [])
      .map((s) => ({
        label: catMap.get(s.category_id)?.name ?? 'Uncategorized',
        value: Number(s.total),
        color: catMap.get(s.category_id)?.color ?? '',
      }))
      .sort((a, b) => b.value - a.value);
    const top = items.slice(0, 5).map((it, i) => ({ ...it, color: it.color || CHART_COLORS[i] }));
    const rest = items.slice(5).reduce((s, it) => s + it.value, 0);
    if (rest > 0) top.push({ label: 'Other', value: rest, color: '#2a2440' });
    return top;
  }, [spending, catMap]);

  const totalSpent = donutSegments.reduce((s, seg) => s + seg.value, 0);

  // Net-worth style area from cumulative monthly net
  const areaData = useMemo(() => {
    const byMonth = new Map<string, number>();
    (trends ?? []).forEach((t) => {
      const signed = t.type === 'income' ? Number(t.total) : -Number(t.total);
      byMonth.set(t.month, (byMonth.get(t.month) ?? 0) + signed);
    });
    const sorted = [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    return sorted.map(([month], i) => {
      const value = sorted.slice(0, i + 1).reduce((sum, [, net]) => sum + net, 0);
      const label = new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'short' });
      return { label, value };
    });
  }, [trends]);

  // Top budgets joined with spending totals
  const topBudgets = useMemo(() => {
    const spentByCat = new Map<string, number>();
    (spending ?? []).forEach((s) => spentByCat.set(s.category_id, Number(s.total)));
    return (budgets?.data ?? [])
      .map((b) => {
        const spent = spentByCat.get(b.category_id) ?? 0;
        const limit = Number(b.amount);
        return {
          id: b.id,
          name: catMap.get(b.category_id)?.name ?? 'Budget',
          spent,
          limit,
          pct: limit > 0 ? Math.round((spent / limit) * 100) : 0,
        };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
  }, [budgets, spending, catMap]);

  const topGoal = useMemo(() => {
    const active = (goals ?? []).filter((g) => !g.is_completed);
    return active.sort((a, b) => b.current_amount - a.current_amount)[0];
  }, [goals]);

  return (
    <div className="flex flex-col gap-4">
      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi
          hero
          label="Total balance"
          value={money(totalBalance)}
          chip={
            <span className="chip" style={{ color: '#8affd8', background: 'rgba(18,185,129,.18)' }}>
              ▲ {accounts.length} account{accounts.length !== 1 ? 's' : ''}
            </span>
          }
        />
        <Kpi
          label="Income · this month"
          value={incomeExpense ? money(incomeExpense.income) : '—'}
          valueClass="text-gain-light"
        />
        <Kpi
          label="Expenses · this month"
          value={incomeExpense ? money(incomeExpense.expense) : '—'}
          valueClass="text-loss"
        />
        <Kpi
          label="Savings rate"
          value={savings ? `${Math.round(savings.rate)}%` : '—'}
          chip={<Chip variant="vio">this month</Chip>}
        />
      </div>

      {/* Net worth + donut */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1fr] gap-4">
        <Card>
          <SectionTitle title="Net worth" sub="Cumulative net · this period" />
          <div className="h-[220px]">
            {areaData.length > 0 ? (
              <AreaTrend data={areaData} />
            ) : (
              <EmptyState>No trend data yet.</EmptyState>
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Spending by category" sub="This month" />
          {donutSegments.length > 0 ? (
            <>
              <div className="flex justify-center my-2">
                <Donut
                  segments={donutSegments}
                  centerTop={money(Math.round(totalSpent / 1000)) + 'k'}
                  centerBottom="total spent"
                />
              </div>
              <DonutLegend segments={donutSegments} />
            </>
          ) : (
            <EmptyState>No spending recorded this month.</EmptyState>
          )}
        </Card>
      </div>

      {/* Recent transactions + budgets/goal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1fr] gap-4">
        <Card>
          <SectionTitle
            title="Recent transactions"
            right={
              <Link href="/transactions" className="text-[12px] font-semibold text-primary-light">
                View all →
              </Link>
            }
          />
          {recent.length === 0 ? (
            <EmptyState>No transactions yet.</EmptyState>
          ) : (
            <div>
              {recent.map((tx) => {
                const cat = catMap.get(tx.category_id);
                const income = tx.type === 'income';
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 py-[11px] border-b border-line2 last:border-none"
                  >
                    <IconBox bg="var(--primary-tint)" color={cat?.color ?? 'var(--primary-light)'}>
                      {cat?.name?.[0] ?? '•'}
                    </IconBox>
                    <div className="min-w-0">
                      <div className="font-semibold text-[13px] truncate">
                        {tx.description || cat?.name || 'Transaction'}
                      </div>
                      <div className="text-[11px] text-faint mt-0.5 truncate">
                        {cat?.name ?? 'Uncategorized'} · {acctMap.get(tx.account_id) ?? 'Account'}
                      </div>
                    </div>
                    <div className="flex-1" />
                    <div className="text-right">
                      <div
                        className="mono text-[13.5px]"
                        style={{ color: income ? 'var(--green-d)' : 'var(--red)' }}
                      >
                        {income ? '+' : '−'}
                        {money(Math.abs(Number(tx.amount)))}
                      </div>
                      <div className="text-[11px] text-faint mt-0.5">{tx.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="font-bold text-[14.5px] mb-3.5">Top budgets</div>
            {topBudgets.length === 0 ? (
              <EmptyState>No budgets set.</EmptyState>
            ) : (
              <div className="flex flex-col gap-3.5">
                {topBudgets.map((b) => (
                  <div key={b.id}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="font-semibold">{b.name}</span>
                      <span className="text-faint">
                        <b className="mono text-ink">{money(b.spent)}</b> / {money(b.limit)}
                      </span>
                    </div>
                    <ProgressBar pct={b.pct} color={budgetColor(b.pct)} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {topGoal ? (
            <Card>
              <SectionTitle
                title={topGoal.name}
                right={
                  <Chip variant="up">
                    {Math.round((topGoal.current_amount / topGoal.target_amount) * 100)}%
                  </Chip>
                }
              />
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="mono text-[22px]">{money(topGoal.current_amount)}</span>
                <span className="text-[12px] text-faint">/ {money(topGoal.target_amount)}</span>
              </div>
              <ProgressBar
                pct={(topGoal.current_amount / topGoal.target_amount) * 100}
                color="linear-gradient(90deg,var(--primary),var(--green))"
                height={9}
              />
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

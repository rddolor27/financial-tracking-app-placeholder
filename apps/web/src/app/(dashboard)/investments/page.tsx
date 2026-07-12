'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateInvestmentSchema } from '@financial-tracker/shared-types';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useInvestments, useCreateInvestment, useDeleteInvestment, useAccounts } from '@/lib/crud-hooks';
import { money, formatCurrency } from '@financial-tracker/shared-utils';
import { Card, Kpi, Chip, SectionTitle, IconBox, EmptyState } from '@/components/ui';
import { Donut, DonutLegend, type DonutSegment } from '@/components/charts';

type InvestmentForm = {
  account_id: string;
  symbol: string;
  name: string;
  asset_type: 'crypto' | 'us_stock' | 'ph_stock';
  quantity?: number;
  avg_buy_price?: number;
  currency?: string;
};

const ASSET_TYPES = [
  { value: 'crypto', label: 'Crypto' },
  { value: 'us_stock', label: 'US Stock' },
  { value: 'ph_stock', label: 'PH Stock' },
] as const;

const ASSET_LABEL: Record<string, string> = {
  crypto: 'Crypto',
  us_stock: 'US Stocks',
  ph_stock: 'PH Stocks',
};
const ASSET_COLOR: Record<string, string> = {
  crypto: '#3b82f6',
  us_stock: '#38bdf8',
  ph_stock: '#f5a524',
};

export default function InvestmentsPage() {
  const { data: investmentsData, isLoading } = useInvestments();
  const { data: accountsData } = useAccounts();
  const createMutation = useCreateInvestment();
  const deleteMutation = useDeleteInvestment();
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvestmentForm>({
    resolver: zodResolver(CreateInvestmentSchema),
    defaultValues: { quantity: 0, avg_buy_price: 0, currency: 'USD' },
  });

  const investments = investmentsData?.data ?? [];
  const investmentAccounts = (accountsData?.data ?? []).filter((a) => a.type === 'investment');

  const stats = useMemo(() => {
    let value = 0;
    let cost = 0;
    const byType = new Map<string, number>();
    investments.forEach((inv) => {
      const v = inv.quantity * inv.current_price;
      value += v;
      cost += inv.quantity * inv.avg_buy_price;
      byType.set(inv.asset_type, (byType.get(inv.asset_type) ?? 0) + v);
    });
    const gain = value - cost;
    const gainPct = cost > 0 ? (gain / cost) * 100 : 0;
    const allocation: DonutSegment[] = [...byType.entries()].map(([type, v]) => ({
      label: ASSET_LABEL[type] ?? type,
      value: Math.round(v),
      color: ASSET_COLOR[type] ?? '#818cf8',
    }));
    return { value, cost, gain, gainPct, allocation };
  }, [investments]);

  const onSubmit = async (data: InvestmentForm) => {
    await createMutation.mutateAsync(data as Parameters<typeof createMutation.mutateAsync>[0]);
    reset();
    setShowForm(false);
  };

  const inputCls =
    'w-full px-3 py-2 rounded-[10px] bg-canvas border border-line text-[13px] text-ink focus:outline-none focus:border-primary';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div>
          <div className="font-bold text-[16px]">Portfolio</div>
          <div className="text-[12px] text-faint mt-0.5">{investments.length} holdings</div>
        </div>
        <div className="flex-1" />
        <button onClick={() => setShowForm((v) => !v)} className="btn-p">
          <FiPlus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add investment'}
        </button>
      </div>

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Kpi
          hero
          label="Portfolio value"
          value={money(Math.round(stats.value))}
          chip={
            <span className="chip" style={{ color: '#8affd8', background: 'rgba(18,185,129,.18)' }}>
              ▲ {stats.gainPct.toFixed(1)}%
            </span>
          }
        />
        <Kpi
          label="Total gain / loss"
          value={`${stats.gain >= 0 ? '+' : '−'}${money(Math.abs(Math.round(stats.gain)))}`}
          valueClass={stats.gain >= 0 ? 'text-gain-light' : 'text-loss'}
          chip={<Chip variant={stats.gain >= 0 ? 'up' : 'down'}>{stats.gainPct.toFixed(1)}% all-time</Chip>}
        />
        <Kpi label="Cost basis" value={money(Math.round(stats.cost))} />
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Symbol</label>
                <input {...register('symbol')} className={inputCls} placeholder="e.g. BTC, AAPL, SM" />
                {errors.symbol && <p className="text-loss text-[12px] mt-1">{errors.symbol.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Name</label>
                <input {...register('name')} className={inputCls} placeholder="e.g. Bitcoin, Apple Inc." />
                {errors.name && <p className="text-loss text-[12px] mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Asset type</label>
                <select {...register('asset_type')} className={inputCls}>
                  {ASSET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Account</label>
                <select {...register('account_id')} className={inputCls}>
                  <option value="">Select account</option>
                  {investmentAccounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                {errors.account_id && <p className="text-loss text-[12px] mt-1">{errors.account_id.message}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Currency</label>
                <select {...register('currency')} className={inputCls}>
                  <option value="USD">USD</option>
                  <option value="PHP">PHP</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Quantity</label>
                <input type="number" step="0.0001" {...register('quantity', { valueAsNumber: true })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-muted mb-1">Avg buy price</label>
                <input type="number" step="0.01" {...register('avg_buy_price', { valueAsNumber: true })} className={inputCls} />
              </div>
            </div>
            <button type="submit" disabled={createMutation.isPending} className="btn-p self-start disabled:opacity-50">
              {createMutation.isPending ? 'Creating…' : 'Add investment'}
            </button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <Card><EmptyState>Loading investments…</EmptyState></Card>
      ) : investments.length === 0 ? (
        <Card><EmptyState>No investments yet. Add one to track your portfolio.</EmptyState></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <SectionTitle title="Holdings" sub={`${investments.length} assets`} />
            {investments.map((inv) => {
              const value = inv.quantity * inv.current_price;
              const cost = inv.quantity * inv.avg_buy_price;
              const pnlPct = cost > 0 ? ((value - cost) / cost) * 100 : 0;
              const up = pnlPct >= 0;
              return (
                <div key={inv.id} className="flex items-center gap-3 py-[11px] border-b border-line2 last:border-none">
                  <IconBox bg={`${ASSET_COLOR[inv.asset_type]}1a`} color={ASSET_COLOR[inv.asset_type]}>
                    {inv.symbol[0]}
                  </IconBox>
                  <div className="min-w-0">
                    <div className="font-semibold text-[13px] truncate">{inv.name}</div>
                    <div className="text-[11px] text-faint mt-0.5">
                      {inv.symbol} · {ASSET_LABEL[inv.asset_type]}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <div className="text-right">
                    <div className="mono text-[13px]">{formatCurrency(value, inv.currency)}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: up ? 'var(--green-d)' : 'var(--red)' }}>
                      {up ? '▲' : '▼'} {Math.abs(pnlPct).toFixed(1)}%
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(inv.id)}
                    title="Delete"
                    className="ml-2 text-faint hover:text-loss transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </Card>

          <Card>
            <SectionTitle title="Allocation" sub="By asset type" />
            {stats.allocation.length > 0 ? (
              <>
                <div className="flex justify-center my-3">
                  <Donut segments={stats.allocation} />
                </div>
                <DonutLegend segments={stats.allocation} />
              </>
            ) : (
              <EmptyState>No allocation data.</EmptyState>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { CHART_COLORS } from './ui';

export type DonutSegment = { label: string; value: number; color: string };

/** Pure-SVG donut mirroring the handoff (stroke-dasharray wedges). */
export function Donut({
  segments,
  centerTop,
  centerBottom,
  size = 160,
}: {
  segments: DonutSegment[];
  centerTop?: string;
  centerBottom?: string;
  size?: number;
}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const lengths = segments.map((seg) => (seg.value / total) * c);
  // Offset of each wedge = sum of the lengths that precede it (no mutation).
  const offsets = lengths.map((_, i) =>
    lengths.slice(0, i).reduce((sum, len) => sum + len, 0),
  );

  return (
    <svg width={size} height={size} viewBox="0 0 160 160">
      <g transform="rotate(-90 80 80)" fill="none" strokeWidth={18}>
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={80}
            cy={80}
            r={r}
            stroke={seg.color}
            strokeDasharray={`${lengths[i]} ${c - lengths[i]}`}
            strokeDashoffset={-offsets[i]}
          />
        ))}
      </g>
      {centerTop ? (
        <text
          x={80}
          y={centerBottom ? 74 : 84}
          textAnchor="middle"
          fontFamily="Space Grotesk"
          fontWeight={600}
          fontSize={21}
          fill="var(--ink)"
        >
          {centerTop}
        </text>
      ) : null}
      {centerBottom ? (
        <text x={80} y={92} textAnchor="middle" fontSize={10} fill="var(--faint)">
          {centerBottom}
        </text>
      ) : null}
    </svg>
  );
}

export function DonutLegend({ segments }: { segments: DonutSegment[] }) {
  return (
    <div className="flex flex-col gap-2.5 text-[12px]">
      {segments.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-[9px] h-[9px] rounded-[3px] shrink-0"
            style={{ background: s.color }}
          />
          <span className="truncate">{s.label}</span>
          <span className="flex-1" />
          <b className="mono">{s.value.toLocaleString('en-US')}</b>
        </div>
      ))}
    </div>
  );
}

/** Area/line trend with a primary gradient fill. */
export function AreaTrend({
  data,
  height = 220,
  color = '#3b82f6',
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity={0.22} />
            <stop offset="1" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--faint)', fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            color: 'var(--ink)',
            fontSize: 12,
          }}
          labelStyle={{ color: 'var(--faint)' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          fill="url(#areaFill)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Grouped income-vs-expense bars. */
export function IncomeExpenseBars({
  data,
  height = 220,
}: {
  data: { label: string; income: number; expense: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--faint)', fontSize: 11 }}
        />
        <Tooltip
          cursor={{ fill: 'var(--line2)' }}
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            color: 'var(--ink)',
            fontSize: 12,
          }}
          labelStyle={{ color: 'var(--faint)' }}
        />
        <Bar dataKey="income" fill={CHART_COLORS[1]} radius={[6, 6, 0, 0]} />
        <Bar dataKey="expense" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

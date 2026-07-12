'use client';

import type { ReactNode } from 'react';

export const CHART_COLORS = [
  '#3b82f6',
  '#38bdf8',
  '#f5a524',
  '#5a9bf6',
  '#e5484d',
  '#818cf8',
  '#34d399',
];

export function Card({
  children,
  className = '',
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return <div className={`card ${pad ? 'pad' : ''} ${className}`}>{children}</div>;
}

export function Kpi({
  label,
  value,
  chip,
  hero = false,
  valueClass = '',
}: {
  label: string;
  value: ReactNode;
  chip?: ReactNode;
  hero?: boolean;
  valueClass?: string;
}) {
  return (
    <div className={`kpi ${hero ? 'hero' : ''}`}>
      <div className="kpi-lbl" style={hero ? { color: '#b3aad6' } : undefined}>
        {label}
      </div>
      <div className={`kpi-val ${valueClass}`}>{value}</div>
      {chip ? <div className="mt-[9px]">{chip}</div> : null}
    </div>
  );
}

type ChipVariant = 'up' | 'down' | 'vio' | 'amb';

export function Chip({
  variant = 'vio',
  children,
  className = '',
}: {
  variant?: ChipVariant;
  children: ReactNode;
  className?: string;
}) {
  return <span className={`chip chip-${variant} ${className}`}>{children}</span>;
}

export function ProgressBar({
  pct,
  color,
  height = 7,
}: {
  pct: number;
  color: string;
  height?: number;
}) {
  return (
    <div className="bar" style={{ height }}>
      <i style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  );
}

export function SectionTitle({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-3.5">
      <div>
        <div className="font-bold text-[14.5px]">{title}</div>
        {sub ? <div className="text-[12px] text-faint mt-0.5">{sub}</div> : null}
      </div>
      {right}
    </div>
  );
}

export function IconBox({
  children,
  bg,
  color,
  size = 38,
  radius = 11,
}: {
  children: ReactNode;
  bg: string;
  color: string;
  size?: number;
  radius?: number;
}) {
  return (
    <div
      className="ic-box"
      style={{ width: size, height: size, background: bg, color, borderRadius: radius }}
    >
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="text-[13px] text-faint py-6 text-center">{children}</div>;
}

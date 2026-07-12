import React from 'react';
import { render, screen } from '@testing-library/react';
import { Chip, ProgressBar, Kpi, IconBox, EmptyState } from './ui';

describe('Chip', () => {
  it('renders children with the variant class', () => {
    const { container } = render(<Chip variant="up">+4.2%</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toBeTruthy();
    expect(chip?.className).toContain('chip-up');
    expect(screen.getByText('+4.2%')).toBeTruthy();
  });
});

describe('ProgressBar', () => {
  it('clamps the fill width to 100%', () => {
    const { container } = render(<ProgressBar pct={140} color="red" />);
    const fill = container.querySelector('i') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('never goes below 0%', () => {
    const { container } = render(<ProgressBar pct={-20} color="red" />);
    const fill = container.querySelector('i') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('applies the given color', () => {
    const { container } = render(<ProgressBar pct={50} color="rgb(1, 2, 3)" />);
    const fill = container.querySelector('i') as HTMLElement;
    expect(fill.style.background).toBe('rgb(1, 2, 3)');
  });
});

describe('Kpi', () => {
  it('renders label and value', () => {
    render(<Kpi label="Total balance" value="₱248,530" />);
    expect(screen.getByText('Total balance')).toBeTruthy();
    expect(screen.getByText('₱248,530')).toBeTruthy();
  });
});

describe('IconBox', () => {
  it('renders content', () => {
    render(<IconBox bg="#111" color="#fff">B</IconBox>);
    expect(screen.getByText('B')).toBeTruthy();
  });
});

describe('EmptyState', () => {
  it('renders its message', () => {
    render(<EmptyState>No transactions yet.</EmptyState>);
    expect(screen.getByText('No transactions yet.')).toBeTruthy();
  });
});

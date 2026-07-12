import React from 'react';
import { render, screen } from '@testing-library/react';
import { Donut, DonutLegend, type DonutSegment } from './charts';

const segments: DonutSegment[] = [
  { label: 'Rent', value: 16250, color: '#3b82f6' },
  { label: 'Food', value: 11920, color: '#38bdf8' },
  { label: 'Transport', value: 6500, color: '#f5a524' },
];

describe('Donut', () => {
  it('renders one arc per segment', () => {
    const { container } = render(<Donut segments={segments} />);
    expect(container.querySelectorAll('circle')).toHaveLength(3);
  });

  it('renders center labels when provided', () => {
    render(<Donut segments={segments} centerTop="₱35k" centerBottom="total spent" />);
    expect(screen.getByText('₱35k')).toBeTruthy();
    expect(screen.getByText('total spent')).toBeTruthy();
  });
});

describe('DonutLegend', () => {
  it('renders a row per segment with grouped values', () => {
    render(<DonutLegend segments={segments} />);
    expect(screen.getByText('Rent')).toBeTruthy();
    expect(screen.getByText('Food')).toBeTruthy();
    expect(screen.getByText('16,250')).toBeTruthy();
  });
});

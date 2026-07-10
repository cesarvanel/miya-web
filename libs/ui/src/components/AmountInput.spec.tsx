import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { AmountInput, formatAmount, parseAmount } from './AmountInput';

describe('formatAmount', () => {
  it('groups thousands with spaces', () => {
    expect(formatAmount(0)).toBe('0');
    expect(formatAmount(500)).toBe('500');
    expect(formatAmount(127500)).toBe('127 500');
    expect(formatAmount(1234567)).toBe('1 234 567');
  });
});

describe('parseAmount', () => {
  it('keeps only digits and returns an integer', () => {
    expect(parseAmount('127 500')).toBe(127500);
    expect(parseAmount('12a7.5-00')).toBe(127500);
  });

  it('returns null when there is no digit', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
  });
});

const ControlledAmountInput = ({ initial }: { initial: number | null }) => {
  const [value, setValue] = useState<number | null>(initial);
  return <AmountInput value={value} onChange={setValue} aria-label="Montant" />;
};

describe('AmountInput', () => {
  it('renders the formatted value with FCFA suffix', () => {
    render(<AmountInput value={127500} onChange={() => undefined} aria-label="Montant" />);
    expect(screen.getByLabelText('Montant')).toHaveProperty('value', '127 500');
    expect(screen.getByText('FCFA')).toBeDefined();
  });

  it('formats while typing', () => {
    render(<ControlledAmountInput initial={null} />);
    const input = screen.getByLabelText('Montant');
    fireEvent.change(input, { target: { value: '1234567' } });
    expect(input).toHaveProperty('value', '1 234 567');
  });

  it('strips non-digit characters as you type', () => {
    render(<ControlledAmountInput initial={null} />);
    const input = screen.getByLabelText('Montant');
    fireEvent.change(input, { target: { value: '12x500' } });
    expect(input).toHaveProperty('value', '12 500');
  });

  it('emits null when cleared', () => {
    const onChange = vi.fn();
    render(<AmountInput value={500} onChange={onChange} aria-label="Montant" />);
    fireEvent.change(screen.getByLabelText('Montant'), { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('emits the parsed integer on change', () => {
    const onChange = vi.fn();
    render(<AmountInput value={null} onChange={onChange} aria-label="Montant" />);
    fireEvent.change(screen.getByLabelText('Montant'), {
      target: { value: '44 500' },
    });
    expect(onChange).toHaveBeenCalledWith(44500);
  });
});

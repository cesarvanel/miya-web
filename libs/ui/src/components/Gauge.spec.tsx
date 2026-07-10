import { render, screen } from '@testing-library/react';
import { Gauge, gaugeRatio } from './Gauge';

describe('gaugeRatio', () => {
  it('computes the value/max ratio', () => {
    expect(gaugeRatio(85000, 100000)).toBe(0.85);
    expect(gaugeRatio(0, 100000)).toBe(0);
  });

  it('clamps between 0 and 1', () => {
    expect(gaugeRatio(150000, 100000)).toBe(1);
    expect(gaugeRatio(-5, 100)).toBe(0);
  });

  it('returns 0 when max is zero or negative', () => {
    expect(gaugeRatio(50, 0)).toBe(0);
    expect(gaugeRatio(50, -10)).toBe(0);
  });
});

describe('Gauge', () => {
  it('sizes the fill from the ratio and exposes meter semantics', () => {
    render(<Gauge value={85000} max={100000} label="Plafond" />);
    expect(screen.getByTestId('gauge-fill').style.width).toBe('85%');
    const meter = screen.getByRole('meter');
    expect(meter.getAttribute('aria-valuenow')).toBe('85000');
    expect(meter.getAttribute('aria-valuemax')).toBe('100000');
  });

  it('switches to the amber state above warnRatio', () => {
    const { container } = render(
      <Gauge value={85000} max={100000} warnRatio={0.8} label="Plafond" />,
    );
    expect(container.querySelector('[data-warning="true"]')).not.toBeNull();
  });

  it('stays in the normal state below warnRatio', () => {
    const { container } = render(
      <Gauge value={40000} max={100000} warnRatio={0.8} label="Plafond" />,
    );
    expect(container.querySelector('[data-warning="false"]')).not.toBeNull();
  });

  it('shows formatted amounts', () => {
    render(<Gauge value={85000} max={100000} label="Plafond" />);
    expect(screen.getByText('85 000 / 100 000')).toBeDefined();
  });
});

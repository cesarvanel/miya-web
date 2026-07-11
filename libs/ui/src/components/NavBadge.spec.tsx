import { render, screen } from '@testing-library/react';
import { NavBadge } from './NavBadge';

describe('NavBadge', () => {
  it('renders nothing when the count is zero', () => {
    const { container } = render(<NavBadge count={0} tone="amber" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for a negative count', () => {
    const { container } = render(<NavBadge count={-1} tone="red" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the count when positive', () => {
    render(<NavBadge count={4} tone="amber" />);
    expect(screen.getByText('4')).toBeDefined();
  });

  it('applies the amber tone classes by default', () => {
    render(<NavBadge count={3} tone="amber" />);
    expect(screen.getByText('3').className).toContain('bg-badge-amber');
  });

  it('applies the red tone classes', () => {
    render(<NavBadge count={3} tone="red" />);
    expect(screen.getByText('3').className).toContain('bg-danger');
  });

  it('applies the neutral tone classes', () => {
    render(<NavBadge count={6} tone="neutral" />);
    expect(screen.getByText('6').className).toContain('bg-primary');
  });

  it('inverts to a white pill with tone-colored text when active', () => {
    render(<NavBadge count={3} tone="red" inverted />);
    const badge = screen.getByText('3');
    expect(badge.className).toContain('bg-white');
    expect(badge.className).toContain('text-danger');
  });
});

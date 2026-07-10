import { render, screen } from '@testing-library/react';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('shows the Miya Banque home with a link to the design system page', () => {
    render(<App />);
    expect(screen.getByText(/Miya/)).toBeDefined();
    expect(
      screen.getByRole('link', { name: /Design system/i }),
    ).toBeDefined();
  });
});

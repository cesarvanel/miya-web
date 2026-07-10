import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { platformRoutes } from './router';

const renderAt = (path: string) =>
  render(
    <RouterProvider
      router={createMemoryRouter(platformRoutes, { initialEntries: [path] })}
    />,
  );

describe('platform router', () => {
  it('renders the admin sidebar and the overview placeholder at /', () => {
    renderAt('/');
    expect(screen.getByText('Console éditeur')).toBeDefined();
    expect(screen.getByText('Plateforme')).toBeDefined();
    expect(screen.getByRole('heading', { name: "Vue d'ensemble" })).toBeDefined();
  });

  it('renders each module placeholder under the layout', () => {
    renderAt('/tenants');
    expect(screen.getByRole('heading', { name: 'Banques' })).toBeDefined();
    expect(screen.getByText('Console éditeur')).toBeDefined();
  });

  it('marks the active link only', () => {
    renderAt('/billing');
    const active = screen.getByRole('link', { name: /Abonnements/ });
    const inactive = screen.getByRole('link', { name: /Banques/ });
    expect(active.className).toContain('bg-admin-primary');
    expect(inactive.className).not.toContain('bg-admin-primary');
  });

  it('renders the login placeholder outside the layout', () => {
    renderAt('/auth/login');
    expect(screen.getByText(/Connexion/)).toBeDefined();
    expect(screen.queryByText('Console éditeur')).toBeNull();
  });
});

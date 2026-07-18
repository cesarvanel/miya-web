import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { LoginAsync } from '@/modules/auth';
import { platformRoutes } from './router';
import { makePlatformDependencies } from './dependencies';
import { makePlatformStore } from './store';
import type { PlatformStore } from './store';

const makeStore = () => makePlatformStore(makePlatformDependencies());

const loginAsOwner = async (store: PlatformStore) => {
  await store.dispatch(LoginAsync({ identifier: 'cesar@miya.cm', password: 'demo' }));
};

const renderAt = (path: string, store: PlatformStore = makeStore()) =>
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(platformRoutes, { initialEntries: [path] })} />
    </Provider>,
  );

describe('platform router', () => {
  it('renders the admin sidebar and the overview once authenticated', async () => {
    const store = makeStore();
    await loginAsOwner(store);
    renderAt('/', store);
    expect(await screen.findByRole('heading', { name: "Vue d'ensemble" })).toBeDefined();
    expect(screen.getByText('Console éditeur')).toBeDefined();
    expect(screen.getByText('Plateforme')).toBeDefined();
  });

  it('renders the tenants list under the layout', async () => {
    const store = makeStore();
    await loginAsOwner(store);
    renderAt('/tenants', store);
    expect(await screen.findByRole('heading', { name: 'Banques clientes' })).toBeDefined();
    expect(screen.getByText('Console éditeur')).toBeDefined();
    expect(await screen.findByText('MEC La Confiance')).toBeDefined();
  });

  it('renders the profile page with identity, security and notifications', async () => {
    const store = makeStore();
    await loginAsOwner(store);
    renderAt('/profile', store);
    expect(await screen.findByRole('heading', { name: 'Mon profil' })).toBeDefined();
    expect((await screen.findAllByText('Console éditeur')).length).toBeGreaterThan(0);
    expect(await screen.findByText('Informations personnelles')).toBeDefined();
    expect(await screen.findByText('Sécurité')).toBeDefined();
    expect(await screen.findByText('Journal de mes actions')).toBeDefined();
  });

  it('renders the platform settings page with identity, collaborators and templates', async () => {
    const store = makeStore();
    await loginAsOwner(store);
    renderAt('/settings', store);
    expect(await screen.findByRole('heading', { name: 'Paramètres' })).toBeDefined();
    expect((await screen.findAllByText('Comptes super admin')).length).toBeGreaterThan(0);
    expect(await screen.findByText('César Vanel')).toBeDefined();
    expect(await screen.findByText('Modèles de notifications')).toBeDefined();
  });

  it('renders the activity page with its supervision sections under the layout', async () => {
    const store = makeStore();
    await loginAsOwner(store);
    renderAt('/activity', store);
    expect(await screen.findByRole('heading', { name: 'Activité plateforme' })).toBeDefined();
    expect(await screen.findByText(/Journal d.audit/)).toBeDefined();
  });

  it('marks the active link only', async () => {
    const store = makeStore();
    await loginAsOwner(store);
    renderAt('/billing', store);
    await screen.findByRole('heading', { name: 'Abonnements & facturation' });
    const active = screen.getByRole('link', { name: /Abonnements/ });
    const inactive = screen.getByRole('link', { name: /Banques/ });
    expect(active.className).toContain('bg-admin-primary');
    expect(inactive.className).not.toContain('bg-admin-primary');
  });

  it('renders the login page outside the layout for an anonymous visitor', () => {
    renderAt('/auth/login');
    expect(screen.getByText('Connexion à la console éditeur')).toBeDefined();
    expect(screen.queryByText('Console éditeur — accès restreint')).toBeDefined();
    expect(screen.queryByText('Plateforme')).toBeNull();
  });

  it('redirects an anonymous visitor from a protected route to /auth/login', async () => {
    renderAt('/tenants');
    expect(await screen.findByText('Connexion à la console éditeur')).toBeDefined();
  });
});

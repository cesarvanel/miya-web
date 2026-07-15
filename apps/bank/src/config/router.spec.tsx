import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { LoginAsync, SelectBankAsync } from '@/modules/auth';
import { bankRoutes } from './router';
import { makeBankDependencies } from './stores/dependencies/dependencies';
import { FakeRealtimeClient } from './stores/socket/realtime';
import { makeBankStore } from './stores/store';
import type { BankStore } from './stores/store';

const makeStore = () => makeBankStore(makeBankDependencies(), new FakeRealtimeClient());

/** Antoine Mbarga — responsable, connexion directe (compte mono-banque). */
const loginAsSupervisor = async (store: BankStore) => {
  await store.dispatch(LoginAsync({ identifier: 'a.mbarga@laconfiance.cm', password: 'demo' }));
};

/** Diane Ndione — administratrice, compte multi-banques (passe par la sélection d'établissement). */
const loginAsBankAdmin = async (store: BankStore) => {
  const result = await store.dispatch(LoginAsync({ identifier: 'd.ndione@laconfiance.cm', password: 'demo' }));
  if (LoginAsync.fulfilled.match(result) && result.payload.outcome.kind === 'SelectBank') {
    const { user, banks } = result.payload.outcome;
    await store.dispatch(SelectBankAsync({ userId: user.id, bankId: banks[0].id }));
  }
};

const renderAt = (path: string, store: BankStore = makeStore()) =>
  render(
    <Provider store={store}>
      <RouterProvider router={createMemoryRouter(bankRoutes(store), { initialEntries: [path] })} />
    </Provider>,
  );

describe('bank router', () => {
  it('renders the sidebar and the dashboard at / once authenticated', async () => {
    const store = makeStore();
    await loginAsSupervisor(store);
    renderAt('/', store);
    // Le loader de route est async (fetch caché) : attendre l'hydratation.
    expect(
      await screen.findByRole('heading', { name: 'Tableau de bord' }),
    ).toBeDefined();
    expect(screen.getByText('MEC La Confiance')).toBeDefined();
    expect(screen.getByText('Pilotage')).toBeDefined();
  });

  it('hides Administration for a supervisor', async () => {
    const supervisorStore = makeStore();
    await loginAsSupervisor(supervisorStore);
    renderAt('/', supervisorStore);
    await screen.findByRole('heading', { name: 'Tableau de bord' });
    expect(screen.queryByRole('link', { name: 'Administration' })).toBeNull();
  });

  it('shows Administration for a bank admin', async () => {
    const adminStore = makeStore();
    await loginAsBankAdmin(adminStore);
    renderAt('/', adminStore);
    await screen.findByRole('heading', { name: 'Tableau de bord' });
    expect(screen.getByRole('link', { name: 'Administration' })).toBeDefined();
  });

  it('renders the settlements queue under the layout', async () => {
    const store = makeStore();
    await loginAsSupervisor(store);
    renderAt('/settlements', store);
    // Le loader de route est async (fetch caché) : attendre l'hydratation.
    expect(
      await screen.findByRole('heading', { name: 'Reversements' }),
    ).toBeDefined();
    // La sidebar est bien présente autour de la page.
    expect(screen.getByText('MEC La Confiance')).toBeDefined();
  });

  it('marks the active link only', async () => {
    const store = makeStore();
    await loginAsSupervisor(store);
    renderAt('/disputes', store);
    // Le loader de route est async (fetch caché) : attendre l'hydratation.
    await screen.findByRole('heading', { name: 'Contestations' });
    const active = screen.getByRole('link', { name: /Contestations/ });
    const inactive = screen.getByRole('link', { name: /Tournées/ });
    expect(active.className).toContain('bg-primary');
    expect(inactive.className).not.toContain('bg-primary');
  });

  it('renders the login page outside the layout for an anonymous visitor', () => {
    renderAt('/login');
    expect(screen.getByText('Connexion à votre espace')).toBeDefined();
    // Pas de sidebar sur l'écran de connexion.
    expect(screen.queryByText('Pilotage')).toBeNull();
  });

  it('redirects an anonymous visitor from a protected route to /login', async () => {
    renderAt('/settlements');
    expect(await screen.findByText('Connexion à votre espace')).toBeDefined();
  });
});

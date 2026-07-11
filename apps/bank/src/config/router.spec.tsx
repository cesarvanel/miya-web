import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { bankRoutes } from './router';
import { makeBankDependencies } from './stores/dependencies/dependencies';
import { FakeRealtimeClient } from './stores/socket/realtime';
import { makeBankStore } from './stores/store';

const renderAt = (path: string) => {
  const store = makeBankStore(makeBankDependencies(), new FakeRealtimeClient());
  return render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(bankRoutes(store), { initialEntries: [path] })}
      />
    </Provider>,
  );
};

describe('bank router', () => {
  it('renders the sidebar and the dashboard at /', async () => {
    renderAt('/');
    // Le loader de route est async (fetch caché) : attendre l'hydratation.
    expect(
      await screen.findByRole('heading', { name: 'Tableau de bord' }),
    ).toBeDefined();
    expect(screen.getByText('MEC La Confiance')).toBeDefined();
    expect(screen.getByText('Pilotage')).toBeDefined();
    expect(screen.getByText('Administration')).toBeDefined();
  });

  it('renders the settlements queue under the layout', async () => {
    renderAt('/settlements');
    // Le loader de route est async (fetch caché) : attendre l'hydratation.
    expect(
      await screen.findByRole('heading', { name: 'Reversements' }),
    ).toBeDefined();
    // La sidebar est bien présente autour de la page.
    expect(screen.getByText('MEC La Confiance')).toBeDefined();
  });

  it('marks the active link only', async () => {
    renderAt('/disputes');
    // Le loader de route est async (fetch caché) : attendre l'hydratation.
    await screen.findByRole('heading', { name: 'Contestations' });
    const active = screen.getByRole('link', { name: /Contestations/ });
    const inactive = screen.getByRole('link', { name: /Tournées/ });
    expect(active.className).toContain('bg-primary');
    expect(inactive.className).not.toContain('bg-primary');
  });

  it('renders the login placeholder outside the layout', () => {
    renderAt('/auth/login');
    expect(screen.getByText(/Connexion/)).toBeDefined();
    expect(screen.queryByText('MEC La Confiance')).toBeNull();
  });
});

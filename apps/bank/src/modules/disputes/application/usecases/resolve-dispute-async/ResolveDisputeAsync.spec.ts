import { LoginAsync } from '@/modules/auth';
import { FetchDaySummaryAsync } from '@/modules/dashboard';
import { makeBankDependencies } from '@/config/stores/dependencies/dependencies';
import { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import { makeBankStore } from '@/config/stores/store';
import { FetchDisputesAsync } from '../fetch-disputes-async/FetchDisputesAsync';
import { ResolveDisputeAsync } from './ResolveDisputeAsync';

const makeStore = () => makeBankStore(makeBankDependencies(), new FakeRealtimeClient());

describe('ResolveDisputeAsync', () => {
  it('resolves in favor of the client and decrements the agent’s dashboard dispute count', async () => {
    const store = makeStore();
    await store.dispatch(LoginAsync({ identifier: 'a.mbarga@laconfiance.cm', password: 'demo' }));
    await store.dispatch(FetchDaySummaryAsync({}));
    await store.dispatch(FetchDisputesAsync({}));

    expect(
      store.getState().dashboard.agents.entities['agent-grace-atangana']?.openDisputesCount,
    ).toBe(1);

    const result = await store.dispatch(
      ResolveDisputeAsync({ disputeId: 'CT-0703-07', inFavorOf: 'Client', reason: 'Reçu SMS présenté.' }),
    );

    expect(result.meta.requestStatus).toBe('fulfilled');
    const dispute = store.getState().disputes.entities['CT-0703-07'];
    expect(dispute?.status).toBe('Resolved');
    expect(dispute?.resolution).toMatchObject({
      decidedInFavorOf: 'Client',
      reason: 'Reçu SMS présenté.',
      decidedBy: 'Antoine Mbarga',
    });

    expect(
      store.getState().dashboard.agents.entities['agent-grace-atangana']?.openDisputesCount,
    ).toBe(0);
  });

  it('resolves in favor of the agent', async () => {
    const store = makeStore();
    await store.dispatch(FetchDisputesAsync({}));

    const result = await store.dispatch(
      ResolveDisputeAsync({ disputeId: 'CT-0703-06', inFavorOf: 'Agent', reason: 'Montant confirmé par le client.' }),
    );

    expect(result.meta.requestStatus).toBe('fulfilled');
    expect(store.getState().disputes.entities['CT-0703-06']?.resolution?.decidedInFavorOf).toBe('Agent');
  });

  it('rejects when the dispute does not exist', async () => {
    const store = makeStore();
    await store.dispatch(FetchDisputesAsync({}));

    const result = await store.dispatch(
      ResolveDisputeAsync({ disputeId: 'missing', inFavorOf: 'Agent', reason: 'x' }),
    );

    expect(result.meta.requestStatus).toBe('rejected');
  });
});

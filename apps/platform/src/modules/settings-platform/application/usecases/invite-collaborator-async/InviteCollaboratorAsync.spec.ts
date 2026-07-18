import { LoginAsync, PlatformUserRole } from '@/modules/auth';
import { makePlatformDependencies } from '@/config/dependencies';
import { makePlatformStore } from '@/config/store';
import { ChangeCollaboratorRoleAsync } from '../change-collaborator-role-async/ChangeCollaboratorRoleAsync';
import { FetchPlatformSettingsAsync } from '../fetch-platform-settings-async/FetchPlatformSettingsAsync';
import { InviteCollaboratorAsync } from './InviteCollaboratorAsync';

const makeStore = () => makePlatformStore(makePlatformDependencies());

describe('InviteCollaboratorAsync', () => {
  it('invites a ReadOnly collaborator and the activity module journals a CollaboratorAdded audit entry — without ever fetching activity', async () => {
    const store = makeStore();
    await store.dispatch(LoginAsync({ identifier: 'cesar@miya.cm', password: 'demo' }));
    await store.dispatch(FetchPlatformSettingsAsync());

    const result = await store.dispatch(
      InviteCollaboratorAsync({ fullName: 'Nouvelle Recrue', email: 'n.recrue@miya.cm', role: PlatformUserRole.ReadOnly }),
    );
    expect(result.meta.requestStatus).toBe('fulfilled');

    const collaborators = Object.values(store.getState().platformSettings.collaborators.entities);
    const invited = collaborators.find((collaborator) => collaborator?.email === 'n.recrue@miya.cm');
    expect(invited?.role).toBe(PlatformUserRole.ReadOnly);
    expect(invited?.status).toBe('Invited');

    const auditEntries = Object.values(store.getState().activity.auditLog.entities);
    const collaboratorAddedEntry = auditEntries.find((entry) => entry?.action === 'CollaboratorAdded');
    expect(collaboratorAddedEntry?.summary).toContain('Nouvelle Recrue');
    expect(collaboratorAddedEntry?.actor.name).toBe('César Vanel');
  });
});

describe('ChangeCollaboratorRoleAsync', () => {
  /**
   * Le garde-fou "dernier Owner actif" pour un ACTEUR différent de la cible
   * est testé en isolation au niveau du slice (PlatformSettingsSlice.spec.ts)
   * — impossible à exercer ici avec une seule session de démo : l'acteur ne
   * peut jamais toucher son propre rôle (garde-fou ci-dessous), donc il reste
   * toujours lui-même Owner tant qu'il n'a démis personne d'autre, ce qui
   * empêche structurellement d'atteindre "un seul Owner actif, ciblé par un
   * tiers" en une seule session.
   */
  it('rejects a collaborator changing their own role, with a clear error', async () => {
    const store = makeStore();
    await store.dispatch(LoginAsync({ identifier: 'cesar@miya.cm', password: 'demo' }));
    await store.dispatch(FetchPlatformSettingsAsync());

    const result = await store.dispatch(
      ChangeCollaboratorRoleAsync({ collaboratorId: 'super-admin-cesar', newRole: PlatformUserRole.Owner }),
    );
    expect(result.meta.requestStatus).toBe('rejected');
    if (result.meta.requestStatus === 'rejected') {
      expect((result.payload as { message: string }).message).toContain('propre rôle');
    }
  });
});

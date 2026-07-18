import { ProfileSelectors } from './domain/selectors/Selectors';
import { profileSlice } from './domain/slices/ProfileSlice';

// Types de domaine
export type { ActiveSession, PlatformNotificationPreferences, ProfilePreferences } from './domain/entities/Profile';

// Reducer (branché dans root-reducer)
export const profileReducer = profileSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const profileSelectors = {
  ...ProfileSelectors,
};

// Use cases
export { FetchProfileAsync } from './application/usecases/fetch-profile-async/FetchProfileAsync';
export { UpdatePersonalInfoAsync } from './application/usecases/update-personal-info-async/UpdatePersonalInfoAsync';
export type { UpdatePersonalInfoCommand } from './application/usecases/update-personal-info-async/UpdatePersonalInfoCommand';
export { ChangePasswordAsync } from './application/usecases/change-password-async/ChangePasswordAsync';
export type { ChangePasswordCommand } from './application/usecases/change-password-async/ChangePasswordCommand';
export { UpdateNotificationPrefsAsync } from './application/usecases/update-notification-prefs-async/UpdateNotificationPrefsAsync';
export { RevokeSessionAsync } from './application/usecases/revoke-session-async/RevokeSessionAsync';

// Ports (types utilisés par la composition root)
export type { PlatformProfileDependencies } from './application/ports/PlatformProfileDependencies';
export type { PersonalInfoInput, PlatformProfileGateway, ProfileSnapshot } from './application/ports/PlatformProfileGateway';

// Infrastructure (instanciée par la composition root)
export { FakePlatformProfileGateway } from './infrastructure/gateways/FakePlatformProfileGateway';

// Vues (routées par config/router.tsx)
export { ProfilePage } from './infrastructure/views/index/ProfilePage';

// Modales (montées globalement dans le layout)
export { ChangePasswordModal } from './infrastructure/views/modal/ChangePasswordModal';

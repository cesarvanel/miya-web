import { ProfileSelectors } from './domain/selectors/Selectors';
import { profileSlice } from './domain/slices/ProfileSlice';

// Types de domaine
export { RecentActionKind } from './domain/entities/Profile';
export type { ActiveSession, NotificationPreferences, ProfilePreferences, RecentAction } from './domain/entities/Profile';

// Reducer (branché dans RootReducer)
export const profileReducer = profileSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const profileSelectors = {
  ...ProfileSelectors,
};

// Use cases
export { FetchProfileAsync } from './application/usecases/fetch-profile-async/FetchProfileAsync';
export type { FetchProfileCommand } from './application/usecases/fetch-profile-async/FetchProfileCommand';
export type { FetchProfileResponse } from './application/usecases/fetch-profile-async/FetchProfileResponse';

export { UpdatePersonalInfoAsync } from './application/usecases/update-personal-info-async/UpdatePersonalInfoAsync';
export type { UpdatePersonalInfoCommand } from './application/usecases/update-personal-info-async/UpdatePersonalInfoCommand';

export { ChangePasswordAsync } from './application/usecases/change-password-async/ChangePasswordAsync';
export type { ChangePasswordCommand } from './application/usecases/change-password-async/ChangePasswordCommand';

export { UpdateNotificationPrefsAsync } from './application/usecases/update-notification-prefs-async/UpdateNotificationPrefsAsync';
export type { UpdateNotificationPrefsCommand } from './application/usecases/update-notification-prefs-async/UpdateNotificationPrefsCommand';

export { RevokeSessionAsync } from './application/usecases/revoke-session-async/RevokeSessionAsync';
export type { RevokeSessionCommand } from './application/usecases/revoke-session-async/RevokeSessionCommand';

// Ports (types utilisés par la composition root)
export type { ProfileDependencies } from './application/ports/ProfileDependencies';
export type { PersonalInfoInput, ProfileGateway, ProfileSnapshot } from './application/ports/ProfileGateway';

// Infrastructure (instanciée par la composition root)
export { FakeProfileGateway } from './infrastructure/gateways/FakeProfileGateway';
export { ProfileRouter } from './infrastructure/router/ProfileRouter';
export { ProfileRoutes } from './infrastructure/router/ProfileRoutes';

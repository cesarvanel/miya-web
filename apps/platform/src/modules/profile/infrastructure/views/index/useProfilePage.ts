import { useEffect, useState } from 'react';
import { FetchAuditLogAsync } from '@/modules/activity';
import { authSelectors } from '@/modules/auth';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { openModal } from '@/shared/modals';
import { FetchProfileAsync } from '../../../application/usecases/fetch-profile-async/FetchProfileAsync';
import { RevokeSessionAsync } from '../../../application/usecases/revoke-session-async/RevokeSessionAsync';
import { UpdateNotificationPrefsAsync } from '../../../application/usecases/update-notification-prefs-async/UpdateNotificationPrefsAsync';
import { UpdatePersonalInfoAsync } from '../../../application/usecases/update-personal-info-async/UpdatePersonalInfoAsync';
import { selectActiveSessions, selectMyRecentActions, selectNotificationPreferences } from '../../../domain/selectors/Selectors';
import type { PlatformNotificationPreferences } from '../../../domain/entities/Profile';

export const useProfilePage = () => {
  const dispatch = usePlatformDispatch();
  const user = usePlatformSelector(authSelectors.selectCurrentUser);
  const notifications = usePlatformSelector(selectNotificationPreferences);
  const activeSessions = usePlatformSelector(selectActiveSessions);
  const myRecentActions = usePlatformSelector(selectMyRecentActions);

  useEffect(() => {
    dispatch(FetchProfileAsync());
    // Alimente le journal personnel (dérivé) même si /activity n'a jamais été visitée dans cette session.
    dispatch(FetchAuditLogAsync());
  }, [dispatch]);

  const [isEditing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const startEditing = (): void => {
    if (!user) {
      return;
    }
    const [first, ...rest] = user.fullName.split(' ');
    setFirstName(first ?? '');
    setLastName(rest.join(' '));
    setPhone(user.phone);
    setEmail(user.email);
    setEditing(true);
  };

  const cancelEditing = (): void => setEditing(false);

  const savePersonalInfo = async (): Promise<void> => {
    setSaving(true);
    await dispatch(UpdatePersonalInfoAsync({ firstName, lastName, phone, email }));
    setSaving(false);
    setEditing(false);
  };

  const openChangePassword = (): void => {
    dispatch(openModal({ type: 'changePlatformPassword', props: undefined }));
  };

  const toggleNotification = (key: keyof PlatformNotificationPreferences): void => {
    if (!notifications) {
      return;
    }
    dispatch(UpdateNotificationPrefsAsync({ ...notifications, [key]: !notifications[key] }));
  };

  const revokeSession = (sessionId: string): void => {
    dispatch(RevokeSessionAsync({ sessionId }));
  };

  return {
    user,
    notifications,
    activeSessions,
    myRecentActions,
    isEditing,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    email,
    setEmail,
    saving,
    startEditing,
    cancelEditing,
    savePersonalInfo,
    openChangePassword,
    toggleNotification,
    revokeSession,
  };
};

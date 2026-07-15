import { useState } from 'react';
import { authSelectors } from '@/modules/auth';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { openModal } from '@/shared/modals';
import { selectActiveSessions, selectMemberSince, selectMyRecentActions, selectNotificationPreferences } from '../../../domain/selectors/Selectors';
import { RevokeSessionAsync } from '../../../application/usecases/revoke-session-async/RevokeSessionAsync';
import { UpdateNotificationPrefsAsync } from '../../../application/usecases/update-notification-prefs-async/UpdateNotificationPrefsAsync';
import { UpdatePersonalInfoAsync } from '../../../application/usecases/update-personal-info-async/UpdatePersonalInfoAsync';
import type { NotificationPreferences } from '../../../domain/entities/Profile';

export const useProfilePage = () => {
  const dispatch = useBankDispatch();
  const user = useBankSelector(authSelectors.selectCurrentUser);
  const memberSince = useBankSelector(selectMemberSince);
  const notifications = useBankSelector(selectNotificationPreferences);
  const activeSessions = useBankSelector(selectActiveSessions);
  const myRecentActions = useBankSelector(selectMyRecentActions);

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
    dispatch(openModal({ type: 'changePassword', props: undefined }));
  };

  const toggleNotification = (key: keyof NotificationPreferences): void => {
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
    memberSince,
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

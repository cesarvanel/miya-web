import React from 'react';
import { Button, initialsOf } from '@miya/ui';
import { PlatformUserRole } from '@/modules/auth';
import { PageShell } from '@/shared/layout/PageShell';
import { openModal } from '@/shared/modals';
import { usePlatformDispatch } from '@/config/root-hook';
import { NotificationsCard } from '../composants/NotificationsCard';
import { PersonalInfoCard } from '../composants/PersonalInfoCard';
import { RecentActionsCard } from '../composants/RecentActionsCard';
import { SecurityCard } from '../composants/SecurityCard';
import { ChangePasswordModal } from '../modal/ChangePasswordModal';
import { useProfilePage } from './useProfilePage';

const ROLE_LABEL: Record<PlatformUserRole, string> = {
  [PlatformUserRole.Owner]: 'Complet',
  [PlatformUserRole.ReadOnly]: 'Lecture',
};

const ROLE_AVATAR_CLASSES: Record<PlatformUserRole, string> = {
  [PlatformUserRole.Owner]: 'bg-admin-primary text-white',
  [PlatformUserRole.ReadOnly]: 'bg-cream-100 text-ink-muted',
};

const ROLE_PILL_CLASSES: Record<PlatformUserRole, string> = {
  [PlatformUserRole.Owner]: 'bg-[#EAF6F0] text-primary',
  [PlatformUserRole.ReadOnly]: 'bg-cream-100 text-ink-muted',
};

/** Page Mon profil de la console éditeur — informations, sécurité, notifications, journal personnel. */
export const ProfilePage: React.FC = () => {
  const dispatch = usePlatformDispatch();
  const {
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
  } = useProfilePage();

  if (!user) {
    return null;
  }

  return (
    <PageShell
      title="Mon profil"
      subtitle="Identité, sécurité et préférences de votre compte"
      actions={
        <Button variant="secondary" onClick={() => dispatch(openModal({ type: 'confirmLogout', props: undefined }))}>
          Se déconnecter
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-card-lg border border-line bg-card p-5.5">
          <div className="flex items-center gap-4.5">
            <span className={['flex size-19 flex-none items-center justify-center rounded-card-lg text-xl font-bold', ROLE_AVATAR_CLASSES[user.role]].join(' ')}>
              {initialsOf(user.fullName)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[22px] font-extrabold tracking-[-0.01em] text-ink">{user.fullName}</span>
                <span className={['rounded-full px-2.75 py-1 text-xs font-bold', ROLE_PILL_CLASSES[user.role]].join(' ')}>{ROLE_LABEL[user.role]}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-admin-primary/30 bg-admin-primary/10 px-2.75 py-1 text-xs font-bold text-admin-primary">
                  <span className="size-1.5 rounded-full bg-admin-primary" />
                  Console éditeur
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5.5 gap-y-1.5 text-[13.5px] font-semibold text-ink-muted">
                <span className="flex items-center gap-1.75">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2.5 5.5h11v7a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-7z" stroke="#9A9C93" strokeWidth="1.5" />
                    <path d="M2.5 6l5.5 3.5L13.5 6" stroke="#9A9C93" strokeWidth="1.5" />
                  </svg>
                  {user.email}
                </span>
                <span className="flex items-center gap-1.75">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M4 3h2l1 3-1.5 1a8 8 0 0 0 3.5 3.5L11 12l3 1v2a8 8 0 0 1-8-8V3z" stroke="#9A9C93" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <span className="num">{user.phone}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1.15fr_1fr] items-start gap-5">
          <PersonalInfoCard
            user={user}
            isEditing={isEditing}
            firstName={firstName}
            onFirstNameChange={setFirstName}
            lastName={lastName}
            onLastNameChange={setLastName}
            phone={phone}
            onPhoneChange={setPhone}
            email={email}
            onEmailChange={setEmail}
            saving={saving}
            onEdit={startEditing}
            onCancel={cancelEditing}
            onSave={() => void savePersonalInfo()}
          />
          <SecurityCard activeSessions={activeSessions} onChangePassword={openChangePassword} onRevokeSession={revokeSession} />
        </div>

        <div className="grid grid-cols-[1fr_1.15fr] items-start gap-5">
          {notifications && <NotificationsCard notifications={notifications} onToggle={toggleNotification} />}
          <RecentActionsCard actions={myRecentActions} actorId={user.id} />
        </div>
      </div>

      <ChangePasswordModal />
    </PageShell>
  );
};

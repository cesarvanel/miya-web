import React from 'react';
import { Button, initialsOf } from '@miya/ui';
import { BankUserRole } from '@/modules/auth';
import { PageShell } from '@/shared/layout/PageShell';
import { openModal } from '@/shared/modals';
import { useBankDispatch } from '@/config/stores/root-hook/RootHook';
import { NotificationsCard } from '../composants/NotificationsCard';
import { PersonalInfoCard } from '../composants/PersonalInfoCard';
import { RecentActionsCard } from '../composants/RecentActionsCard';
import { SecurityCard } from '../composants/SecurityCard';
import { ChangePasswordModal } from '../modal/ChangePasswordModal';
import { useProfilePage } from './useProfilePage';

const ROLE_LABEL: Record<BankUserRole, string> = {
  [BankUserRole.BankAdmin]: 'Administrateur',
  [BankUserRole.Supervisor]: 'Responsable',
};

const ROLE_AVATAR_CLASSES: Record<BankUserRole, string> = {
  [BankUserRole.BankAdmin]: 'bg-violet text-white',
  [BankUserRole.Supervisor]: 'bg-primary-deep text-primary-bright',
};

const ROLE_PILL_CLASSES: Record<BankUserRole, string> = {
  [BankUserRole.BankAdmin]: 'bg-violet-soft text-violet',
  [BankUserRole.Supervisor]: 'bg-primary-soft text-primary',
};

const JOURNAL_SUBTITLE: Record<BankUserRole, string> = {
  [BankUserRole.BankAdmin]: 'Mes créations, modifications de config et révocations',
  [BankUserRole.Supervisor]: 'Mes validations et résolutions — traçabilité personnelle',
};

const formatMemberSince = (iso: string): string => new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

/** Page Mon profil — variantes responsable / admin. Maquette A1/A2. */
export const ProfilePage: React.FC = () => {
  const dispatch = useBankDispatch();
  const {
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
                <span className="flex items-center gap-1.75">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 14s5-3.5 5-7A5 5 0 0 0 3 7c0 3.5 5 7 5 7z" stroke="#9A9C93" strokeWidth="1.5" />
                    <circle cx="8" cy="6.5" r="1.7" stroke="#9A9C93" strokeWidth="1.5" />
                  </svg>
                  {user.agency}
                </span>
              </div>
            </div>
            {memberSince && (
              <div className="flex-none text-right">
                <div className="text-[11.5px] font-semibold text-ink-faint">Membre depuis</div>
                <div className="num text-[14px] font-bold text-ink">{formatMemberSince(memberSince)}</div>
              </div>
            )}
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
          {notifications && <NotificationsCard role={user.role} notifications={notifications} onToggle={toggleNotification} />}
          <RecentActionsCard subtitle={JOURNAL_SUBTITLE[user.role]} actions={myRecentActions} />
        </div>
      </div>

      <ChangePasswordModal />
    </PageShell>
  );
};

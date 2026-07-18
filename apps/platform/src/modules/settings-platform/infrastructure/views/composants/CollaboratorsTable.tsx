import React from 'react';
import { ActionMenu, InitialsAvatar, Table, Tooltip, type TableColumn } from '@miya/ui';
import { PlatformUserRole } from '@/modules/auth';
import { CollaboratorStatus, type Collaborator } from '../../../domain/entities/Collaborator';

interface CollaboratorsTableProps {
  collaborators: Collaborator[];
  currentUserId: string;
  canWrite: boolean;
  onChangeRole: (collaboratorId: string) => void;
  onResendInvitation: (collaboratorId: string) => void;
  onRevoke: (collaboratorId: string) => void;
}

const ROLE_BADGE_CLASSES: Record<PlatformUserRole, string> = {
  [PlatformUserRole.Owner]: 'bg-[#EAF6F0] text-primary',
  [PlatformUserRole.ReadOnly]: 'bg-cream-100 text-ink-muted',
};

const ROLE_LABEL: Record<PlatformUserRole, string> = {
  [PlatformUserRole.Owner]: 'Complet',
  [PlatformUserRole.ReadOnly]: 'Lecture',
};

const EditIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M9.5 2.5l3 3-7 7-3.5.5.5-3.5 7-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
const MailIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M2 4h11v7H2z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 4l5.5 4L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
const TrashIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M3 4.5h9M6 4V3h3v1M5 4.5l.5 7h4l.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Comptes super admin — badge de rôle (Owner émeraude / Lecture neutre), menu d'actions ⋯. Maquette 5a. */
export const CollaboratorsTable: React.FC<CollaboratorsTableProps> = ({
  collaborators,
  currentUserId,
  canWrite,
  onChangeRole,
  onResendInvitation,
  onRevoke,
}) => {
  const columns: TableColumn<Collaborator>[] = [
    {
      key: 'member',
      header: 'Membre',
      cell: (collaborator) => (
        <div className="flex items-center gap-2.75">
          <InitialsAvatar name={collaborator.fullName} />
          <div>
            <div className="flex items-center gap-1.5 text-[13.5px] font-bold text-ink">
              {collaborator.fullName}
              {collaborator.id === currentUserId && (
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary">Vous</span>
              )}
            </div>
            <div className={['text-[11.5px] font-medium', collaborator.status === CollaboratorStatus.Invited ? 'text-amber' : 'text-ink-faint'].join(' ')}>
              {collaborator.status === CollaboratorStatus.Invited ? 'Invitation en attente' : 'Actif'}
            </div>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'E-mail', cell: (collaborator) => <span className="text-[13px] font-semibold text-ink-muted">{collaborator.email}</span> },
    {
      key: 'role',
      header: 'Rôle',
      cell: (collaborator) => (
        <span className={['w-fit rounded-full px-2.75 py-1.25 text-[11.5px] font-bold', ROLE_BADGE_CLASSES[collaborator.role]].join(' ')}>
          {ROLE_LABEL[collaborator.role]}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (collaborator) => {
        if (collaborator.id === currentUserId) {
          return <span className="text-[12px] font-semibold text-ink-disabled">—</span>;
        }
        const menu = (
          <ActionMenu
            aria-label={`Actions pour ${collaborator.fullName}`}
            items={[
              { id: 'role', label: 'Changer le rôle', icon: <EditIcon />, onClick: () => onChangeRole(collaborator.id) },
              ...(collaborator.status === CollaboratorStatus.Invited
                ? [{ id: 'resend', label: "Renvoyer l'invitation", icon: <MailIcon />, onClick: () => onResendInvitation(collaborator.id) }]
                : []),
              { id: 'revoke', label: 'Révoquer', icon: <TrashIcon />, onClick: () => onRevoke(collaborator.id), destructive: true },
            ]}
          />
        );
        return canWrite ? (
          <div className="flex justify-end">{menu}</div>
        ) : (
          <div className="flex justify-end">
            <Tooltip label="Rôle lecture seule">
              <span className="pointer-events-none opacity-40">{menu}</span>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      rows={collaborators}
      rowKey={(collaborator) => collaborator.id}
      emptyState={<div className="text-center text-sm font-medium text-ink-faint">Aucun collaborateur.</div>}
    />
  );
};

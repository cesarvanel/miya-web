import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton, Tooltip } from '@miya/ui';
import { PageShell } from '@/shared/layout/PageShell';
import { CollaboratorsTable } from '../composants/CollaboratorsTable';
import { PlatformIdentityCard } from '../composants/PlatformIdentityCard';
import { TemplatesGrid } from '../composants/TemplatesGrid';
import { SETTINGS_SECTIONS, useSettingsPage } from './useSettingsPage';

/** Paramètres plateforme — vue lecture (identité, comptes super admin, notifications) + éditions en modale. Maquette 5a. */
export const PlatformSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    identity,
    collaborators,
    templates,
    isPending,
    activeSection,
    goToSection,
    currentUserId,
    canWrite,
    openEditIdentity,
    openInviteCollaborator,
    openChangeCollaboratorRole,
    openResendCollaboratorInvitation,
    openRevokeCollaborator,
    openEditTemplate,
  } = useSettingsPage();

  return (
    <PageShell
      title="Paramètres"
      subtitle="Identité, comptes super admin & notifications"
      actions={
        <Button variant="secondary" size="sm" onClick={() => navigate('/settings/change-log')}>
          Journal des changements
        </Button>
      }
    >
      <div className="flex items-start gap-6">
        <div className="sticky top-0 flex w-52 flex-none flex-col gap-1">
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => goToSection(section.id)}
              className={[
                'cursor-pointer rounded-[10px] px-3 py-2.5 text-left text-[13.5px] font-bold transition-colors',
                activeSection === section.id ? 'bg-admin-sidebar text-white' : 'text-ink-muted hover:bg-cream-100',
              ].join(' ')}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5.5">
          {!identity || isPending ? (
            <Skeleton variant="card" />
          ) : (
            <PlatformIdentityCard identity={identity} canEdit={canWrite} onEdit={openEditIdentity} />
          )}

          <div id="platform-settings-section-collaborators" className="rounded-card-lg border border-line bg-card p-[22px_26px]">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-[16px] font-extrabold text-ink">Comptes super admin</div>
                <div className="text-[12.5px] font-medium text-ink-faint">Membres de l&rsquo;équipe Miya avec accès à la console.</div>
              </div>
              {canWrite ? (
                <Button variant="secondary" size="sm" onClick={openInviteCollaborator}>
                  Inviter un collaborateur
                </Button>
              ) : (
                <Tooltip label="Rôle lecture seule">
                  <Button variant="secondary" size="sm" disabled>
                    Inviter un collaborateur
                  </Button>
                </Tooltip>
              )}
            </div>
            {isPending && collaborators.length === 0 ? (
              <Skeleton variant="card" />
            ) : (
              <CollaboratorsTable
                collaborators={collaborators}
                currentUserId={currentUserId}
                canWrite={canWrite}
                onChangeRole={openChangeCollaboratorRole}
                onResendInvitation={openResendCollaboratorInvitation}
                onRevoke={openRevokeCollaborator}
              />
            )}
            <div className="mt-4 flex gap-5 border-t border-line-faint pt-3.5">
              <span className="text-[11.5px] font-semibold text-ink-muted">
                <b className="text-ink">Lecture</b> — consulte banques, factures &amp; activité, sans modifier.
              </span>
              <span className="text-[11.5px] font-semibold text-ink-muted">
                <b className="text-ink">Complet</b> — suspend, édite les plans, enregistre les paiements.
              </span>
            </div>
          </div>

          <div id="platform-settings-section-notifications" className="rounded-card-lg border border-line bg-card p-[22px_26px]">
            <div className="mb-4.5">
              <div className="text-[16px] font-extrabold text-ink">Modèles de notifications</div>
              <div className="text-[12.5px] font-medium text-ink-faint">Messages automatiques envoyés aux banques clientes.</div>
            </div>
            {isPending && templates.length === 0 ? (
              <Skeleton variant="card" />
            ) : (
              <TemplatesGrid templates={templates} canEdit={canWrite} onEdit={openEditTemplate} />
            )}
            <div className="mt-3.5 flex items-center gap-2.25 text-[12.5px] font-semibold text-ink-muted">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <circle cx="7.5" cy="7.5" r="6" stroke="#9A9C93" strokeWidth="1.3" />
                <path d="M7.5 4.5v3.2l2 1.3" stroke="#9A9C93" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Cadence de relance : J+3, J+10, puis suspension à J+15 (configurable côté Abonnements).
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

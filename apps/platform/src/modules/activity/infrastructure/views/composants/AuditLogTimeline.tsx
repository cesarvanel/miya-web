import React from 'react';
import { Link } from 'react-router-dom';
import { AuditAction, type AuditEntry } from '../../../domain/entities/AuditEntry';

interface AuditLogTimelineProps {
  entries: AuditEntry[];
}

const ICON_CLASSES: Record<AuditAction, string> = {
  [AuditAction.TenantSuspended]: 'bg-danger-soft text-danger',
  [AuditAction.TenantReactivated]: 'bg-primary-soft text-primary',
  [AuditAction.PlanChanged]: 'bg-violet-soft text-violet',
  [AuditAction.PlanUpdated]: 'bg-amber-soft text-amber',
  [AuditAction.InvoiceMarkedPaid]: 'bg-primary-soft text-primary',
  [AuditAction.ReminderSent]: 'bg-info-soft text-info',
  [AuditAction.TenantCreated]: 'bg-info-soft text-info',
  [AuditAction.CollaboratorAdded]: 'bg-cream-100 text-ink-muted',
};

const ActionIcon: React.FC<{ action: AuditAction }> = ({ action }) => {
  if (action === AuditAction.TenantSuspended) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="2.2" height="8" rx="1" fill="currentColor" />
        <rect x="8" y="3" width="2.2" height="8" rx="1" fill="currentColor" />
      </svg>
    );
  }
  if (action === AuditAction.TenantReactivated) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 8l2.5 2.5L12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (action === AuditAction.PlanChanged || action === AuditAction.PlanUpdated) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M8.5 2.5l3 3-7 7-3.5.5.5-3.5 7-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (action === AuditAction.InvoiceMarkedPaid) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 8l2.5 2.5L12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (action === AuditAction.ReminderSent) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 5.5l4-2.5 4 2.5M3.5 5.5v4.5h7V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (action === AuditAction.TenantCreated) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 11a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
};

/** Piste d'audit du super admin — chronologie en lecture seule, la plus récente en tête. Maquette 4a/4b. */
export const AuditLogTimeline: React.FC<AuditLogTimelineProps> = ({ entries }) => (
  <div>
    {entries.length === 0 ? (
      <div className="px-5.5 py-6 text-center text-sm font-medium text-ink-faint">Aucune entrée pour ces filtres.</div>
    ) : (
      entries.map((entry, index) => (
        <div
          key={entry.id}
          className={['flex gap-3 px-5.5 py-3', index > 0 ? 'border-t border-line-faint' : ''].join(' ')}
        >
          <span className={['flex size-8 flex-none items-center justify-center rounded-[9px]', ICON_CLASSES[entry.action]].join(' ')}>
            <ActionIcon action={entry.action} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] leading-[1.45] font-medium text-ink">
              <b>{entry.actor.name}</b> {entry.summary}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="num text-[11.5px] font-semibold text-ink-faint">
                {new Date(entry.at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} ·{' '}
                {new Date(entry.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {entry.targetTenant && (
                <Link to={`/tenants/${entry.targetTenant.id}`} className="text-[11.5px] font-bold text-admin-primary hover:underline">
                  Voir la fiche
                </Link>
              )}
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

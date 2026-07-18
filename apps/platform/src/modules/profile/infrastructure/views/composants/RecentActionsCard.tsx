import React from 'react';
import { Link } from 'react-router-dom';
import { AuditAction, type AuditEntry } from '@/modules/activity';
import { Card } from '@miya/ui';

interface RecentActionsCardProps {
  actions: AuditEntry[];
  actorId: string;
}

const DOT_CLASSES: Record<AuditAction, string> = {
  [AuditAction.TenantSuspended]: 'bg-danger',
  [AuditAction.TenantReactivated]: 'bg-primary',
  [AuditAction.PlanChanged]: 'bg-violet',
  [AuditAction.PlanUpdated]: 'bg-amber',
  [AuditAction.InvoiceMarkedPaid]: 'bg-primary',
  [AuditAction.ReminderSent]: 'bg-info',
  [AuditAction.TenantCreated]: 'bg-info',
  [AuditAction.CollaboratorAdded]: 'bg-violet',
};

const formatWhen = (at: string): string => {
  const date = new Date(at);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (isToday) {
    return time;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `hier · ${time}`;
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

/** Journal personnel, lecture seule — dérivé du journal d'audit du module activity. Maquette Profil. */
export const RecentActionsCard: React.FC<RecentActionsCardProps> = ({ actions, actorId }) => (
  <Card>
    <div className="flex items-center justify-between">
      <span className="text-[15px] font-extrabold text-ink">Journal de mes actions</span>
      <span className="bg-cream-100 rounded-full px-2.5 py-1 text-[10.5px] font-bold text-ink-muted">Lecture seule · audit</span>
    </div>
    <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">Mes suspensions, paiements et changements sur la console</div>

    <div className="mt-3.5 flex flex-col gap-3">
      {actions.slice(0, 6).map((action) => (
        <div key={action.id} className="flex items-start gap-3">
          <span className={['mt-1.5 size-2 flex-none rounded-full', DOT_CLASSES[action.action]].join(' ')} />
          <div className="min-w-0 flex-1 text-[13px] font-semibold text-ink">{action.summary}</div>
          <span className="flex-none text-[11.5px] font-medium text-ink-faint">{formatWhen(action.at)}</span>
        </div>
      ))}
      {actions.length === 0 && <div className="text-[12.5px] font-medium text-ink-faint">Aucune action récente.</div>}
    </div>

    <Link
      to={`/activity?actorId=${actorId}`}
      className="mt-4 block text-center text-[12.5px] font-bold text-admin-primary hover:underline"
    >
      Voir tout le journal
    </Link>
  </Card>
);

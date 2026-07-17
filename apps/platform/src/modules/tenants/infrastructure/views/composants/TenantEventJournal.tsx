import React from 'react';
import { TenantEventKind, type TenantEvent } from '../../../domain/entities/Tenant';

interface TenantEventJournalProps {
  events: TenantEvent[];
}

const ICON_CLASSES: Record<TenantEventKind, string> = {
  [TenantEventKind.Created]: 'bg-primary-soft text-primary',
  [TenantEventKind.PlanChanged]: 'bg-violet-soft text-violet',
  [TenantEventKind.Suspended]: 'bg-cream-100 text-ink-muted',
  [TenantEventKind.Reactivated]: 'bg-primary-soft text-primary',
  [TenantEventKind.InvoicePaid]: 'bg-primary-soft text-primary',
  [TenantEventKind.InvitationResent]: 'bg-info-soft text-info',
};

const EventIcon: React.FC<{ kind: TenantEventKind }> = ({ kind }) => {
  if (kind === TenantEventKind.Suspended) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="4" y="3" width="2.2" height="8" rx="1" fill="currentColor" />
        <rect x="8" y="3" width="2.2" height="8" rx="1" fill="currentColor" />
      </svg>
    );
  }
  if (kind === TenantEventKind.PlanChanged) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === TenantEventKind.InvitationResent) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 5.5l4-2.5 4 2.5M3.5 5.5v4.5h7V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === TenantEventKind.Created) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 2l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 10.7 3.8 12.4l.6-3.6L1.8 6.3l3.6-.5L7 2z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 7.5l2.5 2.5 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Journal du tenant — chronologie inversée (le plus récent en tête). Maquette 2f/2d. */
export const TenantEventJournal: React.FC<TenantEventJournalProps> = ({ events }) => (
  <div className="rounded-card-lg border border-line bg-card p-5.5 pb-2.5">
    <div className="mb-4 text-[15px] font-extrabold text-ink">Journal du tenant</div>
    {events.length === 0 ? (
      <div className="pb-4 text-sm font-medium text-ink-faint">Aucun événement pour le moment.</div>
    ) : (
      events.map((event, index) => (
        <div key={event.id} className="flex gap-2.75 pb-3.75">
          <div className="flex flex-none flex-col items-center">
            <span className={['flex size-7 items-center justify-center rounded-[8px]', ICON_CLASSES[event.kind]].join(' ')}>
              <EventIcon kind={event.kind} />
            </span>
            {index < events.length - 1 && <span className="mt-1.25 w-px flex-1 bg-line-soft" />}
          </div>
          <div className="flex-1 pt-0.5">
            <div className="num text-[11px] font-bold text-ink-faint">
              {new Date(event.at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="mt-0.5 text-[12.5px] font-semibold text-ink">{event.summary}</div>
          </div>
        </div>
      ))
    )}
  </div>
);

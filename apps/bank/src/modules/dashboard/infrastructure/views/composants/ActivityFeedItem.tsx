import React from 'react';
import { ActivityEventKind, type ActivityEvent } from '@/modules/dashboard/domain/entities/ActivityEvent';

interface ActivityFeedItemProps {
  event: ActivityEvent;
  showConnector?: boolean;
}

const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
};

const iconByKind: Record<ActivityEventKind, { bg: string; icon: React.ReactNode }> = {
  [ActivityEventKind.CollectionConfirmed]: {
    bg: 'bg-primary-soft',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <path d="M4 9l3 3 6-7" stroke="#0A6B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  [ActivityEventKind.DisputeOpened]: {
    bg: 'bg-danger-soft',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <path d="M8.5 2l7 12h-14L8.5 2z" fill="#C43B32" />
        <path d="M8.5 6.5v3.5M8.5 12h.01" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  [ActivityEventKind.DayClosed]: {
    bg: 'bg-amber-soft',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="6.5" stroke="#B5771A" strokeWidth="1.6" />
        <path d="M8.5 5v3.8l2.2 1.3" stroke="#B5771A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  [ActivityEventKind.SettlementValidated]: {
    bg: 'bg-info-soft',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <path d="M4 8.5l3 3 6-7" stroke="#2A6BA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  [ActivityEventKind.CapApproaching]: {
    bg: 'bg-amber-soft',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <path d="M8.5 2l7 12h-14L8.5 2z" stroke="#E08A1E" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8.5 6.5v3M8.5 11.5h.01" stroke="#E08A1E" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
};

/** Une entrée du fil "Activité en direct" — icône par nature, connecteur de timeline. */
export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({ event, showConnector = true }) => {
  const { bg, icon } = iconByKind[event.kind];
  return (
    <div className="flex gap-3 pb-4">
      <div className="flex flex-none flex-col items-center">
        <div className={['flex size-[34px] items-center justify-center rounded-tile', bg].join(' ')}>
          {icon}
        </div>
        {showConnector && <span className="mt-1.5 w-0.5 flex-1 bg-line-soft" />}
      </div>
      <div className="flex-1 pt-0.5">
        <div className="num text-[11.5px] font-bold text-ink-faint">{formatTime(event.occurredAt)}</div>
        <div className="mt-0.5 text-[13px] leading-[1.5] font-medium text-ink">{event.message}</div>
      </div>
    </div>
  );
};

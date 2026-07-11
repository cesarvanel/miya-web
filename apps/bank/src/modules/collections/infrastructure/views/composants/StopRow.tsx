import React from 'react';
import { InitialsAvatar } from '@miya/ui';
import { Money } from '@miya/kernel';
import type { RoundStop } from '../../../domain/entities/RoundStop';
import { RoundStopStatus } from '../../../domain/entities/RoundStop';
import { StopStatusDot } from './StopStatusDot';

interface StopRowProps {
  stop: RoundStop;
}

const statusNote = (stop: RoundStop): string => {
  switch (stop.status) {
    case RoundStopStatus.Collected:
      return stop.collectedAt ?? '';
    case RoundStopStatus.Absent:
      return 'Absent';
    case RoundStopStatus.Postponed:
      return stop.note ?? 'Reporté';
    case RoundStopStatus.Pending:
      return 'En attente de confirmation';
    case RoundStopStatus.OffRound:
      return 'Hors tournée';
    case RoundStopStatus.ToVisit:
    default:
      return 'À visiter';
  }
};

export const StopRow: React.FC<StopRowProps> = ({ stop }) => {
  const isCollected = stop.status === RoundStopStatus.Collected;
  return (
    <div className="flex items-center gap-[11px] border-b border-line-faint px-[18px] py-[13px] last:border-b-0">
      <StopStatusDot status={stop.status} />
      <InitialsAvatar name={stop.client.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className={['truncate text-[13px] font-semibold', isCollected ? 'text-ink' : 'text-ink-muted'].join(' ')}>
          {stop.client.name}
        </div>
        <div className={['num text-[11px]', isCollected ? 'text-ink-muted' : 'text-ink-faint'].join(' ')}>
          {statusNote(stop)}
        </div>
      </div>
      <span className={['num text-[12.5px] font-bold', isCollected ? 'text-ink' : 'text-ink-disabled'].join(' ')}>
        {isCollected && stop.collectedAmount !== undefined ? Money.from(stop.collectedAmount).format() : '—'}
      </span>
    </div>
  );
};

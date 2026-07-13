import React from 'react';
import { Money } from '@miya/kernel';
import { AgentSettlementStatus, type AgentDayRecord } from '../../../domain/entities/AgentDayRecord';

interface DayRecordRowProps {
  record: AgentDayRecord;
}

const formatDayLabel = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/** Ligne « journée » — pastille verte (validé) / ambre (écart mineur) / neutre (en attente). */
export const DayRecordRow: React.FC<DayRecordRowProps> = ({ record }) => {
  const isGap = record.settlementStatus === AgentSettlementStatus.SettledWithGap;
  const isPending = record.settlementStatus === AgentSettlementStatus.Pending;
  const dotColor = isPending ? 'bg-ink-faint' : isGap ? 'bg-amber' : 'bg-primary';

  return (
    <div className="flex items-center gap-3 border-b border-line-faint px-5 py-3.5 last:border-b-0">
      <span className={['size-2.5 flex-none rounded-full', dotColor].join(' ')} />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold text-ink">{formatDayLabel(record.date)}</div>
        <div className="text-[11.5px] font-medium text-ink-faint">
          {isPending
            ? 'Reversement en attente'
            : `Reversement ${isGap ? 'avec écart' : 'validé'}${record.settledAt ? ` · ${record.settledAt}` : ''}`}
          {record.note && <span className="text-amber"> · {record.note}</span>}
        </div>
      </div>
      <div className="text-right">
        <div className="num text-[13.5px] font-bold text-ink">{Money.from(record.collected).format()}</div>
        {typeof record.gapAmount === 'number' && record.gapAmount !== 0 && (
          <div className="num text-[11px] font-bold text-amber">
            {record.gapAmount > 0 ? '+' : ''}
            {record.gapAmount}
          </div>
        )}
      </div>
    </div>
  );
};

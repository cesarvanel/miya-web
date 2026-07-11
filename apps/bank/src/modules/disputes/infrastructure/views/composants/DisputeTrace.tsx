import React from 'react';
import { InitialsAvatar } from '@miya/ui';
import { Money } from '@miya/kernel';
import { DisputeDecision, type Dispute } from '../../../domain/entities/Dispute';
import { formatTime } from './formatDisputeTime';

interface DisputeTraceProps {
  dispute: Dispute;
}

const WarningIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M7.5 2l6 10.5h-12L7.5 2z" fill="#C43B32" />
    <path d="M7.5 6v3M7.5 10.5h.01" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const EvidenceIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <rect x="2.5" y="3" width="10" height="9" rx="1.5" stroke="#2A6BA8" strokeWidth="1.3" />
    <path d="M5 6.5h5M5 9h3" stroke="#2A6BA8" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M3.5 7.5l2.5 2.5 5.5-6" stroke="#0A6B4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface TraceEntryProps {
  time: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
  isLast?: boolean;
}

const TraceEntry: React.FC<TraceEntryProps> = ({ time, icon, iconBg, children, isLast = false }) => (
  <div className="flex gap-3 pb-4 last:pb-0">
    <div className="flex flex-none flex-col items-center">
      <div className={['flex size-[30px] items-center justify-center rounded-[9px]', iconBg].join(' ')}>
        {icon}
      </div>
      {!isLast && <span className="mt-1.5 w-0.5 flex-1 bg-line-soft" />}
    </div>
    <div className="flex-1 pt-px">
      <div className="num text-[11.5px] font-bold text-ink-faint">{time}</div>
      <div className="mt-0.5 text-[13px] leading-normal font-medium text-ink">{children}</div>
    </div>
  </div>
);

/** « Trace de la décision » — timeline reconstruite depuis les faits de la contestation. Maquette 3c. */
export const DisputeTrace: React.FC<DisputeTraceProps> = ({ dispute }) => {
  const { resolution } = dispute;
  if (!resolution) {
    return null;
  }
  const isForClient = resolution.decidedInFavorOf === DisputeDecision.Client;
  const evidenceAt = new Date(new Date(resolution.decidedAt).getTime() - 60_000).toISOString();

  return (
    <div className="rounded-card border border-line bg-card p-5">
      <div className="mb-4 text-sm font-extrabold text-ink">Trace de la décision</div>

      <TraceEntry
        time={formatTime(dispute.openedAt)}
        icon={<InitialsAvatar name={dispute.agent.name} size="sm" />}
        iconBg=""
      >
        <b className="font-bold">{dispute.agent.name}</b> saisit une collecte de{' '}
        <b className="num font-bold">{Money.from(dispute.agent.enteredAmount).format()}</b> chez{' '}
        {dispute.client.name}
      </TraceEntry>

      <TraceEntry time={formatTime(dispute.openedAt)} icon={<WarningIcon />} iconBg="bg-danger-soft">
        <b className="font-bold text-danger">Contestation ouverte</b> — le client déclare avoir versé{' '}
        <b className="num font-bold">{Money.from(dispute.client.declaredAmount).format()}</b>
      </TraceEntry>

      <TraceEntry time={formatTime(evidenceAt)} icon={<EvidenceIcon />} iconBg="bg-info-soft">
        {resolution.reason}
      </TraceEntry>

      <TraceEntry time={formatTime(resolution.decidedAt)} icon={<CheckIcon />} iconBg="bg-primary-soft" isLast>
        <b className="font-bold">{resolution.decidedBy}</b> tranche{' '}
        <b className="font-bold text-primary">
          {isForClient ? 'en faveur du client' : "en faveur de l'agent"}
        </b>{' '}
        · transaction {isForClient ? 'corrigée' : 'maintenue'} à{' '}
        {Money.from(isForClient ? dispute.client.declaredAmount : dispute.agent.enteredAmount).format()}
      </TraceEntry>
    </div>
  );
};

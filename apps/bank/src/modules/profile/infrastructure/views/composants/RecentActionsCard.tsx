import React from 'react';
import { Card } from '@miya/ui';
import { RecentActionKind, type RecentAction } from '../../../domain/entities/Profile';

interface RecentActionsCardProps {
  subtitle: string;
  actions: RecentAction[];
}

const DOT_CLASSES: Record<RecentActionKind, string> = {
  [RecentActionKind.SettlementValidated]: 'bg-primary',
  [RecentActionKind.DisputeResolved]: 'bg-violet',
  [RecentActionKind.WithdrawalApproved]: 'bg-primary',
  [RecentActionKind.AgentCreated]: 'bg-primary',
  [RecentActionKind.ConfigChanged]: 'bg-amber',
  [RecentActionKind.DeviceRevoked]: 'bg-danger',
  [RecentActionKind.ZoneCreated]: 'bg-violet',
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

/** Journal personnel, lecture seule. Maquette A1/A2. */
export const RecentActionsCard: React.FC<RecentActionsCardProps> = ({ subtitle, actions }) => (
  <Card>
    <div className="flex items-center justify-between">
      <span className="text-[15px] font-extrabold text-ink">Journal de mes actions récentes</span>
      <span className="bg-cream-100 rounded-full px-2.5 py-1 text-[10.5px] font-bold text-ink-muted">Lecture seule · audit</span>
    </div>
    <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">{subtitle}</div>

    <div className="mt-3.5 flex flex-col gap-3">
      {actions.map((action, index) => (
        <div key={index} className="flex items-start gap-3">
          <span className={['mt-1.5 size-2 flex-none rounded-full', DOT_CLASSES[action.kind]].join(' ')} />
          <div className="min-w-0 flex-1 text-[13px] font-semibold text-ink">{action.summary}</div>
          <span className="flex-none text-[11.5px] font-medium text-ink-faint">{formatWhen(action.at)}</span>
        </div>
      ))}
      {actions.length === 0 && <div className="text-[12.5px] font-medium text-ink-faint">Aucune action récente.</div>}
    </div>
  </Card>
);

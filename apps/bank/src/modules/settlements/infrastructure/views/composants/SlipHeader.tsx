import React from 'react';
import { Link } from 'react-router-dom';
import { InitialsAvatar } from '@miya/ui';

export type SlipBadgeTone = 'amber' | 'primary' | 'neutral';

interface SlipBadge {
  label: string;
  tone: SlipBadgeTone;
}

interface SlipHeaderProps {
  agentName: string;
  agentId: string;
  slipMeta: string;
  statusBadge?: SlipBadge;
  cornerBadge?: SlipBadge;
}

const badgeClasses: Record<SlipBadgeTone, string> = {
  amber: 'bg-amber-soft text-amber',
  primary: 'bg-primary-soft text-primary',
  neutral: 'bg-cream-100 text-ink-muted',
};

/** En-tête du bordereau sélectionné — partagé entre reversement et dépôt partiel. */
export const SlipHeader: React.FC<SlipHeaderProps> = ({
  agentName,
  agentId,
  slipMeta,
  statusBadge,
  cornerBadge,
}) => {
  return (
    <div className="flex items-center gap-[14px]">
      <InitialsAvatar name={agentName} size="lg" />
      <div className="flex-1">
        <div className="flex items-center gap-[10px]">
          <Link to={`/agents/${agentId}`} className="text-xl font-extrabold text-ink hover:underline">
            {agentName}
          </Link>
          {statusBadge && (
            <span
              className={[
                'rounded-full px-[10px] py-1 text-[11px] font-bold',
                badgeClasses[statusBadge.tone],
              ].join(' ')}
            >
              {statusBadge.label}
            </span>
          )}
        </div>
        <div className="num mt-0.5 text-[13px] font-semibold text-ink-muted">
          {slipMeta}
        </div>
      </div>
      {cornerBadge && (
        <span
          className={[
            'num rounded-full px-3 py-[7px] text-[12.5px] font-bold',
            badgeClasses[cornerBadge.tone],
          ].join(' ')}
        >
          {cornerBadge.label}
        </span>
      )}
    </div>
  );
};

import React from 'react';

/** Statuts d'une collecte — mapping couleur relevé dans design/tokens/tokens.json. */
export type CollectionStatus =
  | 'collected'
  | 'pending'
  | 'disputed'
  | 'rejected'
  | 'absent'
  | 'postponed';

interface StatusBadgeProps {
  status: CollectionStatus;
  size?: 'sm' | 'md';
  /** Libellé personnalisé ; à défaut, le libellé français standard. */
  children?: React.ReactNode;
}

const statusClasses: Record<CollectionStatus, string> = {
  collected: 'bg-primary-soft text-primary',
  pending: 'bg-amber-soft text-amber',
  disputed: 'bg-danger-soft text-danger',
  rejected: 'bg-danger text-white',
  absent: 'bg-neutral-soft text-neutral',
  postponed: 'bg-info-soft text-info',
};

const statusLabels: Record<CollectionStatus, string> = {
  collected: 'Collecté',
  pending: 'En attente',
  disputed: 'Litige',
  rejected: 'Rejeté',
  absent: 'Absent',
  postponed: 'Reporté',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  children,
}) => {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-bold whitespace-nowrap',
        size === 'md' ? 'px-[11px] py-[5px] text-[11px]' : 'px-[9px] py-1 text-[10.5px]',
        statusClasses[status],
      ].join(' ')}
    >
      {children ?? statusLabels[status]}
    </span>
  );
};

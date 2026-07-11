import React from 'react';

export type NotificationBellVariant = 'none' | 'dot' | 'count';

interface NotificationBellProps {
  variant?: NotificationBellVariant;
  count?: number;
  /** Cloche sur fond sombre — panneau ouvert. */
  active?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

/** Icône cloche + badge — variantes sans/point/compteur, état actif (panneau ouvert). */
export const NotificationBell: React.FC<NotificationBellProps> = ({
  variant = 'none',
  count,
  active = false,
  onClick,
  'aria-label': ariaLabel = 'Notifications',
}) => {
  const iconColor = active ? '#fff' : '#16241E';
  const badgeBorder = active ? 'border-ink' : 'border-card';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={[
        'relative flex size-11 cursor-pointer items-center justify-center rounded-xl transition',
        active ? 'bg-ink' : 'border border-line bg-card hover:bg-cream-50',
      ].join(' ')}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M5 8a5 5 0 0 1 10 0c0 4 1.5 5 1.5 5h-13S5 12 5 8z"
          stroke={iconColor}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M8.5 16a1.6 1.6 0 0 0 3 0" stroke={iconColor} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {variant === 'dot' && (
        <span
          className={['absolute top-[9px] right-[10px] size-2 rounded-full border-2 bg-danger', badgeBorder].join(
            ' ',
          )}
        />
      )}
      {variant === 'count' && count !== undefined && count > 0 && (
        <span
          className={[
            'num absolute top-[5px] right-[5px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 bg-danger px-1 text-[11px] font-bold text-white',
            badgeBorder,
          ].join(' ')}
        >
          {count}
        </span>
      )}
    </button>
  );
};

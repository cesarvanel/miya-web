import React from 'react';

export type AlertBannerTone = 'amber' | 'danger';

interface AlertBannerProps {
  tone: AlertBannerTone;
  title: string;
  detail: string;
  actionLabel: string;
  onAction: () => void;
}

/** Bandeau d'alerte — ambre (CapApproaching) ou rouge (SettlementOverdue), avec action. */
export const AlertBanner: React.FC<AlertBannerProps> = ({
  tone,
  title,
  detail,
  actionLabel,
  onAction,
}) => {
  const isDanger = tone === 'danger';
  return (
    <div
      className={[
        'flex items-center gap-[13px] rounded-2xl border px-4 py-[14px]',
        isDanger ? 'border-danger/30 bg-danger-soft' : 'border-amber-border bg-amber-soft',
      ].join(' ')}
    >
      <div className="flex size-10 flex-none items-center justify-center rounded-xl bg-card">
        {isDanger ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8" stroke="#C43B32" strokeWidth="1.8" />
            <path d="M10 6v4.4l2.6 1.6" stroke="#C43B32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 3l8 14H2L10 3z" fill="#E08A1E" />
            <path d="M10 8v4M10 14.5h.01" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className={['text-sm font-bold', isDanger ? 'text-danger-deep' : 'text-ink'].join(' ')}>
          {title}
        </div>
        <div className={['num mt-0.5 text-[12.5px] font-semibold', isDanger ? 'text-danger' : 'text-amber-deep'].join(' ')}>
          {detail}
        </div>
      </div>
      <button
        type="button"
        onClick={onAction}
        className={[
          'flex-none cursor-pointer rounded-full px-[13px] py-2 text-[12.5px] font-bold transition',
          isDanger ? 'bg-danger text-white hover:bg-danger/90' : 'bg-card text-amber hover:bg-amber-soft',
        ].join(' ')}
      >
        {actionLabel}
      </button>
    </div>
  );
};

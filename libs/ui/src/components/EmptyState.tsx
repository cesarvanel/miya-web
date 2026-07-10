import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Icône dans la pastille (coche des maquettes par défaut). */
  icon?: React.ReactNode;
  /** Action optionnelle (ex. un Button) affichée sous la description. */
  action?: React.ReactNode;
}

const DefaultIcon: React.FC = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
    <circle cx="26" cy="26" r="22" stroke="#0A6B4E" strokeWidth="3" />
    <path
      d="M16 26.5l7 7 14-15"
      stroke="#0A6B4E"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-11 text-center">
      <div className="flex size-[104px] items-center justify-center rounded-full bg-primary-soft">
        {icon ?? <DefaultIcon />}
      </div>
      <div className="mt-[22px] text-[26px] font-extrabold text-ink">{title}</div>
      {description && (
        <div className="mt-2 max-w-[460px] text-[15px] leading-[1.55] font-medium text-ink-muted">
          {description}
        </div>
      )}
      {action && <div className="mt-[26px]">{action}</div>}
    </div>
  );
};

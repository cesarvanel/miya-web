import React from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
}

interface ToastProps {
  variant: ToastVariant;
  title: string;
  message?: string;
  onDismiss?: () => void;
}

const variantStyles: Record<
  ToastVariant,
  { border: string; iconBg: string; title: string; icon: React.ReactElement }
> = {
  success: {
    border: 'border-l-primary',
    iconBg: 'bg-primary-soft text-primary',
    title: 'text-primary',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M5 10.5l3.5 3.5 7-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  error: {
    border: 'border-l-danger',
    iconBg: 'bg-danger-soft text-danger',
    title: 'text-danger',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M6 6l8 8M14 6l-8 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  warning: {
    border: 'border-l-amber-strong',
    iconBg: 'bg-amber-soft text-amber',
    title: 'text-amber',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 4.5v7M10 15.5v.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  info: {
    border: 'border-l-info',
    iconBg: 'bg-info-soft text-info',
    title: 'text-info',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 9v6M10 4.5v.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

export const Toast: React.FC<ToastProps> = ({
  variant,
  title,
  message,
  onDismiss,
}) => {
  const styles = variantStyles[variant];
  return (
    <div
      role="status"
      className={[
        'animate-toast-in rounded-card-sm flex w-[340px] items-start gap-3 border-l-4 bg-card p-4 shadow-toast',
        styles.border,
      ].join(' ')}
    >
      <span
        className={[
          'rounded-tile flex size-10 flex-none items-center justify-center',
          styles.iconBg,
        ].join(' ')}
      >
        {styles.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className={['text-sm font-extrabold', styles.title].join(' ')}>
          {title}
        </div>
        {message && (
          <div className="mt-0.5 text-[12.5px] leading-[1.45] font-medium text-ink-muted">
            {message}
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Fermer"
          onClick={onDismiss}
          className="cursor-pointer text-ink-soft hover:text-ink-muted"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M3.5 3.5l7 7M10.5 3.5l-7 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

interface ToasterProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

/** Empile les toasts en haut à droite (position des maquettes). */
export const Toaster: React.FC<ToasterProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) {
    return null;
  }
  return (
    <div className="fixed top-6 right-8 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
};

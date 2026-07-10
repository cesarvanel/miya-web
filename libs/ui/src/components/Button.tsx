import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white shadow-primary-glow hover:bg-primary/90 focus-visible:shadow-focus-ring',
  secondary:
    'bg-cream-100 text-ink-muted hover:bg-line focus-visible:shadow-focus-ring',
  destructive:
    'bg-danger text-white shadow-danger-glow hover:bg-danger/90 focus-visible:shadow-danger-ring',
  ghost:
    'bg-transparent text-ink-muted hover:bg-cream-100 focus-visible:shadow-focus-ring',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'rounded-lg px-3 py-[5px] text-[13px]',
  md: 'rounded-[14px] px-5 py-[15px] text-[14.5px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  className,
}) => {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={[
        'inline-flex cursor-pointer items-center justify-center gap-2 font-bold outline-none transition',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled ? 'pointer-events-none opacity-50' : '',
        className ?? '',
      ].join(' ')}
    >
      {loading && (
        <span
          role="status"
          aria-label="Chargement"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
};

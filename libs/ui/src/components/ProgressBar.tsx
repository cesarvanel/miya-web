import React from 'react';

export type ProgressBarMode = 'indeterminate' | 'determinate';

interface ProgressBarProps {
  mode?: ProgressBarMode;
  /** 0–100, utilisé uniquement en mode déterminé. */
  value?: number;
  className?: string;
}

/** Barre de progression fine (nav en haut de page) — indéterminée ou déterminée. */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  mode = 'indeterminate',
  value = 0,
  className,
}) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={mode === 'determinate' ? value : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      className={['relative h-[3px] overflow-hidden rounded-full bg-[#E4E1D8]', className ?? ''].join(' ')}
    >
      {mode === 'indeterminate' ? (
        <div className="animate-indeterminate absolute top-0 h-[3px] rounded-full bg-primary" />
      ) : (
        <div
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          className="h-[3px] rounded-full bg-primary"
        />
      )}
    </div>
  );
};

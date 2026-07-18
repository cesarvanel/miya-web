import React from 'react';

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Info-bulle générique au survol/focus — ex. "Rôle lecture seule" sur une action désactivée. */
export const Tooltip: React.FC<TooltipProps> = ({ label, children, className }) => (
  <span className={['group relative inline-flex', className ?? ''].join(' ')}>
    {children}
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 rounded-md bg-ink px-2.25 py-1.25 text-[11px] font-semibold whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
    >
      {label}
    </span>
  </span>
);

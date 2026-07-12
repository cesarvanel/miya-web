import React from 'react';
import { Link } from 'react-router-dom';

export interface HeaderBack {
  label: string;
  to: string;
}

interface HeaderProps {
  title: string;
  /** Ex. « Jeudi 3 juillet 2026 · 14h34 · Agence Mokolo ». */
  subtitle?: string;
  /** Lien de retour affiché à gauche du titre (ex. « ← Tournées »), pages de détail uniquement. */
  back?: HeaderBack;
  /** Zone droite : SearchInput, filtres, cloche… */
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, back, actions }) => {
  return (
    <header className="flex h-[78px] flex-none items-center justify-between border-b border-header-line bg-cream/85 px-8 backdrop-blur">
      <div className="flex items-center gap-3.5">
        {back && (
          <Link
            to={back.to}
            className="flex items-center gap-[7px] text-[13px] font-bold text-ink-muted hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 3l-5 5 5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {back.label}
          </Link>
        )}
        <div>
          <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-ink">
            {title}
          </h1>
          {subtitle && (
            <div className="mt-px text-[13px] font-medium text-ink-muted">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
};

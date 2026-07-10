import React from 'react';

interface HeaderProps {
  title: string;
  /** Ex. « Samedi 5 juillet 2026 · 15h04 · toutes régions ». */
  subtitle?: string;
  /** Zone droite : SearchInput, filtres… */
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <header className="flex h-[78px] flex-none items-center justify-between border-b border-header-line bg-cream/85 px-8 backdrop-blur">
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
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
};

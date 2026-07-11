import React from 'react';

export type FreshnessStatus = 'updating' | 'fresh';

interface FreshnessIndicatorProps {
  status: FreshnessStatus;
  /** Texte affiché en état "fresh" (ex. "8 s") — calculé par le consommateur. */
  label?: string;
}

/**
 * Indicateur de fraîcheur des données — présentational pur (le calcul du
 * `label` ticking vient du hook `useFreshness` de @miya/kernel).
 */
export const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({ status, label }) => (
  <div className="flex w-fit items-center gap-2 rounded-full border border-line-soft bg-cream px-[13px] py-2 text-[12.5px] font-semibold text-ink-muted">
    {status === 'updating' ? (
      <>
        <span className="size-[14px] animate-spin rounded-full border-2 border-line-soft border-t-primary" />
        Mise à jour…
      </>
    ) : (
      <>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.2" stroke="#0A6B4E" strokeWidth="1.5" />
          <path d="M8 5v3l2 1.5" stroke="#0A6B4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Dernière mise à jour il y a <span className="num text-ink">{label}</span>
      </>
    )}
  </div>
);

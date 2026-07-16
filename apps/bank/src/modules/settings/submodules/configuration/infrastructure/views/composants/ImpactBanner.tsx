import React from 'react';

interface ImpactBannerProps {
  title: string;
  detail: string;
}

/** Bannière d'impact — affichée quand un changement touche les opérations en cours. Maquettes 9d/9e/9f. */
export const ImpactBanner: React.FC<ImpactBannerProps> = ({ title, detail }) => (
  <div className="animate-badge-in mt-4.5 flex items-start gap-2.5 rounded-2xl border border-amber-strong/30 bg-amber-soft px-4 py-3.5">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-px flex-none">
      <path d="M9 2l7 12H2L9 2z" stroke="#B5771A" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 7v3.5M9 12.5h.01" stroke="#B5771A" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <div>
      <div className="text-[13px] font-extrabold text-amber-deep">{title}</div>
      <div className="mt-0.5 text-[12.5px] leading-[1.45] font-medium text-amber-deep">{detail}</div>
    </div>
  </div>
);

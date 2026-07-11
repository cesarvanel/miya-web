import React from 'react';

interface LiveBadgeProps {
  label?: string;
}

/** Pastille "en direct" — point vert pulsant (fil d'activité temps réel). */
export const LiveBadge: React.FC<LiveBadgeProps> = ({ label = 'En direct' }) => (
  <div className="flex w-fit items-center gap-[9px] rounded-full border border-primary-soft bg-[#F3FAF6] px-[14px] py-2">
    <span className="relative flex size-[9px]" aria-hidden="true">
      <span className="animate-pulse-soft absolute inset-0 rounded-full bg-primary" />
    </span>
    <span className="text-[12.5px] font-extrabold tracking-[.03em] text-primary uppercase">
      {label}
    </span>
  </div>
);

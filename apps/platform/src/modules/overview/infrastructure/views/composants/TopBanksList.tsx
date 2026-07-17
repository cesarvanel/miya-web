import React from 'react';
import { Link } from 'react-router-dom';
import type { BankColorTone, TopBank } from '../../../domain/entities/Overview';

interface TopBanksListProps {
  banks: TopBank[];
}

const TONE_CLASSES: Record<BankColorTone, string> = {
  info: 'bg-info-soft text-info',
  primary: 'bg-primary-soft text-primary',
  orange: 'bg-orange-avatar-soft text-orange-avatar',
  olive: 'bg-olive-soft text-olive',
};

const formatM = (value: number): string => `${value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M`;

/** Classement des banques les plus actives — maquette 1a. */
export const TopBanksList: React.FC<TopBanksListProps> = ({ banks }) => (
  <div className="overflow-hidden rounded-card-lg border border-line bg-card">
    <div className="flex items-center justify-between px-5.5 py-4.5">
      <span className="text-[16px] font-extrabold text-ink">Banques les plus actives</span>
      <Link to="/tenants" className="text-[12.5px] font-bold text-admin-primary hover:underline">
        Tout voir
      </Link>
    </div>
    <div className="grid grid-cols-[28px_2fr_1.4fr_1fr_24px] gap-3.5 border-t border-b border-line-soft bg-cream-50 px-5.5 py-2.25 text-[11px] font-bold tracking-[.04em] text-ink-soft uppercase">
      <span>#</span>
      <span>Banque</span>
      <span>Volume · 30j</span>
      <span>Croissance</span>
      <span />
    </div>
    {banks.map((bank, index) => (
      <Link
        key={bank.id}
        to={`/tenants/${bank.id}`}
        className="group animate-stagger-in grid grid-cols-[28px_2fr_1.4fr_1fr_24px] items-center gap-3.5 border-b border-line-faint px-5.5 py-3.25 transition-colors last:border-b-0 hover:bg-cream-50"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        <span className="num text-sm font-bold text-ink-disabled">{index + 1}</span>
        <div className="flex items-center gap-2.5">
          <span className={['flex size-8.5 flex-none items-center justify-center rounded-[10px] text-xs font-bold', TONE_CLASSES[bank.colorTone]].join(' ')}>
            {bank.initials}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-bold text-ink">{bank.name}</div>
            <div className="truncate text-[11.5px] font-medium text-ink-faint">{bank.city} · {bank.plan}</div>
          </div>
        </div>
        <span className="num text-[14.5px] font-bold text-ink">{formatM(bank.volumeThirtyDaysM)}</span>
        {bank.isNew ? (
          <span className="w-fit rounded-full bg-info-soft px-2.5 py-1 text-[11.5px] font-bold text-info">Nouveau</span>
        ) : (
          <span className="w-fit rounded-full bg-primary-soft px-2.5 py-1 text-[11.5px] font-bold text-primary">
            ▲ +{bank.growthPct}%
          </span>
        )}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          <path d="M7 4l5 5-5 5" stroke="#B9BAB2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    ))}
  </div>
);

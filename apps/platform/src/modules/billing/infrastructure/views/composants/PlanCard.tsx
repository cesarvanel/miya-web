import React from 'react';
import type { Plan } from '../../../domain/entities/Plan';

interface PlanCardProps {
  plan: Plan;
  /** Plan mis en avant visuellement (bordure verte, ruban) — le plus souscrit. Maquette 3a. */
  featured?: boolean;
  onEdit: () => void;
}

const formatLimit = (value: number | null): string => (value === null ? 'illimité' : value.toLocaleString('fr-FR'));

const CheckIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8.2l3 3 7-7.5" stroke="#0F9E6C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M9.5 2.5l3 3-7 7-3.5.5.5-3.5 7-7z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/** Carte plan — tarif, limites (illimité pour Élite), banques abonnées, édition. Maquette 3a. */
export const PlanCard: React.FC<PlanCardProps> = ({ plan, featured = false, onEdit }) => (
  <div
    className={[
      'relative rounded-card-lg p-[22px_22px_18px]',
      featured ? 'border-2 border-primary bg-card shadow-primary-glow' : 'border border-line bg-card',
    ].join(' ')}
  >
    {featured && (
      <span className="absolute -top-2.5 left-5.5 rounded-full bg-primary px-2.5 py-0.75 text-[10px] font-extrabold tracking-[.04em] text-white">
        LE PLUS CHOISI
      </span>
    )}
    <div className="flex items-center justify-between">
      <span className="rounded-full bg-primary-soft px-3 py-1.25 text-xs font-bold text-primary">{plan.name}</span>
      <span className="num rounded-full bg-cream-100 px-2.75 py-1.25 text-xs font-bold text-ink-faint">
        {plan.tenantsCount} banque{plan.tenantsCount > 1 ? 's' : ''}
      </span>
    </div>
    <div className="mt-4 flex items-baseline gap-1.5">
      <span className="num text-[30px] font-bold tracking-[-0.02em] text-ink">{plan.monthlyPrice.toLocaleString('fr-FR')}</span>
      <span className="text-[13px] font-semibold text-ink-faint">FCFA / mois</span>
    </div>
    <div className="mt-4.5 flex flex-col gap-2.75">
      <div className="flex items-center gap-2.25">
        <CheckIcon />
        <span className="text-[13px] font-medium text-ink">
          {plan.limits.agents === null ? (
            <>
              Agents <b>illimités</b>
            </>
          ) : (
            <>
              Jusqu&rsquo;à <b className="num">{formatLimit(plan.limits.agents)}</b> agents
            </>
          )}
        </span>
      </div>
      <div className="flex items-center gap-2.25">
        <CheckIcon />
        <span className="text-[13px] font-medium text-ink">
          {plan.limits.clients === null ? (
            <>
              Clients <b>illimités</b>
            </>
          ) : (
            <>
              Jusqu&rsquo;à <b className="num">{formatLimit(plan.limits.clients)}</b> clients
            </>
          )}
        </span>
      </div>
      <div className="flex items-center gap-2.25">
        <CheckIcon />
        <span className="text-[13px] font-medium text-ink">
          <b className="num">{plan.limits.agencies}</b> agences
        </span>
      </div>
    </div>
    <button
      type="button"
      onClick={onEdit}
      className={[
        'mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] py-2.75 text-[13px] font-bold',
        featured ? 'shadow-primary-glow bg-primary text-white' : 'border border-line text-ink',
      ].join(' ')}
    >
      <EditIcon color={featured ? '#fff' : '#16241E'} />
      Modifier le plan
    </button>
  </div>
);

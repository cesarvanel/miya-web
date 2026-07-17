import React from 'react';
import { Link } from 'react-router-dom';
import { AlertKind, type PlatformAlert } from '../../../domain/entities/Overview';

interface AlertsColumnProps {
  alerts: PlatformAlert[];
}

const fcfa = (amount: number): string => `${amount.toLocaleString('fr-FR')} FCFA`;

const PaymentOverdueCard: React.FC<{ alert: Extract<PlatformAlert, { kind: 'PaymentOverdue' }> }> = ({ alert }) => (
  <div className="animate-stagger-in rounded-2xl border-[1.5px] border-[#E8B0AA] bg-card p-4">
    <div className="mb-2.5 flex items-center gap-2.25">
      <span className="flex size-8 flex-none items-center justify-center rounded-[10px] bg-danger-soft">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
          <rect x="2" y="4.5" width="13" height="8.5" rx="1.6" stroke="#C43B32" strokeWidth="1.6" />
          <path d="M2 7.5h13" stroke="#C43B32" strokeWidth="1.6" />
        </svg>
      </span>
      <span className="text-[12px] font-extrabold tracking-[.02em] text-danger uppercase">Retard de paiement</span>
    </div>
    <div className="text-[14px] font-bold text-ink">{alert.bankName} — impayé depuis {alert.daysLate} jours</div>
    <div className="num mt-0.75 text-[12.5px] font-semibold text-[#B65950]">
      Plan {alert.planName} · {fcfa(alert.amount)} · lecture seule dans {alert.readOnlyInDays} jours
    </div>
    <div className="mt-3 flex gap-2.25">
      <Link to={`/tenants/${alert.bankId}`} className="rounded-full bg-danger px-3.25 py-2 text-xs font-bold text-white">
        Déployer
      </Link>
      <Link to={`/tenants/${alert.bankId}`} className="rounded-full bg-cream-100 px-3.25 py-2 text-xs font-bold text-ink-muted">
        Relancer
      </Link>
    </div>
  </div>
);

const PlanLimitCard: React.FC<{ alert: Extract<PlatformAlert, { kind: 'PlanLimitApproaching' }> }> = ({ alert }) => {
  const ratio = Math.min(1, alert.currentAgents / alert.maxAgents);
  return (
    <div className="animate-stagger-in rounded-2xl border border-amber-border bg-card p-4">
      <div className="mb-2.5 flex items-center gap-2.25">
        <span className="flex size-8 flex-none items-center justify-center rounded-[10px] bg-amber-soft">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path d="M8.5 2l6.5 11h-13L8.5 2z" stroke="#E08A1E" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M8.5 6.5v3M8.5 11.5h.01" stroke="#E08A1E" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-[12px] font-extrabold tracking-[.02em] text-amber uppercase">Limite de plan</span>
      </div>
      <div className="text-[14px] font-bold text-ink">{alert.bankName} approche le plafond agents</div>
      <div className="num mt-1 text-[12.5px] font-semibold text-amber-deep">
        {alert.currentAgents} / {alert.maxAgents} agents · plan {alert.planName}
      </div>
      <div className="mt-2 h-1.75 overflow-hidden rounded-full bg-amber-track">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-strong to-amber-fill-end transition-[width] duration-500 ease-out"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <div className="mt-3">
        <Link to={`/tenants/${alert.bankId}`} className="rounded-full bg-amber-soft px-3.25 py-2 text-xs font-bold text-amber">
          Proposer un palier
        </Link>
      </div>
    </div>
  );
};

const PendingActivationCard: React.FC<{ alert: Extract<PlatformAlert, { kind: 'PendingActivation' }> }> = ({ alert }) => (
  <div className="animate-stagger-in rounded-2xl border border-[#BFD8F0] bg-card p-4">
    <div className="mb-2.5 flex items-center gap-2.25">
      <span className="flex size-8 flex-none items-center justify-center rounded-[10px] bg-info-soft">
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
          <path d="M8.5 3.5v10M3.5 8.5h10" stroke="#2A6BA8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-[12px] font-extrabold tracking-[.02em] text-info uppercase">En attente d&rsquo;activation</span>
    </div>
    <div className="text-[14px] font-bold text-ink">{alert.bankName}</div>
    <div className="mt-0.75 text-[12.5px] font-semibold text-[#5E7EA0]">
      Dossier complet · KYC validé · plan {alert.planRequested} demandé
    </div>
    <div className="mt-3 flex gap-2.25">
      <Link to={`/tenants/${alert.bankId}`} className="rounded-full bg-info px-3.25 py-2 text-xs font-bold text-white">
        Activer la banque
      </Link>
      <Link to={`/tenants/${alert.bankId}`} className="rounded-full bg-cream-100 px-3.25 py-2 text-xs font-bold text-ink-muted">
        Dossier
      </Link>
    </div>
  </div>
);

/** Colonne d'alertes plateforme — 3 variantes fidèles à la maquette 1a. */
export const AlertsColumn: React.FC<AlertsColumnProps> = ({ alerts }) => (
  <div className="flex w-90 flex-none flex-col gap-3.5">
    <div className="flex items-center gap-2.25">
      <span className="text-[13px] font-extrabold tracking-[.03em] text-ink-muted uppercase">Alertes plateforme</span>
      <span className="h-px flex-1 bg-line" />
      <span className="num rounded-full bg-danger-soft px-2.25 py-0.75 text-[11.5px] font-bold text-danger">{alerts.length}</span>
    </div>

    {alerts.map((alert) => {
      if (alert.kind === AlertKind.PaymentOverdue) {
        return <PaymentOverdueCard key={alert.id} alert={alert} />;
      }
      if (alert.kind === AlertKind.PlanLimitApproaching) {
        return <PlanLimitCard key={alert.id} alert={alert} />;
      }
      return <PendingActivationCard key={alert.id} alert={alert} />;
    })}

    <Link
      to="/activity"
      className="rounded-2xl border border-line bg-card px-4.5 py-3.5 text-center text-[13px] font-bold text-admin-primary"
    >
      Voir toute l&rsquo;activité plateforme
    </Link>
  </div>
);

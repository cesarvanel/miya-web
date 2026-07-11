import React from 'react';
import { Button, Card, FreshnessIndicator, KpiCard, LiveBadge, Skeleton } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import { RoundStatusChip } from '../composants/RoundStatusChip';
import { StopRow } from '../composants/StopRow';
import { useRoundDetail } from './useRoundDetail';

/** Drill-down d'une tournée — carte de synthèse, dépôts partiels, clients groupés par zone. Maquette 4/4b/4c. */
export const RoundDetailPage: React.FC = () => {
  const { round, kpis, stopsByZone, isPending, freshness, goToAgentDisputes } = useRoundDetail();

  if (!round || !kpis) {
    return isPending ? (
      <Skeleton variant="card" />
    ) : (
      <div className="text-sm font-medium text-ink-muted">Tournée introuvable.</div>
    );
  }

  const remaining = round.progress.expected - round.progress.visited;

  return (
    <PageShell
      title={round.agent.name}
      subtitle={`${round.zone} · démarrée ${round.startedAt}${round.endedAt ? ` · fin ${round.endedAt}` : ''}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <RoundStatusChip status={round.status} />
        <LiveBadge />
        <FreshnessIndicator status={freshness.status} label={freshness.label} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Collecté"
          value={kpis.collectedTotal}
          tone="primary"
          formatter={(value) => Money.from(value).format()}
          hint={<span className="text-primary-tint text-[11.5px] font-medium">{round.progress.visited} clients cotisants</span>}
        />
        <KpiCard
          label="Cash en main"
          value={kpis.cashInHand}
          tone={kpis.cashRatio >= 0.85 ? 'danger' : 'default'}
          formatter={(value) => Money.from(value).format()}
          hint={
            <span className="text-[11px] font-semibold text-ink-faint">
              {Math.round(kpis.cashRatio * 100)}% du plafond
            </span>
          }
        />
        <KpiCard
          label="Progression"
          value={round.progress.visited}
          hint={<span className="text-[11px] font-semibold text-ink-faint">{remaining} clients restants</span>}
        />
        <KpiCard
          label="Contestations"
          value={round.openDisputesCount}
          tone={round.openDisputesCount > 0 ? 'danger' : 'default'}
          hint={
            <span className="text-[11px] font-semibold text-ink-faint">
              {round.partialDeposits.length} dépôt{round.partialDeposits.length > 1 ? 's' : ''} partiel
              {round.partialDeposits.length > 1 ? 's' : ''}
            </span>
          }
        />
      </div>

      {round.openDisputesCount > 0 && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={goToAgentDisputes}>
            Voir les contestations de {round.agent.name}
          </Button>
        </div>
      )}

      {round.partialDeposits.map((deposit) => (
        <div
          key={deposit.id}
          className="mt-3.5 flex items-center gap-2.75 rounded-tile bg-info-soft px-4 py-3.25"
        >
          <span className="text-[13px] font-semibold text-info">
            Dépôt partiel de <b className="num">{Money.from(deposit.amount).format()}</b> validé à{' '}
            {deposit.validatedAt} par {deposit.validatedBy} · cash remis au responsable.
          </span>
        </div>
      ))}

      <Card padding="none" className="mt-4.5">
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-3.75">
          <span className="text-[15px] font-extrabold text-ink">
            Clients de la tournée <span className="text-[13px] font-semibold text-ink-faint">· {round.progress.expected}</span>
          </span>
        </div>
        {Object.entries(stopsByZone).map(([zone, stops]) => (
          <div key={zone}>
            <div className="bg-cream-50 px-5 py-2.5 text-[11.5px] font-bold tracking-[.03em] text-ink-faint uppercase">
              {zone}
            </div>
            {stops.map((stop) => (
              <StopRow key={stop.id} stop={stop} />
            ))}
          </div>
        ))}
      </Card>
    </PageShell>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, FreshnessIndicator, KpiCard, LiveBadge, Skeleton } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import { RoundStatus } from '../../../domain/entities/CollectionRound';
import { formatRoundDuration } from '../composants/formatDuration';
import { RoundStatusChip } from '../composants/RoundStatusChip';
import { StopsGrid } from '../composants/StopsGrid';
import { useRoundDetail } from './useRoundDetail';

/** Drill-down d'une tournée — carte de synthèse, dépôts partiels, clients groupés par zone. Maquette 4/4b. */
export const RoundDetailPage: React.FC = () => {
  const {
    round,
    kpis,
    stopsByZone,
    collectedBreakdown,
    pendingSlip,
    isPending,
    freshness,
    goToAgentDisputes,
    goToSlip,
  } = useRoundDetail();

  if (!round || !kpis) {
    return isPending ? (
      <Skeleton variant="card" />
    ) : (
      <div className="text-sm font-medium text-ink-muted">Tournée introuvable.</div>
    );
  }

  const back = { label: 'Tournées', to: '/collections' };

  if (round.status === RoundStatus.Closed) {
    return (
      <PageShell
        title={round.agent.name}
        subtitle={`${round.zone} · ${round.startedAt} → clôturée ${round.endedAt ?? ''}`}
        back={back}
      >
        <div className="max-w-240">
          <div className="mb-4.5 flex items-center gap-3">
            <span className="rounded-full bg-danger-soft px-[12px] py-[5px] text-[11px] font-bold text-danger">
              Journée clôturée
            </span>
            <span className="text-[13px] font-medium text-ink-faint">
              Tous les clients traités · GPS remis à l'agence
            </span>
            <Link to={`/agents/${round.agent.id}`} className="text-[12.5px] font-bold text-primary hover:underline">
              Voir la fiche agent
            </Link>
          </div>

          {/* Bandeau en attente de reversement */}
          <div className="flex items-center gap-5.5 rounded-card-lg bg-[#16241E] p-6 text-white">
            <div className="min-w-0 flex-1">
              <div className="text-primary-bright text-[12.5px] font-bold tracking-[.06em] uppercase">
                En attente de reversement
              </div>
              <div className="mt-1.5 text-[15px] leading-normal font-medium text-[#B9C4BE]">
                La tournée est bouclée. Le cash doit être compté et rapproché en validation croisée.
              </div>
            </div>
            {pendingSlip && (
              <>
                <div className="flex-none text-right">
                  <div className="text-[12px] font-semibold text-[#9FB0A9]">Montant à reverser</div>
                  <div className="num text-4xl leading-tight font-bold">
                    {Money.from(pendingSlip.expectedAmount).format()}
                  </div>
                  <div className="num mt-0.5 text-[12px] font-semibold text-[#9FB0A9]">{pendingSlip.slipNumber}</div>
                </div>
                <Button variant="primary" onClick={goToSlip} className="flex-none">
                  Ouvrir le bordereau
                </Button>
              </>
            )}
          </div>

          {/* Synthèse */}
          <div className="mt-4 grid grid-cols-4 gap-4">
            <KpiCard
              label="Collecté total"
              value={round.collectedTotal}
              formatter={(value) => Money.from(value).format()}
              hint={
                <span className="text-[11.5px] font-medium text-ink-faint">
                  {collectedBreakdown.normal + collectedBreakdown.extra} cotisants
                </span>
              }
            />
            <KpiCard
              label="Progression"
              value={round.progress.visited}
              tone="primary"
              hint={<span className="text-[11.5px] font-medium text-ink-faint">/{round.progress.expected}</span>}
            />
            {round.endedAt && (
              <KpiCard
                label="Durée de tournée"
                value={0}
                formatter={() => formatRoundDuration(round.startedAt, round.endedAt as string)}
                hint={
                  <span className="text-[11.5px] font-medium text-ink-faint">
                    {round.startedAt} → {round.endedAt}
                  </span>
                }
              />
            )}
            {round.partialDeposits.length > 0 && (
              <KpiCard
                label="Dépôt partiel"
                value={round.partialDeposits[0]?.amount ?? 0}
                formatter={(value) => Money.from(value).format()}
                hint={
                  <span className="text-[11.5px] font-medium text-ink-faint">
                    validé {round.partialDeposits[0]?.validatedAt} · déduit
                  </span>
                }
              />
            )}
          </div>

          {/* Répartition des clients */}
          <Card padding="none" className="mt-4.5">
            <div className="border-b border-line-soft px-5 py-3.75 text-[15px] font-extrabold text-ink">
              Répartition des {round.progress.expected} clients
            </div>
            <div className="grid grid-cols-4">
              <div className="border-r border-line-faint px-5 py-4.5">
                <div className="flex items-center gap-1.75">
                  <span className="size-2.25 rounded-full bg-primary" />
                  <span className="text-xs font-semibold text-ink-muted">Cotisé</span>
                </div>
                <div className="num mt-2 text-2xl font-bold text-ink">{collectedBreakdown.normal}</div>
              </div>
              <div className="border-r border-line-faint px-5 py-4.5">
                <div className="flex items-center gap-1.75">
                  <span className="size-2.25 rounded-full bg-[#E08A1E]" />
                  <span className="text-xs font-semibold text-ink-muted">Supplément.</span>
                </div>
                <div className="num mt-2 text-2xl font-bold text-amber">{collectedBreakdown.extra}</div>
              </div>
              <div className="border-r border-line-faint px-5 py-4.5">
                <div className="flex items-center gap-1.75">
                  <span className="size-2.25 rounded-full bg-[#9A9C93]" />
                  <span className="text-xs font-semibold text-ink-muted">Absent</span>
                </div>
                <div className="num mt-2 text-2xl font-bold text-ink-faint">{collectedBreakdown.absent}</div>
              </div>
              <div className="px-5 py-4.5">
                <div className="flex items-center gap-1.75">
                  <span className="size-2.25 rounded-full bg-danger" />
                  <span className="text-xs font-semibold text-ink-muted">Contestation</span>
                </div>
                <div className="num mt-2 text-2xl font-bold text-primary">{round.openDisputesCount}</div>
              </div>
            </div>
          </Card>
        </div>
      </PageShell>
    );
  }

  const remaining = round.progress.expected - round.progress.visited;

  return (
    <PageShell
      title={round.agent.name}
      subtitle={`${round.zone} · démarrée ${round.startedAt}`}
      back={back}
    >
      <div className="mb-4 flex items-center gap-3">
        <RoundStatusChip status={round.status} />
        <LiveBadge />
        <FreshnessIndicator status={freshness.status} label={freshness.label} />
        <Link to={`/agents/${round.agent.id}`} className="ml-auto text-[12.5px] font-bold text-primary hover:underline">
          Voir la fiche agent
        </Link>
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
            <StopsGrid stops={stops} />
          </div>
        ))}
      </Card>
    </PageShell>
  );
};

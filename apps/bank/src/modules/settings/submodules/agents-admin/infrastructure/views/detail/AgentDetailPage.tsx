import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, InitialsAvatar, KpiCard, Skeleton } from '@miya/ui';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { PageShell } from '@/shared/layout/PageShell';
import { AgentRole, AgentStatus } from '../../../domain/entities/Agent';
import { selectCollectorsBySupervisor } from '../../../domain/selectors/Selectors';
import { AgentStatusChip } from '../composants/AgentStatusChip';
import { DayRecordRow } from '../composants/DayRecordRow';
import { RoleBadge } from '../composants/RoleBadge';
import { ActivationCodeModal } from '../modal/ActivationCodeModal';
import { ConfirmReactivateModal } from '../modal/ConfirmReactivateModal';
import { RevokeDeviceModal } from '../modal/RevokeDeviceModal';
import { SuspendAgentModal } from '../modal/SuspendAgentModal';
import { useAgentDetail } from './useAgentDetail';

/** Fiche agent pleine page — appareil, stats du mois, journées & reversements. Maquette 7/7b/7c. */
export const AgentDetailPage: React.FC = () => {
  const {
    agent,
    dayRecords,
    isPending,
    pendingSlip,
    hasOpenRoundToday,
    openRevokeDevice,
    openActivationCode,
    openSuspend,
    openReactivate,
    goToPendingSlip,
    goToTodayRound,
  } = useAgentDetail();

  const collectors = useBankSelector((state) =>
    agent ? selectCollectorsBySupervisor(state, agent.id) : [],
  );

  if (!agent) {
    return isPending ? (
      <Skeleton variant="card" />
    ) : (
      <div className="text-sm font-medium text-ink-muted">Agent introuvable.</div>
    );
  }

  const isSupervisor = agent.role === AgentRole.Supervisor;
  const isSuspended = agent.status === AgentStatus.Suspended;

  return (
    <PageShell
      title={agent.fullName}
      subtitle={`${agent.registrationNumber} · ${isSupervisor ? 'Responsable' : 'Agent collecteur'}${agent.supervisor ? ` · resp. ${agent.supervisor.name}` : ''}`}
      back={{ label: 'Agents', to: '/agents' }}
      actions={
        isSuspended ? (
          <Button variant="primary" onClick={openReactivate}>
            Réactiver
          </Button>
        ) : (
          <Button variant="secondary" onClick={openSuspend}>
            Suspendre
          </Button>
        )
      }
    >
      {hasOpenRoundToday && (
        <div className="mb-4.5 flex items-center justify-between rounded-card-lg bg-primary-soft px-5 py-3.5">
          <span className="text-primary text-[13px] font-semibold">Tournée en cours aujourd&rsquo;hui.</span>
          <Button variant="primary" size="sm" onClick={goToTodayRound}>
            Voir la tournée du jour
          </Button>
        </div>
      )}
      {pendingSlip && (
        <div className="mb-4.5 flex items-center justify-between rounded-card-lg bg-amber-soft px-5 py-3.5">
          <span className="text-amber text-[13px] font-semibold">Reversement en attente de validation.</span>
          <Button variant="primary" size="sm" onClick={goToPendingSlip}>
            Ouvrir le bordereau
          </Button>
        </div>
      )}

      <div className="flex items-start gap-5.5">
        {/* LEFT column */}
        <div className="w-85 flex-none space-y-4">
          <Card className="text-center">
            <InitialsAvatar name={agent.fullName} size="lg" />
            <div className="mt-3.5 text-lg font-extrabold text-ink">{agent.fullName}</div>
            <div className="mt-0.5 text-[13px] font-medium text-ink-muted">
              {isSupervisor ? 'Responsable' : 'Agent'} · {agent.zones.join(', ')}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <RoleBadge role={agent.role} />
              <AgentStatusChip status={agent.status} />
            </div>
          </Card>

          {!isSupervisor && (
            <Card>
              <div className="mb-3.5 text-[11px] font-bold tracking-[.05em] text-ink-faint uppercase">
                Appareil enregistré
              </div>
              {agent.device ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-soft flex size-11 flex-none items-center justify-center rounded-xl">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                        <rect x="6" y="2.5" width="10" height="17" rx="2" stroke="#0A6B4E" strokeWidth="1.6" />
                        <path d="M9.5 16.5h3" stroke="#0A6B4E" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-ink">{agent.device.model}</div>
                      <div className="num text-[11.5px] font-semibold text-ink-muted">
                        {agent.device.os} · IMEI {agent.device.maskedImei}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-cream-100 px-3.25 py-2.5">
                    <span className="text-[12px] font-semibold text-ink-muted">Lié le</span>
                    <span className="num text-[12.5px] font-bold text-ink">{agent.device.linkedAt}</span>
                  </div>
                  <div className="mt-3.5 flex gap-2.25">
                    <button
                      type="button"
                      onClick={openRevokeDevice}
                      className="flex-1 cursor-pointer rounded-lg border border-danger px-3 py-[9px] text-[12.5px] font-bold text-danger transition hover:bg-danger-soft"
                    >
                      Révoquer l&rsquo;appareil
                    </button>
                    <button
                      type="button"
                      onClick={openActivationCode}
                      className="border-primary text-primary flex-1 cursor-pointer rounded-lg border px-3 py-[9px] text-[12.5px] font-bold transition hover:bg-primary-soft"
                    >
                      Code d&rsquo;activation
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-lg bg-cream-100 px-3.25 py-4 text-center text-[12.5px] font-semibold text-ink-muted">
                    Aucun appareil lié — générez un code d&rsquo;activation.
                  </div>
                  <Button variant="primary" size="sm" onClick={openActivationCode} className="mt-3.5 w-full">
                    Générer un code d&rsquo;activation
                  </Button>
                </>
              )}
            </Card>
          )}
        </div>

        {/* RIGHT column */}
        <div className="min-w-0 flex-1 space-y-4">
          {isSupervisor ? (
            <Card padding="none">
              <div className="border-b border-line-soft px-5 py-3.75 text-[15px] font-extrabold text-ink">
                Collecteurs rattachés ({collectors.length})
              </div>
              {collectors.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm font-medium text-ink-faint">Aucun collecteur rattaché.</div>
              ) : (
                collectors.map((collector) => (
                  <Link
                    key={collector.id}
                    to={`/agents/${collector.id}`}
                    className="flex items-center gap-2.75 border-b border-line-faint px-5 py-3 last:border-b-0 hover:bg-cream-50"
                  >
                    <InitialsAvatar name={collector.fullName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-bold text-ink">{collector.fullName}</div>
                      <div className="text-[11.5px] font-medium text-ink-faint">{collector.zones.join(', ')}</div>
                    </div>
                    <AgentStatusChip status={collector.status} />
                  </Link>
                ))
              )}
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <KpiCard label="Collecté ce mois" value={agent.monthStats.collected} tone="primary" formatter={(v) => v.toLocaleString('fr-FR')} />
                <KpiCard
                  label="Confirmation"
                  value={agent.monthStats.confirmationRate}
                  formatter={(v) => `${v.toFixed(1).replace('.', ',')}%`}
                />
                <KpiCard label="Écarts" value={agent.monthStats.gaps} tone={agent.monthStats.gaps > 0 ? 'danger' : 'default'} />
              </div>

              <Card padding="none">
                <div className="border-b border-line-soft px-5 py-3.75 text-[15px] font-extrabold text-ink">
                  Journées &amp; reversements
                </div>
                {dayRecords.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm font-medium text-ink-faint">Aucune journée enregistrée.</div>
                ) : (
                  dayRecords.map((record) => <DayRecordRow key={record.id} record={record} />)
                )}
              </Card>
            </>
          )}
        </div>
      </div>

      <RevokeDeviceModal />
      <ActivationCodeModal />
      <SuspendAgentModal />
      <ConfirmReactivateModal />
    </PageShell>
  );
};

import { initialsOf } from '@miya/ui';
import { computeMrr, planFixtures } from '@/modules/billing';
import { BillingStatus, computePlanLimitAlerts, TenantStatus, tenantFixtures, type Tenant } from '@/modules/tenants';
import type { OverviewGateway, OverviewSnapshot } from '../../application/ports/OverviewGateway';
import { AlertKind, AlertSeverity, type BankColorTone, type PlatformAlert, type TopBank } from '../../domain/entities/Overview';

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

const COLOR_TONES: BankColorTone[] = ['info', 'primary', 'orange', 'olive'];
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const RECENTLY_CREATED_MS = 3 * ONE_DAY_MS;

/** 4 banques actives/en essai au volume le plus élevé — dérivé des mêmes fixtures que le module tenants. */
const deriveTopBanks = (tenants: Tenant[]): TopBank[] =>
  [...tenants]
    .filter((tenant) => tenant.status !== TenantStatus.Suspended)
    .sort((a, b) => b.volumeMonth - a.volumeMonth)
    .slice(0, 4)
    .map((tenant, index) => {
      const [previous, last] = tenant.volumeSeries.slice(-2);
      const growthPct = previous && last && previous.volume > 0 ? Math.round(((last.volume - previous.volume) / previous.volume) * 100) : undefined;
      const isRecent = Date.now() - new Date(tenant.registeredAt).getTime() <= 60 * ONE_DAY_MS;
      return {
        id: tenant.id,
        name: tenant.name,
        city: tenant.city,
        plan: tenant.plan.name,
        initials: initialsOf(tenant.name),
        colorTone: COLOR_TONES[index % COLOR_TONES.length],
        volumeThirtyDaysM: tenant.volumeMonth / 1_000_000,
        growthPct: isRecent ? undefined : growthPct,
        isNew: isRecent,
      };
    });

/** COOPEC-style impayés, plafonds de plan à 85%+, essais tout juste créés — 3 dérivations, pas de duplication. */
const deriveAlerts = (tenants: Tenant[]): PlatformAlert[] => {
  const alerts: PlatformAlert[] = [];

  for (const tenant of tenants) {
    if (tenant.status === TenantStatus.Suspended || tenant.billingStatus !== BillingStatus.Overdue) {
      continue;
    }
    alerts.push({
      id: `alert-${tenant.id}-overdue`,
      kind: AlertKind.PaymentOverdue,
      bankId: tenant.id,
      bankName: tenant.name,
      severity: AlertSeverity.Critical,
      amount: tenant.plan.monthlyPrice,
      daysLate: 12,
      readOnlyInDays: 3,
      planName: tenant.plan.name,
    });
  }

  for (const limitAlert of computePlanLimitAlerts(tenants)) {
    if (limitAlert.metric !== 'agents') {
      continue;
    }
    alerts.push({
      id: `alert-${limitAlert.tenantId}-plan-limit`,
      kind: AlertKind.PlanLimitApproaching,
      bankId: limitAlert.tenantId,
      bankName: limitAlert.tenantName,
      severity: AlertSeverity.Warning,
      currentAgents: limitAlert.used,
      maxAgents: limitAlert.limit,
      planName: limitAlert.planName,
    });
  }

  for (const tenant of tenants) {
    const isFreshTrial =
      tenant.status === TenantStatus.Trial && Date.now() - new Date(tenant.registeredAt).getTime() <= RECENTLY_CREATED_MS;
    if (!isFreshTrial) {
      continue;
    }
    alerts.push({
      id: `alert-${tenant.id}-pending`,
      kind: AlertKind.PendingActivation,
      bankId: tenant.id,
      bankName: tenant.name,
      severity: AlertSeverity.Info,
      planRequested: tenant.plan.name,
    });
  }

  return alerts;
};

/** Gateway en mémoire — KPIs plateforme curés (agrégat des 27 banques, hors périmètre des fixtures détaillées) ; banques phares et alertes dérivées des mêmes fixtures que le module tenants. */
export class FakeOverviewGateway implements OverviewGateway {
  async fetchOverview(): Promise<OverviewSnapshot> {
    await delay();
    return {
      kpis: {
        volumeToday: 214_700_000,
        volumeMonth: 1_840_000_000,
        volumeMonthGrowthPct: 11,
        activeBanks: 24,
        totalBanks: 27,
        newBanksThisMonth: 2,
        trialBanks: 2,
        totalClients: 48_320,
        clientsDeltaThirtyDays: 1_240,
        totalAgents: 412,
        agentsActiveToday: 387,
        // Dérivé du catalogue de plans du module billing (tarif × banques abonnées par plan) —
        // même calcul que le KPI MRR de la page Abonnements, pas un chiffre dupliqué.
        mrr: computeMrr(planFixtures),
        mrrGrowthPct: 6.2,
      },
      volumeSeries: [
        { monthLabel: 'Fév', volumeMd: 1.21 },
        { monthLabel: 'Mar', volumeMd: 1.34 },
        { monthLabel: 'Avr', volumeMd: 1.42 },
        { monthLabel: 'Mai', volumeMd: 1.58 },
        { monthLabel: 'Juin', volumeMd: 1.71 },
        { monthLabel: 'Juil', volumeMd: 1.84 },
      ],
      topBanks: deriveTopBanks(tenantFixtures),
      alerts: deriveAlerts(tenantFixtures),
    };
  }
}

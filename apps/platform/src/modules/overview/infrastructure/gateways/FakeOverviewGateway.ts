import type { OverviewGateway, OverviewSnapshot } from '../../application/ports/OverviewGateway';
import { AlertKind, AlertSeverity } from '../../domain/entities/Overview';

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — données exactes de la maquette 1a « Vue d'ensemble ». */
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
        mrr: 4_250_000,
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
      topBanks: [
        {
          id: 'bank-camccul-express',
          name: 'CamCCUL Express',
          city: 'Bamenda',
          plan: 'Élite',
          initials: 'CE',
          colorTone: 'info',
          volumeThirtyDaysM: 298.4,
          growthPct: 14,
        },
        {
          id: 'bank-mec-confiance',
          name: 'MEC La Confiance',
          city: 'Yaoundé',
          plan: 'Élite',
          initials: 'MC',
          colorTone: 'primary',
          volumeThirtyDaysM: 214.7,
          growthPct: 8,
        },
        {
          id: 'bank-regionale-mf',
          name: 'La Régionale MF',
          city: 'Douala',
          plan: 'Croissance',
          initials: 'LR',
          colorTone: 'orange',
          volumeThirtyDaysM: 128.9,
          growthPct: 9,
        },
        {
          id: 'bank-financia-mf',
          name: 'Financia MF',
          city: 'Bafoussam',
          plan: 'Croissance',
          initials: 'FM',
          colorTone: 'olive',
          volumeThirtyDaysM: 96.1,
          isNew: true,
        },
      ],
      alerts: [
        {
          id: 'alert-coopec-sahel-overdue',
          kind: AlertKind.PaymentOverdue,
          bankId: 'bank-coopec-sahel',
          bankName: 'COOPEC Sahel',
          severity: AlertSeverity.Critical,
          amount: 120_000,
          daysLate: 12,
          readOnlyInDays: 3,
          planName: 'Croissance',
        },
        {
          id: 'alert-camccul-plan-limit',
          kind: AlertKind.PlanLimitApproaching,
          bankId: 'bank-camccul-express',
          bankName: 'CamCCUL Express',
          severity: AlertSeverity.Warning,
          currentAgents: 51,
          maxAgents: 60,
          planName: 'Élite',
        },
        {
          id: 'alert-union-financiere-pending',
          kind: AlertKind.PendingActivation,
          bankId: 'bank-union-financiere-ouest',
          bankName: "Union Financière de l'Ouest",
          severity: AlertSeverity.Info,
          planRequested: 'Croissance',
        },
      ],
    };
  }
}

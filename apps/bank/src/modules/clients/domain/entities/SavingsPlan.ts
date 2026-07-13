/** Plancher de cotisation quotidienne — constante banque, plus un champ par client. */
export const SAVINGS_PLAN_FLOOR_AMOUNT = 500;

export const DayOfWeek = {
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
  Sunday: 'Sunday',
} as const;
export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

/** Ordre d'affichage français — Lundi → Dimanche. */
export const DAY_OF_WEEK_ORDER: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

export const DAY_OF_WEEK_SHORT_LABEL: Record<DayOfWeek, string> = {
  Monday: 'Lun',
  Tuesday: 'Mar',
  Wednesday: 'Mer',
  Thursday: 'Jeu',
  Friday: 'Ven',
  Saturday: 'Sam',
  Sunday: 'Dim',
};

export const EngagementPreset = {
  ThreeMonths: 'ThreeMonths',
  SixMonths: 'SixMonths',
  OneYear: 'OneYear',
  Custom: 'Custom',
} as const;
export type EngagementPreset = (typeof EngagementPreset)[keyof typeof EngagementPreset];

export interface SavingsEngagement {
  /** ISO (YYYY-MM-DD). */
  startDate: string;
  /** ISO (YYYY-MM-DD) — TOUJOURS > startDate. */
  endDate: string;
  preset: EngagementPreset;
}

/** Toujours dérivés (computePlannedCollectionDays/computeSavingsTarget) — jamais saisis directement. */
export interface SavingsPlanComputed {
  plannedCollectionDays: number;
  /** Objectif INDICATIF — aucun blocage métier si le solde ne l'atteint pas à l'échéance. */
  targetAmount: number;
}

export interface SavingsPlan {
  /** Montant cotisé à chaque jour de collecte, en FCFA — ≥ SAVINGS_PLAN_FLOOR_AMOUNT. */
  amountPerCollectionDay: number;
  /** Jours cochés — au moins un. */
  collectionDays: DayOfWeek[];
  engagement: SavingsEngagement;
  computed: SavingsPlanComputed;
  openingDeposit?: number;
}

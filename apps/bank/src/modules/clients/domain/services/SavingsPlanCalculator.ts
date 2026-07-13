import { DayOfWeek, EngagementPreset, type SavingsPlanComputed } from '../entities/SavingsPlan';

/** Index JS (`Date#getUTCDay`) — 0 = dimanche. */
const WEEKDAY_INDEX: Record<DayOfWeek, number> = {
  [DayOfWeek.Sunday]: 0,
  [DayOfWeek.Monday]: 1,
  [DayOfWeek.Tuesday]: 2,
  [DayOfWeek.Wednesday]: 3,
  [DayOfWeek.Thursday]: 4,
  [DayOfWeek.Friday]: 5,
  [DayOfWeek.Saturday]: 6,
};

const parseDateOnly = (iso: string): Date => new Date(`${iso}T00:00:00.000Z`);

/**
 * Nombre de jours de collecte prévus entre `startDate` et `endDate`
 * (bornes incluses) — un service pur, réutilisé par le formulaire (récap en
 * direct) et par les selectors (objectif du plan).
 */
export const computePlannedCollectionDays = (
  collectionDays: DayOfWeek[],
  startDate: string,
  endDate: string,
): number => {
  if (collectionDays.length === 0) {
    return 0;
  }
  const weekdayIndexes = new Set(collectionDays.map((day) => WEEKDAY_INDEX[day]));
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);
  if (end < start) {
    return 0;
  }

  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    if (weekdayIndexes.has(cursor.getUTCDay())) {
      count += 1;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
};

/** Objectif indicatif — cotisation prévue cumulée + dépôt d'ouverture éventuel. */
export const computeSavingsTarget = (
  amountPerCollectionDay: number,
  plannedCollectionDays: number,
  openingDeposit = 0,
): number => amountPerCollectionDay * plannedCollectionDays + openingDeposit;

export const computeSavingsPlanComputed = (
  amountPerCollectionDay: number,
  collectionDays: DayOfWeek[],
  startDate: string,
  endDate: string,
  openingDeposit = 0,
): SavingsPlanComputed => {
  const plannedCollectionDays = computePlannedCollectionDays(collectionDays, startDate, endDate);
  return {
    plannedCollectionDays,
    targetAmount: computeSavingsTarget(amountPerCollectionDay, plannedCollectionDays, openingDeposit),
  };
};

const addMonths = (iso: string, months: number): string => {
  const date = parseDateOnly(iso);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
};

/** Date de fin dérivée d'un préréglage — sans effet pour `Custom` (l'appelant fournit sa propre date). */
export const computeEngagementEndDate = (startDate: string, preset: EngagementPreset): string => {
  switch (preset) {
    case EngagementPreset.ThreeMonths:
      return addMonths(startDate, 3);
    case EngagementPreset.SixMonths:
      return addMonths(startDate, 6);
    case EngagementPreset.OneYear:
      return addMonths(startDate, 12);
    case EngagementPreset.Custom:
    default:
      return startDate;
  }
};

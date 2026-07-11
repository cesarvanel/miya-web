import { createEntityAdapter } from '@reduxjs/toolkit';

export const ActivityEventKind = {
  CollectionConfirmed: 'collectionConfirmed',
  DisputeOpened: 'disputeOpened',
  DayClosed: 'dayClosed',
  SettlementValidated: 'settlementValidated',
  CapApproaching: 'capApproaching',
} as const;
export type ActivityEventKind = (typeof ActivityEventKind)[keyof typeof ActivityEventKind];

export interface ActivityEvent {
  id: string;
  /** ISO 8601. */
  occurredAt: string;
  kind: ActivityEventKind;
  message: string;
  agentId?: string;
}

/** Tri décroissant par occurredAt — le plus récent en tête du fil. */
export const ActivityEventsAdapter = createEntityAdapter<ActivityEvent>({
  sortComparer: (a, b) => b.occurredAt.localeCompare(a.occurredAt),
});

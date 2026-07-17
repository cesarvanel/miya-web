import { createEntityAdapter } from '@reduxjs/toolkit';

export type TenantPlanName = 'Essentiel' | 'Croissance' | 'Élite';

export interface TenantPlan {
  id: string;
  name: TenantPlanName;
  monthlyPrice: number;
}

export interface AdminContact {
  name: string;
  email: string;
  phone?: string;
}

export interface UsageMetric {
  used: number;
  limit: number;
}

export interface TenantUsage {
  agents: UsageMetric;
  clients: UsageMetric;
  agencies: UsageMetric;
}

export const TenantStatus = { Active: 'Active', Trial: 'Trial', Suspended: 'Suspended' } as const;
export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus];

/** Axe séparé de `status` : une banque Active peut être Overdue — la suspension est une décision, jamais automatique. */
export const BillingStatus = { UpToDate: 'UpToDate', Overdue: 'Overdue' } as const;
export type BillingStatus = (typeof BillingStatus)[keyof typeof BillingStatus];

export interface TenantSuspension {
  by: string;
  at: string;
  reason: string;
}

export interface VolumePoint {
  monthLabel: string;
  /** FCFA. */
  volume: number;
}

export interface Tenant {
  id: string;
  name: string;
  city: string;
  logoUrl?: string;
  /** Raison sociale complète — distincte du nom d'usage affiché partout ailleurs. */
  legalName?: string;
  /** Numéro d'agrément COBAC. */
  cobacApproval?: string;
  adminContact: AdminContact;
  plan: TenantPlan;
  usage: TenantUsage;
  volumeMonth: number;
  volumeSeries: VolumePoint[];
  status: TenantStatus;
  trialEndsAt?: string;
  billingStatus: BillingStatus;
  registeredAt: string;
  suspension?: TenantSuspension;
}

export const tenantsAdapter = createEntityAdapter<Tenant>();

export const TenantEventKind = {
  Created: 'Created',
  PlanChanged: 'PlanChanged',
  Suspended: 'Suspended',
  Reactivated: 'Reactivated',
  InvoicePaid: 'InvoicePaid',
  InvitationResent: 'InvitationResent',
} as const;
export type TenantEventKind = (typeof TenantEventKind)[keyof typeof TenantEventKind];

export interface TenantEvent {
  id: string;
  tenantId: string;
  /** ISO. */
  at: string;
  kind: TenantEventKind;
  summary: string;
}

/** Le plus récent en tête — le journal se lit chronologie inversée. */
export const eventsAdapter = createEntityAdapter<TenantEvent>({
  sortComparer: (a, b) => b.at.localeCompare(a.at),
});

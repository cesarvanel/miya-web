import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { invoicePaid } from '@/modules/billing';
import {
  BillingStatus,
  eventsAdapter,
  tenantsAdapter,
  TenantEventKind,
  TenantStatus,
  type Tenant,
  type TenantEvent,
  type TenantPlan,
  type TenantUsage,
} from '../entities/Tenant';
import { FetchTenantAsync } from '../../application/usecases/fetch-tenant-async/FetchTenantAsync';
import { FetchTenantsAsync } from '../../application/usecases/fetch-tenants-async/FetchTenantsAsync';

const initialState = {
  tenants: tenantsAdapter.getInitialState(),
  events: eventsAdapter.getInitialState(),
};

export type TenantsState = typeof initialState;

let nextEventSeq = 1;
const nextEventId = (): string => `tev-local-${Date.now()}-${nextEventSeq++}`;

/**
 * "180000" -> "180 000" - fr-FR groupe les milliers avec une espace insecable
 * (U+00A0 ou U+202F selon l'environnement JS) ; normalisee en espace ASCII
 * classique par code point, comme Money.format(), pour un texte previsible
 * dans le journal du tenant.
 */
const formatFcfa = (amount: number): string =>
  Array.from(amount.toLocaleString('fr-FR'))
    .map((char) => (char.charCodeAt(0) === 160 || char.charCodeAt(0) === 8239 ? ' ' : char))
    .join('');

/** Le journal se construit dans le domaine — chaque transition ajoute son propre event. */
const pushEvent = (state: TenantsState, event: Omit<TenantEvent, 'id'>): void => {
  eventsAdapter.addOne(state.events, { ...event, id: nextEventId() });
};

export const tenantsSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    created: (state, action: PayloadAction<{ tenant: Tenant }>) => {
      const { tenant } = action.payload;
      tenantsAdapter.addOne(state.tenants, tenant);
      pushEvent(state, {
        tenantId: tenant.id,
        at: tenant.registeredAt,
        kind: TenantEventKind.Created,
        summary: "Banque créée · invitation admin envoyée",
      });
    },

    /** Motif obligatoire ; les données sont préservées, seul l'accès est coupé. */
    suspended: (
      state,
      action: PayloadAction<{ tenantId: string; by: string; at: string; reason: string }>,
    ) => {
      const { tenantId, by, at, reason } = action.payload;
      if (!state.tenants.entities[tenantId]) {
        return;
      }
      tenantsAdapter.updateOne(state.tenants, {
        id: tenantId,
        changes: { status: TenantStatus.Suspended, suspension: { by, at, reason } },
      });
      pushEvent(state, { tenantId, at, kind: TenantEventKind.Suspended, summary: `Banque suspendue par ${by}` });
    },

    reactivated: (
      state,
      action: PayloadAction<{ tenantId: string; by: string; at: string }>,
    ) => {
      const { tenantId, by, at } = action.payload;
      if (!state.tenants.entities[tenantId]) {
        return;
      }
      tenantsAdapter.updateOne(state.tenants, {
        id: tenantId,
        changes: { status: TenantStatus.Active, suspension: undefined },
      });
      pushEvent(state, { tenantId, at, kind: TenantEventKind.Reactivated, summary: `Banque réactivée par ${by}` });
    },

    /** Prend effet au prochain cycle de facturation — l'event le précise. */
    planChanged: (
      state,
      action: PayloadAction<{ tenantId: string; at: string; plan: TenantPlan; usage: TenantUsage }>,
    ) => {
      const { tenantId, at, plan, usage } = action.payload;
      const tenant = state.tenants.entities[tenantId];
      if (!tenant) {
        return;
      }
      const previousPlanName = tenant.plan.name;
      tenantsAdapter.updateOne(state.tenants, { id: tenantId, changes: { plan, usage } });
      pushEvent(state, {
        tenantId,
        at,
        kind: TenantEventKind.PlanChanged,
        summary: `Passage ${previousPlanName} → ${plan.name} (au prochain cycle de facturation)`,
      });
    },

    invitationResent: (
      state,
      action: PayloadAction<{ tenantId: string; at: string; maskedEmail: string }>,
    ) => {
      const { tenantId, at, maskedEmail } = action.payload;
      pushEvent(state, { tenantId, at, kind: TenantEventKind.InvitationResent, summary: `Invitation renvoyée à ${maskedEmail}` });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(FetchTenantsAsync.fulfilled, (state, action) => {
        tenantsAdapter.setAll(state.tenants, action.payload);
      })
      .addCase(FetchTenantAsync.fulfilled, (state, action) => {
        tenantsAdapter.upsertOne(state.tenants, action.payload.tenant);
        eventsAdapter.upsertMany(state.events, action.payload.events);
      })
      .addCase(invoicePaid, (state, action) => {
        const { tenantId, amount, at } = action.payload;
        if (!state.tenants.entities[tenantId]) {
          return;
        }
        tenantsAdapter.updateOne(state.tenants, { id: tenantId, changes: { billingStatus: BillingStatus.UpToDate } });
        pushEvent(state, {
          tenantId,
          at,
          kind: TenantEventKind.InvoicePaid,
          summary: `Paiement reçu · ${formatFcfa(amount)} FCFA`,
        });
      });
  },
});

export const TenantsActions = tenantsSlice.actions;

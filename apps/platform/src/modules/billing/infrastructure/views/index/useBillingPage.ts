import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { openModal } from '@/shared/modals';
import { FetchBillingAsync } from '../../../application/usecases/fetch-billing-async/FetchBillingAsync';
import {
  BillingSelectors,
  type InvoiceStatusFilter,
} from '../../../domain/selectors/Selectors';

/** Lit un statut de filtre depuis l'URL (deep-link depuis l'alerte de retard de paiement), sinon "all". */
const readInitialStatus = (searchParams: URLSearchParams): InvoiceStatusFilter => {
  const raw = searchParams.get('status');
  return raw === 'paid' || raw === 'pending' || raw === 'overdue' ? raw : 'all';
};

export const useBillingPage = () => {
  const dispatch = usePlatformDispatch();
  const [searchParams] = useSearchParams();
  const tenantId = searchParams.get('tenantId') ?? undefined;

  const [status, setStatus] = useState<InvoiceStatusFilter>(() => readInitialStatus(searchParams));

  useEffect(() => {
    dispatch(FetchBillingAsync());
  }, [dispatch]);

  const { isPending } = useRequestStatus(FetchBillingAsync);
  const plans = usePlatformSelector(BillingSelectors.selectAllPlans);
  const mrr = usePlatformSelector(BillingSelectors.selectMrr);
  const totals = usePlatformSelector(BillingSelectors.selectInvoiceTotals);
  const counts = usePlatformSelector(BillingSelectors.selectInvoicesFilterCounts);
  const invoices = usePlatformSelector((state) => BillingSelectors.selectFilteredInvoices(state, { status, tenantId }));

  const featuredPlanId = plans.reduce<string | null>(
    (currentId, plan) => (currentId === null || plan.tenantsCount > (plans.find((p) => p.id === currentId)?.tenantsCount ?? 0) ? plan.id : currentId),
    null,
  );

  const openEditPlan = (planId: string): void => {
    dispatch(openModal({ type: 'editPlan', props: { planId } }));
  };
  const openMarkInvoicePaid = (invoiceId: string): void => {
    dispatch(openModal({ type: 'markInvoicePaid', props: { invoiceId } }));
  };
  const openSendReminder = (invoiceId: string): void => {
    dispatch(openModal({ type: 'sendReminder', props: { invoiceId } }));
  };

  return {
    plans,
    featuredPlanId,
    mrr,
    totals,
    counts,
    status,
    setStatus,
    invoices,
    tenantId,
    isPending,
    openEditPlan,
    openMarkInvoicePaid,
    openSendReminder,
  };
};

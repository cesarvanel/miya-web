import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { billingSelectors, FetchBillingAsync } from '@/modules/billing';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { openModal } from '@/shared/modals';
import { FetchTenantAsync } from '../../../application/usecases/fetch-tenant-async/FetchTenantAsync';
import { selectEventsByTenant, selectTenantById } from '../../../domain/selectors/Selectors';

export const useTenantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const tenantId = id ?? '';
  const dispatch = usePlatformDispatch();

  useEffect(() => {
    if (tenantId) {
      dispatch(FetchTenantAsync(tenantId));
    }
    dispatch(FetchBillingAsync());
  }, [dispatch, tenantId]);

  const { isPending } = useRequestStatus(FetchTenantAsync);
  const tenant = usePlatformSelector((state) => selectTenantById(state, tenantId));
  const events = usePlatformSelector((state) => selectEventsByTenant(state, tenantId));
  const invoices = usePlatformSelector((state) => billingSelectors.selectInvoicesByTenant(state, tenantId));

  const openChangePlan = (): void => {
    dispatch(openModal({ type: 'changePlan', props: { tenantId } }));
  };
  const openSuspend = (): void => {
    dispatch(openModal({ type: 'suspendTenant', props: { tenantId } }));
  };
  const openReactivate = (): void => {
    dispatch(openModal({ type: 'confirmReactivateTenant', props: { tenantId } }));
  };
  const openResendInvitation = (): void => {
    dispatch(openModal({ type: 'resendInvitation', props: { tenantId } }));
  };

  return {
    tenant,
    events,
    invoices,
    isPending: isPending && !tenant,
    openChangePlan,
    openSuspend,
    openReactivate,
    openResendInvitation,
  };
};

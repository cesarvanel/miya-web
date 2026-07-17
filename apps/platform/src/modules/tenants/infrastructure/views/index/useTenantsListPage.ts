import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { openModal } from '@/shared/modals';
import { FetchTenantsAsync } from '../../../application/usecases/fetch-tenants-async/FetchTenantsAsync';
import {
  selectFilteredTenants,
  selectTenantsFilterCounts,
  type TenantsStatusFilter,
} from '../../../domain/selectors/Selectors';

const PAGE_SIZE = 7;

export const useTenantsListPage = () => {
  const dispatch = usePlatformDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TenantsStatusFilter>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(FetchTenantsAsync());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const { isPending } = useRequestStatus(FetchTenantsAsync);
  const counts = usePlatformSelector(selectTenantsFilterCounts);
  const filtered = usePlatformSelector((state) => selectFilteredTenants(state, { search, status }));

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageTenants = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToDetail = (tenantId: string): void => {
    navigate(`/tenants/${tenantId}`);
  };
  const goToNew = (): void => {
    navigate('/tenants/new');
  };

  const openSuspend = (tenantId: string): void => {
    dispatch(openModal({ type: 'suspendTenant', props: { tenantId } }));
  };

  const openReactivate = (tenantId: string): void => {
    dispatch(openModal({ type: 'confirmReactivateTenant', props: { tenantId } }));
  };

  return {
    search,
    setSearch,
    status,
    setStatus,
    counts,
    tenants: pageTenants,
    totalFiltered: filtered.length,
    isPending,
    page,
    pageCount,
    pageSize: PAGE_SIZE,
    setPage,
    goToDetail,
    goToNew,
    openSuspend,
    openReactivate,
  };
};

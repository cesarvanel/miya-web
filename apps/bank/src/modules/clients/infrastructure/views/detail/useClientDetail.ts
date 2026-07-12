import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { openModal } from '@/shared/modals';
import { FetchClientAsync } from '../../../application/usecases/fetch-client-async/FetchClientAsync';
import { FetchClientOperationsAsync } from '../../../application/usecases/fetch-client-operations-async/FetchClientOperationsAsync';
import { selectClientById, selectOperationsByClient } from '../../../domain/selectors/Selectors';

export const useClientDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useBankDispatch();
  const navigate = useNavigate();
  const [isQrPreviewOpen, setQrPreviewOpen] = useState(false);

  const client = useBankSelector((state) => selectClientById(state, id));
  const operationsByMonth = useBankSelector((state) => selectOperationsByClient(state, id));
  const { isPending } = useRequestStatus(FetchClientAsync);
  const { isPending: isOperationsPending } = useRequestStatus(FetchClientOperationsAsync);

  const openEditUsualAmount = (): void => {
    if (!client) {
      return;
    }
    dispatch(openModal({ type: 'editUsualAmount', props: { clientId: client.id } }));
  };

  const openDeactivate = (): void => {
    if (!client) {
      return;
    }
    dispatch(openModal({ type: 'deactivateClient', props: { clientId: client.id } }));
  };

  const goToWithdrawal = (): void => {
    navigate('/withdrawals');
  };

  return {
    client,
    operationsByMonth,
    isPending,
    isOperationsPending,
    isQrPreviewOpen,
    openQrPreview: () => setQrPreviewOpen(true),
    closeQrPreview: () => setQrPreviewOpen(false),
    openEditUsualAmount,
    openDeactivate,
    goToWithdrawal,
  };
};

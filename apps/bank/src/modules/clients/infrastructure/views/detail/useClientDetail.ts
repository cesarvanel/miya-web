import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { withdrawalSelectors } from '@/modules/withdrawals';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { openModal } from '@/shared/modals';
import { FetchClientAsync } from '../../../application/usecases/fetch-client-async/FetchClientAsync';
import { FetchClientOperationsAsync } from '../../../application/usecases/fetch-client-operations-async/FetchClientOperationsAsync';
import { selectClientById, selectOperationsByClient, selectSavingsProgress } from '../../../domain/selectors/Selectors';

export const useClientDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useBankDispatch();
  const navigate = useNavigate();
  const [isQrPreviewOpen, setQrPreviewOpen] = useState(false);

  const client = useBankSelector((state) => selectClientById(state, id));
  const operationsByMonth = useBankSelector((state) => selectOperationsByClient(state, id));
  const savingsProgress = useBankSelector((state) => selectSavingsProgress(state, id));
  const { isPending } = useRequestStatus(FetchClientAsync);
  const { isPending: isOperationsPending } = useRequestStatus(FetchClientOperationsAsync);

  const openEditSavingsPlan = (): void => {
    if (!client) {
      return;
    }
    dispatch(openModal({ type: 'editSavingsPlan', props: { clientId: client.id } }));
  };

  const openDeactivate = (): void => {
    if (!client) {
      return;
    }
    dispatch(openModal({ type: 'deactivateClient', props: { clientId: client.id } }));
  };

  const pendingWithdrawal = useBankSelector((state) => withdrawalSelectors.selectPendingByClient(state, id));

  const goToWithdrawal = (): void => {
    navigate(pendingWithdrawal ? `/withdrawals?highlight=${pendingWithdrawal.id}` : '/withdrawals');
  };

  return {
    client,
    operationsByMonth,
    savingsProgress,
    isPending,
    isOperationsPending,
    isQrPreviewOpen,
    openQrPreview: () => setQrPreviewOpen(true),
    closeQrPreview: () => setQrPreviewOpen(false),
    openEditSavingsPlan,
    openDeactivate,
    goToWithdrawal,
  };
};

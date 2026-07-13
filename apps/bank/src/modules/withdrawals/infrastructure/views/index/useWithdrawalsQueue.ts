import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { openModal } from '@/shared/modals';
import { WithdrawalStatus } from '../../../domain/entities/Withdrawal';
import {
  selectAllWithdrawals,
  selectApprovedAwaitingDisbursement,
  selectHistoryList,
  selectPendingWithdrawals,
  selectWithdrawalById,
} from '../../../domain/selectors/Selectors';
import { FetchWithdrawalsAsync } from '../../../application/usecases/fetch-withdrawals-async/FetchWithdrawalsAsync';

export type WithdrawalsTab = 'pending' | 'approved' | 'history';

export const useWithdrawalsQueue = () => {
  const dispatch = useBankDispatch();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight') ?? undefined;
  const [tab, setTab] = useState<WithdrawalsTab>('pending');

  const { isPending } = useRequestStatus(FetchWithdrawalsAsync);

  const pendingWithdrawals = useBankSelector(selectPendingWithdrawals);
  const approvedWithdrawals = useBankSelector(selectApprovedAwaitingDisbursement);
  const historyList = useBankSelector(selectHistoryList);
  const allWithdrawals = useBankSelector(selectAllWithdrawals);
  const highlighted = useBankSelector((state) => (highlightId ? selectWithdrawalById(state, highlightId) : undefined));

  useEffect(() => {
    if (!highlighted) {
      return;
    }
    if (highlighted.status === WithdrawalStatus.Approved) {
      setTab('approved');
    } else if (highlighted.status === WithdrawalStatus.Pending) {
      setTab('pending');
    } else {
      setTab('history');
    }
  }, [highlighted]);

  const totalPendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.requestedAmount, 0);
  const totalApprovedAmount = approvedWithdrawals.reduce((sum, w) => sum + w.requestedAmount, 0);

  const now = new Date();
  const disbursedThisMonthAmount = allWithdrawals
    .filter((w) => {
      if (w.status !== WithdrawalStatus.Disbursed || !w.disbursement) {
        return false;
      }
      const at = new Date(w.disbursement.at);
      return at.getFullYear() === now.getFullYear() && at.getMonth() === now.getMonth();
    })
    .reduce((sum, w) => sum + w.requestedAmount, 0);
  const rejectedCount = allWithdrawals.filter((w) => w.status === WithdrawalStatus.Rejected).length;

  const openApprove = (id: string): void => {
    dispatch(openModal({ type: 'approveWithdrawal', props: { withdrawalId: id } }));
  };
  const openReject = (id: string): void => {
    dispatch(openModal({ type: 'rejectWithdrawal', props: { withdrawalId: id } }));
  };
  const openDisburse = (id: string): void => {
    dispatch(openModal({ type: 'disburseWithdrawal', props: { withdrawalId: id } }));
  };

  return {
    tab,
    setTab,
    isPending,
    pendingWithdrawals,
    approvedWithdrawals,
    historyList,
    totalPendingAmount,
    totalApprovedAmount,
    disbursedThisMonthAmount,
    rejectedCount,
    highlightId,
    openApprove,
    openReject,
    openDisburse,
  };
};

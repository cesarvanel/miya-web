import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { openModal } from '@/shared/modals';
import { FetchDisputesAsync } from '../../../application/usecases/fetch-disputes-async/FetchDisputesAsync';
import { DisputeDecision } from '../../../domain/entities/Dispute';
import { selectDisputeById, selectOpenDisputes } from '../../../domain/selectors/Selectors';

export const useDisputeResolution = () => {
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useBankDispatch();
  const [reason, setReason] = useState('');

  const dispute = useBankSelector((state) => selectDisputeById(state, id));
  const openDisputes = useBankSelector(selectOpenDisputes);
  const { isPending } = useRequestStatus(FetchDisputesAsync);

  const position = openDisputes.findIndex((candidate) => candidate.id === id);
  const positionLabel =
    position >= 0 ? `${position + 1} / ${openDisputes.length} ouvertes` : null;

  const canDecide = reason.trim() !== '';

  const openConfirm = (inFavorOf: DisputeDecision): void => {
    if (!dispute || !canDecide) {
      return;
    }
    dispatch(openModal({ type: 'confirmResolveDispute', props: { disputeId: dispute.id, inFavorOf, reason } }));
  };

  return {
    dispute,
    isPending,
    positionLabel,
    reason,
    setReason,
    canDecide,
    openConfirm,
  };
};

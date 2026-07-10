import { useParams } from 'react-router-dom';
import { Money, useRequestStatus } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { openModal } from '@/shared/modals';
import { FetchSlipAsync } from '@/modules/settlements/application/usecases/fetch-slip-async/FetchSlipAsync';
import {
  SettlementSelectors,
  selectQueue,
  selectSlipById,
} from '@/modules/settlements/domain/selectors/Selectors';

export const useSlipDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useBankDispatch();

  const slip = useBankSelector((state) => selectSlipById(state, id));
  const subtotals = useBankSelector((state) =>
    SettlementSelectors.selectSlipSubtotals(state, id),
  );
  const queue = useBankSelector(selectQueue);
  const { isPending } = useRequestStatus(FetchSlipAsync);

  const position = queue.findIndex((item) => item.id === id);
  const positionLabel =
    position >= 0 ? `Bordereau ${position + 1} / ${queue.length}` : null;

  const partialDepositTotal = (slip?.partialDeposits ?? []).reduce(
    (total, deposit) => total.add(Money.from(deposit.amount)),
    Money.from(0),
  );
  const firstPartialDeposit = slip?.partialDeposits[0];

  const openConfirmValidation = (): void => {
    if (!slip) {
      return;
    }
    dispatch(openModal({ type: 'confirmValidation', props: { slipId: slip.id } }));
  };

  const openReject = (): void => {
    if (!slip) {
      return;
    }
    dispatch(openModal({ type: 'rejectSettlement', props: { slipId: slip.id } }));
  };

  return {
    slip,
    subtotals,
    isPending,
    positionLabel,
    partialDepositTotal,
    firstPartialDeposit,
    openConfirmValidation,
    openReject,
  };
};

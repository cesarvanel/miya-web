import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { selectBankSelectionPending } from '../../../domain/selectors/Selectors';
import { SelectBankAsync } from '../../../application/usecases/select-bank-async/SelectBankAsync';
import { AuthRoutes } from '../../router/AuthRoutes';

export const useBankSelectionPage = () => {
  const dispatch = useBankDispatch();
  const navigate = useNavigate();
  const pending = useBankSelector(selectBankSelectionPending);
  const [submittingBankId, setSubmittingBankId] = useState<string | null>(null);

  const selectBank = async (bankId: string): Promise<void> => {
    if (!pending) {
      return;
    }
    setSubmittingBankId(bankId);
    const result = await dispatch(SelectBankAsync({ userId: pending.user.id, bankId }));
    setSubmittingBankId(null);
    if (SelectBankAsync.fulfilled.match(result)) {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    if (!pending) {
      navigate(AuthRoutes.loginPath, { replace: true });
    }
  }, [pending, navigate]);

  return {
    pending,
    submittingBankId,
    selectBank,
  };
};

import { useNavigate } from 'react-router-dom';
import { useRequestStatus } from '@miya/kernel';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { FetchRoundsAsync } from '../../../application/usecases/fetch-rounds-async/FetchRoundsAsync';
import { selectRoundsOfDay } from '../../../domain/selectors/Selectors';
import { CollectionsRoutes } from '../../router/CollectionsRoutes';

export const useRoundsList = () => {
  const navigate = useNavigate();
  const rounds = useBankSelector(selectRoundsOfDay);
  const { isPending } = useRequestStatus(FetchRoundsAsync);

  const goToRound = (roundId: string): void => {
    navigate(CollectionsRoutes.buildDetailPath(roundId));
  };

  return { rounds, isPending, goToRound };
};

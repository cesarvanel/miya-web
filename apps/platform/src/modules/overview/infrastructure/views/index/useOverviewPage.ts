import { useEffect, useState } from 'react';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { FetchOverviewAsync } from '../../../application/usecases/fetch-overview-async/FetchOverviewAsync';
import { OverviewSelectors } from '../../../domain/selectors/Selectors';

export type OverviewPeriod = 'month' | 'day';

export const useOverviewPage = () => {
  const dispatch = usePlatformDispatch();
  const [period, setPeriod] = useState<OverviewPeriod>('month');

  const kpis = usePlatformSelector(OverviewSelectors.selectKpis);
  const volumeSeries = usePlatformSelector(OverviewSelectors.selectVolumeSeries);
  const topBanks = usePlatformSelector(OverviewSelectors.selectTopBanks);
  const alerts = usePlatformSelector(OverviewSelectors.selectAlerts);

  useEffect(() => {
    dispatch(FetchOverviewAsync());
  }, [dispatch]);

  return { period, setPeriod, kpis, volumeSeries, topBanks, alerts };
};

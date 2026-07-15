import type { BankRootState } from '@/config/stores/store';
import type { SupervisionDaySnapshot, SupervisionMonthSnapshot } from '../entities/Supervision';

export const selectDaySnapshot = (state: BankRootState): SupervisionDaySnapshot | null => state.supervision.day;

export const selectMonthSnapshot = (state: BankRootState): SupervisionMonthSnapshot | null => state.supervision.month;

export const SupervisionSelectors = {
  selectDaySnapshot,
  selectMonthSnapshot,
};

import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { SelectBankCommand } from './SelectBankCommand';
import { SelectBankResponse } from './SelectBankResponse';

/** Complète la connexion après l'écran de sélection d'établissement. */
export const SelectBankAsync = createBankAsyncThunk<SelectBankResponse, SelectBankCommand>(
  'auth/selectBank',
  async ({ userId, bankId }, { extra, rejectWithValue }) => {
    try {
      return await extra.authGateway.selectBank(userId, bankId);
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);

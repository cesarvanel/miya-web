import { getErrorState } from '@miya/kernel';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { TenantsActions } from '../../../domain/slices/TenantsSlice';

export const ResendInvitationAsync = createPlatformAsyncThunk<void, { tenantId: string }>(
  'tenants/resendInvitation',
  async ({ tenantId }, { extra, dispatch, rejectWithValue }) => {
    try {
      const { maskedEmail } = await extra.tenantGateway.resendInvitation(tenantId);

      dispatch(
        TenantsActions.invitationResent({
          tenantId,
          at: new Date().toISOString(),
          maskedEmail,
        }),
      );
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Invitation renvoyée',
          message: `Un nouvel e-mail a été envoyé à ${maskedEmail}.`,
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);

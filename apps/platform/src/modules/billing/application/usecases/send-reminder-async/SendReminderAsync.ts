import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { reminderSent } from '../../../domain/events';
import { BillingActions } from '../../../domain/slices/BillingSlice';
import { SendReminderCommand } from './SendReminderCommand';

/** Relance une facture ; si elle est Overdue, pose (ou repousse) la suspension programmée à échéance + 15 jours. */
export const SendReminderAsync = createPlatformAsyncThunk<void, SendReminderCommand>(
  'billing/sendReminder',
  async ({ invoiceId }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const invoice = await extra.billingGateway.sendReminder(invoiceId);
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const byId = authSelectors.selectCurrentUser(getState())?.id ?? '';
      const at = new Date().toISOString();

      dispatch(BillingActions.sendReminder({ invoiceId, by, at }));
      dispatch(reminderSent({ invoiceId, tenantId: invoice.tenantId, tenantName: invoice.tenantName, by, byId, at }));
      dispatch(invalidateTags(['Billing']));

      const suspensionLabel = invoice.scheduledSuspensionAt
        ? new Date(invoice.scheduledSuspensionAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Relance envoyée',
          message: suspensionLabel
            ? `Suspension programmée le ${suspensionLabel} sans paiement.`
            : `Relance envoyée à ${invoice.tenantName}.`,
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);

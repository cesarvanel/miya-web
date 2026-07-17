import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { invoicePaid } from '../../../domain/events';
import { BillingActions } from '../../../domain/slices/BillingSlice';
import type { InvoicePayment } from '../../../domain/entities/Invoice';
import { MarkInvoicePaidCommand } from './MarkInvoicePaidCommand';

/**
 * Enregistre un paiement reçu hors plateforme (virement / mobile money). Met
 * à jour la facture ET dispatche l'event `invoicePaid` : le module tenants s'y
 * abonne pour repasser sa `billingStatus` à jour, sans que billing importe
 * ses entrailles.
 */
export const MarkInvoicePaidAsync = createPlatformAsyncThunk<void, MarkInvoicePaidCommand>(
  'billing/markInvoicePaid',
  async (command, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const invoice = await extra.billingGateway.markInvoicePaid(command);
      const recordedBy = authSelectors.selectCurrentUserDisplayName(getState());
      const payment: InvoicePayment = {
        receivedAt: command.receivedAt,
        method: command.method,
        reference: command.reference,
        recordedBy,
      };

      dispatch(BillingActions.markPaid({ invoiceId: invoice.id, payment }));
      dispatch(
        invoicePaid({
          invoiceId: invoice.id,
          tenantId: invoice.tenantId,
          tenantName: invoice.tenantName,
          amount: invoice.amount,
          at: command.receivedAt,
          recordedBy,
        }),
      );
      dispatch(invalidateTags(['Billing', 'Tenants']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Paiement enregistré',
          message: `${invoice.tenantName} est à jour.`,
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);

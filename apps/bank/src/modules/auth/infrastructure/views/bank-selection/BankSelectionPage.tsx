import React from 'react';
import { InitialsAvatar } from '@miya/ui';
import { BankUserRole } from '../../../domain/entities/Session';
import { AuthSplitShell } from '../composants/AuthSplitShell';
import { useBankSelectionPage } from './useBankSelectionPage';

const ROLE_LABEL: Record<BankUserRole, string> = {
  [BankUserRole.BankAdmin]: 'Administrateur',
  [BankUserRole.Supervisor]: 'Responsable',
};

/** Sélection d'établissement — compte multi-banques. Maquette B8. */
export const BankSelectionPage: React.FC = () => {
  const { pending, submittingBankId, selectBank } = useBankSelectionPage();

  if (!pending) {
    return null;
  }

  const firstName = pending.user.fullName.split(' ')[0];

  return (
    <AuthSplitShell>
      <div className="text-[22px] font-extrabold text-ink">Choisir un établissement</div>
      <div className="mt-1.5 text-[13px] font-medium text-ink-muted">
        Bonjour {firstName} — vous êtes rattaché·e à plusieurs institutions.
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        {pending.banks.map((bank) => {
          const submitting = submittingBankId === bank.id;
          return (
            <button
              key={bank.id}
              type="button"
              disabled={submittingBankId !== null}
              onClick={() => void selectBank(bank.id)}
              className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-card p-3.5 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_16px_32px_-18px_rgba(10,107,78,.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <InitialsAvatar name={bank.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-bold text-ink">{bank.name}</div>
                <div className="text-[12px] font-medium text-ink-faint">{ROLE_LABEL[pending.user.role]} · {pending.banks.length} agence{pending.banks.length > 1 ? 's' : ''}</div>
              </div>
              {submitting ? (
                <span className="size-4 flex-none animate-spin rounded-full border-2 border-line border-t-primary" />
              ) : (
                <span className="size-[18px] flex-none rounded-full border-[1.5px] border-line-soft transition group-hover:border-primary/40" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-[11.5px] font-semibold text-ink-faint">Survolez une carte pour la surélever · cliquez pour continuer.</div>
    </AuthSplitShell>
  );
};

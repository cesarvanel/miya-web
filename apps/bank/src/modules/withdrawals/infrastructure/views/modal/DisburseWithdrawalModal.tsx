import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dropdown, Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { agentSelectors } from '@/modules/settings';
import { clientsSelectors } from '@/modules/clients';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { DisburseWithdrawalAsync } from '../../../application/usecases/disburse-withdrawal-async/DisburseWithdrawalAsync';
import { DisbursementMethod } from '../../../domain/entities/Withdrawal';
import { selectWithdrawalById } from '../../../domain/selectors/Selectors';

/** TODO(auth): remplacer par l'utilisateur connecté réel — pas d'auth branchée pour l'instant. */
const CURRENT_USER = 'A. Mbarga';

export const DisburseWithdrawalModal: React.FC = () => {
  const { isOpen, props, close } = useModal('disburseWithdrawal');
  const dispatch = useBankDispatch();
  const withdrawal = useBankSelector((state) => (props ? selectWithdrawalById(state, props.withdrawalId) : undefined));
  const client = useBankSelector((state) => (withdrawal ? clientsSelectors.selectClientById(state, withdrawal.client.id) : undefined));
  const agents = useBankSelector(agentSelectors.selectAllAgents);

  const [method, setMethod] = useState<DisbursementMethod>(DisbursementMethod.CashAtBranch);
  const [agentId, setAgentId] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && client) {
      setAgentId(client.assignedAgent.id);
    }
    if (!isOpen) {
      setMethod(DisbursementMethod.CashAtBranch);
      setConfirmed(false);
    }
  }, [isOpen, client]);

  if (!isOpen || !withdrawal) {
    return null;
  }

  const canConfirm = confirmed && (method === DisbursementMethod.CashAtBranch || agentId !== '') && !submitting;

  const handleClose = (): void => {
    setConfirmed(false);
    close();
  };

  const handleConfirm = async (): Promise<void> => {
    if (!canConfirm) {
      return;
    }
    setSubmitting(true);
    await dispatch(
      DisburseWithdrawalAsync({
        withdrawalId: withdrawal.id,
        method,
        agentId: method === DisbursementMethod.ViaAgent ? agentId : undefined,
      }),
    );
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel="Confirmer le décaissement" width={460}>
      <div className="text-lg font-extrabold text-ink">Confirmer le décaissement</div>
      <div className="mt-1 text-[13px] font-medium text-ink-muted">{withdrawal.client.name}</div>

      <div className="rounded-card-lg mt-4.5 bg-primary-deep p-6 text-center text-white">
        <div className="text-primary-tint text-[12px] font-bold tracking-[.06em] uppercase">
          Montant à décaisser
        </div>
        <div className="num mt-1.5 text-[42px] leading-tight font-bold tracking-[-0.02em]">
          {Money.from(withdrawal.requestedAmount).format()}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-[11.5px] font-bold text-ink">Mode de décaissement</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMethod(DisbursementMethod.CashAtBranch)}
            className={[
              'flex-1 cursor-pointer rounded-xl border px-4 py-2.75 text-[13px] font-bold transition',
              method === DisbursementMethod.CashAtBranch
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-cream-50 text-ink-muted hover:bg-cream-100',
            ].join(' ')}
          >
            En agence
          </button>
          <button
            type="button"
            onClick={() => setMethod(DisbursementMethod.ViaAgent)}
            className={[
              'flex-1 cursor-pointer rounded-xl border px-4 py-2.75 text-[13px] font-bold transition',
              method === DisbursementMethod.ViaAgent
                ? 'border-primary bg-primary text-white'
                : 'border-line bg-cream-50 text-ink-muted hover:bg-cream-100',
            ].join(' ')}
          >
            Via l&rsquo;agent
          </button>
        </div>
        {method === DisbursementMethod.ViaAgent && (
          <div className="mt-2.5">
            <Dropdown
              options={agents.map((agent) => ({ value: agent.id, label: agent.fullName }))}
              value={agentId}
              onChange={setAgentId}
              aria-label="Agent décaisseur"
            />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-center justify-between rounded-lg bg-cream-100 px-3.25 py-2.5">
        <span className="text-[12.5px] font-semibold text-ink-muted">Décaissé par</span>
        <span className="text-[13px] font-bold text-ink">{CURRENT_USER}</span>
      </div>

      <div className="mt-4">
        <Checkbox
          checked={confirmed}
          onChange={setConfirmed}
          label={`J'ai remis ${Money.from(withdrawal.requestedAmount).format()} en espèces au client`}
        />
      </div>

      <div className="mt-5 flex gap-[10px]">
        <Button variant="secondary" className="flex-1" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" className="flex-[1.4]" loading={submitting} disabled={!canConfirm} onClick={handleConfirm}>
          Confirmer le décaissement
        </Button>
      </div>
    </Modal>
  );
};

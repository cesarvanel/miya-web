import React, { useEffect, useState } from 'react';
import { AmountInput, Button, Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { UpdateSavingsPlanAsync } from '../../../application/usecases/update-savings-plan-async/UpdateSavingsPlanAsync';
import { selectClientById } from '../../../domain/selectors/Selectors';
import { SAVINGS_PLAN_FLOOR_AMOUNT, DAY_OF_WEEK_ORDER, DAY_OF_WEEK_SHORT_LABEL, type DayOfWeek } from '../../../domain/entities/SavingsPlan';

export const EditSavingsPlanModal: React.FC = () => {
  const { isOpen, props, close } = useModal('editSavingsPlan');
  const dispatch = useBankDispatch();
  const client = useBankSelector((state) => (props ? selectClientById(state, props.clientId) : undefined));
  const [amount, setAmount] = useState<number | null>(null);
  const [days, setDays] = useState<DayOfWeek[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && client) {
      setAmount(client.savingsPlan.amountPerCollectionDay);
      setDays(client.savingsPlan.collectionDays);
    }
  }, [isOpen, client]);

  if (!isOpen || !client) {
    return null;
  }

  const currentAmount = amount ?? client.savingsPlan.amountPerCollectionDay;
  const isBelowFloor = currentAmount < SAVINGS_PLAN_FLOOR_AMOUNT;
  const hasNoDays = days.length === 0;

  const toggleDay = (day: DayOfWeek): void => {
    setDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day]));
  };

  const handleClose = (): void => {
    setAmount(null);
    setDays([]);
    close();
  };

  const handleConfirm = async (): Promise<void> => {
    if (isBelowFloor || hasNoDays) {
      return;
    }
    setSubmitting(true);
    await dispatch(
      UpdateSavingsPlanAsync({ id: client.id, amountPerCollectionDay: currentAmount, collectionDays: days }),
    );
    setSubmitting(false);
    setAmount(null);
    setDays([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel="Modifier le plan d'épargne">
      <div className="text-lg font-extrabold text-ink">Modifier le plan d&rsquo;épargne</div>
      <div className="mt-1 text-sm font-medium text-ink-muted">{client.fullName}</div>

      <div className="mt-4.5">
        <label htmlFor="edit-savings-amount" className="mb-2 block text-[12.5px] font-bold text-ink">
          Montant par jour de collecte
        </label>
        <AmountInput
          id="edit-savings-amount"
          value={amount ?? client.savingsPlan.amountPerCollectionDay}
          onChange={setAmount}
          error={isBelowFloor}
          aria-label="Nouveau montant par jour de collecte"
        />
        <div className="mt-1.5 text-[11.5px] font-semibold text-ink-faint">
          Plancher banque : {Money.from(SAVINGS_PLAN_FLOOR_AMOUNT).format()}
        </div>
        {isBelowFloor && (
          <div className="mt-1.5 text-[11.5px] font-semibold text-danger">
            Le montant doit être supérieur ou égal au plancher.
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-2 text-[12.5px] font-bold text-ink">Jours de collecte</div>
        <div className="flex flex-wrap gap-1.5">
          {DAY_OF_WEEK_ORDER.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={[
                'cursor-pointer rounded-lg px-3 py-2 text-[12.5px] font-bold transition',
                days.includes(day) ? 'bg-primary text-white' : 'bg-cream-100 text-ink-muted hover:bg-cream',
              ].join(' ')}
            >
              {DAY_OF_WEEK_SHORT_LABEL[day]}
            </button>
          ))}
        </div>
        {hasNoDays && (
          <div className="mt-1.5 text-[11.5px] font-semibold text-danger">Sélectionnez au moins un jour.</div>
        )}
      </div>

      <div className="rounded-tile mt-4 bg-primary-soft px-[13px] py-[11px] text-xs font-semibold text-primary">
        Effectif dès le prochain jour de collecte — l&rsquo;engagement en cours n&rsquo;est pas rétroactif.
      </div>

      <div className="mt-4 flex gap-[10px]">
        <Button variant="secondary" onClick={handleClose} className="flex-1">
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          loading={submitting}
          disabled={isBelowFloor || hasNoDays}
          className="flex-[1.4]"
        >
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
};

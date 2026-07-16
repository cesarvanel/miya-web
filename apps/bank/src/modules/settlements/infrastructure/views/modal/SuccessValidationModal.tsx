import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { selectQueue } from '../../../domain/selectors/Selectors';
import { SettlementsRoutes } from '../../router/SettlementsRoutes';

/** "Prénom I." à partir d'un nom complet (ex. « Grace Atangana » → « Grace A. »). */
const shortName = (fullName: string): string => {
  const [first, ...rest] = fullName.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last.charAt(0)}.` : (first ?? fullName);
};

/**
 * Célébration après validation croisée réussie — en plus du toast quittance,
 * comme sur la maquette 2b : montant reversé + numéro de quittance, puis
 * enchaînement direct sur le bordereau suivant de la file.
 */
export const SuccessValidationModal: React.FC = () => {
  const { isOpen, props, close } = useModal('validationSuccess');
  const navigate = useNavigate();
  const queue = useBankSelector(selectQueue);
  const [next] = queue;

  if (!isOpen || !props) {
    return null;
  }

  const handleNext = (): void => {
    close();
    navigate(next ? SettlementsRoutes.buildDetailPath(next.id) : '/settlements');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleNext}
      ariaLabel="Reversement validé"
      panelClassName="bg-primary-deep p-[34px_30px] text-center"
    >
      <div className="animate-seal-pop mx-auto flex size-[92px] items-center justify-center rounded-full bg-white">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path
            d="M12 22.5l7 7 14-16"
            stroke="#0A6B4E"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-[22px] text-2xl font-extrabold text-white">
        Reversement validé
      </div>
      <div className="mt-2 text-sm font-medium text-primary-tint">
        Validation croisée confirmée entre vous et {props.agentName}.
        <br />
        L'agent reçoit sa quittance instantanément.
      </div>

      <div className="mt-5 flex items-center justify-between rounded-tile bg-white/12 px-[18px] py-4">
        <div className="text-left">
          <div className="text-[11.5px] font-semibold text-primary-tint">
            Montant reversé
          </div>
          <div className="num text-2xl font-bold text-white">
            {Money.from(props.amount).format()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11.5px] font-semibold text-primary-tint">
            Quittance
          </div>
          <div className="num text-sm font-bold text-white">
            {props.receiptNumber}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="mt-[18px] w-full cursor-pointer rounded-tile bg-white px-4 py-[15px] text-[14.5px] font-bold text-primary transition hover:bg-white/90"
      >
        {next ? `Bordereau suivant · ${shortName(next.agentName)} →` : 'Retour à la file'}
      </button>
    </Modal>
  );
};

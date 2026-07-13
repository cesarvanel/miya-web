import React from 'react';
import { Button, Modal } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useBankDispatch } from '@/config/stores/root-hook/RootHook';
import { pushToast } from '@/shared/toasts';
import type { Client } from '../../../domain/entities/Client';

interface QrCardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

/**
 * Aperçu imprimable de la carte QR — maquette 6c. Impression/téléchargement
 * restent des stubs : aucun module de génération de documents pour l'instant.
 * TODO(documents): brancher un vrai générateur de PDF quand ce module existera.
 */
export const QrCardPreviewModal: React.FC<QrCardPreviewModalProps> = ({ isOpen, onClose, client }) => {
  const dispatch = useBankDispatch();

  const handleStubAction = (): void => {
    dispatch(
      pushToast({
        variant: 'info',
        title: 'Génération du PDF — module documents à venir',
        message: "La carte sera remise à la cliente lors de la première collecte.",
      }),
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Aperçu de la carte QR" width={560}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-extrabold text-ink">Aperçu de la carte QR</div>
          <div className="mt-0.5 text-[13px] font-medium text-ink-muted">
            Vérifiez avant d'imprimer · format carte 85 × 54 mm
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-deep to-primary p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.75">
              <div className="flex size-9.5 items-center justify-center rounded-[11px] bg-white/15">
                <span className="num text-lg font-bold">M</span>
              </div>
              <div>
                <div className="text-sm font-extrabold">
                  Miya <span className="text-primary-bright">Banque</span>
                </div>
                <div className="text-[10.5px] font-semibold text-primary-muted">MEC La Confiance</div>
              </div>
            </div>
            <span className="rounded-full bg-white/15 px-2.5 py-[5px] text-[10px] font-bold tracking-[.08em] text-primary-bright uppercase">
              Carte cliente
            </span>
          </div>

          <div className="mt-5.5 flex items-center gap-5.5">
            <div className="flex size-[110px] flex-none items-center justify-center rounded-[14px] bg-white">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" aria-hidden="true">
                <rect width="90" height="90" fill="#fff" />
                <rect x="6" y="6" width="24" height="24" fill="#0B3B2A" />
                <rect x="60" y="6" width="24" height="24" fill="#0B3B2A" />
                <rect x="6" y="60" width="24" height="24" fill="#0B3B2A" />
                <rect x="38" y="38" width="14" height="14" fill="#0B3B2A" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-primary-muted">Titulaire</div>
              <div className="mt-0.5 text-xl font-extrabold tracking-[-0.01em]">{client.fullName}</div>
              <div className="mt-3 flex gap-5.5">
                <div>
                  <div className="text-[10.5px] font-semibold text-primary-muted">Identifiant</div>
                  <div className="num text-sm font-bold">{client.id.startsWith('client-') ? client.id.slice(-8).toUpperCase() : client.id}</div>
                </div>
                <div>
                  <div className="text-[10.5px] font-semibold text-primary-muted">Cotisation</div>
                  <div className="num text-sm font-bold">
                    {Money.from(client.savingsPlan.amountPerCollectionDay).format().replace(' FCFA', '')} / jour
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-5.5">
                <div>
                  <div className="text-[10.5px] font-semibold text-primary-muted">Zone</div>
                  <div className="text-[13px] font-bold">{client.zone}</div>
                </div>
                <div>
                  <div className="text-[10.5px] font-semibold text-primary-muted">Agent</div>
                  <div className="text-[13px] font-bold">{client.assignedAgent.name}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="num absolute right-6 bottom-4 text-[10.5px] font-semibold text-primary-tint">
            app.miya.cm · scannez à chaque collecte
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="text-[12.5px] font-semibold text-ink-faint">
          La carte sera remise à la cliente lors de la première collecte.
        </span>
        <div className="ml-auto flex gap-[10px]">
          <Button variant="secondary" onClick={handleStubAction}>
            Télécharger PDF
          </Button>
          <Button variant="primary" onClick={handleStubAction}>
            Imprimer la carte
          </Button>
        </div>
      </div>
    </Modal>
  );
};

import React, { useEffect, useState } from 'react';
import { Button, Modal } from '@miya/ui';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { useModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { GenerateActivationCodeAsync } from '../../../application/usecases/generate-activation-code-async/GenerateActivationCodeAsync';
import { selectAgentById } from '../../../domain/selectors/Selectors';

const formatCountdown = (expiresAt: string): string => {
  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  if (remainingMs <= 0) {
    return 'Expiré';
  }
  const hours = Math.floor(remainingMs / 3_600_000);
  const minutes = Math.floor((remainingMs % 3_600_000) / 60_000);
  return `Expire dans ${hours}h ${String(minutes).padStart(2, '0')}min`;
};

export const ActivationCodeModal: React.FC = () => {
  const { isOpen, props, close } = useModal('activationCode');
  const dispatch = useBankDispatch();
  const agent = useBankSelector((state) => (props ? selectAgentById(state, props.agentId) : undefined));
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (isOpen && props) {
      dispatch(GenerateActivationCodeAsync({ agentId: props.agentId })).then((result) => {
        if (GenerateActivationCodeAsync.fulfilled.match(result)) {
          setCode(result.payload.code);
          setExpiresAt(result.payload.expiresAt);
        }
      });
    }
    if (!isOpen) {
      setCode(null);
      setExpiresAt(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, props?.agentId]);

  useEffect(() => {
    if (!expiresAt) {
      return;
    }
    const interval = setInterval(() => forceTick((n) => n + 1), 1_000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!isOpen || !agent) {
    return null;
  }

  const handleCopy = (): void => {
    if (code) {
      void navigator.clipboard.writeText(code.replace(/\s*·\s*/g, ''));
      dispatch(pushToast({ variant: 'success', title: 'Code copié' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} ariaLabel="Code d'activation" panelClassName="bg-primary-deep p-[30px] text-white">
      <div className="text-lg font-extrabold">Code d&rsquo;activation</div>
      <div className="text-primary-muted mt-1 text-[13px] font-medium">{agent.fullName} · nouvel appareil</div>

      <div key={code ?? 'pending'} className="animate-seal-pop mt-5.5 rounded-2xl border border-dashed border-primary-bright/40 bg-white/6 p-6 text-center">
        <div className="text-primary-bright text-[11.5px] font-bold tracking-[.08em] uppercase">
          Code à usage unique
        </div>
        <div className="num mt-2.5 text-[46px] font-bold tracking-[.12em]">{code ?? '···· · ····'}</div>
        {expiresAt && (
          <div className="bg-amber-soft/16 mt-3.5 inline-flex items-center gap-1.75 rounded-full px-3.25 py-1.5">
            <span className="num text-amber text-xs font-bold">{formatCountdown(expiresAt)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2.5">
        <Button variant="primary" onClick={handleCopy} disabled={!code} className="flex-1">
          Copier
        </Button>
        <Button variant="secondary" onClick={close} className="flex-1 bg-white/10 text-white hover:bg-white/15">
          Fermer
        </Button>
      </div>

      <div className="mt-4 rounded-xl bg-white/6 px-3.5 py-3 text-[12px] font-medium text-[#B9C4BE]">
        Communiquez ce code à l&rsquo;agent — il le saisira à la première connexion de l&rsquo;app mobile.
      </div>
    </Modal>
  );
};

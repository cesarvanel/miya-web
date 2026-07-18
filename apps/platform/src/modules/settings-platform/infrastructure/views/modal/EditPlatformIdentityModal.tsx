import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, Textarea } from '@miya/ui';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { UpdateIdentityAsync } from '../../../application/usecases/update-identity-async/UpdateIdentityAsync';
import { selectIdentity } from '../../../domain/selectors/Selectors';

/** Identité Miya — coordonnées & mentions légales. Ces informations apparaissent sur les factures des banques. Maquette 5a. */
export const EditPlatformIdentityModal: React.FC = () => {
  const { isOpen, close } = useModal('editPlatformIdentity');
  const dispatch = usePlatformDispatch();
  const identity = usePlatformSelector(selectIdentity);

  const [legalName, setLegalName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [invoiceMentions, setInvoiceMentions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && identity) {
      setLegalName(identity.legalName);
      setTaxNumber(identity.taxNumber);
      setEmail(identity.contacts.email);
      setPhone(identity.contacts.phone);
      setInvoiceMentions(identity.invoiceMentions);
    }
  }, [isOpen, identity]);

  if (!isOpen || !identity) {
    return null;
  }

  const handleSave = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(
      UpdateIdentityAsync({
        legalName,
        taxNumber,
        contacts: { email, phone },
        invoiceMentions,
      }),
    );
    setSubmitting(false);
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      ariaLabel="Identité Miya"
      width={640}
      header={
        <>
          <div className="text-lg font-extrabold text-ink">Identité Miya</div>
          <div className="mt-1 text-[12.5px] font-medium text-ink-muted">Coordonnées &amp; mentions légales</div>
        </>
      }
      footer={
        <div className="flex gap-2.5">
          <Button variant="secondary" className="flex-1" onClick={close}>
            Annuler
          </Button>
          <Button variant="primary" className="flex-[1.4]" loading={submitting} onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3.5">
        <TextField label="Raison sociale" value={legalName} onChange={setLegalName} required />
        <TextField label="N° contribuable" value={taxNumber} onChange={setTaxNumber} required />
        <TextField label="E-mail de facturation" value={email} onChange={setEmail} required />
        <TextField label="Téléphone" value={phone} onChange={setPhone} required />
      </div>
      <div className="mt-3.5">
        <Textarea label="Mentions bas de facture" value={invoiceMentions} onChange={setInvoiceMentions} rows={4} required />
      </div>
      <div className="mt-4.5 flex items-center gap-2 rounded-xl border border-line-soft bg-cream px-3.5 py-2.75">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-none">
          <circle cx="8" cy="8" r="6.2" stroke="#8A8A82" strokeWidth="1.4" />
          <path d="M8 5v3l2 1.5" stroke="#8A8A82" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="text-[12px] font-semibold text-ink-muted">Ces informations apparaissent sur les factures des banques.</span>
      </div>
    </Modal>
  );
};

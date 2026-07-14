import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField } from '@miya/ui';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { pushToast } from '@/shared/toasts';
import { useModal } from '@/shared/modals';
import { selectIdentity } from '../../../domain/selectors/Selectors';
import { UpdateIdentityAsync } from '../../../application/usecases/update-identity-async/UpdateIdentityAsync';

const DOCUMENT_COLOR_PRESETS = ['#0A6B4E', '#0B3B2A', '#7A56A8', '#2A6BA8'];

export const EditIdentityModal: React.FC = () => {
  const { isOpen, close } = useModal('editIdentity');
  const dispatch = useBankDispatch();
  const identity = useBankSelector(selectIdentity);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [documentColor, setDocumentColor] = useState('#0A6B4E');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && identity) {
      setName(identity.name);
      setCity(identity.city);
      setPhone(identity.contacts.phone);
      setEmail(identity.contacts.email);
      setDocumentColor(identity.documentColor);
    }
  }, [isOpen, identity]);

  if (!isOpen || !identity) {
    return null;
  }

  const handleUploadStub = (): void => {
    dispatch(pushToast({ variant: 'info', title: 'Import de logo — module documents à venir' }));
  };

  const handleSave = async (): Promise<void> => {
    setSubmitting(true);
    await dispatch(
      UpdateIdentityAsync({
        name,
        city,
        contacts: { phone, email },
        documentColor,
      }),
    );
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} ariaLabel="Identité de l'institution" width={640}>
      <div className="text-lg font-extrabold text-ink">Identité de l&rsquo;institution</div>
      <div className="mt-1 text-[12.5px] font-medium text-ink-muted">Coordonnées, logo &amp; couleur documentaire</div>

      <div className="mt-5 grid grid-cols-2 gap-3.5">
        <div className="col-span-2">
          <TextField label="Raison sociale" value={name} onChange={setName} required />
        </div>
        <TextField label="Siège" value={city} onChange={setCity} required />
        <div>
          <div className="mb-1.75 text-[11.5px] font-bold text-ink">
            Devise <span className="text-ink-faint font-semibold">· non modifiable</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-line-soft bg-cream px-3.5 py-2.75">
            <span className="num text-[14px] font-bold text-ink-muted">{identity.currency}</span>
          </div>
        </div>
        <TextField label="Téléphone" value={phone} onChange={setPhone} />
        <TextField label="Email" value={email} onChange={setEmail} />
      </div>

      <div className="mt-4.5">
        <div className="mb-1.75 text-[11.5px] font-bold text-ink">Logo de la banque</div>
        <div className="flex items-stretch gap-3.5">
          <div className="relative flex size-22 flex-none items-center justify-center rounded-2xl bg-primary">
            <span className="num text-4xl font-bold text-white">{identity.name.charAt(0)}</span>
          </div>
          <button
            type="button"
            onClick={handleUploadStub}
            className="border-primary/40 bg-primary-soft/30 flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed p-3 text-center hover:bg-primary-soft"
          >
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <path d="M13 17V7m0 0l-4 4m4-4l4 4" stroke="#0A6B4E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 19h16" stroke="#0A6B4E" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <div className="text-[13px] font-bold text-ink">
              Glisser une image ou <span className="text-primary">parcourir</span>
            </div>
            <div className="text-[11px] font-semibold text-ink-faint">PNG ou SVG · fond transparent · max 1 Mo</div>
          </button>
        </div>
      </div>

      <div className="mt-4.5">
        <div className="mb-1.75 text-[11.5px] font-bold text-ink">Couleur documentaire</div>
        <div className="flex items-stretch gap-3.5">
          <div className="flex flex-none flex-col gap-2">
            <div className="flex gap-2">
              {DOCUMENT_COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setDocumentColor(color)}
                  style={{ backgroundColor: color }}
                  className={['size-8.5 cursor-pointer rounded-lg', documentColor === color ? 'ring-2 ring-primary ring-offset-2' : ''].join(' ')}
                  aria-label={color}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.75 rounded-lg border border-line px-2.5 py-1.75">
              <span style={{ backgroundColor: documentColor }} className="size-4.5 flex-none rounded-[5px]" />
              <span className="num text-[12.5px] font-bold text-ink">{documentColor}</span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden rounded-xl border border-line bg-card">
            <div style={{ backgroundColor: documentColor }} className="flex items-center gap-2.5 px-4 py-3">
              <div className="flex size-6.5 items-center justify-center rounded-md bg-white/18">
                <span className="num text-[13px] font-bold text-white">{name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-[12.5px] font-extrabold text-white">{name}</div>
                <div className="text-primary-tint text-[9.5px] font-semibold">Reçu de cotisation · {city}</div>
              </div>
            </div>
            <div className="space-y-1.75 p-4">
              <div className="h-1.75 w-3/5 rounded bg-cream-100" />
              <div className="h-1.75 w-4/5 rounded bg-cream-100" />
              <div className="h-1.75 w-2/5 rounded bg-cream-100" />
            </div>
          </div>
        </div>
        <div className="mt-2 text-[11px] font-semibold text-ink-faint">Appliquée aux reçus, bordereaux et cartes clients.</div>
      </div>

      <div className="mt-4.5 flex items-center gap-2 rounded-xl border border-line-soft bg-cream px-3.5 py-2.75">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-none">
          <circle cx="8" cy="8" r="6.2" stroke="#8A8A82" strokeWidth="1.4" />
          <path d="M8 5v3l2 1.5" stroke="#8A8A82" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="text-[12px] font-semibold text-ink-muted">
          Enregistré au Journal des changements (D. Ndione · aujourd&rsquo;hui).
        </span>
      </div>

      <div className="mt-5 flex gap-2.5">
        <Button variant="secondary" className="flex-1" onClick={close}>
          Annuler
        </Button>
        <Button variant="primary" className="flex-[1.4]" loading={submitting} onClick={handleSave}>
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
};

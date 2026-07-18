import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal } from '@miya/ui';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useModal } from '@/shared/modals';
import { UpdateTemplateAsync } from '../../../application/usecases/update-template-async/UpdateTemplateAsync';
import { AVAILABLE_TEMPLATE_VARIABLES, validateTemplateBody } from '../../../domain/entities/NotificationTemplate';
import { selectTemplateById } from '../../../domain/selectors/Selectors';

/** Valeurs d'exemple pour l'aperçu rendu en direct — fidèles à la maquette. */
const SAMPLE_VALUES: Record<string, string> = {
  '{{bankName}}': 'MEC La Confiance',
  '{{amount}}': '145 000 FCFA',
  '{{dueDate}}': '15 juillet',
  '{{suspensionDate}}': '30 juillet',
  '{{adminName}}': 'Rosalie Mbarga',
  '{{planName}}': 'Élite',
};

const renderPreview = (text: string): string =>
  Object.entries(SAMPLE_VALUES).reduce((rendered, [variable, value]) => rendered.split(variable).join(value), text);

/** Éditeur de modèle — variables en chips cliquables (insertion au curseur), aperçu rendu en direct, erreur inline. Maquette 5a. */
export const TemplateEditorModal: React.FC = () => {
  const { isOpen, props, close } = useModal('editTemplate');
  const dispatch = usePlatformDispatch();
  const template = usePlatformSelector((state) => (props ? selectTemplateById(state, props.templateId) : undefined));

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  }, [isOpen, template]);

  if (!isOpen || !template) {
    return null;
  }

  const { valid, missing } = validateTemplateBody(template.kind, body);

  const insertVariable = (variable: string): void => {
    const el = bodyRef.current;
    if (!el) {
      setBody((current) => `${current}${variable}`);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = `${body.slice(0, start)}${variable}${body.slice(end)}`;
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + variable.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  const handleClose = (): void => {
    close();
  };

  const handleSave = async (): Promise<void> => {
    if (!valid || submitting) {
      return;
    }
    setSubmitting(true);
    await dispatch(UpdateTemplateAsync({ templateId: template.id, subject, body }));
    setSubmitting(false);
    close();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="Éditeur de modèle"
      width={720}
      header={
        <>
          <div className="text-lg font-extrabold text-ink">Modifier le modèle</div>
          <div className="mt-1 text-[12.5px] font-medium text-ink-muted">Dernière modification par {template.lastEditedBy}</div>
        </>
      }
      footer={
        <div className="flex items-center justify-between gap-2.5">
          <span className="text-[11.5px] font-semibold text-ink-faint">Chaque modification est tracée au Journal des changements.</span>
          <div className="flex gap-2.5">
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSave} loading={submitting} disabled={!valid}>
              Enregistrer
            </Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-3.5">
          <div>
            <label className="mb-1.75 block text-[11.5px] font-bold text-ink">Objet</label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="rounded-input focus-within:shadow-focus-ring w-full border border-line bg-card px-3.5 py-2.75 text-[13.5px] font-semibold text-ink outline-none"
            />
          </div>

          <div>
            <label className="mb-1.75 block text-[11.5px] font-bold text-ink">
              Message {!valid && <span className="text-danger">*</span>}
            </label>
            <textarea
              ref={bodyRef}
              value={body}
              rows={7}
              onChange={(event) => setBody(event.target.value)}
              className={[
                'w-full rounded-xl border bg-card p-[13px] text-[13px] font-medium text-ink outline-none transition',
                valid ? 'border-line focus:border-[1.5px] focus:border-primary focus:shadow-focus-ring' : 'border-[1.5px] border-danger',
              ].join(' ')}
            />
            {!valid && (
              <div className="mt-1.5 text-[11.5px] font-semibold text-danger">
                Variable{missing.length > 1 ? 's' : ''} obligatoire{missing.length > 1 ? 's' : ''} manquante{missing.length > 1 ? 's' : ''} : {missing.join(', ')}
              </div>
            )}
          </div>

          <div>
            <div className="mb-1.75 text-[11.5px] font-bold text-ink">Variables disponibles</div>
            <div className="flex flex-wrap gap-1.75">
              {AVAILABLE_TEMPLATE_VARIABLES[template.kind].map((variable) => (
                <button
                  key={variable}
                  type="button"
                  onClick={() => insertVariable(variable)}
                  className="num cursor-pointer rounded-full bg-cream-100 px-2.75 py-1.25 text-[11px] font-bold text-ink-muted hover:bg-line"
                >
                  {variable}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-1.75 text-[11.5px] font-bold text-ink">Aperçu rendu — données d&rsquo;exemple</div>
          <div className="rounded-2xl border border-line bg-cream p-4">
            <div className="text-[12px] font-bold text-ink-faint">Objet</div>
            <div className="mt-1 text-[13.5px] font-bold text-ink">{renderPreview(subject)}</div>
            <div className="mt-3.5 text-[12px] font-bold text-ink-faint">Message</div>
            <div className="mt-1 rounded-xl border border-line-soft bg-card p-3.5 text-[12.5px] leading-[1.55] font-medium text-ink-muted whitespace-pre-wrap">
              {renderPreview(body)}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

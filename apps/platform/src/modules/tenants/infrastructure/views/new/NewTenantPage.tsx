import React from 'react';
import { Button, Dropdown, TextField, Tooltip } from '@miya/ui';
import { Money } from '@miya/kernel';
import { useCanWrite } from '@/shared/guards/useCanWrite';
import { useNewTenantPage, TRIAL_DAY_OPTIONS } from './useNewTenantPage';

const SuccessIcon: React.FC = () => (
  <div className="mx-auto mb-5 flex size-18 items-center justify-center rounded-[22px] bg-primary-soft">
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M9 18.5l6 6 12-13" className="animate-seal-pop" stroke="#0F9E6C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/** Provisionnement d'un nouveau tenant — formulaire puis écran de succès. Maquette 2b. */
export const NewTenantPage: React.FC = () => {
  const {
    name,
    setName,
    city,
    setCity,
    adminName,
    setAdminName,
    adminEmail,
    setAdminEmail,
    planId,
    setPlanId,
    trialDays,
    setTrialDays,
    canSubmit,
    submitting,
    createdTenant,
    submit,
    cancel,
    goToDetail,
    planCatalog,
  } = useNewTenantPage();
  const canWrite = useCanWrite();

  if (createdTenant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-6">
        <div className="animate-modal-in w-[460px] rounded-card-lg border border-line bg-card p-9 text-center shadow-[0_40px_90px_-50px_rgba(0,0,0,.4)]">
          <SuccessIcon />
          <div className="text-[21px] font-extrabold tracking-[-0.01em] text-ink">Invitation envoyée</div>
          <div className="mt-2 text-[13.5px] leading-[1.55] font-medium text-ink-muted">
            Un e-mail d&rsquo;activation a été envoyé à l&rsquo;admin de <b className="text-ink">{createdTenant.name}</b>.
          </div>
          <div className="mt-5 flex flex-col gap-2.25 rounded-[14px] bg-cream p-4 text-left">
            <div className="flex justify-between text-[12.5px]">
              <span className="font-semibold text-ink-faint">Destinataire</span>
              <span className="font-bold text-ink">{createdTenant.adminContact.email}</span>
            </div>
            <div className="flex justify-between text-[12.5px]">
              <span className="font-semibold text-ink-faint">Plan</span>
              <span className="text-admin-primary font-bold">{createdTenant.plan.name}</span>
            </div>
            <div className="flex justify-between text-[12.5px]">
              <span className="font-semibold text-ink-faint">Essai</span>
              <span className="num font-bold text-ink">{trialDays} jours</span>
            </div>
            <div className="flex justify-between text-[12.5px]">
              <span className="font-semibold text-ink-faint">Statut</span>
              <span className="w-fit rounded-full bg-amber-soft px-2.25 py-0.5 text-[11.5px] font-bold text-amber">
                En attente d&rsquo;activation
              </span>
            </div>
          </div>
          <div className="mt-5 flex gap-2.5">
            <Button variant="secondary" className="flex-1" onClick={cancel}>
              Retour à la liste
            </Button>
            <Button variant="primary" className="flex-1" onClick={goToDetail}>
              Voir la fiche
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-6">
      <div className="animate-modal-in w-[560px] overflow-hidden rounded-card-lg border border-line bg-card shadow-[0_40px_90px_-30px_rgba(0,0,0,.5)]">
        <div className="border-b border-line px-6.5 py-5.5">
          <div className="text-[19px] font-extrabold tracking-[-0.01em] text-ink">Nouvelle banque</div>
          <div className="mt-0.5 text-[12.5px] font-medium text-ink-muted">Provisionner un nouveau tenant sur la plateforme</div>
        </div>

        <div className="flex flex-col gap-4 px-6.5 py-5.5">
          <TextField label="Raison sociale" value={name} onChange={setName} placeholder="Ex. Union Financière de l'Ouest" required />
          <div className="grid grid-cols-2 gap-3.5">
            <TextField label="Ville" value={city} onChange={setCity} placeholder="Ex. Dschang" required />
            <div>
              <label className="mb-[7px] block text-[12.5px] font-bold text-ink">Période d&rsquo;essai</label>
              <Dropdown options={TRIAL_DAY_OPTIONS} value={trialDays} onChange={setTrialDays} aria-label="Période d'essai" />
            </div>
          </div>
          <TextField label="Nom du contact admin" value={adminName} onChange={setAdminName} placeholder="Ex. Admin UFO" required />
          <TextField label="E-mail du contact admin" value={adminEmail} onChange={setAdminEmail} placeholder="admin@banque.cm" required />

          <div>
            <label className="mb-2 block text-[12.5px] font-bold text-ink">Plan d&rsquo;abonnement</label>
            <div className="grid grid-cols-3 gap-2.5">
              {Object.values(planCatalog).map(({ plan }) => {
                const isChosen = plan.id === planId;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setPlanId(plan.id)}
                    className={[
                      'relative cursor-pointer rounded-[14px] border p-3.25 text-center transition',
                      isChosen ? 'border-[2px] border-admin-primary bg-[#F4FAF7]' : 'border-line bg-card hover:bg-cream-50',
                    ].join(' ')}
                  >
                    {isChosen && (
                      <span className="bg-admin-primary absolute -top-2.25 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9.5px] font-extrabold text-white">
                        CHOISI
                      </span>
                    )}
                    <div className={['text-[13px] font-bold', isChosen ? 'text-admin-primary' : 'text-ink'].join(' ')}>{plan.name}</div>
                    <div className="num mt-0.75 text-xs font-semibold text-ink-faint">{Money.from(plan.monthlyPrice).format()}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 border-t border-line px-6.5 py-4">
          <Button variant="secondary" onClick={cancel}>
            Annuler
          </Button>
          {canWrite ? (
            <Button variant="primary" onClick={submit} loading={submitting} disabled={!canSubmit}>
              Créer &amp; inviter l&rsquo;admin
            </Button>
          ) : (
            <Tooltip label="Rôle lecture seule">
              <Button variant="primary" disabled>
                Créer &amp; inviter l&rsquo;admin
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

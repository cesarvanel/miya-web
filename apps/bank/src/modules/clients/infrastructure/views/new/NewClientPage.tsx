import React from 'react';
import { AmountInput, Button, Card, Dropdown, PhoneInput, TextField, Toggle } from '@miya/ui';
import { Money } from '@miya/kernel';
import { PageShell } from '@/shared/layout/PageShell';
import { DAY_OF_WEEK_ORDER, DAY_OF_WEEK_SHORT_LABEL, EngagementPreset } from '../../../domain/entities/SavingsPlan';
import { useNewClient } from './useNewClient';

const PRESET_LABELS: Record<EngagementPreset, string> = {
  [EngagementPreset.ThreeMonths]: '3 mois',
  [EngagementPreset.SixMonths]: '6 mois',
  [EngagementPreset.OneYear]: '1 an',
  [EngagementPreset.Custom]: 'Personnalisée',
};

const formatDate = (iso: string): string =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

interface StepDotProps {
  index: number;
  label: string;
  state: 'done' | 'current' | 'upcoming';
}

const StepDot: React.FC<StepDotProps> = ({ index, label, state }) => (
  <div className="flex items-center gap-2.25">
    <div
      className={[
        'flex size-7.5 flex-none items-center justify-center rounded-full text-[13px] font-extrabold',
        state === 'done' ? 'bg-primary text-white' : state === 'current' ? 'bg-primary text-white' : 'border-2 border-line bg-card text-ink-faint',
      ].join(' ')}
    >
      {state === 'done' ? (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M4 7.5l2 2 5-5.5" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        index
      )}
    </div>
    <span className={['text-[13px] font-bold', state === 'upcoming' ? 'text-ink-faint' : 'text-ink'].join(' ')}>
      {label}
    </span>
  </div>
);

/** Création d'un client — stepper Identité → Plan d'épargne & affectation. Fidèle à la maquette 6b. */
export const NewClientPage: React.FC = () => {
  const {
    step,
    goToStep1,
    goToStep2,
    canGoToStep2,
    fullName,
    setFullName,
    phone,
    setPhone,
    cniNumber,
    setCniNumber,
    activity,
    setActivity,
    amountPerCollectionDay,
    setAmountPerCollectionDay,
    isBelowFloor,
    floorAmount,
    ceilingHint,
    collectionDays,
    toggleDay,
    applyDaysPreset,
    hasNoDays,
    preset,
    setPreset,
    startDate,
    setStartDate,
    endDate,
    customEndDate,
    setCustomEndDate,
    isEndDateValid,
    openingDeposit,
    setOpeningDeposit,
    computed,
    zone,
    setZone,
    zones,
    agentId,
    setAgentId,
    agents,
    hasSmartphone,
    setHasSmartphone,
    canSubmit,
    submitting,
    error,
    submit,
    cancel,
  } = useNewClient();

  return (
    <PageShell title="Nouveau client" subtitle="Enregistrement & vérification KYC" back={{ label: 'Clients', to: '/clients' }}>
      <div className="mx-auto max-w-4xl">
        {/* Stepper */}
        <div className="mb-6 flex items-center">
          <StepDot index={1} label="Identité" state={step === 1 ? 'current' : 'done'} />
          <div className={['mx-3 h-[2.5px] flex-1 rounded-full', step === 2 ? 'bg-primary' : 'bg-line'].join(' ')} />
          <StepDot index={2} label="Plan d'épargne & affectation" state={step === 2 ? 'current' : 'upcoming'} />
          <div className="mx-3 h-[2.5px] flex-1 rounded-full bg-line" />
          <StepDot index={3} label="Carte QR" state="upcoming" />
        </div>

        {step === 1 && (
          <>
            <Card>
              <div className="mb-4 text-[15px] font-extrabold text-ink">Identité</div>
              <div className="grid grid-cols-2 gap-3.5">
                <TextField label="Nom complet" value={fullName} onChange={setFullName} placeholder="Ex. Bernadette Ngo" required />
                <PhoneInput value={phone} onChange={setPhone} />
                <TextField label="N° CNI" value={cniNumber} onChange={setCniNumber} placeholder="Ex. 108455201" required />
                <TextField label="Activité" value={activity} onChange={setActivity} placeholder="Ex. Vendeuse de beignets" required />
              </div>
            </Card>

            <div className="mt-4 flex justify-end gap-2.5">
              <Button variant="secondary" onClick={cancel}>
                Annuler
              </Button>
              <Button variant="primary" onClick={goToStep2} disabled={!canGoToStep2}>
                Suivant
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-start gap-5">
              {/* form */}
              <div className="flex-1 space-y-4">
                <Card className="border-2 border-primary shadow-primary-glow">
                  <div className="mb-4 text-[15px] font-extrabold text-ink">Plan d&rsquo;épargne</div>

                  <div className="mb-4">
                    <div className="mb-2 text-[11.5px] font-bold text-ink">
                      Montant par jour de collecte <span className="text-danger">*</span>
                    </div>
                    <AmountInput value={amountPerCollectionDay} onChange={setAmountPerCollectionDay} error={isBelowFloor} aria-label="Montant par jour de collecte" />
                    <div className="mt-1.5 text-[11.5px] font-semibold text-ink-faint">
                      Plancher {floorAmount.toLocaleString('fr-FR')} — {ceilingHint.toLocaleString('fr-FR')} FCFA
                    </div>
                    {isBelowFloor && (
                      <div className="mt-1.5 text-[11.5px] font-semibold text-danger">
                        Le montant doit être supérieur ou égal au plancher.
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11.5px] font-bold text-ink">
                        Jours de collecte <span className="text-danger">*</span>
                      </span>
                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => applyDaysPreset('all')} className="cursor-pointer rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-bold text-ink-muted hover:bg-cream">
                          Tous les jours
                        </button>
                        <button type="button" onClick={() => applyDaysPreset('exceptSunday')} className="cursor-pointer rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-bold text-ink-muted hover:bg-cream">
                          Sauf dimanche
                        </button>
                        <button type="button" onClick={() => applyDaysPreset('weekly')} className="cursor-pointer rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-bold text-ink-muted hover:bg-cream">
                          Hebdomadaire
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {DAY_OF_WEEK_ORDER.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={[
                            'cursor-pointer rounded-lg px-3.5 py-2.25 text-[12.5px] font-bold transition',
                            collectionDays.includes(day) ? 'bg-primary text-white' : 'bg-cream-50 text-ink-muted hover:bg-cream-100',
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

                  <div className="mb-4">
                    <div className="mb-2 text-[11.5px] font-bold text-ink">
                      Durée de l&rsquo;engagement <span className="text-danger">*</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.values(EngagementPreset).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPreset(value)}
                          className={[
                            'cursor-pointer rounded-xl border px-3 py-2.5 text-center text-[12.5px] font-bold transition',
                            preset === value ? 'border-primary bg-primary text-white' : 'border-line bg-cream-50 text-ink-muted hover:bg-cream-100',
                          ].join(' ')}
                        >
                          {PRESET_LABELS[value]}
                        </button>
                      ))}
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-3.5">
                      <div>
                        <label htmlFor="engagement-start" className="mb-1.5 block text-[11px] font-bold text-ink-muted">
                          Date de départ
                        </label>
                        <input
                          id="engagement-start"
                          type="date"
                          value={startDate}
                          onChange={(event) => setStartDate(event.target.value)}
                          className="w-full rounded-[11px] border border-line bg-card px-[13px] py-[11px] text-[13.5px] font-semibold text-ink outline-none focus:border-[1.5px] focus:border-primary"
                        />
                      </div>
                      {preset === EngagementPreset.Custom ? (
                        <div>
                          <label htmlFor="engagement-end" className="mb-1.5 block text-[11px] font-bold text-ink-muted">
                            Date de fin
                          </label>
                          <input
                            id="engagement-end"
                            type="date"
                            value={customEndDate}
                            onChange={(event) => setCustomEndDate(event.target.value)}
                            className="w-full rounded-[11px] border border-line bg-card px-[13px] py-[11px] text-[13.5px] font-semibold text-ink outline-none focus:border-[1.5px] focus:border-primary"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="mb-1.5 text-[11px] font-bold text-ink-muted">Date de fin (calculée)</div>
                          <div className="num rounded-[11px] border border-line-soft bg-cream px-[13px] py-[11px] text-[13.5px] font-semibold text-ink-disabled">
                            {formatDate(endDate)}
                          </div>
                        </div>
                      )}
                    </div>
                    {!isEndDateValid && (
                      <div className="mt-1.5 text-[11.5px] font-semibold text-danger">
                        La date de fin doit être postérieure à la date de départ.
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 text-[11.5px] font-bold text-ink">Dépôt d&rsquo;ouverture (optionnel)</div>
                    <AmountInput value={openingDeposit} onChange={setOpeningDeposit} aria-label="Dépôt d'ouverture" />
                  </div>
                </Card>

                <Card>
                  <div className="mb-4 text-[15px] font-extrabold text-ink">Affectation</div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <div className="mb-1.75 text-[11.5px] font-bold text-ink">
                        Zone <span className="text-danger">*</span>
                      </div>
                      <Dropdown
                        options={[{ value: '', label: 'Sélectionner une zone' }, ...zones.map((z) => ({ value: z, label: z }))]}
                        value={zone}
                        onChange={setZone}
                        aria-label="Zone"
                      />
                    </div>
                    <div>
                      <div className="mb-1.75 text-[11.5px] font-bold text-ink">
                        Agent collecteur <span className="text-danger">*</span>
                      </div>
                      <Dropdown
                        options={[{ value: '', label: 'Sélectionner un agent' }, ...agents.map((agent) => ({ value: agent.id, label: agent.fullName }))]}
                        value={agentId}
                        onChange={setAgentId}
                        aria-label="Agent collecteur"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4">
                    <div>
                      <div className="text-[13.5px] font-bold text-ink">Cliente équipée d&rsquo;un smartphone</div>
                      <div className="text-[11.5px] font-medium text-ink-faint">Désactivez si la cliente n&rsquo;a pas de smartphone.</div>
                    </div>
                    <Toggle checked={hasSmartphone} onChange={setHasSmartphone} aria-label="Cliente équipée d'un smartphone" />
                  </div>

                  {!hasSmartphone && (
                    <div className="rounded-tile mt-3.5 bg-primary-soft px-[13px] py-[11px] text-xs font-semibold text-primary">
                      Une carte QR sera générée automatiquement à la création — la cliente l&rsquo;utilisera pour ses collectes.
                    </div>
                  )}
                </Card>
              </div>

              {/* summary aside — recalculé en direct */}
              <div className="w-70 flex-none space-y-3.5">
                <div className="rounded-card-lg bg-primary-deep p-5.5 text-white">
                  <div className="text-primary-bright text-[11.5px] font-bold tracking-[.05em] uppercase">
                    Récapitulatif
                  </div>
                  <div className="mt-3.5 flex flex-col gap-3">
                    <div>
                      <div className="text-primary-muted text-[11.5px] font-semibold">Jours de cotisation prévus</div>
                      <div className="num mt-0.5 text-[26px] font-bold">{computed.plannedCollectionDays}</div>
                    </div>
                    <div>
                      <div className="text-primary-muted text-[11.5px] font-semibold">Objectif d&rsquo;épargne</div>
                      <div className="num mt-0.5 text-[26px] font-bold">{Money.from(computed.targetAmount).format()}</div>
                      <div className="text-primary-muted mt-0.5 text-[11px] font-medium">indicatif · aucun blocage</div>
                    </div>
                    <div>
                      <div className="text-primary-muted text-[11.5px] font-semibold">Date de fin</div>
                      <div className="text-[15px] font-bold">{formatDate(endDate)}</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-tile bg-primary-soft px-3.5 py-3 text-xs font-semibold text-primary">
                  L&rsquo;étape suivante génère la carte QR de la cliente pour ses collectes.
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-tile mt-4 bg-danger/10 px-[13px] py-[11px] text-xs font-semibold text-danger">{error}</div>
            )}

            <div className="mt-4 flex justify-between gap-2.5">
              <Button variant="secondary" onClick={goToStep1}>
                Retour
              </Button>
              <Button variant="primary" onClick={submit} disabled={!canSubmit} loading={submitting}>
                Créer & générer la carte
              </Button>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
};

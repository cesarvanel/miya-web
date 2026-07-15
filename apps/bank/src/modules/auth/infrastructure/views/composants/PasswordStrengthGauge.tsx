import React from 'react';
import { PasswordStrengthLabel, type PasswordStrength } from '../../../domain/services/PasswordStrength';

interface PasswordStrengthGaugeProps {
  strength: PasswordStrength;
}

const LABEL_CLASSES: Record<PasswordStrengthLabel, string> = {
  [PasswordStrengthLabel.Empty]: 'text-ink-faint',
  [PasswordStrengthLabel.Weak]: 'text-danger',
  [PasswordStrengthLabel.Fair]: 'text-amber',
  [PasswordStrengthLabel.Good]: 'text-primary-muted',
  [PasswordStrengthLabel.Strong]: 'text-primary',
};

const SEGMENT_CLASSES: Record<PasswordStrengthLabel, string> = {
  [PasswordStrengthLabel.Empty]: 'bg-line',
  [PasswordStrengthLabel.Weak]: 'bg-danger',
  [PasswordStrengthLabel.Fair]: 'bg-amber',
  [PasswordStrengthLabel.Good]: 'bg-primary-muted',
  [PasswordStrengthLabel.Strong]: 'bg-primary',
};

/** Jauge 4 segments + checklist temps réel — « Robuste » seulement si score === 4 (jamais avant). Maquette B5. */
export const PasswordStrengthGauge: React.FC<PasswordStrengthGaugeProps> = ({ strength }) => (
  <div>
    <div className="flex items-center gap-[5px]">
      {strength.criteria.map((_, index) => (
        <div
          key={index}
          className={['h-[5px] flex-1 rounded-[3px] transition-colors', index < strength.score ? SEGMENT_CLASSES[strength.label] : 'bg-line'].join(' ')}
        />
      ))}
    </div>
    {strength.label !== PasswordStrengthLabel.Empty && (
      <div className={['mt-1.5 text-[11.5px] font-bold', LABEL_CLASSES[strength.label]].join(' ')}>{strength.label}</div>
    )}
    <div className="mt-3 flex flex-col gap-1.5">
      {strength.criteria.map((criterion) => (
        <div key={criterion.id} className="flex items-center gap-2">
          <span
            className={[
              'flex size-[17px] flex-none items-center justify-center rounded-full',
              criterion.met ? 'bg-primary' : 'bg-line',
            ].join(' ')}
          >
            {criterion.met && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
                <path d="M1 3.5L3.2 5.7 8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className={['text-[12px] font-medium', criterion.met ? 'text-ink' : 'text-ink-soft'].join(' ')}>{criterion.label}</span>
        </div>
      ))}
    </div>
  </div>
);

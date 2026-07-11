import React, { useState } from 'react';
import { useOutsideClick } from '../internal/useOutsideClick';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  /** Action destructive — séparée des autres par un liseré, teinte rouge. */
  destructive?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  'aria-label'?: string;
}

/** Menu d'actions contextuel (déclencheur ⋯) — action destructive séparée. */
export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  'aria-label': ariaLabel = 'Actions',
}) => {
  const [isOpen, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false), isOpen);
  const firstDestructiveIndex = items.findIndex((item) => item.destructive);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setOpen((open) => !open)}
        className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-line bg-card transition hover:bg-cream-50"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="4" r="1.4" fill="#6B7069" />
          <circle cx="9" cy="9" r="1.4" fill="#6B7069" />
          <circle cx="9" cy="14" r="1.4" fill="#6B7069" />
        </svg>
      </button>
      {isOpen && (
        <div
          role="menu"
          className="rounded-tile absolute top-[46px] right-0 z-10 w-[200px] border border-line bg-card p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,.35)]"
        >
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {index === firstDestructiveIndex && index > 0 && (
                <div className="mx-2 my-[5px] h-px bg-line-soft" />
              )}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className={[
                  'flex w-full cursor-pointer items-center gap-[10px] rounded-lg px-[11px] py-[9px] text-left text-[13px] font-semibold transition',
                  item.destructive
                    ? 'text-danger hover:bg-danger hover:text-white'
                    : 'text-ink hover:bg-cream-50',
                ].join(' ')}
              >
                {item.icon}
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

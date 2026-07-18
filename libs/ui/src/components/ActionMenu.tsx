import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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

const MENU_WIDTH = 200;
const GAP = 6;

/**
 * Menu d'actions contextuel (déclencheur ⋯) — action destructive séparée.
 * Le panneau se rend dans un portail sur `document.body`, positionné en
 * `fixed` d'après la position du déclencheur : il ne peut jamais être
 * rogné par un ancêtre `overflow-hidden` (ex. le conteneur de `Table`, qui
 * coupait le menu des dernières lignes).
 */
export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  'aria-label': ariaLabel = 'Actions',
}) => {
  const [isOpen, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstDestructiveIndex = items.findIndex((item) => item.destructive);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    const estimatedHeight = items.length * 38 + 12 + (firstDestructiveIndex > 0 ? 11 : 0);
    const opensUpward = rect.bottom + GAP + estimatedHeight > window.innerHeight;
    setPosition({
      top: opensUpward ? rect.top - GAP - estimatedHeight : rect.bottom + GAP,
      left: Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - GAP),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne recalcule qu'à l'ouverture, pas à chaque render
  }, [isOpen]);

  /** Le déclencheur ET le panneau (porté ailleurs dans le DOM) comptent tous deux comme "dedans". */
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const handlePointerDown = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
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
      {isOpen &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ position: 'fixed', top: position.top, left: position.left, width: MENU_WIDTH }}
            className="rounded-tile z-50 border border-line bg-card p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,.35)]"
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
          </div>,
          document.body,
        )}
    </>
  );
};

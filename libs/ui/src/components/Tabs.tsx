import React, { useLayoutEffect, useRef, useState } from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  /** Compteur affiché après le libellé (« Ouvertes · 3 »). */
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

interface PillRect {
  left: number;
  width: number;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange }) => {
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [pill, setPill] = useState<PillRect | null>(null);

  useLayoutEffect(() => {
    const measure = (): void => {
      const activeButton = buttonsRef.current.get(activeId);
      if (activeButton) {
        setPill({ left: activeButton.offsetLeft, width: activeButton.offsetWidth });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeId, items]);

  return (
    <div role="tablist" className="relative flex items-center gap-2">
      {pill && (
        <div
          aria-hidden="true"
          className="bg-ink absolute top-0 h-full rounded-full transition-[left,width] duration-250 ease-out"
          style={{ left: pill.left, width: pill.width }}
        />
      )}
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(el) => {
              if (el) {
                buttonsRef.current.set(item.id, el);
              } else {
                buttonsRef.current.delete(item.id);
              }
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={[
              'relative z-10 cursor-pointer rounded-full px-[15px] py-2 text-[13px] transition-colors duration-200',
              isActive
                ? 'font-bold text-white'
                : 'border border-line bg-card font-semibold text-ink-muted hover:bg-cream-50',
            ].join(' ')}
          >
            {item.label}
            {item.count !== undefined && <> · {item.count}</>}
          </button>
        );
      })}
    </div>
  );
};

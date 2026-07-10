import React from 'react';

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

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange }) => {
  return (
    <div role="tablist" className="flex items-center gap-2">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={[
              'cursor-pointer rounded-full px-[15px] py-2 text-[13px] transition',
              isActive
                ? 'bg-ink font-bold text-white'
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

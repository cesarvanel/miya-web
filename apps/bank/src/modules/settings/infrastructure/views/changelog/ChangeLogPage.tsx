import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, EmptyState } from '@miya/ui';
import { ChangeLogEntryCard } from './ChangeLogEntryCard';
import { CHANGE_LOG_SECTIONS, useChangeLog } from './useChangeLog';

/** Journal des changements — chronologie ancien → nouveau, filtrable par section, lecture seule. Maquette 9i. */
export const ChangeLogPage: React.FC = () => {
  const navigate = useNavigate();
  const { section, setSection, groups, isPending, isEmpty } = useChangeLog();

  return (
    <div className="flex h-full min-w-0 flex-1 items-center justify-center bg-[#F6F5F1]">
      <Drawer isOpen onClose={() => navigate('/admin')} title="Journal des changements" width={420}>
        <div className="mb-1 text-[12px] font-semibold text-ink-faint">Lecture seule · piste d&rsquo;audit</div>

        <div className="mb-4 flex flex-wrap gap-1.75">
          <button
            type="button"
            onClick={() => setSection(undefined)}
            className={['cursor-pointer rounded-full px-3.25 py-1.5 text-xs font-bold', section === undefined ? 'bg-primary text-white' : 'border border-line bg-card text-ink-muted'].join(' ')}
          >
            Toutes
          </button>
          {CHANGE_LOG_SECTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSection(value)}
              className={['cursor-pointer rounded-full px-3.25 py-1.5 text-xs font-bold', section === value ? 'bg-primary text-white' : 'border border-line bg-card text-ink-muted'].join(' ')}
            >
              {value}
            </button>
          ))}
        </div>

        {isEmpty && !isPending && <EmptyState title="Aucun changement" description="Les modifications de la configuration apparaîtront ici." />}

        {groups.map(([label, entries]) => (
          <div key={label}>
            <div className="pb-2.5 text-[11px] font-extrabold tracking-[.05em] text-ink-faint uppercase">{label}</div>
            {entries.map((entry, index) => (
              <ChangeLogEntryCard key={entry.id} entry={entry} isLast={index === entries.length - 1} />
            ))}
          </div>
        ))}

        <div className="mt-2 flex items-center justify-center gap-2 border-t border-line-soft pt-3.5 text-center text-[11.5px] font-semibold text-ink-faint">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="4" y="7" width="8" height="6" rx="1.4" stroke="#8A8A82" strokeWidth="1.4" />
            <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" stroke="#8A8A82" strokeWidth="1.4" />
          </svg>
          Journal non modifiable — conservé à des fins d&rsquo;audit
        </div>
      </Drawer>
    </div>
  );
};

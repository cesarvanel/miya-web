import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  'aria-label'?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher…',
  id,
  'aria-label': ariaLabel = 'Rechercher',
}) => {
  return (
    <div className="rounded-input focus-within:shadow-focus-ring flex w-60 items-center gap-[9px] border border-line bg-card px-[14px] py-[10px] transition">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5" stroke="#9A9C93" strokeWidth="1.6" />
        <path
          d="M11 11l3 3"
          stroke="#9A9C93"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <input
        id={id}
        type="search"
        aria-label={ariaLabel}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border-none bg-transparent text-[13.5px] font-medium text-ink outline-none placeholder:text-ink-soft"
      />
    </div>
  );
};

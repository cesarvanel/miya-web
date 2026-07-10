import React from 'react';

export type CardPadding = 'none' | 'sm' | 'md';

interface CardProps {
  padding?: CardPadding;
  className?: string;
  children: React.ReactNode;
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-[13px]',
  md: 'p-5',
};

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  className,
  children,
}) => {
  return (
    <div
      className={[
        'rounded-card border border-line bg-card',
        paddingClasses[padding],
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
};

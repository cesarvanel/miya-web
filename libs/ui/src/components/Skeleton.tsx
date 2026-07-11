import React from 'react';

export type SkeletonVariant = 'card' | 'row' | 'chart' | 'activity';

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const Bone: React.FC<{ className: string }> = ({ className }) => (
  <span className={['shimmer-surface block rounded-md', className].join(' ')} />
);

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'row',
  className,
}) => {
  if (variant === 'card') {
    return (
      <div
        aria-hidden="true"
        className={['rounded-card border border-line bg-card p-5', className ?? ''].join(' ')}
      >
        <Bone className="h-3 w-24" />
        <Bone className="mt-3 h-7 w-36" />
        <Bone className="mt-2 h-3 w-28" />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div
        aria-hidden="true"
        className={[
          'rounded-card flex h-[220px] items-end gap-3 border border-line bg-card p-5',
          className ?? '',
        ].join(' ')}
      >
        {[45, 70, 55, 90, 65, 80, 40].map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%` }}
            className="shimmer-surface flex-1 rounded-t-md"
          />
        ))}
      </div>
    );
  }

  if (variant === 'activity') {
    return (
      <div
        aria-hidden="true"
        className={[
          'rounded-card flex flex-col gap-3 border border-line bg-card p-[18px]',
          className ?? '',
        ].join(' ')}
      >
        {['w-[80%]', 'w-[64%]', 'w-[72%]'].map((width, index) => (
          <div key={index} className="flex items-center gap-[10px]">
            <span className="shimmer-surface size-2 flex-none rounded-full" />
            <Bone className={`h-2.5 ${width}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={[
        'flex items-center gap-3 border-b border-line-faint bg-card px-[22px] py-[15px]',
        className ?? '',
      ].join(' ')}
    >
      <span className="shimmer-surface rounded-tile block size-10 flex-none" />
      <span className="min-w-0 flex-1">
        <Bone className="h-3.5 w-2/5" />
        <Bone className="mt-2 h-3 w-1/4" />
      </span>
      <Bone className="h-6 w-20 rounded-full" />
    </div>
  );
};

import React from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';

interface InitialsAvatarProps {
  name: string;
  size?: AvatarSize;
}

/** Paires fond/texte relevées sur les tuiles d'initiales des maquettes. */
const avatarPalette = [
  'bg-violet-soft text-violet',
  'bg-info-tint text-info',
  'bg-orange-avatar-soft text-orange-avatar',
  'bg-primary-soft text-primary',
  'bg-olive-soft text-olive',
];

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'size-8 rounded-[9px] text-xs',
  md: 'size-10 rounded-tile text-sm',
  lg: 'size-[42px] rounded-tile text-sm',
};

export const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

/** Hash stable du nom → index dans la palette (même nom = même couleur). */
export const avatarColorIndex = (name: string, paletteSize: number): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % paletteSize;
};

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 'md',
}) => {
  const colorClasses = avatarPalette[avatarColorIndex(name, avatarPalette.length)];
  return (
    <span
      aria-hidden="true"
      className={[
        'inline-flex flex-none items-center justify-center font-bold',
        sizeClasses[size],
        colorClasses,
      ].join(' ')}
    >
      {initialsOf(name)}
    </span>
  );
};

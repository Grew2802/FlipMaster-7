import React from 'react';
import {
  SPRITE_PATHS,
  NUMBER_SPRITE_INFO,
  MODIFIER_SPRITE_INFO,
  getNumberSpritePosition,
  getModifierSpritePosition,
} from '../constants';

interface CardProps {
  value: number | string;
  label?: string;
  type?: 'number' | 'modifier';
  selected?: boolean;
  onClick: () => void;
  count?: number; // For Lucky 13 logic
  theme: 'light' | 'dark';
}

export const Card: React.FC<CardProps> = ({ 
  value, 
  label, 
  type = 'number', 
  selected, 
  onClick,
  count = 0,
  theme
}) => {
  const displayLabel = label || value.toString();
  
  let spriteInfo, position;
  let spriteUrl;

  if (type === 'number') {
    spriteInfo = NUMBER_SPRITE_INFO;
    position = getNumberSpritePosition(Number(value), theme);
    spriteUrl = SPRITE_PATHS.numbers;
  } else {
    spriteInfo = MODIFIER_SPRITE_INFO;
    position = getModifierSpritePosition(displayLabel as string, theme);
    spriteUrl = SPRITE_PATHS.modifiers;
  }
  
  const backgroundPositionX = spriteInfo.cols > 1 ? `${(position[0] / (spriteInfo.cols - 1)) * 100}%` : '0%';
  const backgroundPositionY = spriteInfo.rows > 1 ? `${(position[1] / (spriteInfo.rows - 1)) * 100}%` : '0%';
  const backgroundSize = `${spriteInfo.cols * 100}% ${spriteInfo.rows * 100}%`;

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-[133/186] rounded-xl 
        transition-all duration-200 ease-in-out
        bg-cover bg-no-repeat bg-center
        ${selected ? 'transform scale-95 ring-4 ring-yellow-400 z-10' : 'hover:scale-105 hover:z-10 shadow-lg'}
        touch-manipulation select-none overflow-hidden
      `}
      style={{
        backgroundImage: `url(${spriteUrl})`,
        backgroundPosition: `${backgroundPositionX} ${backgroundPositionY}`,
        backgroundSize: backgroundSize,
        backgroundColor: 'var(--card-bg)' // Fallback
      }}
      aria-label={`Card ${displayLabel}`}
    >
      {count > 1 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shadow-md border-2 border-white z-20">
          {count}
        </div>
      )}
    </button>
  );
};

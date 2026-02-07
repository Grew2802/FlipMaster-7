
import React from 'react';
import { CARD_SPRITES } from '../src/card-sprites';

interface CardProps {
  value: number | string;
  label?: string;
  type?: 'number' | 'modifier';
  colorKey?: string | number;
  selected?: boolean;
  onClick: () => void;
  count?: number; // For Lucky 13 logic
  theme?: 'light' | 'dark';
}

export const Card: React.FC<CardProps> = ({ 
  value, 
  label, 
  type = 'number', 
  colorKey, 
  selected, 
  onClick,
  count = 0,
  theme = 'dark'
}) => {
  // Determine which sprite to use based on theme
  const getSpriteKey = () => {
    if (type === 'number') {
      return `${theme}-${value}`;
    } else {
      // Modifier card
      const modLabel = label || value;
      return `${theme}-${modLabel}`;
    }
  };

  const spriteKey = getSpriteKey();
  const spriteUrl = CARD_SPRITES[spriteKey];

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-[5/7] flex items-center justify-center
        transition-all duration-150 touch-manipulation select-none overflow-hidden
        ${selected ? 'transform scale-95' : 'hover:brightness-110'}
      `}
    >
      <img 
        src={spriteUrl} 
        alt={`${label || value}`}
        className={`w-full h-full object-contain transition-all duration-150 ${
          selected ? 'grayscale brightness-50 opacity-60' : ''
        }`}
        draggable={false}
      />

      {count > 1 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow-lg border-2 border-black z-20">
          {count}
        </div>
      )}
    </button>
  );
};

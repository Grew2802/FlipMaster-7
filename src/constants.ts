import { GameMode, CardDef } from './types';

export const SPRITE_PATHS = {
  numbers: '/image_1740673429_0.png',
  modifiers: '/image_1740673398_0.png'
};

export const NUMBER_SPRITE_INFO = {
  cols: 7,
  rows: 4
};

export const MODIFIER_SPRITE_INFO = {
  cols: 8,
  rows: 4
};

// Map card values/labels to their [col, row] position in the sprite sheet.
// Numbers sprite: 7x4 grid
// Light theme: rows 0, 1. Dark theme: rows 2, 3.
// 0-6 are on first row of their theme, 7-13 on the second.
export const getNumberSpritePosition = (value: number, theme: 'light' | 'dark'): [number, number] => {
  const isDark = theme === 'dark';
  let row = isDark ? 2 : 0;
  let col = value;
  if (value > 6) {
    row += 1;
    col = value - 7;
  }
  return [col, row];
};

// Modifiers sprite: 8x4 grid
// Light theme: rows 0, 1. Dark theme: rows 2, 3.
export const getModifierSpritePosition = (label: string, theme: 'light' | 'dark'): [number, number] => {
  const isDark = theme === 'dark';

  const lightMap: { [key: string]: [number, number] } = {
    '+2':  [0, 0],
    '+4':  [1, 0],
    '+6':  [2, 0],
    '+8':  [3, 0],
    '+10': [4, 0],
    'x2':  [5, 0],
    '-2':  [0, 1],
    '-4':  [1, 1],
    '-6':  [2, 1],
    '-8':  [4, 1],
    '-10': [6, 1],
    '÷2':  [7, 1],
  };

  const darkMap: { [key: string]: [number, number] } = {
    '+2':  [0, 2],
    '+4':  [1, 2],
    '+6':  [2, 2],
    '+8':  [3, 2],
    '+10': [4, 2], 
    'x2':  [7, 2],
    '-2':  [0, 3],
    '-4':  [2, 3],
    '-6':  [3, 3],
    '-8':  [1, 3],
    '-10': [6, 3],
    '÷2':  [7, 3],
  };
  
  const map = isDark ? darkMap : lightMap;
  return map[label] || [0, 0]; // Default to first sprite if not found
};

export const NUMBER_CARDS_ORIGINAL: number[] = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
export const NUMBER_CARDS_VENGEANCE: number[] = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

export const MODIFIERS_ORIGINAL: CardDef[] = [
  { value: 2, label: '+2', type: 'modifier' },
  { value: 4, label: '+4', type: 'modifier' },
  { value: 6, label: '+6', type: 'modifier' },
  { value: 8, label: '+8', type: 'modifier' },
  { value: 10, label: '+10', type: 'modifier' },
  { value: 0, label: 'x2', type: 'modifier', special: 'x2' },
];

export const MODIFIERS_VENGEANCE: CardDef[] = [
  { value: -2, label: '-2', type: 'modifier' },
  { value: -4, label: '-4', type: 'modifier' },
  { value: -6, label: '-6', type: 'modifier' },
  { value: -8, label: '-8', type: 'modifier' },
  { value: -10, label: '-10', type: 'modifier' },
  { value: 0, label: '÷2', type: 'modifier', special: 'div2' },
];

export const GAME_MODE_LABELS = {
  [GameMode.ORIGINAL]: 'Original',
  [GameMode.VENGEANCE]: 'Vengeance',
  [GameMode.COMBO]: 'Combo',
};

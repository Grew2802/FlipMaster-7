import { GameMode, CardDef } from './types';

export const COLORS = {
  13: '#ff1744',
  12: '#ff2a2a',
  11: '#ff9100',
  10: '#ffd600',
  9: '#00e676',
  8: '#2979ff',
  7: '#d500f9',
  6: '#f50057',
  5: '#00bfa5',
  4: '#8d6e63',
  3: '#78909c',
  2: '#bdbdbd',
  1: '#ffffff',
  0: '#9e9e9e',
  bonus: 'var(--bonus-green)',
  bust: 'var(--bust-red)',
  f7: 'var(--f7-purple)',
};

export const NUMBER_CARDS_ORIGINAL: number[] = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
export const NUMBER_CARDS_VENGEANCE: number[] = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

export const MODIFIERS_ORIGINAL: CardDef[] = [
  { value: 2, label: '+2', color: 'bonus', type: 'modifier' },
  { value: 4, label: '+4', color: 'bonus', type: 'modifier' },
  { value: 6, label: '+6', color: 'bonus', type: 'modifier' },
  { value: 8, label: '+8', color: 'bonus', type: 'modifier' },
  { value: 10, label: '+10', color: 'bonus', type: 'modifier' },
  { value: 0, label: 'x2', color: 'f7', type: 'modifier', special: 'x2' },
];

export const MODIFIERS_VENGEANCE: CardDef[] = [
  { value: -2, label: '-2', color: 'bust', type: 'modifier' },
  { value: -4, label: '-4', color: 'bust', type: 'modifier' },
  { value: -6, label: '-6', color: 'bust', type: 'modifier' },
  { value: -8, label: '-8', color: 'bust', type: 'modifier' },
  { value: -10, label: '-10', color: 'bust', type: 'modifier' },
  { value: 0, label: '÷2', color: 'f7', type: 'modifier', special: 'div2' },
];

export const GAME_MODE_LABELS = {
  [GameMode.ORIGINAL]: 'Original',
  [GameMode.VENGEANCE]: 'Vengeance',
  [GameMode.COMBO]: 'Combo',
};

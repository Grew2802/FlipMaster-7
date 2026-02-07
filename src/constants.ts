import { GameMode, CardDef } from './types';

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

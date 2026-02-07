
export enum GameMode {
  ORIGINAL = 'ORIGINAL',
  VENGEANCE = 'VENGEANCE',
  COMBO = 'COMBO'
}

export interface Player {
  id: string;
  name: string;
  score: number;
  history: number[]; // Scores per round
  busted: boolean;
  dealer: boolean;
  // Temporary state for the current round input
  currentInput: string;
  isFlip7: boolean;
  isX2: boolean;
  isDiv2: boolean;
  isZeroRule?: boolean; // Tracks if the Vengeance Zero rule triggered
  bonusTotal: number;
}

export interface GameState {
  players: Player[];
  round: number;
  dealerIndex: number;
  gameMode: GameMode;
  theme: 'light' | 'dark';
  sound: boolean;
  brutalMode: boolean;
  targetGoal: number;
  history: MatchRecord[];
}

export interface MatchRecord {
  date: string;
  winner: string;
  score: number;
  mode: GameMode;
}

export interface CardDef {
  value: number;
  label: string | number;
  type: 'number' | 'modifier';
  special?: 'zero' | 'x2' | 'div2';
}
import { GameMode } from '../types';

interface ScoreResult {
  total: number;
  bonusDisplay: string;
  isFlip7: boolean;
  zeroTriggered: boolean;
  breakdown: string;
}

export const calculateScore = (
  mode: GameMode,
  numbers: number[], // Array of selected numbers
  modifiers: number[], // Array of flat modifier values
  isX2: boolean,
  isDiv2: boolean,
  isBrutalMode: boolean = false,
  skipFlip7Bonus: boolean = false // Optional in Brutal Mode
): ScoreResult => {
  // Handle scoring
  const sum = numbers.reduce((a, b) => a + b, 0);
  const uniqueNumbers = new Set(numbers);
  const distinctCount = uniqueNumbers.size;

  // Rules Check
  const hasZero = numbers.includes(0);
  const isFlip7 = numbers.length >= 7;

  // 1. Base Score (Sum of numbers)
  let currentScore = sum;
  let zeroTriggered = false;

  // 2. Multipliers/Divisors
  if (isX2) {
    currentScore = currentScore * 2;
  }

  if (isDiv2) {
    currentScore = Math.floor(currentScore / 2);
  }

  // 3. Add Modifiers
  const modifiersTotal = modifiers.reduce((a, b) => a + b, 0);
  currentScore += modifiersTotal;

  // 4. Vengeance "The Zero" Rule
  if ((mode === GameMode.VENGEANCE || mode === GameMode.COMBO) && hasZero && !isFlip7) {
    currentScore = 0;
    zeroTriggered = true;
  }

  // 5. Floor at 0 (unless Brutal Mode)
  if (!isBrutalMode && currentScore < 0) {
    currentScore = 0;
  }

  // 6. Flip 7 Bonus
  // In Brutal Mode, the user handles the choice (+15 or -15 to another).
  // If skipFlip7Bonus is true, we don't add it here.
  if (isFlip7 && !skipFlip7Bonus) {
    currentScore += 15;
  }

  return {
    total: currentScore,
    bonusDisplay: modifiersTotal > 0 ? `+${modifiersTotal}` : modifiersTotal < 0 ? `${modifiersTotal}` : '',
    isFlip7,
    zeroTriggered,
    breakdown: `Sum: ${sum}`
  };
};

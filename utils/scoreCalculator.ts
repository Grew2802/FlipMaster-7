
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
  isDiv2: boolean
): ScoreResult => {
  // Handle the "Lucky 13" Vengeance rule
  let processedNumbers = [...numbers];
  let baseScore = 0;
  const lucky13Count = processedNumbers.filter(n => n === 13).length;

  if (lucky13Count === 2) {
    baseScore += 31; // Two 13s are worth 31 points
    processedNumbers = processedNumbers.filter(n => n !== 13);
  }

  const sum = processedNumbers.reduce((a, b) => a + b, 0) + baseScore;
  const uniqueNumbers = new Set(numbers);
  const distinctCount = uniqueNumbers.size;
  
  // Rules Check
  const hasZero = numbers.includes(0);
  const isFlip7 = distinctCount >= 7;

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
  // If playing Vengeance or Combo, holding a 0 wipes the score unless you Flip 7.
  if ((mode === GameMode.VENGEANCE || mode === GameMode.COMBO) && hasZero && !isFlip7) {
    currentScore = 0; 
    zeroTriggered = true;
  }

  // 5. Floor at 0
  if (currentScore < 0) {
    currentScore = 0;
  }

  // 6. Flip 7 Bonus
  if (isFlip7) {
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

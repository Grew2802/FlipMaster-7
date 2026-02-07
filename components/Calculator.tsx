
import React, { useState } from 'react';
import { GameMode } from '../types';
import { Card } from './Card';
import { NUMBER_CARDS_ORIGINAL, NUMBER_CARDS_VENGEANCE, MODIFIERS_ORIGINAL, MODIFIERS_VENGEANCE } from '../constants';
import { calculateScore } from '../utils/scoreCalculator';

interface CalculatorProps {
  mode: GameMode;
  onClose: () => void;
  onSubmit: (total: number, bonus: number, isF7: boolean, isX2: boolean, isDiv2: boolean, isZeroRule: boolean) => void;
  playerName: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ mode, onClose, onSubmit, playerName, theme, toggleTheme }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<number[]>([]);
  const [isX2, setIsX2] = useState(false);
  const [isDiv2, setIsDiv2] = useState(false);

  const scoreResult = calculateScore(mode, selectedNumbers, selectedModifiers, isX2, isDiv2);

  const toggleNumber = (num: number) => {
    if (num === 13) {
      const count = selectedNumbers.filter(n => n === 13).length;
      if (count < 2) setSelectedNumbers([...selectedNumbers, 13]);
      else setSelectedNumbers(selectedNumbers.filter(n => n !== 13));
    } else {
      if (selectedNumbers.includes(num)) {
        setSelectedNumbers(selectedNumbers.filter(n => n !== num));
      } else {
        setSelectedNumbers([...selectedNumbers, num]);
      }
    }
  };

  const toggleModifier = (val: number) => {
    if (selectedModifiers.includes(val)) {
      setSelectedModifiers(selectedModifiers.filter(v => v !== val));
    } else {
      setSelectedModifiers([...selectedModifiers, val]);
    }
  };

  const numberCards = (mode === GameMode.ORIGINAL) ? NUMBER_CARDS_ORIGINAL : NUMBER_CARDS_VENGEANCE;
  let modifierCards = [];
  if (mode === GameMode.ORIGINAL) modifierCards = MODIFIERS_ORIGINAL;
  else if (mode === GameMode.VENGEANCE) modifierCards = MODIFIERS_VENGEANCE;
  else modifierCards = [...MODIFIERS_ORIGINAL.filter(m => m.special !== 'x2'), ...MODIFIERS_VENGEANCE];

  const handleSubmit = () => {
    onSubmit(
      scoreResult.total, 
      selectedModifiers.reduce((a, b) => a + b, 0), 
      scoreResult.isFlip7, 
      isX2, 
      isDiv2,
      scoreResult.zeroTriggered
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden p-1 bg-bg transition-colors duration-300">
      {/* Slim Header */}
      <div className="flex-shrink-0 mb-1 p-1 px-2 rounded-xl bg-card-bg border border-white/10 flex items-center justify-between shadow-lg relative z-50">
        <div className="flex flex-col justify-center">
            <div className="text-[8px] uppercase text-subtext font-black leading-none mb-0.5 tracking-[0.2em]">{playerName}</div>
            <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-black leading-none transition-colors ${scoreResult.zeroTriggered ? 'text-bust' : 'text-primary'}`}>
                    {scoreResult.total}
                </span>
                {scoreResult.bonusDisplay && <span className="text-[10px] text-bonus font-black">{scoreResult.bonusDisplay}</span>}
            </div>
        </div>
        <div className="flex items-center gap-2">
             <div className="flex gap-1 flex-wrap justify-end max-w-[100px]">
                {scoreResult.zeroTriggered && <span className="px-1 py-0.5 rounded-md bg-bust text-white text-[6px] font-black uppercase shadow-sm animate-pulse">ZEROED</span>}
                {scoreResult.isFlip7 && <span className="px-1 py-0.5 rounded-md bg-f7 text-white text-[6px] font-black uppercase shadow-sm">FLIP 7</span>}
                {isX2 && <span className="px-1 py-0.5 rounded-md bg-yellow-500 text-black text-[6px] font-black uppercase shadow-sm">x2</span>}
                {isDiv2 && <span className="px-1 py-0.5 rounded-md bg-blue-500 text-white text-[6px] font-black uppercase shadow-sm">÷2</span>}
            </div>
            <div className="flex gap-1">
                <button onClick={toggleTheme} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 text-xs">
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <button onClick={onClose} className="text-subtext hover:text-primary p-1.5 transition-colors">
                    <span className="text-lg font-black leading-none">✕</span>
                </button>
            </div>
        </div>
      </div>

      {/* Centered Grid */}
      <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-md mx-auto px-2">
          {/* Number Cards - 5 per row */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            {numberCards.map(num => (
              <Card 
                key={`num-${num}`} 
                value={num} 
                onClick={() => toggleNumber(num)} 
                selected={selectedNumbers.includes(num)} 
                count={selectedNumbers.filter(x => x === num).length} 
                colorKey={num}
                theme={theme}
              />
            ))}
          </div>
          
          {/* Modifier Cards - New Row */}
          <div className="grid grid-cols-5 gap-2">
            {modifierCards.map((mod, idx) => (
               (mod.special !== 'x2' && mod.special !== 'div2') && (
                 <Card 
                   key={`mod-${idx}`} 
                   value={mod.value} 
                   label={mod.label as string} 
                   type="modifier" 
                   colorKey={mod.color} 
                   onClick={() => toggleModifier(mod.value)} 
                   selected={selectedModifiers.includes(mod.value)}
                   theme={theme}
                 />
               )
             ))}
             {(mode === GameMode.ORIGINAL || mode === GameMode.COMBO) && (
                 <Card value={0} label="x2" type="modifier" colorKey="f7" onClick={() => setIsX2(!isX2)} selected={isX2} theme={theme} />
             )}
             {(mode === GameMode.VENGEANCE || mode === GameMode.COMBO) && (
                 <Card value={0} label="÷2" type="modifier" colorKey="f7" onClick={() => setIsDiv2(!isDiv2)} selected={isDiv2} theme={theme} />
             )}
          </div>
        </div>
      </div>
      
      {/* Ultra Compact Footer Actions */}
      <div className="flex-shrink-0 mt-1 grid grid-cols-4 gap-1.5 pt-1 border-t border-white/10">
          <button 
            onClick={() => { setSelectedNumbers([]); setSelectedModifiers([]); setIsX2(false); setIsDiv2(false); }} 
            className="col-span-1 py-1.5 rounded-lg bg-card-bg text-subtext font-black text-[8px] uppercase tracking-widest active:scale-95 transition-all border border-white/5"
          >
            Clear
          </button>
          <button 
            onClick={handleSubmit} 
            className="col-span-3 py-1.5 rounded-lg bg-primary text-white dark:text-black font-black text-sm active:scale-95 transition-all shadow-md uppercase tracking-widest"
          >
            Apply Score
          </button>
      </div>
    </div>
  );
};

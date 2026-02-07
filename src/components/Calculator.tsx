import React, { useState } from 'react';
import { GameMode, Player } from '../types';
import { Card } from './Card';
import { NUMBER_CARDS_ORIGINAL, NUMBER_CARDS_VENGEANCE, MODIFIERS_ORIGINAL, MODIFIERS_VENGEANCE } from '../constants';
import { calculateScore } from '../utils/scoreCalculator';

interface CalculatorProps {
  mode: GameMode;
  onClose: () => void;
  onSubmit: (total: number, bonus: number, isF7: boolean, isX2: boolean, isDiv2: boolean, isZeroRule: boolean, penaltyTargetId?: string) => void;
  playerName: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isBrutalMode?: boolean;
  players?: Player[]; // Other players for penalty targeting
}

export const Calculator: React.FC<CalculatorProps> = ({
  mode, onClose, onSubmit, playerName, theme, toggleTheme, isBrutalMode = false, players = []
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<number[]>([]);
  const [isX2, setIsX2] = useState(false);
  const [isDiv2, setIsDiv2] = useState(false);

  // Brutal Mode Choice: 'self' (+15) or 'enemy' (-15 to target)
  const [flip7Choice, setFlip7Choice] = useState<'self' | 'enemy'>('self');
  const [penaltyTargetId, setPenaltyTargetId] = useState<string>('');

  const scoreResult = calculateScore(
    mode,
    selectedNumbers,
    selectedModifiers,
    isX2,
    isDiv2,
    isBrutalMode,
    isBrutalMode && flip7Choice === 'enemy' // Skip internal +15 if choice is penalty
  );

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
      scoreResult.zeroTriggered,
      isBrutalMode && flip7Choice === 'enemy' ? penaltyTargetId : undefined
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden p-2 bg-bg transition-colors duration-300">
      {/* Premium Header */}
      <div className="flex-shrink-0 mb-2 p-3 rounded-2xl bg-card-bg border border-white/10 flex items-center justify-between shadow-2xl relative z-50 glass-panel">
        <div className="flex flex-col justify-center">
          <div className="text-[10px] uppercase text-subtext font-black leading-none mb-1 tracking-[0.2em]">{playerName}</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black leading-none transition-all duration-300 ${scoreResult.zeroTriggered ? 'text-bust scale-110 drop-shadow-[0_0_10px_rgba(255,82,82,0.5)]' : 'text-primary'}`}>
              {scoreResult.total}
            </span>
            {scoreResult.bonusDisplay && <span className="text-xs text-bonus font-black bg-bonus/10 px-1.5 py-0.5 rounded-md">{scoreResult.bonusDisplay}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 flex-wrap justify-end max-w-[120px]">
            {scoreResult.zeroTriggered && <span className="px-2 py-1 rounded-lg bg-bust text-white text-[8px] font-black uppercase shadow-lg animate-pulse">ZEROED</span>}
            {scoreResult.isFlip7 && <span className="px-2 py-1 rounded-lg bg-f7 text-white text-[8px] font-black uppercase shadow-lg">FLIP 7</span>}
            {isX2 && <span className="px-2 py-1 rounded-lg bg-yellow-500 text-black text-[8px] font-black uppercase shadow-lg">x2</span>}
            {isDiv2 && <span className="px-2 py-1 rounded-lg bg-blue-500 text-white text-[8px] font-black uppercase shadow-lg">÷2</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="w-10 h-10 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center text-lg active:scale-90">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={onClose} className="w-10 h-10 text-subtext bg-white/5 rounded-xl hover:text-white hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center active:scale-90">
              <span className="text-xl font-black">✕</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar py-2">
        <div className="w-full max-w-md mx-auto px-1">

          {/* Brutal Mode Flip 7 Choice */}
          {isBrutalMode && scoreResult.isFlip7 && (
            <div className="mb-6 p-4 rounded-2xl bg-f7/10 border border-f7/30 animate-in zoom-in-95 duration-300">
              <div className="text-[10px] font-black text-f7 uppercase tracking-widest mb-3 text-center">BRUTAL FLIP 7 CHOICE</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setFlip7Choice('self')}
                  className={`py-3 rounded-xl font-black text-xs uppercase transition-all ${flip7Choice === 'self' ? 'bg-f7 text-white shadow-lg' : 'bg-white/5 text-subtext border border-white/10'}`}
                >
                  Take +15
                </button>
                <button
                  onClick={() => setFlip7Choice('enemy')}
                  className={`py-3 rounded-xl font-black text-xs uppercase transition-all ${flip7Choice === 'enemy' ? 'bg-bust text-white shadow-lg' : 'bg-white/5 text-subtext border border-white/10'}`}
                >
                  Penalty -15
                </button>
              </div>

              {flip7Choice === 'enemy' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="text-[9px] font-bold text-subtext uppercase text-center mb-1">Target Player:</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {players.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPenaltyTargetId(p.id)}
                        className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${penaltyTargetId === p.id ? 'bg-bust text-white scale-110 shadow-md' : 'bg-white/5 text-subtext border border-white/5'}`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section: Numbers */}
          <div className="mb-6">
            <div className="text-[10px] font-black text-subtext uppercase tracking-[0.3em] mb-3 px-1 opacity-60">Number Cards</div>
            <div className="grid grid-cols-4 gap-3">
              {numberCards.map(num => (
                <Card
                  key={`num-${num}`}
                  value={num}
                  onClick={() => toggleNumber(num)}
                  selected={selectedNumbers.includes(num)}
                  count={selectedNumbers.filter(x => x === num).length}
                  theme={theme}
                />
              ))}
            </div>
          </div>

          {/* Section: Modifiers */}
          <div className="mb-6">
            <div className="text-[10px] font-black text-subtext uppercase tracking-[0.3em] mb-3 px-1 opacity-60">Modifiers</div>
            <div className="grid grid-cols-4 gap-3">
              {modifierCards.map((mod, idx) => (
                (mod.special !== 'x2' && mod.special !== 'div2') && (
                  <Card
                    key={`mod-${idx}`}
                    value={mod.value}
                    label={mod.label as string}
                    type="modifier"
                    onClick={() => toggleModifier(mod.value)}
                    selected={selectedModifiers.includes(mod.value)}
                    theme={theme}
                  />
                )
              ))}
              {(mode === GameMode.ORIGINAL || mode === GameMode.COMBO) && (
                <Card value={0} label="x2" type="modifier" onClick={() => setIsX2(!isX2)} selected={isX2} theme={theme} />
              )}
              {(mode === GameMode.VENGEANCE || mode === GameMode.COMBO) && (
                <Card value={0} label="÷2" type="modifier" onClick={() => setIsDiv2(!isDiv2)} selected={isDiv2} theme={theme} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 mt-2 grid grid-cols-4 gap-3 pt-4 border-t border-white/10 pb-2">
        <button
          onClick={() => { setSelectedNumbers([]); setSelectedModifiers([]); setIsX2(false); setIsDiv2(false); setFlip7Choice('self'); setPenaltyTargetId(''); }}
          className="col-span-1 py-4 rounded-2xl bg-white/5 text-subtext font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all border border-white/5 hover:bg-white/10"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={flip7Choice === 'enemy' && !penaltyTargetId}
          className={`col-span-3 py-4 rounded-2xl text-white dark:text-black font-black text-lg active:scale-95 transition-all shadow-2xl shadow-primary/30 uppercase tracking-[0.1em] hover:brightness-110 ${flip7Choice === 'enemy' && !penaltyTargetId ? 'bg-gray-600 opacity-50 cursor-not-allowed' : 'bg-primary'}`}
        >
          {flip7Choice === 'enemy' && penaltyTargetId ? 'Apply Penalty' : 'Apply Score'}
        </button>
      </div>
    </div>
  );
};

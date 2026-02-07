import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sound: boolean;
  toggleSound: () => void;
  goalScore: number;
  setGoalScore: (score: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, theme, toggleTheme, sound, toggleSound, goalScore, setGoalScore
}) => {
  const [tempGoal, setTempGoal] = useState(goalScore.toString());

  if (!isOpen) return null;

  const handleGoalChange = (value: string) => {
    setTempGoal(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 9999) {
      setGoalScore(numValue);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-bg border border-primary/30 w-full max-w-sm rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-black text-primary mb-6">Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <div className="font-bold text-text">Theme</div>
              <div className="text-xs text-subtext">Light / Dark Mode</div>
            </div>
            <button 
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${theme === 'light' ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'}`}
            >
              {theme === 'light' ? 'LIGHT' : 'DARK'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <div className="font-bold text-text">Sound</div>
              <div className="text-xs text-subtext">Sound Effects</div>
            </div>
            <button 
              onClick={toggleSound}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${sound ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'}`}
            >
              {sound ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold text-text">Winning Score</div>
                <div className="text-xs text-subtext">Points needed to win</div>
              </div>
            </div>
            <input
              type="number"
              value={tempGoal}
              onChange={(e) => handleGoalChange(e.target.value)}
              min="1"
              max="9999"
              className="w-full bg-card-bg border border-white/10 rounded-lg px-4 py-3 text-text text-center text-2xl font-black focus:outline-none focus:border-primary transition-colors"
            />
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleGoalChange('100')} className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs font-bold text-subtext hover:bg-white/10 transition-colors">100</button>
              <button onClick={() => handleGoalChange('200')} className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs font-bold text-subtext hover:bg-white/10 transition-colors">200</button>
              <button onClick={() => handleGoalChange('500')} className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs font-bold text-subtext hover:bg-white/10 transition-colors">500</button>
              <button onClick={() => handleGoalChange('1000')} className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs font-bold text-subtext hover:bg-white/10 transition-colors">1000</button>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="mt-8 w-full py-3 rounded-xl bg-white/10 font-bold text-text">
          CLOSE
        </button>
      </div>
    </div>
  );
};

import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sound: boolean;
  toggleSound: () => void;
  brutalMode: boolean;
  toggleBrutalMode: () => void;
  targetGoal: number;
  setTargetGoal: (val: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, theme, toggleTheme, sound, toggleSound, brutalMode, toggleBrutalMode, targetGoal, setTargetGoal
}) => {
  if (!isOpen) return null;

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

          <div className="flex items-center justify-between p-3 rounded-xl bg-bust/5 border border-bust/10">
            <div>
              <div className="font-bold text-bust">Brutal Mode</div>
              <div className="text-[10px] text-subtext leading-tight">Negative scores, modifiers on busted players, & Flip 7 penalties.</div>
            </div>
            <button
              onClick={toggleBrutalMode}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors shadow-lg ${brutalMode ? 'bg-bust text-white' : 'bg-white/10 text-gray-400'}`}
            >
              {brutalMode ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-text text-sm">Target Goal</div>
                <div className="text-[10px] text-subtext">Points to win the game</div>
              </div>
              <div className="text-xl font-black text-primary">{targetGoal}</div>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[100, 200, 300, 500, 1000].map(val => (
                <button
                  key={val}
                  onClick={() => setTargetGoal(val)}
                  className={`py-2 rounded-lg text-[10px] font-black transition-all ${targetGoal === val ? 'bg-primary text-white dark:text-black scale-105 shadow-lg' : 'bg-white/5 text-subtext hover:bg-white/10'}`}
                >
                  {val}
                </button>
              ))}
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
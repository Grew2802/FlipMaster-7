import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sound: boolean;
  toggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, theme, toggleTheme, sound, toggleSound 
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
        </div>

        <button onClick={onClose} className="mt-8 w-full py-3 rounded-xl bg-white/10 font-bold text-text">
          CLOSE
        </button>
      </div>
    </div>
  );
};
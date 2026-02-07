import React from 'react';

interface CardProps {
  value: number | string;
  label?: string;
  type?: 'number' | 'modifier';
  selected?: boolean;
  onClick: () => void;
  count?: number; // For Lucky 13 logic
  theme: 'light' | 'dark';
}

export const Card: React.FC<CardProps> = ({
  value,
  label,
  type = 'number',
  selected,
  onClick,
  count = 0,
  theme
}) => {
  const displayLabel = label || value.toString();
  const isDark = theme === 'dark';

  // Define color schemes based on value/type
  const getColorScheme = () => {
    if (type === 'modifier') {
      if (displayLabel.includes('+')) return 'from-teal-400 to-emerald-500 shadow-emerald-500/20';
      if (displayLabel.includes('-')) return 'from-orange-400 to-red-600 shadow-red-600/20';
      if (displayLabel.includes('x')) return 'from-yellow-400 to-orange-500 shadow-orange-500/20';
      if (displayLabel.includes('÷')) return 'from-blue-400 to-indigo-500 shadow-indigo-500/20';
      return 'from-f7/80 to-f7 shadow-f7/20';
    }

    // Numbers
    if (value === 0) return isDark ? 'from-gray-700 to-gray-900 shadow-gray-900/40' : 'from-gray-400 to-gray-600 shadow-gray-600/40';
    if (Number(value) >= 10) return 'from-primary/80 to-primary shadow-primary/30';
    return isDark ? 'from-slate-700 to-slate-800' : 'from-slate-300 to-slate-400';
  };

  const scheme = getColorScheme();

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full aspect-[2/3] rounded-xl
        transition-all duration-200 ease-out
        ${selected ? 'scale-95 ring-4 ring-yellow-400 z-10' : 'hover:scale-105 hover:shadow-xl hover:z-10 shadow-lg'}
        flex flex-col items-center justify-center
        overflow-hidden ${isDark ? 'border border-white/10' : 'border-2 border-gray-300'}
        bg-gradient-to-br ${scheme}
      `}
      aria-label={`Card ${displayLabel}`}
    >
      {/* Background patterns for texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-4 -left-4 w-12 h-12 border-2 border-white rounded-full"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 border-2 border-white rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className={`
        text-2xl font-black tracking-tighter
        ${type === 'modifier' ? 'scale-110 drop-shadow-md' : ''}
        ${isDark || type === 'modifier' ? 'text-white' : 'text-slate-900'}
      `}>
        {displayLabel}
      </div>

      {/* Sub-label for numbers */}
      {type === 'number' && (
        <div className={`
          absolute bottom-2 right-2 text-[8px] font-bold uppercase opacity-50
          ${isDark ? 'text-white' : 'text-slate-900'}
        `}>
          VAL
        </div>
      )}

      {/* Modifier type icon/shape */}
      {type === 'modifier' && (
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/40"></div>
      )}

      {/* Stacking Counter */}
      {count > 1 && (
        <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-black text-xs shadow-xl border-2 border-white z-20 animate-in zoom-in-50">
          {count}
        </div>
      )}

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
    </button>
  );
};

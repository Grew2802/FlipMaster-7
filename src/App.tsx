
import React, { useState, useEffect } from 'react';
import { GameMode, Player, MatchRecord } from './types';
import { Calculator } from './components/Calculator';
import { SettingsModal } from './components/SettingsModal';
import { GAME_MODE_LABELS } from './constants';

const App = () => {
  // Global State
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.ORIGINAL);
  const [round, setRound] = useState(1);
  const [dealerIdx, setDealerIdx] = useState(0);
  const [history, setHistory] = useState<MatchRecord[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sound, setSound] = useState(true);
  const [brutalMode, setBrutalMode] = useState(false);
  const [targetGoal, setTargetGoal] = useState(200);

  // UI State
  const [screen, setScreen] = useState<'title' | 'game' | 'stats'>('title');
  const [calcTarget, setCalcTarget] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [undoState, setUndoState] = useState<{ players: Player[], round: number, dealerIdx: number } | null>(null);

  // New Game Flow State
  const [newGameStage, setNewGameStage] = useState<'none' | 'confirm' | 'select'>('none');
  const [clearPlayers, setClearPlayers] = useState(false);

  // Persist State
  useEffect(() => {
    const saved = localStorage.getItem('flip7_v_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPlayers(data.players || []);
        setGameMode(data.gameMode || GameMode.ORIGINAL);
        setHistory(data.history || []);
        setTheme(data.theme || 'dark');
        setSound(data.sound !== undefined ? data.sound : true);
        setBrutalMode(data.brutalMode !== undefined ? data.brutalMode : false);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flip7_v_data', JSON.stringify({
      players, gameMode, history, theme, sound, brutalMode, targetGoal
    }));
    // Apply theme
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [players, gameMode, history, theme, sound, brutalMode, targetGoal]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const handleNewGameRequest = () => {
    if (players.length > 0) {
      setNewGameStage('confirm');
      setClearPlayers(false);
    } else {
      setNewGameStage('select');
    }
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    if (clearPlayers) {
      setPlayers([]);
    } else {
      setPlayers(players.map(p => ({
        ...p, score: 0, history: [], busted: false,
        currentInput: '', isFlip7: false, isX2: false, isDiv2: false, isZeroRule: false, bonusTotal: 0
      })));
    }
    setRound(1);
    setDealerIdx(0);
    setScreen('game');
    setWinner(null);
    setNewGameStage('none');
  };

  const addPlayer = (name: string) => {
    if (!name.trim()) return;
    setPlayers([...players, {
      id: Date.now().toString(),
      name,
      score: 0,
      history: [],
      busted: false,
      dealer: false,
      currentInput: '',
      isFlip7: false,
      isX2: false,
      isDiv2: false,
      isZeroRule: false,
      bonusTotal: 0
    }]);
  };

  const removePlayer = (idx: number) => {
    const newP = [...players];
    newP.splice(idx, 1);
    setPlayers(newP);
  };

  const handleCalcSubmit = (
    total: number,
    bonus: number,
    isF7: boolean,
    isX2: boolean,
    isDiv2: boolean,
    isZeroRule: boolean,
    penaltyTargetId?: string // New for Brutal Mode Flip 7 Choice
  ) => {
    if (calcTarget === null) return;
    const newP = [...players];
    const p = newP[calcTarget];
    p.currentInput = total.toString();
    p.bonusTotal = bonus;
    p.isFlip7 = isF7;
    p.isX2 = isX2;
    p.isDiv2 = isDiv2;
    p.isZeroRule = isZeroRule;

    // Handle Brutal Mode Flip 7 Penalty
    if (penaltyTargetId) {
      const target = newP.find(pl => pl.id === penaltyTargetId);
      if (target) {
        target.score -= 15;
      }
    }

    setPlayers(newP);
    setCalcTarget(null);
  };

  const toggleBust = (idx: number) => {
    const newP = [...players];
    newP[idx].busted = !newP[idx].busted;
    if (newP[idx].busted) {
      newP[idx].currentInput = '';
      newP[idx].bonusTotal = 0;
      newP[idx].isFlip7 = false;
      newP[idx].isX2 = false;
      newP[idx].isDiv2 = false;
      newP[idx].isZeroRule = false;
    }
    setPlayers(newP);
  };

  const submitRound = () => {
    let potentialGameWinner: Player | null = null;

    // Save snapshot for Undo
    setUndoState({ players: [...players.map(p => ({ ...p, history: [...p.history] }))], round, dealerIdx });

    const newPlayers = players.map(p => {
      if (p.busted) {
        return { ...p, busted: false, currentInput: '', bonusTotal: 0, isFlip7: false, isX2: false, isDiv2: false, isZeroRule: false };
      }

      const roundScore = parseInt(p.currentInput || '0', 10);
      const newTotal = p.score + roundScore;

      // In Brutal Mode, no floor at 0. Otherwise floor at 0.
      const finalScore = (!brutalMode && newTotal < 0) ? 0 : newTotal;

      if (finalScore >= targetGoal) {
        if (!potentialGameWinner || finalScore > potentialGameWinner.score) {
          potentialGameWinner = { ...p, score: finalScore };
        }
      }

      return {
        ...p,
        score: finalScore,
        history: [...p.history, roundScore],
        currentInput: '',
        bonusTotal: 0,
        isFlip7: false,
        isX2: false,
        isDiv2: false,
        isZeroRule: false,
        busted: false
      };
    });

    setPlayers(newPlayers);
    setRound(r => r + 1);
    setDealerIdx(d => (d + 1) % (players.length || 1));

    if (potentialGameWinner) {
      setWinner(potentialGameWinner);
      setHistory(prev => [{
        date: new Date().toLocaleDateString(),
        winner: (potentialGameWinner as Player).name,
        score: (potentialGameWinner as Player).score,
        mode: gameMode
      }, ...prev].slice(0, 10));
    }
  };

  const handleUndoRound = () => {
    if (!undoState) return;
    setPlayers(undoState.players);
    setRound(undoState.round);
    setDealerIdx(undoState.dealerIdx);
    setWinner(null);
    setUndoState(null);
  };

  if (screen === 'title') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 relative bg-bg transition-colors duration-300"
        style={{
          paddingTop: 'calc(1.5rem + env(safe-area-inset-top, 44px))',
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 20px))'
        }}
      >
        <button
          onClick={toggleTheme}
          className="absolute safe-top right-6 w-12 h-12 rounded-full bg-card-bg border border-white/10 flex items-center justify-center text-xl shadow-lg z-50 hover:bg-white/10 transition-colors"

        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="w-32 h-32 rounded-3xl bg-[#111] dark:bg-[#111] border-2 border-primary flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(64,196,255,0.3)] animate-pulse">
          🎴
        </div>
        <div>
          <h1 className="text-4xl font-black text-text tracking-tight uppercase">FlipMaster 7</h1>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">Scoring Companion</p>
        </div>

        <div className="w-full max-w-xs space-y-3 pt-6 z-10">
          {players.length > 0 ? (
            <>
              <button onClick={() => setScreen('game')} className="w-full p-4 bg-primary text-white dark:text-black font-black rounded-xl uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Continue Game
              </button>
              <div className="text-[10px] text-subtext font-black uppercase tracking-[0.2em] py-2">
                Mode: {GAME_MODE_LABELS[gameMode]}
              </div>
              <button onClick={handleNewGameRequest} className="w-full p-4 bg-white/10 dark:bg-white/10 hover:bg-white/20 border border-white/10 text-text font-black rounded-xl uppercase transition-all">
                New Game / Mode
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <div className="text-[10px] text-subtext font-black uppercase tracking-[0.2em] mb-4">Select Game Mode</div>
              <button onClick={() => startGame(GameMode.ORIGINAL)} className="w-full text-left p-4 rounded-xl bg-card-bg border border-white/10 hover:border-primary/50 transition-all group flex items-center justify-between">
                <span className="font-black text-text group-hover:text-primary transition-colors">ORIGINAL</span>
                <span className="text-[9px] text-subtext bg-black/20 px-2 py-1 rounded font-black">STND</span>
              </button>
              <button onClick={() => startGame(GameMode.VENGEANCE)} className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-bust/10 to-transparent border border-bust/20 hover:border-bust/50 transition-all group flex items-center justify-between">
                <span className="font-black text-text group-hover:text-bust transition-colors">VENGEANCE</span>
                <span className="text-[9px] text-bust bg-black/20 px-2 py-1 rounded font-black">HARD</span>
              </button>
              <button onClick={() => startGame(GameMode.COMBO)} className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-f7/10 to-transparent border border-f7/20 hover:border-f7/50 transition-all group flex items-center justify-between">
                <span className="font-black text-text group-hover:text-f7 transition-colors">COMBO</span>
                <span className="text-[9px] text-f7 bg-black/20 px-2 py-1 rounded font-black">CHAOS</span>
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <button onClick={() => setScreen('stats')} className="flex-1 bg-card-bg p-3 rounded-xl text-[10px] font-black text-subtext hover:bg-white/10 transition-colors border border-white/10 uppercase tracking-widest">History</button>
            <button onClick={() => setShowSettings(true)} className="flex-1 bg-card-bg p-3 rounded-xl text-[10px] font-black text-subtext hover:bg-white/10 transition-colors border border-white/10 uppercase tracking-widest">Settings</button>
          </div>

          <a
            href="https://buymeacoffee.com/unkieshane"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mt-3 bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-xl text-center text-sm font-black text-black hover:brightness-110 transition-all shadow-lg"
          >
            ☕ Buy Unkie Shane a Coffee
          </a>
        </div>

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          theme={theme}
          toggleTheme={toggleTheme}
          sound={sound}
          toggleSound={() => setSound(!sound)}
          brutalMode={brutalMode}
          toggleBrutalMode={() => setBrutalMode(!brutalMode)}
          targetGoal={targetGoal}
          setTargetGoal={setTargetGoal}
        />

        {newGameStage === 'confirm' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setNewGameStage('none')}>
            <div className="bg-bg border border-bust/30 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 left-0 w-full h-1 bg-bust"></div>
              <h2 className="text-2xl font-black text-text mb-2">New Game?</h2>
              <p className="text-subtext mb-6 text-sm font-bold">Current progress will be erased.</p>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-card-bg border border-white/5 mb-6 cursor-pointer hover:bg-white/10 transition-colors">
                <input type="checkbox" checked={clearPlayers} onChange={e => setClearPlayers(e.target.checked)} className="w-5 h-5 rounded border-gray-500 text-primary focus:ring-primary" />
                <span className="text-sm font-bold text-text">Clear player names</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setNewGameStage('none')} className="py-3 rounded-xl bg-white/10 font-black text-subtext hover:bg-white/20 uppercase text-xs">Cancel</button>
                <button onClick={() => setNewGameStage('select')} className="py-3 rounded-xl bg-bust text-white font-black hover:brightness-110 shadow-lg uppercase text-xs">Confirm</button>
              </div>
            </div>
          </div>
        )}

        {newGameStage === 'select' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setNewGameStage('none')}>
            <div className="bg-bg border border-primary/30 w-full max-w-sm rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-black text-text mb-6 text-center uppercase tracking-widest">Select Mode</h2>
              <div className="space-y-3">
                <button onClick={() => startGame(GameMode.ORIGINAL)} className="w-full text-left p-4 rounded-xl bg-card-bg border border-white/10 hover:border-primary/50 transition-all group">
                  <div className="font-black text-text group-hover:text-primary transition-colors text-sm">ORIGINAL</div>
                  <div className="text-[10px] text-subtext mt-1 font-bold uppercase">Standard deck.</div>
                </button>
                <button onClick={() => startGame(GameMode.VENGEANCE)} className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-bust/10 to-transparent border border-bust/20 hover:border-bust/50 transition-all group">
                  <div className="font-black text-text group-hover:text-bust transition-colors text-sm">VENGEANCE</div>
                  <div className="text-[10px] text-subtext mt-1 font-bold uppercase">"The Zero" & Negative modifiers.</div>
                </button>
                <button onClick={() => startGame(GameMode.COMBO)} className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-f7/10 to-transparent border border-f7/20 hover:border-f7/50 transition-all group">
                  <div className="font-black text-text group-hover:text-f7 transition-colors text-sm">COMBO</div>
                  <div className="text-[10px] text-subtext mt-1 font-bold uppercase">Double Decks. Maximum Chaos.</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (screen === 'stats') {
    return (
      <div
        className="min-h-screen p-6 bg-bg transition-colors duration-300"
        style={{
          paddingTop: 'calc(2rem + env(safe-area-inset-top, 44px))',
          paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 20px))'
        }}
      >
        <button onClick={() => setScreen('title')} className="mb-6 text-subtext font-black text-xs tracking-widest">← BACK</button>
        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-tighter">Match History</h2>
        <div className="space-y-2">
          {history.length === 0 ? <div className="text-subtext font-bold text-sm">No matches recorded.</div> : history.map((h, i) => (
            <div key={i} className="bg-card-bg p-4 rounded-xl border border-white/10 flex justify-between items-center shadow-sm">
              <div>
                <div className="font-black text-text text-lg">{h.winner}</div>
                <div className="text-[10px] text-subtext uppercase tracking-wide font-black">{h.date} • {GAME_MODE_LABELS[h.mode]}</div>
              </div>
              <div className="text-3xl font-black text-primary">{h.score}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col p-4 max-w-lg mx-auto bg-bg transition-colors duration-300"
      style={{
        paddingTop: 'calc(1rem + env(safe-area-inset-top, 44px))',
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 20px))'
      }}
    >
      <div className="glass-panel rounded-2xl p-4 mb-4 flex justify-between items-center bg-card-bg shadow-lg">
        <div>
          <h2 className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Round {round}</h2>
          <div className="text-[10px] text-subtext uppercase font-black">{GAME_MODE_LABELS[gameMode]}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">{theme === 'dark' ? '☀️' : '🌙'}</button>
          <button onClick={() => setScreen('title')} className="px-4 py-2 bg-primary text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:brightness-110">Menu</button>
        </div>
      </div>

      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="text-center p-8">
            <div className="text-7xl mb-6 animate-bounce">👑</div>
            <h1 className="text-5xl font-black text-primary mb-2 uppercase tracking-tight">{winner.name}</h1>
            <p className="text-xl text-white font-bold mb-8 opacity-80 uppercase tracking-widest">Wins with {winner.score} pts!</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setScreen('title')} className="px-8 py-5 bg-primary text-white dark:text-black font-black rounded-2xl hover:scale-105 transition-transform shadow-2xl uppercase tracking-widest">Finish Match</button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setWinner(null); setScreen('stats'); }} className="py-4 bg-white/10 text-white font-black rounded-2xl border border-white/10 uppercase text-[10px] tracking-widest">History</button>
                <button onClick={handleUndoRound} className="py-4 bg-bust/10 text-bust font-black rounded-2xl border border-bust/20 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                  <span className="text-lg">↺</span> Undo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto pb-32">
        {players.map((p, idx) => (
          <div key={p.id} className={`relative transition-all duration-300 ${p.busted ? (brutalMode ? 'opacity-80 scale-[0.98]' : 'opacity-30 grayscale scale-95') : ''}`}>
            <div className={`p-4 rounded-2xl border transition-colors shadow-sm ${p.score >= Math.max(...players.map(pl => pl.score)) && p.score > 0 ? 'border-primary bg-primary/5' : 'border-white/10 bg-card-bg'} ${p.busted && brutalMode ? 'border-bust/30' : ''}`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div onClick={() => setDealerIdx(idx)} className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all ${dealerIdx === idx ? 'bg-primary text-white dark:text-black border-primary shadow-[0_0_10px_rgba(64,196,255,0.3)]' : 'border-subtext/30 text-subtext cursor-pointer hover:border-subtext'}`}>D</div>
                  <div>
                    <div className="font-black text-text leading-none uppercase tracking-tight flex items-center gap-2">
                      {p.name}
                      {p.busted && brutalMode && <span className="text-[7px] bg-bust text-white px-1 rounded">BUSTED</span>}
                    </div>
                    <div className="text-4xl font-black text-primary leading-none mt-2">{p.score}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <button onClick={() => toggleBust(idx)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${p.busted ? 'bg-subtext/20 text-subtext' : 'bg-bust text-white shadow-lg shadow-bust/20'}`}>{p.busted ? 'Revive' : 'Bust'}</button>
                  <button
                    onClick={() => setCalcTarget(idx)}
                    disabled={p.busted && !brutalMode}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border min-w-[85px] justify-center transition-all shadow-md
                      ${p.isZeroRule ? 'bg-bust/20 border-bust animate-pulse' :
                        (p.busted && brutalMode) ? 'bg-primary/20 border-primary animate-pulse shadow-primary/20' :
                          'bg-white/5 border-white/10 hover:border-primary/50'}`}
                  >
                    {p.currentInput ? <span className="font-black text-text text-xl">{p.currentInput}</span> : <span className={`text-[9px] font-black uppercase tracking-wider ${p.busted && brutalMode ? 'text-primary' : 'text-subtext'}`}>Score It</span>}
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {p.isZeroRule && <span className="text-[8px] font-black px-2 py-1 rounded bg-bust text-white border border-bust shadow-[0_0_10px_rgba(255,82,82,0.4)] uppercase">ZEROED!</span>}
                {p.isFlip7 && <span className="text-[8px] font-black px-2 py-1 rounded bg-f7/20 text-f7 border border-f7/50 uppercase">Flip 7</span>}
                {p.isX2 && <span className="text-[8px] font-black px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 uppercase">x2</span>}
                {p.isDiv2 && <span className="text-[8px] font-black px-2 py-1 rounded bg-blue-500/20 text-blue-500 border border-blue-500/50 uppercase">÷2</span>}
                {p.bonusTotal !== 0 && <span className={`text-[8px] font-black px-2 py-1 rounded border uppercase ${p.bonusTotal > 0 ? 'bg-bonus/20 text-bonus border-bonus/50' : 'bg-bust/20 text-bust border-bust/50'}`}>{p.bonusTotal > 0 ? '+' : ''}{p.bonusTotal}</span>}
              </div>
            </div>
            <button onClick={() => removePlayer(idx)} className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-bust rounded-full text-white flex items-center justify-center text-xs font-black opacity-0 hover:opacity-100 transition-opacity shadow-lg">×</button>
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <input type="text" placeholder="Player Name..." className="flex-1 bg-card-bg border border-white/10 rounded-xl px-4 py-3 text-text text-sm font-bold focus:outline-none focus:border-primary transition-colors" onKeyDown={(e) => { if (e.key === 'Enter') { addPlayer(e.currentTarget.value); e.currentTarget.value = ''; } }} />
          <button onClick={(e) => { const input = e.currentTarget.previousElementSibling as HTMLInputElement; addPlayer(input.value); input.value = ''; }} className="bg-primary text-white dark:text-black px-6 rounded-xl font-black text-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all">+</button>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,20px))] bg-gradient-to-t from-bg via-bg to-transparent pointer-events-none"

      >
        <div className="max-w-lg mx-auto pointer-events-auto">
          <button onClick={submitRound} className="w-full bg-primary text-white dark:text-black font-black text-lg py-5 rounded-2xl shadow-2xl shadow-primary/20 active:scale-95 transition-all hover:brightness-110 uppercase tracking-widest">
            Finish Round
          </button>
        </div>
      </div>

      {calcTarget !== null && (
        <div className="fixed inset-0 z-[100] bg-bg flex flex-col animate-in slide-in-from-bottom duration-300 h-[100dvh]">
          <Calculator
            mode={gameMode}
            playerName={players[calcTarget].name}
            onClose={() => setCalcTarget(null)}
            onSubmit={handleCalcSubmit}
            theme={theme}
            toggleTheme={toggleTheme}
            isBrutalMode={brutalMode}
            players={players.filter((_, i) => i !== calcTarget)} // Pass other players for targeting
          />
        </div>
      )}
    </div>
  );
};

export default App;

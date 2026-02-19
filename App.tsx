import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyNote, ViewMode, Goal, Mantra } from './types';
import DailyEditor from './components/DailyEditor';
import StatsView from './components/StatsView';
import GoalsView from './components/GoalsView';
import MantrasView from './components/MantrasView';
import MonkIcon from './components/MonkIcon';

const STORAGE_KEY = 'zen_notes_data';
const GOALS_KEY = 'zen_goals_data';
const MANTRAS_KEY = 'zen_mantras_data';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [allNotes, setAllNotes] = useState<Record<string, DailyNote>>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [mantras, setMantras] = useState<Mantra[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) { try { setAllNotes(JSON.parse(savedNotes)); } catch (e) { console.error(e); } }
    const savedGoals = localStorage.getItem(GOALS_KEY);
    if (savedGoals) { try { setGoals(JSON.parse(savedGoals)); } catch (e) { console.error(e); } }
    const savedMantras = localStorage.getItem(MANTRAS_KEY);
    if (savedMantras) { try { setMantras(JSON.parse(savedMantras)); } catch (e) { console.error(e); } }
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes)); }, [allNotes]);
  useEffect(() => { localStorage.setItem(GOALS_KEY, JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem(MANTRAS_KEY, JSON.stringify(mantras)); }, [mantras]);

  const updateDailyNote = useCallback((date: string, data: Partial<DailyNote>) => {
    setAllNotes(prev => {
      const existing = prev[date] || { date, learning: '', shortcomings: '', practices: [] };
      return { ...prev, [date]: { ...existing, ...data } };
    });
  }, []);

  const historyPracticeNames = useMemo(() => {
    const names = new Set<string>();
    Object.values(allNotes).forEach((note: DailyNote) => {
      note.practices.forEach(p => { if (p.name.trim()) names.add(p.name.trim()); });
    });
    return Array.from(names);
  }, [allNotes]);

  const addGoal = (goal: Goal) => setGoals(prev => [...prev, goal]);
  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));
  
  const addMantra = (mantra: Mantra) => setMantras(prev => [...prev, mantra]);
  const deleteMantra = (id: string) => setMantras(prev => prev.filter(m => m.id !== id));
  const updateMantra = (updatedMantra: Mantra) => setMantras(prev => prev.map(m => m.id === updatedMantra.id ? updatedMantra : m));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="oak-nav sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setViewMode('daily')}>
            <div className="w-11 h-11 rounded-2xl bg-white/60 border border-[#d2b48c]/30 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <MonkIcon className="w-9 h-9" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-[#4a3728] tracking-widest leading-none">修行日記</h1>
              <span className="text-[10px] text-[#8b7355] font-bold uppercase tracking-[0.2em] mt-1">Light Oak Journal</span>
            </div>
          </div>
          
          <nav className="flex space-x-1.5 bg-[#8b7355]/5 p-1 rounded-2xl">
            {(['daily', 'mantras', 'goals', 'stats'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  viewMode === mode 
                  ? 'bg-[#8b7355] text-white shadow-md' 
                  : 'text-[#8b7355] hover:bg-white/50'
                }`}
              >
                {mode === 'daily' ? '今日' : mode === 'mantras' ? '咒語' : mode === 'goals' ? '目標' : '統計'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:py-12">
        {viewMode === 'daily' && (
          <DailyEditor 
            date={currentDate} 
            onDateChange={setCurrentDate}
            note={allNotes[currentDate] || { date: currentDate, learning: '', shortcomings: '', practices: [] }}
            onSave={(data) => updateDailyNote(currentDate, data)}
            historyPracticeNames={historyPracticeNames}
            mantras={mantras}
          />
        )}
        {viewMode === 'mantras' && (
          <MantrasView
            allNotes={allNotes}
            mantras={mantras}
            onAddMantra={addMantra}
            onDeleteMantra={deleteMantra}
            onUpdateMantra={updateMantra}
          />
        )}
        {viewMode === 'goals' && (
          <GoalsView 
            allNotes={allNotes} 
            goals={goals} 
            onAddGoal={addGoal} 
            onDeleteGoal={deleteGoal} 
          />
        )}
        {viewMode === 'stats' && (
          <StatsView allNotes={allNotes} />
        )}
      </main>

      <footer className="py-12 text-center text-[#8b7355]/60 text-xs flex flex-col items-center">
        <MonkIcon className="w-10 h-10 opacity-30 mb-4 grayscale" />
        <p className="tracking-[0.3em] font-black uppercase mb-1">修行日記</p>
      </footer>
    </div>
  );
};

export default App;
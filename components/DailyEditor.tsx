import React, { useState } from 'react';
import { DailyNote, PracticeItem, Mantra } from '../types';

interface DailyEditorProps {
  date: string;
  onDateChange: (date: string) => void;
  note: DailyNote;
  onSave: (data: Partial<DailyNote>) => void;
  historyPracticeNames?: string[];
  mantras?: Mantra[];
}

const DailyEditor: React.FC<DailyEditorProps> = ({ 
  date, 
  onDateChange, 
  note, 
  onSave, 
  mantras = [] 
}) => {
  const [newPracticeName, setNewPracticeName] = useState('');

  const handleTextChange = (field: 'learning' | 'shortcomings', value: string) => {
    onSave({ [field]: value });
  };

  const updatePractice = (id: string, updates: Partial<PracticeItem>) => {
    const newPractices = note.practices.map(p => p.id === id ? { ...p, ...updates } : p);
    onSave({ practices: newPractices });
  };

  const addPractice = (nameOverride?: string) => {
    const nameToAdd = (nameOverride || newPracticeName).trim();
    if (!nameToAdd) return;
    if (note.practices.some(p => p.name === nameToAdd)) {
      setNewPracticeName('');
      return;
    }
    const newItem: PracticeItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: nameToAdd,
      count: 0
    };
    onSave({ practices: [...note.practices, newItem] });
    setNewPracticeName('');
  };

  const removePractice = (id: string) => {
    onSave({ practices: note.practices.filter(p => p.id !== id) });
  };

  const changeDay = (offset: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + offset);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const mantraShortcuts = mantras.filter(m => !note.practices.some(p => p.name === m.name));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Date Navigation */}
      <div className="paper-card p-6 rounded-[2.5rem] flex items-center justify-between border-b-2 border-[#d2b48c]/20">
        <button onClick={() => changeDay(-1)} className="w-11 h-11 flex items-center justify-center bg-[#d2b48c]/10 hover:bg-[#d2b48c]/20 rounded-2xl text-[#8b7355] transition-all">
          <i className="fa-solid fa-angle-left"></i>
        </button>
        <div className="flex flex-col items-center">
          <input 
            type="date" 
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-2xl font-black text-[#4a3728] bg-transparent border-none focus:ring-0 text-center cursor-pointer"
          />
          <span className="text-[10px] text-[#8b7355] font-black tracking-[0.4em] uppercase mt-1">
            {new Date(date).toLocaleDateString('zh-TW', { weekday: 'long' })}
          </span>
        </div>
        <button onClick={() => changeDay(1)} className="w-11 h-11 flex items-center justify-center bg-[#d2b48c]/10 hover:bg-[#d2b48c]/20 rounded-2xl text-[#8b7355] transition-all">
          <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Practice Section */}
        <section className="paper-card rounded-[2.5rem] flex flex-col h-full">
          <div className="p-6 border-b border-[#d2b48c]/10 bg-[#f4e4bc]/10 flex items-center justify-between">
            <h2 className="font-black text-[#4a3728] flex items-center tracking-widest text-base">
              <i className="fa-solid fa-leaf mr-3 text-[#d2b48c]"></i>
              每日功課
            </h2>
            <span className="text-xs font-black text-white bg-[#d2b48c] px-3 py-1 rounded-full shadow-sm">
              {note.practices.length}
            </span>
          </div>
          
          <div className="p-6 flex-grow space-y-4 max-h-[550px] overflow-y-auto z-10">
            {note.practices.length === 0 ? (
              <div className="text-center py-20 text-[#8b7355]/30 italic text-sm font-medium">
                尚未記錄功課，開始積累功德...
              </div>
            ) : (
              note.practices.map(item => (
                <div key={item.id} className="group bg-white p-5 rounded-3xl border border-[#d2b48c]/10 hover:border-[#d2b48c]/40 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-black text-[#4a3728] tracking-wide">{item.name}</p>
                    <button onClick={() => removePractice(item.id)} className="text-[#d2b48c] hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="fa-solid fa-times text-sm"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => updatePractice(item.id, { count: Math.max(0, item.count - 100) })} className="px-2 h-9 rounded-xl border border-[#d2b48c]/20 text-[10px] font-black text-[#8b7355] hover:bg-rose-50 transition-all">-100</button>
                    <button onClick={() => updatePractice(item.id, { count: Math.max(0, item.count - 1) })} className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#d2b48c]/20 text-[#8b7355] hover:bg-rose-50 transition-all"><i className="fa-solid fa-minus text-[10px]"></i></button>
                    <input 
                      type="number"
                      value={item.count}
                      onChange={(e) => updatePractice(item.id, { count: parseInt(e.target.value) || 0 })}
                      className="flex-grow text-center font-black text-2xl text-[#4a3728] bg-transparent border-none focus:ring-0"
                    />
                    <button onClick={() => updatePractice(item.id, { count: item.count + 1 })} className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#d2b48c]/20 text-[#8b7355] hover:bg-emerald-50 transition-all"><i className="fa-solid fa-plus text-[10px]"></i></button>
                    <button onClick={() => updatePractice(item.id, { count: item.count + 100 })} className="px-2 h-9 rounded-xl border border-[#d2b48c]/20 text-[10px] font-black text-[#8b7355] hover:bg-emerald-50 transition-all">+100</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-[#f4e4bc]/5 border-t border-[#d2b48c]/10 space-y-5 z-10">
            {mantraShortcuts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mantraShortcuts.slice(0, 4).map(m => (
                  <button key={m.id} onClick={() => addPractice(m.name)} className="text-[10px] font-black bg-white text-[#8b7355] px-3 py-2 rounded-xl border border-[#d2b48c]/20 hover:bg-[#8b7355] hover:text-white transition-all shadow-sm">
                    + {m.name}
                  </button>
                ))}
              </div>
            )}
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="新增功課項目..."
                value={newPracticeName}
                onChange={(e) => setNewPracticeName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPractice()}
                className="flex-grow bg-white border border-[#d2b48c]/20 rounded-2xl px-5 py-3 text-sm text-[#4a3728] outline-none shadow-sm focus:ring-1 focus:ring-[#d2b48c]"
              />
              <button onClick={() => addPractice()} className="bg-[#8b7355] text-white w-12 h-12 rounded-2xl hover:bg-[#4a3728] transition-all shadow-md flex items-center justify-center">
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </section>

        {/* Notes Section */}
        <div className="space-y-8">
          <section className="paper-card rounded-[2.5rem] flex flex-col h-[320px] border-b-2 border-amber-500/10">
            <div className="p-5 border-b border-[#d2b48c]/10 bg-amber-50/30 flex items-center">
              <h2 className="font-black text-[#4a3728] flex items-center text-sm tracking-[0.2em] uppercase">
                <i className="fa-solid fa-pen-fancy mr-3 text-[#d2b48c]"></i>
                今日學習
              </h2>
            </div>
            <textarea
              placeholder="今日所學所見，筆記於此..."
              value={note.learning}
              onChange={(e) => handleTextChange('learning', e.target.value)}
              className="p-6 flex-grow w-full resize-none bg-transparent border-none focus:ring-0 text-[#4a3728] leading-[1.8] placeholder:text-[#8b7355]/30 font-medium z-10"
            ></textarea>
          </section>

          <section className="paper-card rounded-[2.5rem] flex flex-col h-[320px] border-b-2 border-rose-500/10">
            <div className="p-5 border-b border-[#d2b48c]/10 bg-rose-50/30 flex items-center">
              <h2 className="font-black text-[#4a3728] flex items-center text-sm tracking-[0.2em] uppercase">
                <i className="fa-solid fa-heart mr-3 text-[#d2b48c]"></i>
                反思不足
              </h2>
            </div>
            <textarea
              placeholder="今日言行，是否有需改進之處？"
              value={note.shortcomings}
              onChange={(e) => handleTextChange('shortcomings', e.target.value)}
              className="p-6 flex-grow w-full resize-none bg-transparent border-none focus:ring-0 text-[#4a3728] leading-[1.8] placeholder:text-[#8b7355]/30 font-medium z-10"
            ></textarea>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DailyEditor;
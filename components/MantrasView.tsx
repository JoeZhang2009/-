import React, { useState, useMemo } from 'react';
import { DailyNote, Mantra } from '../types';
import MonkIcon from './MonkIcon';

interface MantrasViewProps {
  allNotes: Record<string, DailyNote>;
  mantras: Mantra[];
  onAddMantra: (mantra: Mantra) => void;
  onDeleteMantra: (id: string) => void;
  onUpdateMantra: (mantra: Mantra) => void;
}

const MantrasView: React.FC<MantrasViewProps> = ({ 
  allNotes, 
  mantras, 
  onAddMantra, 
  onDeleteMantra, 
  onUpdateMantra 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', pronunciation: '' });
  const [formData, setFormData] = useState({ name: '', pronunciation: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onAddMantra({
      id: Date.now().toString(),
      name: formData.name.trim(),
      pronunciation: formData.pronunciation.trim(),
      initialCount: 0,
      createdAt: Date.now()
    });
    setFormData({ name: '', pronunciation: '' });
    setIsAdding(false);
  };

  const handleStartEdit = (m: Mantra) => {
    setEditingId(m.id);
    setEditFormData({ name: m.name, pronunciation: m.pronunciation });
  };

  const handleSaveEdit = (m: Mantra) => {
    if (!editFormData.name.trim()) return;
    onUpdateMantra({ ...m, name: editFormData.name.trim(), pronunciation: editFormData.pronunciation.trim() });
    setEditingId(null);
  };

  const mantraStats = useMemo(() => {
    return mantras.map(m => {
      let dailySum = 0;
      Object.values(allNotes).forEach((note: DailyNote) => {
        const item = note.practices.find(p => p.name === m.name);
        if (item) dailySum += item.count;
      });
      return { ...m, totalCount: dailySum };
    });
  }, [allNotes, mantras]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#4a3728] flex items-center tracking-widest">
          <i className="fa-solid fa-book mr-3.5 text-[#d2b48c]"></i>
          咒語寶典
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all shadow-sm ${
            isAdding ? 'bg-white text-[#8b7355] border border-[#d2b48c]/30' : 'bg-[#8b7355] text-white hover:bg-[#4a3728]'
          }`}
        >
          {isAdding ? '取消' : '＋ 新增咒語'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="paper-card p-6 rounded-[2rem] space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <input required type="text" placeholder="咒語名稱" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white border border-[#d2b48c]/30 rounded-2xl px-4 py-3 text-sm text-[#4a3728] outline-none" />
            <input type="text" placeholder="念法或提示" value={formData.pronunciation} onChange={e => setFormData({...formData, pronunciation: e.target.value})} className="bg-white border border-[#d2b48c]/30 rounded-2xl px-4 py-3 text-sm text-[#4a3728] outline-none" />
          </div>
          <button type="submit" className="w-full relative z-10 bg-[#8b7355] text-white font-black py-3 rounded-2xl hover:bg-[#4a3728] transition-all">儲存到寶典</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mantraStats.length === 0 ? (
          <div className="col-span-full py-24 text-center paper-card rounded-[2rem] border-dashed border-2 border-[#d2b48c]/20">
            <MonkIcon className="w-20 h-20 opacity-10 mx-auto mb-6 grayscale" />
            <p className="text-[#8b7355]/30 font-bold tracking-widest">目前尚無收藏任何咒語</p>
          </div>
        ) : (
          mantraStats.map(m => (
            <div key={m.id} className="paper-card rounded-[2rem] p-6 hover:shadow-lg transition-all group border-b-2 border-[#d2b48c]/20">
              <div className="absolute -right-6 -bottom-6 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-700 pointer-events-none">
                <MonkIcon className="w-48 h-48" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    {editingId === m.id ? (
                      <input type="text" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="bg-white border border-[#d2b48c]/30 rounded-lg px-2 py-1 text-lg font-black text-[#4a3728]" />
                    ) : (
                      <h3 className="text-xl font-black text-[#4a3728] tracking-wider mb-1">{m.name}</h3>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    {editingId === m.id ? (
                      <button onClick={() => handleSaveEdit(m)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><i className="fa-solid fa-check"></i></button>
                    ) : (
                      <button onClick={() => handleStartEdit(m)} className="p-2 text-[#d2b48c] hover:text-[#8b7355] transition-colors"><i className="fa-solid fa-edit"></i></button>
                    )}
                    <button onClick={() => onDeleteMantra(m.id)} className="p-2 text-[#d2b48c] hover:text-rose-400 transition-colors"><i className="fa-solid fa-trash"></i></button>
                  </div>
                </div>

                <div className="bg-[#d2b48c]/5 rounded-2xl p-5 mb-8 text-center italic border border-[#d2b48c]/10">
                  {editingId === m.id ? (
                    <input type="text" value={editFormData.pronunciation} onChange={e => setEditFormData({...editFormData, pronunciation: e.target.value})} className="w-full bg-white text-center border rounded-lg px-2" />
                  ) : (
                    <p className="text-[#8b7355] text-lg font-medium">{m.pronunciation || '（無記錄）'}</p>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-[#d2b48c]/10 flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-[#d2b48c] uppercase tracking-widest">累計次數</p>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-3xl font-black text-[#4a3728] tabular-nums">{m.totalCount.toLocaleString()}</span>
                      <span className="text-[#8b7355] text-xs font-bold">遍</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MantrasView;
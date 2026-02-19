import React, { useState, useMemo } from 'react';
import { DailyNote, Goal } from '../types';

interface GoalsViewProps {
  allNotes: Record<string, DailyNote>;
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ allNotes, goals, onAddGoal, onDeleteGoal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [noDeadline, setNoDeadline] = useState(false);
  const [newGoal, setNewGoal] = useState({
    itemName: '',
    targetCount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.itemName || !newGoal.targetCount || !newGoal.startDate) return;
    if (!noDeadline && !newGoal.endDate) return;

    const goal: Goal = {
      id: Date.now().toString(),
      itemName: newGoal.itemName,
      targetCount: parseInt(newGoal.targetCount),
      startDate: newGoal.startDate,
      endDate: noDeadline ? undefined : newGoal.endDate,
      createdAt: Date.now()
    };

    onAddGoal(goal);
    setIsAdding(false);
    setNoDeadline(false);
    setNewGoal({
      itemName: '',
      targetCount: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
  };

  const goalItems = useMemo(() => {
    return goals.map(goal => {
      let currentProgress = 0;
      Object.keys(allNotes).forEach(date => {
        const isAfterStart = date >= goal.startDate;
        const isBeforeEnd = goal.endDate ? date <= goal.endDate : true;
        
        if (isAfterStart && isBeforeEnd) {
          const count = allNotes[date].practices.find(p => p.name === goal.itemName)?.count || 0;
          currentProgress += count;
        }
      });

      const isCompleted = currentProgress >= goal.targetCount;
      const hasDeadline = !!goal.endDate;
      
      let remainingDays: number | null = null;
      if (goal.endDate) {
        const today = new Date().toISOString().split('T')[0];
        const end = new Date(goal.endDate);
        const start = new Date(today);
        const diffTime = end.getTime() - start.getTime();
        remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        ...goal,
        currentProgress,
        isCompleted,
        hasDeadline,
        remainingDays
      };
    });
  }, [allNotes, goals]);

  const renderGoalCard = (goal: any) => {
    const progressPercent = Math.min(100, Math.round((goal.currentProgress / goal.targetCount) * 100));
    const themeClass = goal.isCompleted 
      ? "bg-[#fdfdfa] border-[#8b7355]/40" 
      : "bg-[#fdfdfa] border-[#d2b48c]/20 shadow-sm";
    const iconClass = goal.isCompleted ? "text-emerald-600 bg-emerald-50" : "text-[#8b7355] bg-[#f4e4bc]/50";
    const progressColor = goal.isCompleted ? "bg-emerald-500" : "bg-[#8b7355]";

    return (
      <div key={goal.id} className={`${themeClass} border-2 rounded-[2rem] p-6 relative overflow-hidden group transition-all hover:shadow-md paper-card`}>
        <div className="absolute top-0 right-0 p-4">
          <button 
            onClick={() => onDeleteGoal(goal.id)}
            className="text-[#d2b48c] hover:text-rose-500 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="flex items-center space-x-4 mb-6 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconClass} shadow-inner`}>
            <i className={`fa-solid ${goal.isCompleted ? 'fa-award' : 'fa-bullseye'}`}></i>
          </div>
          <div>
            <h4 className={`font-black text-lg ${goal.isCompleted ? 'text-emerald-900' : 'text-[#4a3728]'}`}>{goal.itemName}</h4>
            <p className="text-[10px] text-[#8b7355] font-black tracking-widest uppercase mt-0.5">
              {goal.startDate} {goal.endDate ? `— ${goal.endDate}` : '(無期限)'}
            </p>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-[#8b7355] uppercase tracking-wider">修進度</p>
              <p className={`text-2xl font-black tabular-nums ${goal.isCompleted ? 'text-emerald-600' : 'text-[#4a3728]'}`}>
                {goal.currentProgress.toLocaleString()}
                <span className="text-[#d2b48c] text-sm font-bold ml-1.5">/ {goal.targetCount.toLocaleString()}</span>
              </p>
            </div>
            <div className="text-right">
              {!goal.isCompleted && goal.hasDeadline && (
                <p className="text-[10px] text-amber-700 font-black mb-1 uppercase tracking-tighter">
                  {goal.remainingDays! >= 0 ? `尚餘 ${goal.remainingDays} 日` : '已逾期'}
                </p>
              )}
              {goal.isCompleted && <p className="text-[10px] text-emerald-600 font-black mb-1 uppercase tracking-widest">已圓滿</p>}
              <p className={`text-xl font-black ${goal.isCompleted ? 'text-emerald-500' : 'text-[#8b7355]'}`}>{progressPercent}%</p>
            </div>
          </div>

          <div className={`w-full h-2.5 rounded-full overflow-hidden bg-[#d2b48c]/10`}>
            <div 
              className={`h-full transition-all duration-1000 ease-out ${progressColor} shadow-sm`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title: string, subtitle: string, items: any[], emptyMsg: string, icon: string) => (
    <div className="space-y-6 mb-12">
      <div className="flex items-center space-x-3 border-b border-[#d2b48c]/20 pb-3">
        <i className={`fa-solid ${icon} text-[#d2b48c] text-lg`}></i>
        <h3 className="text-lg font-black text-[#4a3728] tracking-widest">{title}</h3>
        <span className="text-[10px] font-black text-[#8b7355] bg-white px-2 py-0.5 rounded-lg shadow-sm border border-[#d2b48c]/10 uppercase tracking-widest">{subtitle} ({items.length})</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#f4e4bc]/10 rounded-[2rem] border-dashed border-2 border-[#d2b48c]/20 text-[#8b7355]/40 text-sm font-bold tracking-widest">
            {emptyMsg}
          </div>
        ) : (
          items.map(goal => renderGoalCard(goal))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#4a3728] flex items-center tracking-widest">
          <i className="fa-solid fa-map mr-4 text-[#d2b48c]"></i>
          修行目標
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all flex items-center shadow-sm ${
            isAdding ? 'bg-white text-[#8b7355] border border-[#d2b48c]/30' : 'bg-[#8b7355] text-white hover:bg-[#4a3728]'
          }`}
        >
          <i className={`fa-solid ${isAdding ? 'fa-xmark' : 'fa-plus'} mr-2`}></i>
          {isAdding ? '取消添加' : '添加新目標'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="paper-card p-8 rounded-[2.5rem] space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#8b7355] uppercase tracking-widest ml-1">功課名稱</label>
              <input 
                required
                type="text" 
                placeholder="例如：普門品"
                value={newGoal.itemName}
                onChange={e => setNewGoal({...newGoal, itemName: e.target.value})}
                className="w-full bg-white border border-[#d2b48c]/30 rounded-2xl px-5 py-3 text-sm text-[#4a3728] outline-none shadow-sm focus:ring-1 focus:ring-[#d2b48c]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#8b7355] uppercase tracking-widest ml-1">目標遍數</label>
              <input 
                required
                type="number" 
                placeholder="例如：1000"
                value={newGoal.targetCount}
                onChange={e => setNewGoal({...newGoal, targetCount: e.target.value})}
                className="w-full bg-white border border-[#d2b48c]/30 rounded-2xl px-5 py-3 text-sm text-[#4a3728] outline-none shadow-sm focus:ring-1 focus:ring-[#d2b48c]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#8b7355] uppercase tracking-widest ml-1">開始日期</label>
              <input 
                required
                type="date" 
                value={newGoal.startDate}
                onChange={e => setNewGoal({...newGoal, startDate: e.target.value})}
                className="w-full bg-white border border-[#d2b48c]/30 rounded-2xl px-5 py-3 text-sm text-[#4a3728] outline-none shadow-sm focus:ring-1 focus:ring-[#d2b48c]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-[#8b7355] uppercase tracking-widest">結束日期</label>
                <label className="flex items-center text-[10px] font-black text-[#8b7355] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={noDeadline} 
                    onChange={e => setNoDeadline(e.target.checked)}
                    className="mr-1.5 rounded text-[#8b7355] focus:ring-[#d2b48c]"
                  />
                  無期限
                </label>
              </div>
              <input 
                required={!noDeadline}
                disabled={noDeadline}
                type="date" 
                value={newGoal.endDate}
                onChange={e => setNewGoal({...newGoal, endDate: e.target.value})}
                className={`w-full border rounded-2xl px-5 py-3 text-sm outline-none transition-all shadow-sm ${
                  noDeadline ? 'bg-[#f4e4bc]/20 text-[#8b7355]/30 border-transparent' : 'bg-white border-[#d2b48c]/30 text-[#4a3728] focus:ring-1 focus:ring-[#d2b48c]'
                }`}
              />
            </div>
          </div>
          <button type="submit" className="w-full relative z-10 bg-[#8b7355] text-white font-black py-4 rounded-2xl hover:bg-[#4a3728] transition-all shadow-md">
            立下誓願，開始修行
          </button>
        </form>
      )}

      {/* Section 1: Timed Goals */}
      <div className="pt-8">
        <h3 className="text-sm font-black text-[#8b7355] mb-4 uppercase tracking-[0.2em] px-1 flex items-center">
          <i className="fa-solid fa-clock mr-2 opacity-50"></i> 限時完成
        </h3>
        {renderSection(
          "未完成", 
          "Incomplete", 
          goalItems.filter(g => g.hasDeadline && !g.isCompleted), 
          "目前尚無未完成的限時項目",
          "fa-hourglass-half"
        )}
        {renderSection(
          "已完成", 
          "Completed", 
          goalItems.filter(g => g.hasDeadline && g.isCompleted), 
          "尚未有已完成的限時項目",
          "fa-circle-check"
        )}
      </div>

      {/* Section 2: Perpetual Goals */}
      <div className="pt-10 border-t border-[#d2b48c]/20">
        <h3 className="text-sm font-black text-[#8b7355] mb-4 uppercase tracking-[0.2em] px-1 flex items-center">
          <i className="fa-solid fa-infinity mr-2 opacity-50"></i> 不限時完成
        </h3>
        {renderSection(
          "未完成", 
          "Incomplete", 
          goalItems.filter(g => !g.hasDeadline && !g.isCompleted), 
          "目前尚無未完成的長期項目",
          "fa-rotate"
        )}
        {renderSection(
          "已完成", 
          "Completed", 
          goalItems.filter(g => !g.hasDeadline && g.isCompleted), 
          "尚未有已完成的長期項目",
          "fa-certificate"
        )}
      </div>
    </div>
  );
};

export default GoalsView;
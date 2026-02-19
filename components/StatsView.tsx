import React, { useState, useMemo } from 'react';
import { DailyNote } from '../types';

interface StatsViewProps {
  allNotes: Record<string, DailyNote>;
}

const StatsView: React.FC<StatsViewProps> = ({ allNotes }) => {
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);

  const statsResults = useMemo(() => {
    const results: Record<string, { total: number; days: Set<string> }> = {};

    Object.keys(allNotes).forEach((date) => {
      const note = allNotes[date];
      if (date >= startDate && date <= endDate) {
        note.practices.forEach(p => {
          if (!results[p.name]) {
            results[p.name] = { total: 0, days: new Set() };
          }
          results[p.name].total += p.count;
          if (p.count > 0) {
            results[p.name].days.add(date);
          }
        });
      }
    });

    return Object.entries(results).map(([name, data]) => ({
      itemName: name,
      totalCount: data.total,
      daysActive: data.days.size
    })).sort((a, b) => b.totalCount - a.totalCount);
  }, [allNotes, startDate, endDate]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Date Range Selector */}
      <div className="paper-card p-8 rounded-3xl border-b-4 border-[#c4a484]/40">
        <h2 className="text-xl font-black text-[#3e2723] mb-8 flex items-center tracking-widest">
          <i className="fa-solid fa-chart-line mr-3.5 text-[#d97706]"></i>
          功課總結
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-6 items-end z-10 relative">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-[#8d6e63] uppercase tracking-widest flex items-center">
              <i className="fa-solid fa-calendar mr-2"></i>
              開始日期
            </label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white border border-[#c4a484]/40 rounded-xl px-4 py-2.5 text-sm text-[#3e2723] focus:ring-2 focus:ring-[#5d4037] outline-none transition-all"
            />
          </div>

          <div className="hidden sm:block pb-3.5 text-[#c4a484]">
            <i className="fa-solid fa-arrow-right"></i>
          </div>

          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-[#8d6e63] uppercase tracking-widest flex items-center">
              <i className="fa-solid fa-calendar-check mr-2"></i>
              結束日期
            </label>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-white border border-[#c4a484]/40 rounded-xl px-4 py-2.5 text-sm text-[#3e2723] focus:ring-2 focus:ring-[#5d4037] outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsResults.length === 0 ? (
          <div className="col-span-full py-24 text-center paper-card rounded-3xl border-dashed border-2 border-[#c4a484]/40 text-[#8d6e63]/50">
            <i className="fa-regular fa-folder-open text-4xl mb-4 opacity-20"></i>
            <p className="font-bold tracking-widest">目前範圍內無記錄</p>
          </div>
        ) : (
          statsResults.map(stat => (
            <div key={stat.itemName} className="paper-card p-6 rounded-2xl hover:shadow-2xl transition-all group border-b-2 border-[#c4a484]/20">
              <h3 className="text-[#3e2723] text-sm font-black mb-4 tracking-wider truncate border-b border-[#c4a484]/10 pb-2">
                {stat.itemName}
              </h3>
              
              <div className="flex items-baseline space-x-2 mb-6">
                <span className="text-3xl font-black text-[#3e2723] tabular-nums">
                  {stat.totalCount.toLocaleString()}
                </span>
                <span className="text-[#8d6e63] text-[10px] font-bold uppercase tracking-widest">總計</span>
              </div>
              
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#8d6e63] bg-[#5d4037]/5 rounded-lg px-3 py-2">
                  <span>累計天數</span>
                  <span className="text-[#3e2723]">{stat.daysActive} 天</span>
                </div>
                
                {stat.daysActive > 0 && (
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#8d6e63] bg-[#d97706]/5 rounded-lg px-3 py-2">
                    <span>平均日數</span>
                    <span className="text-[#d97706]">
                      {Math.round(stat.totalCount / stat.daysActive).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StatsView;
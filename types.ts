
export interface PracticeItem {
  id: string;
  name: string;
  count: number;
}

export interface DailyNote {
  date: string; // ISO date string YYYY-MM-DD
  learning: string;
  shortcomings: string;
  practices: PracticeItem[];
}

export interface Goal {
  id: string;
  itemName: string;
  targetCount: number;
  startDate: string;
  endDate?: string; // 選填，若無則為無時間限制
  createdAt: number;
}

export interface Mantra {
  id: string;
  name: string;
  pronunciation: string;
  initialCount: number;
  createdAt: number;
}

export type ViewMode = 'daily' | 'stats' | 'goals' | 'mantras';

export interface StatsResult {
  itemName: string;
  totalCount: number;
  daysActive: number;
}

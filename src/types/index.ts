export type BreakType = 'ALONGAMENTO' | 'HIDRATACAO' | 'DESCANSO_VISUAL';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface BreakDTO {
  id: number;
  breakType: BreakType;
  durationSeconds: number;
  durationFormatted: string;
  user: User;
  dateTime?: string; 
  createdAt?: string;
  updatedAt?: string;
}

export interface RequestBreakDTO {
  userId: number;
  breakType: BreakType;
  durationSeconds: number;
}

export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface BreakTypeConfig {
  type: BreakType;
  label: string;
  icon: string;
  color: string;
  gradient: string[];
  benefit: string;
}

export interface UserStats {
  totalBreaks: number;
  totalMinutes: number;
  todayBreaks: number;
  weeklyBreaks: number;
  monthlyBreaks: number;
  averagePerDay: number;
  longestStreak: number;
  currentStreak: number;
  byType: Record<BreakType, number>;
}

export interface FormattedDateTime {
  date: string;
  time: string;
  dayOfWeek: string;
  relative: string; 
}
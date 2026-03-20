import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { TOTAL_RUKUS, TARAWEEH_27_NIGHT_RUKUS } from './quran-data';

export type ProgressMode = 'ruku';
export type StrategyMode = 'balanced' | 'front' | 'back' | 'custom' | 'taraweeh' | 'custom_plan';

export interface DailyLog {
  day: number;
  unitsCompleted: number;
  timestamp: number;
}

export interface ReadingSession {
  id: string;
  timestamp: number;
  dateStr: string;
  timeLabel: string;
  unitsRead: number;
  startUnit: number;
  endUnit: number;
  ramadanDay?: number;
}

export interface UserState {
  isOnboarded: boolean;
  ramadanTotalDays: number;
  currentRamadanDay: number;
  targetCompletionDay: number;
  progressMode: ProgressMode;
  strategyMode: StrategyMode;
  customDailyTarget: number;
  customTotalDays: number;
  weekendHeavy: boolean;
  customStartDate: string | null;
  currentTotalCompleted: number;
  logs: DailyLog[];
  sessions: ReadingSession[];
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
}

const INITIAL_STATE: UserState = {
  isOnboarded: false,
  ramadanTotalDays: 30,
  currentRamadanDay: 1,
  targetCompletionDay: 30,
  progressMode: 'ruku',
  strategyMode: 'balanced',
  customDailyTarget: 20,
  customTotalDays: 30,
  weekendHeavy: false,
  customStartDate: null,
  currentTotalCompleted: 0,
  logs: [],
  sessions: [],
  currentStreak: 0,
  longestStreak: 0,
  lastLogDate: null
};

const STORAGE_KEY = 'ramadan_planner_state';

function getPrayerTimeLabel(date: Date): string {
  const hour = date.getHours();
  if (hour >= 0 && hour < 5) return 'Tahajjud (Late Night)';
  if (hour >= 5 && hour < 7) return 'Fajr';
  if (hour >= 7 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 16) return 'Zohr';
  if (hour >= 16 && hour < 19) return 'Asr';
  if (hour >= 19 && hour < 21) return 'Maghrib';
  return 'Isha';
}

function loadState(): UserState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.sessions) parsed.sessions = [];
      if (!parsed.targetCompletionDay) parsed.targetCompletionDay = parsed.ramadanTotalDays || 30;
      parsed.progressMode = 'ruku';
      return { ...INITIAL_STATE, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
  return INITIAL_STATE;
}

function saveState(state: UserState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calculateStreak(logs: DailyLog[]): { current: number; longest: number } {
  if (logs.length === 0) return { current: 0, longest: 0 };
  const sorted = [...logs].sort((a, b) => a.day - b.day);
  let tempStreak = 0;
  let maxStreak = 0;
  let lastDay = -1;

  for (const log of sorted) {
    if (log.unitsCompleted >= 0) {
      if (lastDay === -1 || log.day === lastDay + 1) {
        tempStreak++;
      } else if (log.day !== lastDay) {
        tempStreak = 1;
      }
      lastDay = log.day;
      maxStreak = Math.max(maxStreak, tempStreak);
    }
  }
  return { current: tempStreak, longest: maxStreak };
}

interface StoreContextType {
  state: UserState;
  // Computed
  maxUnits: number;
  remainingUnits: number;
  remainingDays: number;
  daysUntilTarget: number;
  percentage: number;
  dailyRequired: number;
  // Actions
  completeOnboarding: (settings: Partial<UserState>) => void;
  logSession: (amountRead: number) => void;
  logAbsolute: (targetAbsolute: number) => void;
  deleteLastSession: () => void;
  nextDay: () => void;
  prevDay: () => void;
  resetProgress: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>(loadState);

  const persist = useCallback((newState: UserState) => {
    setState(newState);
    saveState(newState);
  }, []);

  // Auto-calculate current day for custom_plan based on start date
  const effectiveCurrentDay = useMemo(() => {
    if (state.strategyMode === 'custom_plan' && state.customStartDate) {
      const start = new Date(state.customStartDate + 'T00:00:00');
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const diffMs = now.getTime() - start.getTime();
      const daysSinceStart = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(1, Math.min(state.customTotalDays, daysSinceStart));
    }
    return state.currentRamadanDay;
  }, [state.strategyMode, state.customStartDate, state.customTotalDays, state.currentRamadanDay]);

  const maxUnits = TOTAL_RUKUS;
  const remainingUnits = Math.max(0, maxUnits - state.currentTotalCompleted);
  const remainingDays = Math.max(1, state.ramadanTotalDays - effectiveCurrentDay + 1);
  const daysUntilTarget = Math.max(0, state.targetCompletionDay - effectiveCurrentDay + 1);
  const percentage = Math.min(100, Math.max(0, (state.currentTotalCompleted / maxUnits) * 100));

  const dailyRequired = useMemo(() => {
    const strat = state.strategyMode;
    const currentCompleted = state.currentTotalCompleted;
    const currentDay = state.currentRamadanDay;
    const remUnits = Math.max(0, maxUnits - currentCompleted);

    if (strat === 'taraweeh') {
      if (currentDay > 27) return 0;
      const targetRukusCumulative = TARAWEEH_27_NIGHT_RUKUS[currentDay - 1] || TOTAL_RUKUS;
      const needed = targetRukusCumulative - currentCompleted;
      return Math.max(0, needed);
    }

    if (strat === 'custom_plan') {
      const totalDays = state.customTotalDays;
      const daysLeft = Math.max(1, totalDays - currentDay + 1);

      if (!state.weekendHeavy) {
        return remUnits / daysLeft;
      }

      // Weekend-heavy: calculate remaining weekdays/weekends from current day
      let weekdaysLeft = 0;
      let weekendsLeft = 0;
      const startDate = state.customStartDate ? new Date(state.customStartDate) : new Date();
      for (let d = currentDay; d <= totalDays; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (d - 1));
        const dow = date.getDay();
        if (dow === 0 || dow === 6) weekendsLeft++;
        else weekdaysLeft++;
      }

      // Weekend days get 1.4x the weekday target
      const factor = 1.4;
      const effectiveDays = weekdaysLeft + weekendsLeft * factor;
      const weekdayTarget = remUnits / Math.max(1, effectiveDays);

      const todayDate = new Date(startDate);
      todayDate.setDate(todayDate.getDate() + (currentDay - 1));
      const todayDow = todayDate.getDay();
      const isWeekend = todayDow === 0 || todayDow === 6;

      return isWeekend ? weekdayTarget * factor : weekdayTarget;
    }

    let daysAvail = Math.max(0, state.targetCompletionDay - currentDay + 1);
    if (daysAvail <= 0 && remUnits > 0) {
      daysAvail = Math.max(1, state.ramadanTotalDays - currentDay + 1);
    }
    daysAvail = Math.max(1, daysAvail);

    const base = remUnits / daysAvail;
    if (strat === 'custom') return state.customDailyTarget;
    if (strat === 'front') return daysAvail > 15 ? base * 1.25 : base * 0.8;
    if (strat === 'back') return daysAvail <= 10 ? base * 1.5 : base * 0.8;
    return base;
  }, [state.strategyMode, state.currentTotalCompleted, state.currentRamadanDay, state.targetCompletionDay, state.ramadanTotalDays, state.customDailyTarget, state.customTotalDays, state.weekendHeavy, state.customStartDate, maxUnits]);

  const completeOnboarding = useCallback((settings: Partial<UserState>) => {
    persist({ ...state, ...settings, isOnboarded: true });
  }, [state, persist]);

  const logSession = useCallback((amountRead: number) => {
    if (amountRead <= 0) return;
    setState(s => {
      const start = s.currentTotalCompleted;
      const end = Math.min(maxUnits, start + amountRead);
      const actualAmount = end - start;
      if (actualAmount <= 0) return s;

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeLabel = getPrayerTimeLabel(now);

      const newSession: ReadingSession = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        dateStr,
        timeLabel,
        unitsRead: actualAmount,
        startUnit: start,
        endUnit: end,
        ramadanDay: s.currentRamadanDay
      };

      const newSessions = [newSession, ...s.sessions];
      const otherLogs = s.logs.filter(l => l.day !== s.currentRamadanDay);
      const newDailyLog: DailyLog = { day: s.currentRamadanDay, unitsCompleted: end, timestamp: Date.now() };
      const newLogs = [...otherLogs, newDailyLog].sort((a, b) => a.day - b.day);
      const { current, longest } = calculateStreak(newLogs);

      const newState = {
        ...s,
        currentTotalCompleted: end,
        sessions: newSessions,
        logs: newLogs,
        currentStreak: current,
        longestStreak: Math.max(longest, s.longestStreak),
        lastLogDate: dateStr
      };
      saveState(newState);
      return newState;
    });
  }, [maxUnits]);

  const logAbsolute = useCallback((targetAbsolute: number) => {
    const diff = targetAbsolute - state.currentTotalCompleted;
    if (diff > 0) logSession(diff);
  }, [state.currentTotalCompleted, logSession]);

  const deleteLastSession = useCallback(() => {
    setState(s => {
      if (s.sessions.length === 0) return s;
      const [lastSession, ...remainingSessions] = s.sessions;
      const newTotal = lastSession.startUnit;
      const targetLogDay = lastSession.ramadanDay || s.currentRamadanDay;
      const hasOtherSessionsForDay = remainingSessions.some(sess => sess.ramadanDay === targetLogDay);

      let newLogs = [...s.logs];
      if (!hasOtherSessionsForDay && lastSession.ramadanDay) {
        newLogs = newLogs.filter(l => l.day !== targetLogDay);
      } else {
        const logIndex = newLogs.findIndex(l => l.day === targetLogDay);
        if (logIndex !== -1) {
          newLogs[logIndex] = { ...newLogs[logIndex], unitsCompleted: newTotal };
        }
      }

      const { current, longest } = calculateStreak(newLogs);
      const newState = {
        ...s,
        currentTotalCompleted: newTotal,
        sessions: remainingSessions,
        logs: newLogs,
        currentStreak: current,
        longestStreak: Math.max(s.longestStreak, longest)
      };
      saveState(newState);
      return newState;
    });
  }, []);

  const nextDay = useCallback(() => {
    setState(s => {
      const newState = { ...s, currentRamadanDay: Math.min(s.ramadanTotalDays, s.currentRamadanDay + 1) };
      saveState(newState);
      return newState;
    });
  }, []);

  const prevDay = useCallback(() => {
    setState(s => {
      const newState = { ...s, currentRamadanDay: Math.max(1, s.currentRamadanDay - 1) };
      saveState(newState);
      return newState;
    });
  }, []);

  const resetProgress = useCallback(() => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      persist({ ...INITIAL_STATE });
    }
  }, [persist]);

  const value: StoreContextType = {
    state,
    maxUnits,
    remainingUnits,
    remainingDays,
    daysUntilTarget,
    percentage,
    dailyRequired,
    completeOnboarding,
    logSession,
    logAbsolute,
    deleteLastSession,
    nextDay,
    prevDay,
    resetProgress
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

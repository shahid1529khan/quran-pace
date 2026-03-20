import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { SURAH_NAMES, SURAH_RUKU_COUNTS, TOTAL_RUKUS, TARAWEEH_27_NIGHT_RUKUS, getAbsoluteRuku, getRelativeRuku } from '@/lib/quran-data';
import { BookOpen, ChevronLeft, ChevronRight, Plus, Trash2, RotateCcw, X, CheckCircle2, HelpCircle, TableProperties } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

function formatUnitName(count: number) {
  return count === 1 ? 'Ruku' : 'Rukus';
}

export default function Dashboard() {
  const store = useStore();
  const { state } = store;
  const navigate = useNavigate();

  const [showLogModal, setShowLogModal] = useState(false);
  const [showKhatamModal, setShowKhatamModal] = useState(false);
  const [inputSurah, setInputSurah] = useState(1);
  const [inputRuku, setInputRuku] = useState(1);

  const isCompleted = state.currentTotalCompleted >= TOTAL_RUKUS;

  const surahList = useMemo(() =>
    SURAH_NAMES.map((name, i) => ({
      id: i + 1,
      name: `${i + 1}. ${name}`,
      rukuCount: SURAH_RUKU_COUNTS[i]
    })), []);

  const currentSurahMaxRukus = SURAH_RUKU_COUNTS[inputSurah - 1] || 1;

  const currentDay = store.effectiveCurrentDay;
  const totalDays = state.strategyMode === 'custom_plan' ? state.customTotalDays : state.ramadanTotalDays;
  const isCustomPlan = state.strategyMode === 'custom_plan';

  const projectedFinishDay = useMemo(() => {
    const total = state.currentTotalCompleted;
    if (currentDay <= 1 || total === 0) return 0;
    const rate = total / currentDay;
    const remaining = store.remainingUnits;
    return Math.ceil(currentDay + remaining / rate);
  }, [state.currentTotalCompleted, currentDay, store.remainingUnits]);

  const expectedByNow = useMemo(() => {
    if (state.strategyMode === 'taraweeh') {
      if (currentDay > 27) return TOTAL_RUKUS;
      return TARAWEEH_27_NIGHT_RUKUS[currentDay - 1] || 0;
    }
    return (store.maxUnits / state.targetCompletionDay) * currentDay;
  }, [state.strategyMode, currentDay, state.targetCompletionDay, store.maxUnits]);

  const isOnTrack = useMemo(() => {
    return state.currentTotalCompleted >= Math.floor(expectedByNow);
  }, [state.currentTotalCompleted, expectedByNow]);

  const diffUnits = useMemo(() => {
    return Math.round(state.currentTotalCompleted - expectedByNow);
  }, [state.currentTotalCompleted, expectedByNow]);

  const recentSessions = state.sessions.slice(0, 5);

  const resumePoint = useMemo(() => {
    const total = state.currentTotalCompleted;
    if (total >= store.maxUnits) return 'Completed!';
    if (total === 0) return 'Start of Quran';
    const last = getRelativeRuku(total);
    return `After ${SURAH_NAMES[last.surah - 1]} : Ruku ${last.ruku}`;
  }, [state.currentTotalCompleted, store.maxUnits]);

  const stoppedAtPoint = useMemo(() => {
    const total = state.currentTotalCompleted;
    if (total === 0) return 'Start of Quran';
    const loc = getRelativeRuku(total);
    return `${SURAH_NAMES[loc.surah - 1]} : Ruku ${loc.ruku}`;
  }, [state.currentTotalCompleted]);

  const calculatedSession = Math.max(0, getAbsoluteRuku(inputSurah, inputRuku) - state.currentTotalCompleted);

  const getCatchUpPlan = () => {
    const needed = Math.abs(diffUnits);
    const remDays = store.remainingDays;
    if (remDays === 0) return "Ramadan is over!";
    const extraPerDay = Math.ceil(needed / remDays);
    return `Add ${extraPerDay} extra Rukus per day to your target.`;
  };

  const openLog = () => {
    const currentAbs = state.currentTotalCompleted;
    const next = getRelativeRuku(Math.min(TOTAL_RUKUS, currentAbs + 1));
    setInputSurah(next.surah);
    setInputRuku(next.ruku);
    setShowLogModal(true);
  };

  const submitLog = () => {
    const prevTotal = state.currentTotalCompleted;
    const wasOnTrack = isOnTrack;
    const targetAbs = getAbsoluteRuku(inputSurah, inputRuku);
    store.logAbsolute(targetAbs);
    setShowLogModal(false);

    // We need to check post-log state. Since setState is async, use targetAbs directly.
    const newTotal = Math.min(TOTAL_RUKUS, Math.max(prevTotal, targetAbs));
    const newExpected = (store.maxUnits / totalDays) * currentDay;
    const isNowOnTrack = newTotal >= Math.floor(newExpected);

    if (newTotal >= TOTAL_RUKUS && prevTotal < TOTAL_RUKUS) {
      triggerKhatamCelebration();
    } else if (!wasOnTrack && isNowOnTrack) {
      triggerTargetMetCelebration();
    } else if (newTotal > prevTotal) {
      triggerSmallCelebration();
    }
  };

  const deleteSession = () => {
    if (confirm('Undo last reading session?')) {
      store.deleteLastSession();
    }
  };

  const triggerSmallCelebration = () => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.9 }, colors: ['#10B981', '#34D399', '#6EE7B7'] });
  };

  const triggerTargetMetCelebration = () => {
    const duration = 1000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#10B981', '#F59E0B'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#10B981', '#F59E0B'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const triggerKhatamCelebration = () => {
    setShowKhatamModal(true);
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <BookOpen size={18} />
            </div>
            <span className="font-bold text-foreground tracking-tight">Ramadan Planner</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/juz-ruku-reference')}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
              title="Juz-Ruku Reference"
            >
              <TableProperties size={18} />
            </button>
            <button
              onClick={() => navigate('/how-to-find-ruku')}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
              title="How to find Ruku numbers"
            >
              <HelpCircle size={18} />
            </button>
            {!isCustomPlan && (
              <button onClick={store.prevDay} className="p-1 text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft size={20} />
              </button>
            )}
            <span className="font-medium text-muted-foreground text-sm">
              Day {currentDay} <span className="text-muted-foreground/60 font-normal">/ {totalDays}</span>
            </span>
            {!isCustomPlan && (
              <button onClick={store.nextDay} className="p-1 text-muted-foreground hover:text-primary transition-colors">
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Progress Hero */}
        <section className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 animate-fade-slide-in">
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="progress-ring-track" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="progress-ring-fill" strokeDasharray={`${store.percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground">
              <span className="text-2xl md:text-3xl font-bold">{Math.round(store.percentage)}%</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="text-center md:text-left">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Completed</h2>
              <div className="text-2xl font-bold text-foreground">
                {state.currentTotalCompleted.toLocaleString()} <span className="text-base font-normal text-muted-foreground">/ {store.maxUnits.toLocaleString()} {formatUnitName(2)}</span>
              </div>
            </div>

            {!isCompleted ? (
              <div className="bookmark-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse-dot"></div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">Start Here</div>
                  </div>
                  <div className="text-xl font-bold text-foreground leading-none">{resumePoint}</div>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-primary/20 pt-2 sm:pt-0 sm:pl-4">
                  <div className="text-xs text-primary/60 uppercase tracking-wider mb-1">Stopped At</div>
                  <div className="text-sm font-medium text-foreground/80">{stoppedAtPoint}</div>
                </div>
              </div>
            ) : (
              <div className="bg-primary/10 rounded-xl border border-primary/20 p-4 flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-full text-primary">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="font-bold text-foreground">Alhamdulillah!</div>
                  <div className="text-sm text-muted-foreground">You have completed the entire Quran.</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Daily Target & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!isCompleted ? (
            <section className="target-card animate-fade-slide-in-delay-1">
              <div className="relative z-10">
                <h3 className="text-accent-foreground/70 text-sm font-medium mb-1">Today's Target</h3>
                <div className="text-3xl font-bold mb-1">
                  {Math.ceil(store.dailyRequired)} <span className="text-lg font-normal opacity-80">{formatUnitName(2)}</span>
                </div>
                <p className="text-xs text-accent-foreground/60">
                  To finish by <strong>Day {state.targetCompletionDay}</strong> ({store.daysUntilTarget} days left)
                </p>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </section>
          ) : (
            <section className="target-card flex flex-col justify-center">
              <div className="relative z-10 flex items-center gap-3">
                <div className="text-4xl">🎉</div>
                <div>
                  <h3 className="font-bold text-lg">Goal Achieved!</h3>
                  <p className="text-accent-foreground/70 text-sm">May it be accepted.</p>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </section>
          )}

          <section className="glass-card rounded-2xl p-6 flex flex-col justify-center animate-fade-slide-in-delay-1">
            {isCompleted ? (
              <div className="text-foreground font-medium text-center">
                <span className="block text-4xl mb-2">⭐</span>
                Reset Progress and Complete Again!!
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-muted-foreground text-sm font-medium">Status</h3>
                  {isOnTrack ? (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">ON TRACK</span>
                  ) : (
                    <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-bold rounded">BEHIND</span>
                  )}
                </div>
                {isOnTrack ? (
                  <>
                    <div className="text-foreground font-medium">
                      You are <span className="text-primary font-bold">{diffUnits}</span> {formatUnitName(2)} ahead.
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">Excellent consistency.</div>
                  </>
                ) : (
                  <>
                    <div className="text-foreground font-medium">
                      Behind by <span className="text-destructive font-bold">{Math.abs(diffUnits)}</span> {formatUnitName(2)}.
                    </div>
                    <div className="text-muted-foreground text-xs mt-2 p-2 bg-secondary rounded border border-border">
                      💡 <strong>Tip:</strong> {getCatchUpPlan()}
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-slide-in-delay-2">
          <div className="stat-card">
            <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Current Streak</div>
            <div className="text-2xl font-bold text-foreground">{state.currentStreak} <span className="text-sm font-normal text-muted-foreground">days</span></div>
          </div>
          <div className="stat-card">
            <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Est. Finish</div>
            {projectedFinishDay > 0 && !isCompleted ? (
              <div className={`text-2xl font-bold ${projectedFinishDay <= state.ramadanTotalDays ? 'text-primary' : 'text-destructive'}`}>
                Day {projectedFinishDay}
              </div>
            ) : isCompleted ? (
              <div className="text-2xl font-bold text-primary">Done</div>
            ) : (
              <div className="text-xl font-bold text-muted-foreground/30">--</div>
            )}
          </div>
          <div className="col-span-2 md:col-span-1 stat-card">
            <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Completion</div>
            <div className="text-2xl font-bold text-foreground">{Math.floor(store.percentage)}%</div>
          </div>
        </div>

        {/* Recent Sessions */}
        <section className="glass-card rounded-2xl overflow-hidden animate-fade-slide-in-delay-3">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/50">
            <h3 className="text-foreground font-bold text-sm uppercase tracking-wide">Recent Sessions</h3>
            <span className="text-xs text-muted-foreground">Total Logged: {state.sessions.length}</span>
          </div>
          <div className="divide-y divide-border">
            {recentSessions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground italic text-sm">
                No reading sessions recorded yet.
              </div>
            ) : (
              recentSessions.map((session, i) => (
                <div key={session.id} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        Read <span className="font-bold text-primary">+{session.unitsRead}</span> {formatUnitName(session.unitsRead)}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>{session.dateStr}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                        <span className="text-muted-foreground font-medium">{session.timeLabel || 'Recorded'}</span>
                      </div>
                    </div>
                  </div>
                  {i === 0 && (
                    <button onClick={deleteSession} className="flex items-center gap-1 px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/20 transition-colors" title="Undo last session">
                      <Trash2 size={14} /> Undo
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Reset */}
        <div className="mt-8 border-t border-border pt-8 pb-4 text-center">
          <button onClick={store.resetProgress} className="text-xs text-muted-foreground hover:text-destructive font-medium transition-colors flex items-center justify-center gap-1 mx-auto">
            <RotateCcw size={12} /> Reset All Progress
          </button>
          <p className="text-[10px] text-muted-foreground/40 mt-2">Ramadan Quran Planner</p>
        </div>

        {/* FAB */}
        {!isCompleted && (
          <div className="fixed bottom-6 right-6 md:static md:w-full md:mt-4 z-20">
            <button onClick={openLog} className="fab-button md:rounded-xl md:py-4 md:w-full flex items-center justify-center gap-2">
              <Plus size={24} />
              <span className="hidden md:inline font-semibold">Log Reading Session</span>
            </button>
          </div>
        )}
      </main>

      {/* Log Modal */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="bg-secondary/50 px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-foreground">Log Session</h3>
              <button onClick={() => setShowLogModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Surah Reached</label>
                  <select
                    value={inputSurah}
                    onChange={e => setInputSurah(+e.target.value)}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-foreground"
                  >
                    {surahList.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.rukuCount} rukus)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Ruku No. (within Surah)</label>
                  <input
                    type="number"
                    min={1}
                    max={currentSurahMaxRukus}
                    value={inputRuku}
                    onChange={e => setInputRuku(+e.target.value)}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-foreground"
                    placeholder="e.g. 1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Look for the Ruku mark (ع) in the margin.
                    {currentSurahMaxRukus > 1 && ` (Max ${currentSurahMaxRukus})`}
                  </p>
                </div>
                <div className="p-3 bg-primary/8 rounded-lg border border-primary/15 text-center">
                  <div className="text-xs text-primary uppercase font-semibold">Session Summary</div>
                  <div className="text-foreground font-medium">You read {calculatedSession} rukus</div>
                </div>
              </div>
              <button onClick={submitLog} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Confirm Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Khatam Modal */}
      {showKhatamModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/90 backdrop-blur-md p-4" style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div className="bg-card w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10"></div>
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6" style={{ boxShadow: '0 10px 30px hsl(158 64% 35% / 0.35)' }}>
              <span className="text-4xl">🤲</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Alhamdulillah!</h2>
            <p className="text-muted-foreground mb-6">You have successfully completed the Quran (558 Rukus).</p>
            <div className="bg-primary/8 p-4 rounded-xl border border-primary/15 mb-6">
              <p className="text-foreground text-sm font-medium italic">"And He found you lost and guided [you]."</p>
            </div>
            <button onClick={() => setShowKhatamModal(false)} className="w-full bg-foreground text-background font-bold py-3 rounded-xl hover:bg-foreground/90 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useStore, StrategyMode } from '@/lib/store';
import { BookOpen } from 'lucide-react';

export default function Onboarding() {
  const store = useStore();
  const [strategy, setStrategy] = useState<StrategyMode>('balanced');
  const [days, setDays] = useState(30);
  const [currentDay, setCurrentDay] = useState(1);
  const [targetDay, setTargetDay] = useState(30);
  const [customDays, setCustomDays] = useState<number | string>(30);
  const [weekendHeavy, setWeekendHeavy] = useState(false);

  useEffect(() => {
    if (targetDay > days) setTargetDay(days);
  }, [days, targetDay]);

  useEffect(() => {
    if (strategy === 'taraweeh') setTargetDay(27);
    if (strategy === 'custom_plan') setWeekendHeavy(false);
  }, [strategy]);

  const numDays = Number(customDays) || 1;

  const save = () => {
    if (strategy === 'custom_plan') {
      store.completeOnboarding({
        progressMode: 'ruku',
        strategyMode: 'custom_plan',
        ramadanTotalDays: numDays,
        currentRamadanDay: currentDay,
        targetCompletionDay: numDays,
        customTotalDays: numDays,
        weekendHeavy,
        customStartDate: new Date().toISOString().split('T')[0]
      });
    } else {
      store.completeOnboarding({
        progressMode: 'ruku',
        strategyMode: strategy,
        ramadanTotalDays: days,
        currentRamadanDay: currentDay,
        targetCompletionDay: targetDay
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full glass-card rounded-2xl p-8 animate-fade-slide-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Ramadan Planner</h1>
          <p className="text-muted-foreground mt-2">Structure your Quran completion journey (Ruku Track).</p>
        </div>

        <div className="space-y-6">
          {/* Strategy */}
          <div className="animate-fade-slide-in-delay-1">
            <label className="block text-sm font-medium text-foreground/80 mb-2">Completion Strategy</label>
            <select
              value={strategy}
              onChange={e => setStrategy(e.target.value as StrategyMode)}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="balanced">Balanced (Steady Pace)</option>
              <option value="front">Front-Loaded (Heavy Start)</option>
              <option value="back">Back-Loaded (Strong Finish)</option>
              <option value="taraweeh">Taraweeh (1.25 Juz Schedule)</option>
              <option value="custom_plan">Custom Plan (Your Own Schedule)</option>
            </select>
            {strategy === 'taraweeh' && (
              <p className="text-xs text-primary mt-1 italic">
                Follows the 27-night 1.25 Juz progressive schedule.
              </p>
            )}
            {strategy === 'custom_plan' && (
              <p className="text-xs text-primary mt-1 italic">
                Set your own number of days and optionally load weekends heavier.
              </p>
            )}
          </div>

          {strategy === 'custom_plan' ? (
            <>
              {/* Custom Plan Fields */}
              <div className="grid grid-cols-2 gap-4 animate-fade-slide-in-delay-2">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Total Days</label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={customDays}
                    onChange={e => setCustomDays(e.target.value === '' ? '' : Math.max(1, +e.target.value))}
                    onBlur={() => { if (customDays === '' || Number(customDays) < 1) setCustomDays(1); }}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Current Day</label>
                  <input
                    type="number"
                    min={1}
                    max={numDays}
                    value={currentDay}
                    onChange={e => setCurrentDay(Math.max(1, Math.min(numDays, +e.target.value)))}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground"
                  />
                </div>
              </div>

              {/* Weekend Heavy Toggle */}
              <div className="animate-fade-slide-in-delay-3">
                <label className="flex items-center justify-between cursor-pointer bg-secondary border border-border rounded-lg px-4 py-3">
                  <div>
                    <span className="text-sm font-medium text-foreground">Weekend Heavy</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Assign ~40% more Rukus on Sat & Sun
                    </p>
                  </div>
                  <div
                    onClick={() => setWeekendHeavy(!weekendHeavy)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${weekendHeavy ? 'bg-primary' : 'bg-border'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-background rounded-full shadow transition-transform ${weekendHeavy ? 'translate-x-5' : ''}`} />
                  </div>
                </label>
                {weekendHeavy && (
                  <p className="text-xs text-primary mt-2 flex items-center gap-1">
                    ✓ Weekdays: lighter load · Weekends: heavier load
                  </p>
                )}
              </div>

              {/* Preview */}
              <div className="animate-fade-slide-in-delay-3 bg-secondary/50 border border-border rounded-lg px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  {weekendHeavy
                    ? `~${Math.round(558 / (customDays * 0.71 + customDays * 0.29 * 1.4))} Rukus/weekday · ~${Math.round((558 / (customDays * 0.71 + customDays * 0.29 * 1.4)) * 1.4)} Rukus/weekend`
                    : `~${Math.round(558 / customDays)} Rukus/day for ${customDays} days`
                  }
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Days & Current */}
              <div className="grid grid-cols-2 gap-4 animate-fade-slide-in-delay-2">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Ramadan Length</label>
                  <select
                    value={days}
                    onChange={e => setDays(+e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground"
                  >
                    <option value={29}>29 Days</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">Current Day</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={currentDay}
                    onChange={e => setCurrentDay(+e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground"
                  />
                </div>
              </div>

              {/* Target */}
              <div className="animate-fade-slide-in-delay-3">
                <label className="block text-sm font-medium text-foreground/80 mb-2">Target Finish Date</label>
                <select
                  value={targetDay}
                  onChange={e => setTargetDay(+e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground appearance-none"
                >
                  <option value={days}>End of Ramadan (Day {days})</option>
                  <option value={27}>Night of Power (Day 27)</option>
                  <option value={20}>Before Last 10 Days (Day 20)</option>
                </select>
                {targetDay < days && (
                  <p className="text-xs text-primary mt-2 flex items-center gap-1">
                    ✓ Goal: Finish {days - targetDay} days early!
                  </p>
                )}
              </div>
            </>
          )}

          <button
            onClick={save}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]"
            style={{ boxShadow: '0 8px 24px hsl(158 64% 35% / 0.25)' }}
          >
            Start Journey
          </button>
        </div>
      </div>
    </div>
  );
}

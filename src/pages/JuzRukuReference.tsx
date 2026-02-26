import { ArrowLeft, BookOpen, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JUZ_RUKU_DATA } from '@/lib/quran-data';

export default function JuzRukuReference() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Juz-wise Ruku Reference</h1>
          <p className="text-xs text-muted-foreground">Complete breakdown of Rukus across 30 Juz</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <section className="glass-card rounded-2xl p-5 space-y-3 animate-fade-slide-in">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>Juz & Ruku Relationship</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Quran is divided into <strong className="text-foreground">30 Juz</strong> (also called <em>Para</em>) and <strong className="text-foreground">558 Rukus</strong>.
            These two systems are independent — Juz divisions are based on equal text length, while Rukus are thematic sections within Surahs.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This table shows how many Rukus fall in each Juz, helping you track your progress either way.
          </p>
        </section>

        {/* Note */}
        <div className="flex gap-2 bg-primary/10 border border-primary/20 rounded-xl p-3 animate-fade-slide-in-delay-1">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Note:</strong> Some boundary Rukus may span across two Juz divisions since these are independent systems. Data verified via the Quran Foundation API.
          </p>
        </div>

        {/* Table */}
        <section className="glass-card rounded-2xl overflow-hidden animate-fade-slide-in-delay-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Juz</th>
                  <th className="text-center px-3 py-3 font-semibold text-foreground">Rukus</th>
                  <th className="text-center px-3 py-3 font-semibold text-foreground">Range</th>
                </tr>
              </thead>
              <tbody>
                {JUZ_RUKU_DATA.map((juz, i) => (
                  <tr
                    key={juz.juz}
                    className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">Juz {juz.juz}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{juz.surahs}</div>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 text-primary font-bold text-sm">
                        {juz.rukuCount}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3 text-muted-foreground font-mono text-xs">
                      {juz.startRuku}–{juz.endRuku}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Summary Stats */}
        <section className="glass-card rounded-2xl p-5 space-y-3 animate-fade-slide-in-delay-3">
          <p className="text-sm font-semibold text-foreground">📊 Quick Stats</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="text-lg font-bold text-primary">30</div>
              <div className="text-xs text-muted-foreground">Total Juz</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="text-lg font-bold text-primary">558</div>
              <div className="text-xs text-muted-foreground">Total Rukus</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="text-lg font-bold text-primary">~19</div>
              <div className="text-xs text-muted-foreground">Avg/Juz</div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="glass-card rounded-2xl p-5 space-y-3 animate-fade-slide-in-delay-3">
          <p className="text-sm font-semibold text-foreground">💡 How to Use This</p>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
            <li>If you're tracking by <strong className="text-foreground">Juz</strong>, use the <em>Ruku range</em> column to know exactly which Rukus fall in your current Juz.</li>
            <li>If you know your <strong className="text-foreground">Ruku number</strong>, find which Juz it belongs to using the range column.</li>
            <li>Juz 30 has the most Rukus (<strong className="text-foreground">39</strong>) because it contains 37 shorter Surahs, each with at least 1 Ruku.</li>
            <li>Juz 14 has <strong className="text-foreground">22 Rukus</strong> — the most among earlier Juz — covering Al-Hijr and An-Nahl.</li>
          </ul>
        </section>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  );
}

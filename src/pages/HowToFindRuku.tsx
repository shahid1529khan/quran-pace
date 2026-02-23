import { ArrowLeft, BookOpen, Eye, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import rukuSymbolGuide from '@/assets/ruku-symbol-guide.png';

export default function HowToFindRuku() {
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
          <h1 className="text-lg font-bold">How to Find Ruku Numbers</h1>
          <p className="text-xs text-muted-foreground">A visual guide for Quran readers</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <section className="glass-card rounded-2xl p-5 space-y-3 animate-fade-slide-in">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>What is a Ruku?</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A <strong className="text-foreground">Ruku</strong> (ركوع) is a thematic section of the Quran.
            The entire Quran is divided into <strong className="text-foreground">558 Rukus</strong> across
            all 114 Surahs. Each Surah contains one or more Rukus, and they are marked in most printed
            copies of the Quran with the Arabic letter <strong className="text-primary text-lg">ع</strong>.
          </p>
        </section>

        {/* Visual Guide */}
        <section className="glass-card rounded-2xl p-5 space-y-4 animate-fade-slide-in-delay-1">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Eye className="w-5 h-5" />
            <span>Spotting the Ruku Symbol</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Look for the <strong className="text-primary text-lg">ع</strong> symbol on the
            <strong className="text-foreground"> left margin</strong> of the page. The number written
            <strong className="text-foreground"> above</strong> this symbol is the <strong className="text-foreground">Ruku number within that Surah</strong>.
          </p>

          {/* Image */}
          <div className="bg-muted/50 rounded-xl p-4 flex justify-center">
            <img
              src={rukuSymbolGuide}
              alt="Ruku symbol (ع) with the Ruku number shown above it — this number indicates the Ruku number within the current Surah"
              className="max-w-[220px] w-full rounded-lg"
            />
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-primary">In this example:</p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>The <strong className="text-foreground">ع</strong> symbol marks the start of a new Ruku</li>
              <li>The number <strong className="text-foreground">٢٢</strong> (22) above it means this is <strong className="text-foreground">Ruku 22</strong> of the current Surah</li>
            </ul>
          </div>
        </section>

        {/* Step by Step */}
        <section className="glass-card rounded-2xl p-5 space-y-4 animate-fade-slide-in-delay-2">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Search className="w-5 h-5" />
            <span>Step-by-Step Guide</span>
          </div>

          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Open your Quran',
                desc: 'Open the Quran to the page where you stopped reading. Note which Surah you are in.',
              },
              {
                step: 2,
                title: 'Look at the left margin',
                desc: 'Scan the left side of the page for the ع symbol. It appears wherever a new Ruku begins.',
              },
              {
                step: 3,
                title: 'Read the number above ع',
                desc: 'The number written directly above the ع symbol is the Ruku number within that Surah. This is the number you log in the app.',
              },
              {
                step: 4,
                title: 'Log it in the app',
                desc: 'Select the Surah name, enter the Ruku number you found, and tap "Log Ruku" to record your progress.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="glass-card rounded-2xl p-5 space-y-3 animate-fade-slide-in-delay-3">
          <p className="text-sm font-semibold text-foreground">💡 Tips</p>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
            <li>The Ruku number <strong className="text-foreground">resets to 1</strong> at the start of each new Surah.</li>
            <li>Some shorter Surahs have only <strong className="text-foreground">1 Ruku</strong>, while Al-Baqarah has <strong className="text-foreground">40 Rukus</strong>.</li>
            <li>If you can't find the ع symbol, check a different print edition — some digital apps may not show it.</li>
            
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

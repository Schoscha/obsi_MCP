import {
  FilePlus,
  CalendarDays,
  Share2,
  Search,
  Sun,
  Moon,
  Sparkles,
  ListTodo,
  Headphones,
} from 'lucide-react';

interface Props {
  themeMode: 'weiss' | 'bunt';
  setThemeMode: (mode: 'weiss' | 'bunt') => void;
  onOpenChecklist: () => void;
  onOpenSimulator: () => void;
  onOpenGraph: () => void;
  onOpenAnalysis: () => void;
  onOpenAudio: () => void;
  onNewNote: () => void;
  onDailyNote: () => void;
}

export const GlassBottomBar = ({
  themeMode,
  setThemeMode,
  onOpenChecklist,
  onOpenSimulator,
  onOpenGraph,
  onOpenAnalysis,
  onOpenAudio,
  onNewNote,
  onDailyNote,
}: Props) => {
  const isWeiss = themeMode === 'weiss';

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div
        className={`pointer-events-auto rounded py-2 px-3 sm:px-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 border shadow-2xl transition-colors duration-200 ${
          isWeiss
            ? 'bg-[#e4f0ec] border-[#bdd6cf] text-[#06201b]'
            : 'bg-[#0b1715] border-[#16302b] text-[#ecfdf5]'
        }`}
      >
        <button
          onClick={onOpenAudio}
          className="px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer bg-[#34d399] text-[#041311] hover:bg-[#10b981]"
          title="Audio-Erklärung anhören"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>AUDIO</span>
        </button>

        <button
          onClick={onNewNote}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] hover:border-[#06201b]'
              : 'bg-[#07100e] border-[#16302b] text-[#b2d8ce] hover:border-[#ecfdf5] hover:text-[#ecfdf5]'
          }`}
        >
          <FilePlus className="w-3.5 h-3.5 text-[#34d399]" />
          <span className="hidden sm:inline">Neue Notiz</span>
        </button>

        <button
          onClick={onDailyNote}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] hover:border-[#06201b]'
              : 'bg-[#07100e] border-[#16302b] text-[#b2d8ce] hover:border-[#ecfdf5] hover:text-[#ecfdf5]'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5 text-[#22d3ee]" />
          <span className="hidden sm:inline">Tagesnotiz</span>
        </button>

        <button
          onClick={onOpenChecklist}
          className="px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer bg-[#34d399] text-[#041311] hover:bg-[#10b981]"
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>32-Kapitel</span>
        </button>

        <button
          onClick={onOpenGraph}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] hover:border-[#06201b]'
              : 'bg-[#07100e] border-[#16302b] text-[#b2d8ce] hover:border-[#ecfdf5] hover:text-[#ecfdf5]'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Graph</span>
        </button>

        <button
          onClick={onOpenSimulator}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] hover:border-[#06201b]'
              : 'bg-[#07100e] border-[#16302b] text-[#b2d8ce] hover:border-[#ecfdf5] hover:text-[#ecfdf5]'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-[#22d3ee]" />
          <span className="hidden sm:inline">RRF Suche</span>
        </button>

        <button
          onClick={onOpenAnalysis}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] hover:border-[#06201b]'
              : 'bg-[#07100e] border-[#16302b] text-[#b2d8ce] hover:border-[#ecfdf5] hover:text-[#ecfdf5]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#34d399]" />
          <span className="hidden md:inline">Audit</span>
        </button>

        <div className={`h-5 w-px ${isWeiss ? 'bg-[#bdd6cf]' : 'bg-[#16302b]'}`} />

        <button
          onClick={() => setThemeMode(isWeiss ? 'bunt' : 'weiss')}
          className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#07100e] text-[#ecfdf5] border-[#07100e]'
              : 'bg-[#f0f7f5] text-[#06201b] border-[#bdd6cf]'
          }`}
          title={isWeiss ? 'Zu OBSIDIAN (#07100e) wechseln' : 'Zu PAPER (#f0f7f5) wechseln'}
        >
          {isWeiss ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#34d399]" />
              <span>OBSIDIAN</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-[#34d399]" />
              <span>PAPER</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

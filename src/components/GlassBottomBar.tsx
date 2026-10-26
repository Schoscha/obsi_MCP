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
            ? 'bg-[#EBE8DF] border-[#D6D2C4] text-[#15130C]'
            : 'bg-[#1e1b14] border-[#2E2A20] text-[#e8e2d6]'
        }`}
      >
        <button
          onClick={onOpenAudio}
          className="px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer bg-[#E54D2E] text-[#F5F3EC] hover:bg-[#ff5c3d]"
          title="Audio-Erklärung anhören"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>AUDIO</span>
        </button>

        <button
          onClick={onNewNote}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C] hover:border-[#15130C]'
              : 'bg-[#15130c] border-[#2E2A20] text-[#cac6ba] hover:border-[#e8e2d6] hover:text-[#e8e2d6]'
          }`}
        >
          <FilePlus className="w-3.5 h-3.5 text-[#E54D2E]" />
          <span className="hidden sm:inline">Neue Notiz</span>
        </button>

        <button
          onClick={onDailyNote}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C] hover:border-[#15130C]'
              : 'bg-[#15130c] border-[#2E2A20] text-[#cac6ba] hover:border-[#e8e2d6] hover:text-[#e8e2d6]'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5 text-[#7bd0ff]" />
          <span className="hidden sm:inline">Tagesnotiz</span>
        </button>

        <button
          onClick={onOpenChecklist}
          className="px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer bg-[#E54D2E] text-[#F5F3EC] hover:bg-[#ff5c3d]"
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>32-Kapitel</span>
        </button>

        <button
          onClick={onOpenGraph}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C] hover:border-[#15130C]'
              : 'bg-[#15130c] border-[#2E2A20] text-[#cac6ba] hover:border-[#e8e2d6] hover:text-[#e8e2d6]'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Graph</span>
        </button>

        <button
          onClick={onOpenSimulator}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C] hover:border-[#15130C]'
              : 'bg-[#15130c] border-[#2E2A20] text-[#cac6ba] hover:border-[#e8e2d6] hover:text-[#e8e2d6]'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-[#7bd0ff]" />
          <span className="hidden sm:inline">RRF Suche</span>
        </button>

        <button
          onClick={onOpenAnalysis}
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C] hover:border-[#15130C]'
              : 'bg-[#15130c] border-[#2E2A20] text-[#cac6ba] hover:border-[#e8e2d6] hover:text-[#e8e2d6]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E54D2E]" />
          <span className="hidden md:inline">Audit</span>
        </button>

        <div className={`h-5 w-px ${isWeiss ? 'bg-[#D6D2C4]' : 'bg-[#2E2A20]'}`} />

        <button
          onClick={() => setThemeMode(isWeiss ? 'bunt' : 'weiss')}
          className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-2 border transition-colors cursor-pointer ${
            isWeiss
              ? 'bg-[#15130c] text-[#e8e2d6] border-[#15130c]'
              : 'bg-[#F5F3EC] text-[#15130C] border-[#D6D2C4]'
          }`}
          title={isWeiss ? 'Zu OBSIDIAN (#15130c) wechseln' : 'Zu PAPER (#F5F3EC) wechseln'}
        >
          {isWeiss ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#E54D2E]" />
              <span>OBSIDIAN</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-[#E54D2E]" />
              <span>PAPER</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

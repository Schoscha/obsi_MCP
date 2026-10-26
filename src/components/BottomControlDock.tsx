import {
  ListTodo,
  Cpu,
  BookOpen,
  FolderTree,
  RotateCcw,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface Props {
  activeTab: 'tasks' | 'simulator' | 'analysis' | 'vault';
  setActiveTab: (tab: 'tasks' | 'simulator' | 'analysis' | 'vault') => void;
  onResetAllTasks: () => void;
  completedTasks: number;
  totalTasks: number;
}

export const BottomControlDock = ({
  activeTab,
  setActiveTab,
  onResetAllTasks,
  completedTasks,
  totalTasks,
}: Props) => {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-40 bg-[#090714]/95 backdrop-blur-xl border-t border-purple-500/30 px-3 sm:px-6 py-2.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Navigation Modes (Replicating the bottom rounded icon buttons from vorlage.jpg) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tasks List Tab */}
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs cursor-pointer transition-all ${
              activeTab === 'tasks'
                ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/30 glow-orange'
                : 'bg-[#15102a] text-slate-300 hover:text-white hover:bg-[#20183e] border border-purple-500/20'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
              <ListTodo className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">32-Kapitel Taskliste</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-orange-200">
              {completedTasks}/{totalTasks}
            </span>
          </button>

          {/* Simulator Tab */}
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs cursor-pointer transition-all ${
              activeTab === 'simulator'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 glow-cyan'
                : 'bg-[#15102a] text-slate-300 hover:text-white hover:bg-[#20183e] border border-purple-500/20'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">RRF Simulator & Architektur</span>
            <span className="sm:hidden">RRF</span>
          </button>

          {/* Analysis & Concept Tab */}
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs cursor-pointer transition-all ${
              activeTab === 'analysis'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 glow-purple'
                : 'bg-[#15102a] text-slate-300 hover:text-white hover:bg-[#20183e] border border-purple-500/20'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">Sinn & Konzept Analyse</span>
            <span className="sm:hidden">Analyse</span>
          </button>

          {/* Vault Structure Tab */}
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs cursor-pointer transition-all ${
              activeTab === 'vault'
                ? 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/30'
                : 'bg-[#15102a] text-slate-300 hover:text-white hover:bg-[#20183e] border border-purple-500/20'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center">
              <FolderTree className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">Vault Verzeichnis & Schema</span>
            <span className="sm:hidden">Vault</span>
          </button>
        </div>

        {/* Right: Live Telemetry ticker & Reset */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="hidden lg:flex items-center gap-2 text-[11px] bg-black/40 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">MCP STDIO</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">sqlite-vec v0.1.9</span>
            <span className="text-slate-600">|</span>
            <span className="text-orange-400">p50: 23ms</span>
          </div>

          <button
            onClick={onResetAllTasks}
            title="Alle Häkchen zurücksetzen"
            className="p-1.5 rounded-lg bg-[#18112c] hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-purple-500/20 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

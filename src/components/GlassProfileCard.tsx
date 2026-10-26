import { Plus, User, Sparkles, Folder, CheckCircle } from 'lucide-react';
import { GlassShimmer } from './GlassShimmer';

interface Props {
  themeMode: 'weiss' | 'bunt';
  userName?: string;
  totalNotesCount?: string;
  activeFolderFilter: string | null;
  setActiveFolderFilter: (f: string | null) => void;
  onOpenChecklist: () => void;
}

export const GlassProfileCard = ({
  themeMode,
  userName = 'Sascha',
  totalNotesCount = '16.894',
  activeFolderFilter,
  setActiveFolderFilter,
  onOpenChecklist,
}: Props) => {
  const isWeiss = themeMode === 'weiss';

  const folders = [
    { name: 'Offen', count: 14, color: '#3b82f6' },
    { name: 'Aufgaben', count: 23, color: '#f97316' },
    { name: 'Werkzeuge', count: 37, color: '#22c55e' },
    { name: 'Preiswissen', count: 52, color: '#a855f7' },
    { name: 'Tagesarbeit', count: 19, color: '#eab308' },
    { name: 'Erinnerungen', count: 8, color: '#14b8a6' },
  ];

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col justify-between glass-rainbow-edge group glass-telemetry-hover transition-all duration-300 relative ${
        isWeiss
          ? 'glass-white text-slate-800'
          : 'glass-bunt text-slate-100'
      }`}
    >
      {/* Futuristic Telemetry Shimmer & Sparkle on Hover */}
      <GlassShimmer themeMode={themeMode} sparklePosition="top-right" />

      <div>
        {/* Top Profile Lockup */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-slate-300/40">
          {/* Avatar with Crystal Glass Ring */}
          <div className="relative mb-3 group">
            <div
              className={`w-20 h-20 rounded-full p-1 transition-transform duration-300 group-hover:scale-105 ${
                isWeiss
                  ? 'bg-gradient-to-tr from-white to-slate-200 shadow-lg border-2 border-white'
                  : 'bg-gradient-to-tr from-cyan-400 to-fuchsia-500 shadow-xl border-2 border-white/40'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-200 relative flex items-center justify-center">
                {/* Clean stylized portrait avatar matching Sascha in reference image */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                  alt="Sascha"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to SVG portrait if offline
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay" />
                <User className="w-8 h-8 text-slate-600 absolute" />
              </div>
            </div>

            {/* Online Status Badge */}
            <span
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-sm"
              title="MCP Server Online"
            />
          </div>

          <h3
            className={`text-lg font-bold tracking-tight font-display ${
              isWeiss ? 'text-slate-900' : 'text-white'
            }`}
          >
            {userName}
          </h3>

          <div
            className={`text-xs flex items-center gap-1.5 mt-0.5 font-medium ${
              isWeiss ? 'text-slate-600' : 'text-cyan-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>{totalNotesCount} Notizen (49.746 Chunks)</span>
          </div>

          <div
            className={`text-[11px] mt-0.5 ${
              isWeiss ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Seit 6. Jan. 2022 · Obsidian 1.13.7
          </div>
        </div>

        {/* Folder List with Colored Dots (Identical to image-1790114036816.png) */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold px-1">
            <span className={isWeiss ? 'text-slate-600' : 'text-slate-300'}>Ordner</span>
            <button
              onClick={onOpenChecklist}
              className={`p-1 rounded hover:scale-110 transition-transform cursor-pointer ${
                isWeiss ? 'hover:bg-slate-200/60 text-slate-600' : 'hover:bg-white/20 text-slate-200'
              }`}
              title="Neuen Bereich anlegen"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {folders.map((folder) => {
              const isSelected = activeFolderFilter === folder.name;
              return (
                <button
                  key={folder.name}
                  onClick={() => setActiveFolderFilter(isSelected ? null : folder.name)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                    isSelected
                      ? isWeiss
                        ? 'bg-white shadow-sm font-semibold'
                        : 'bg-white/20 font-semibold'
                      : isWeiss
                      ? 'hover:bg-white/60 text-slate-700'
                      : 'hover:bg-white/10 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: folder.color }}
                    />
                    <span>{folder.name}</span>
                  </div>
                  <span
                    className={`text-[11px] font-mono tabular-nums ${
                      isWeiss ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {folder.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Action Button at bottom of card */}
      <div className="mt-4 pt-3 border-t border-slate-300/40">
        <button
          onClick={onOpenChecklist}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
            isWeiss
              ? 'bg-white/90 hover:bg-white text-indigo-900 border border-white'
              : 'bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 hover:from-cyan-500/50 hover:to-fuchsia-500/50 text-white border border-white/30'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>32-Kapitel Checklist öffnen</span>
        </button>
      </div>
    </div>
  );
};

import { BarChart3, ArrowUpRight, Database } from 'lucide-react';
import { GlassShimmer } from './GlassShimmer';

interface Props {
  themeMode: 'weiss' | 'bunt';
  notesCount?: string;
  wordCount?: string;
  folderCount?: string;
  avgWords?: string;
  onOpenDetails?: () => void;
}

export const GlassMetricsCard = ({
  themeMode,
  notesCount = '16.894',
  wordCount = '49,7k',
  folderCount = '12',
  avgWords = '23ms',
  onOpenDetails,
}: Props) => {
  const isWeiss = themeMode === 'weiss';

  return (
    <div
      onClick={onOpenDetails}
      className={`rounded-2xl p-4 flex flex-col justify-between glass-rainbow-edge cursor-pointer group glass-telemetry-hover transition-all duration-300 relative ${
        isWeiss ? 'glass-white text-slate-800' : 'glass-bunt text-slate-100'
      }`}
    >
      {/* Futuristic Telemetry Shimmer & Sparkle on Hover */}
      <GlassShimmer themeMode={themeMode} sparklePosition="top-right" />

      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-bold tracking-tight">
          <BarChart3 className={`w-4 h-4 ${isWeiss ? 'text-indigo-600' : 'text-cyan-400'}`} />
          <span className={isWeiss ? 'text-slate-900' : 'text-white'}>Notiz- & Retrieval-Statistik</span>
        </div>
        <ArrowUpRight
          className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
            isWeiss ? 'text-slate-500' : 'text-cyan-300'
          }`}
        />
      </div>

      {/* 4 Inset Glass Tiles */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Tile 1: Notizen */}
        <div
          className={`p-2.5 rounded-xl text-center border transition-all duration-200 hover:scale-[1.03] ${
            isWeiss
              ? 'bg-white/80 border-white hover:bg-white shadow-sm hover:shadow-md'
              : 'bg-white/10 border-white/20 hover:bg-white/20 shadow-md hover:shadow-cyan-500/20'
          }`}
        >
          <div className="text-xl font-bold font-display tracking-tight text-indigo-600 dark:text-cyan-300">
            {notesCount}
          </div>
          <div className={`text-[11px] font-medium ${isWeiss ? 'text-slate-600' : 'text-slate-300'}`}>
            Dateien (Vault)
          </div>
        </div>

        {/* Tile 2: Chunks / Wörter */}
        <div
          className={`p-2.5 rounded-xl text-center border transition-all duration-200 hover:scale-[1.03] ${
            isWeiss
              ? 'bg-white/80 border-white hover:bg-white shadow-sm hover:shadow-md'
              : 'bg-white/10 border-white/20 hover:bg-white/20 shadow-md hover:shadow-fuchsia-500/20'
          }`}
        >
          <div className="text-xl font-bold font-display tracking-tight text-fuchsia-600 dark:text-fuchsia-300">
            {wordCount}
          </div>
          <div className={`text-[11px] font-medium ${isWeiss ? 'text-slate-600' : 'text-slate-300'}`}>
            Chunks (FTS5 + vec0)
          </div>
        </div>

        {/* Tile 3: Domänen */}
        <div
          className={`p-2.5 rounded-xl text-center border transition-all duration-200 hover:scale-[1.03] ${
            isWeiss
              ? 'bg-white/80 border-white hover:bg-white shadow-sm hover:shadow-md'
              : 'bg-white/10 border-white/20 hover:bg-white/20 shadow-md hover:shadow-amber-500/20'
          }`}
        >
          <div className="text-xl font-bold font-display tracking-tight text-amber-600 dark:text-amber-300">
            {folderCount}
          </div>
          <div className={`text-[11px] font-medium ${isWeiss ? 'text-slate-600' : 'text-slate-300'}`}>
            Signal-Domänen
          </div>
        </div>

        {/* Tile 4: Latenz / Ø Wörter */}
        <div
          className={`p-2.5 rounded-xl text-center border transition-all duration-200 hover:scale-[1.03] ${
            isWeiss
              ? 'bg-white/80 border-white hover:bg-white shadow-sm hover:shadow-md'
              : 'bg-white/10 border-white/20 hover:bg-white/20 shadow-md hover:shadow-emerald-500/20'
          }`}
        >
          <div className="text-xl font-bold font-display tracking-tight text-emerald-600 dark:text-emerald-300">
            {avgWords}
          </div>
          <div className={`text-[11px] font-medium ${isWeiss ? 'text-slate-600' : 'text-slate-300'}`}>
            p50 Hybride Latenz
          </div>
        </div>
      </div>
    </div>
  );
};

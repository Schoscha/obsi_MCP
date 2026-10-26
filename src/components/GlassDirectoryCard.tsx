import { Folder, ChevronRight, Lock } from 'lucide-react';
import { GlassShimmer } from './GlassShimmer';

interface Props {
  themeMode: 'weiss' | 'bunt';
  onOpenVaultView?: () => void;
}

export const GlassDirectoryCard = ({ themeMode, onOpenVaultView }: Props) => {
  const isWeiss = themeMode === 'weiss';

  const directories = [
    { name: '01-projects', count: 12, desc: 'Aktive Vorhaben' },
    { name: '03-resources', count: 8, desc: 'Wissensschätze' },
    { name: '05-signals', count: 12, desc: '12 Domänenordner' },
    { name: '07-templates', count: 6, desc: '.indexignore aktiv', isProtected: true },
  ];

  return (
    <div
      onClick={onOpenVaultView}
      className={`rounded-2xl p-4 flex flex-col justify-between glass-rainbow-edge cursor-pointer group glass-telemetry-hover transition-all duration-300 relative ${
        isWeiss ? 'glass-white text-slate-800' : 'glass-bunt text-slate-100'
      }`}
    >
      {/* Futuristic Telemetry Shimmer & Sparkle on Hover */}
      <GlassShimmer themeMode={themeMode} sparklePosition="top-right" />

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Folder className={`w-4 h-4 ${isWeiss ? 'text-indigo-600' : 'text-cyan-400'}`} />
          <span className={isWeiss ? 'text-slate-900' : 'text-white'}>Verzeichnis</span>
        </div>
        <ChevronRight
          className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
            isWeiss ? 'text-slate-500' : 'text-cyan-300'
          }`}
        />
      </div>

      <div className="space-y-1.5 my-1">
        {directories.map((dir) => (
          <div
            key={dir.name}
            className={`flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors ${
              isWeiss ? 'hover:bg-white/70 text-slate-700' : 'hover:bg-white/10 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {dir.isProtected ? (
                <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              )}
              <span className="truncate font-mono text-[11px]">{dir.name}</span>
            </div>
            <span
              className={`text-[10px] font-mono tabular-nums ${
                isWeiss ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {dir.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

import { Newspaper, ArrowRight } from 'lucide-react';
import { GlassShimmer } from './GlassShimmer';

interface Props {
  themeMode: 'weiss' | 'bunt';
  onOpenAudit?: () => void;
}

export const GlassNewsCard = ({ themeMode, onOpenAudit }: Props) => {
  const isWeiss = themeMode === 'weiss';

  const newsItems = [
    { title: 'Obsidian 1.13.7 & Bases', date: 'Heute' },
    { title: 'sqlite-vec v0.1.9 Update', date: 'Gestern' },
    { title: 'MCP Spec 2026-07-28', date: '2 Tage' },
  ];

  return (
    <div
      onClick={onOpenAudit}
      className={`rounded-2xl p-4 flex flex-col justify-between glass-rainbow-edge cursor-pointer group glass-telemetry-hover transition-all duration-300 relative ${
        isWeiss ? 'glass-white text-slate-800' : 'glass-bunt text-slate-100'
      }`}
    >
      {/* Futuristic Telemetry Shimmer & Sparkle on Hover */}
      <GlassShimmer themeMode={themeMode} sparklePosition="top-right" />

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Newspaper className={`w-4 h-4 ${isWeiss ? 'text-indigo-600' : 'text-cyan-400'}`} />
          <span className={isWeiss ? 'text-slate-900' : 'text-white'}>News & Release</span>
        </div>
      </div>

      <div className="space-y-1.5 my-1">
        {newsItems.map((item) => (
          <div
            key={item.title}
            className={`flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors ${
              isWeiss ? 'hover:bg-white/70 text-slate-700' : 'hover:bg-white/10 text-slate-200'
            }`}
          >
            <span className="truncate text-[11px] font-medium">{item.title}</span>
            <span
              className={`text-[10px] font-mono shrink-0 ${
                isWeiss ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {item.date}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 group-hover:underline">
        <span>Mehr lesen</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};

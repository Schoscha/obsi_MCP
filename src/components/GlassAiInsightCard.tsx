import { Sparkles, TrendingUp } from 'lucide-react';
import { GlassShimmer } from './GlassShimmer';

interface Props {
  themeMode: 'weiss' | 'bunt';
  onOpenSimulator: () => void;
}

export const GlassAiInsightCard = ({ themeMode, onOpenSimulator }: Props) => {
  const isWeiss = themeMode === 'weiss';

  return (
    <div
      onClick={onOpenSimulator}
      className={`rounded-2xl p-4 flex flex-col justify-between glass-rainbow-edge cursor-pointer group glass-telemetry-hover transition-all duration-300 relative ${
        isWeiss ? 'glass-white text-slate-800' : 'glass-bunt text-slate-100'
      }`}
    >
      {/* Futuristic Telemetry Shimmer & Sparkle on Hover */}
      <GlassShimmer themeMode={themeMode} sparklePosition="top-right" />

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Sparkles className={`w-4 h-4 ${isWeiss ? 'text-indigo-600' : 'text-cyan-300'}`} />
          <span className={isWeiss ? 'text-slate-900' : 'text-white'}>KI-Einblick</span>
        </div>
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
            isWeiss ? 'bg-indigo-50 text-indigo-700' : 'bg-cyan-950/60 text-cyan-300'
          }`}
        >
          RRF Aktiv
        </span>
      </div>

      <p className={`text-xs leading-relaxed my-1 ${isWeiss ? 'text-slate-700' : 'text-slate-200'}`}>
        Deine Aktivität ist heute höher als an 75 % der letzten 7 Tage. Hybrides Retrieval synchronisiert 49.746 Chunks.
      </p>

      {/* Stylized Ascending Sparkline */}
      <div className="h-9 w-full flex items-end justify-between pt-2">
        <svg className="w-full h-8 overflow-visible" viewBox="0 0 160 35">
          <path
            d="M 0,28 Q 30,30 50,18 T 100,14 T 130,8 T 160,2"
            fill="none"
            stroke={isWeiss ? '#4f46e5' : '#22d3ee'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="160" cy="2" r="3.5" fill={isWeiss ? '#4f46e5' : '#22d3ee'} />
        </svg>
      </div>
    </div>
  );
};

import { CloudSun, Activity, ShieldCheck, Zap } from 'lucide-react';
import { GlassShimmer } from './GlassShimmer';

interface Props {
  themeMode: 'weiss' | 'bunt';
}

export const GlassWeatherStatusCard = ({ themeMode }: Props) => {
  const isWeiss = themeMode === 'weiss';

  return (
    <div
      className={`rounded-2xl p-4 flex flex-col justify-between glass-rainbow-edge group glass-telemetry-hover transition-all duration-300 relative ${
        isWeiss ? 'glass-white text-slate-800' : 'glass-bunt text-slate-100'
      }`}
    >
      {/* Futuristic Telemetry Shimmer & Sparkle on Hover */}
      <GlassShimmer themeMode={themeMode} sparklePosition="top-right" />

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs font-bold">
          <CloudSun className={`w-4 h-4 ${isWeiss ? 'text-amber-500' : 'text-amber-400'}`} />
          <span className={isWeiss ? 'text-slate-900' : 'text-white'}>Wetter & System</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-500 font-semibold">● ONLINE</span>
      </div>

      <div className="flex items-center justify-between my-2">
        <div>
          <div className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            18°
          </div>
          <div className={`text-xs font-medium ${isWeiss ? 'text-slate-600' : 'text-slate-300'}`}>
            Bewölkt · Alpen
          </div>
        </div>

        {/* 3D Stylized Glass Cloud / Sun Icon */}
        <div
          className={`w-14 h-12 rounded-xl flex items-center justify-center relative shadow-sm border ${
            isWeiss
              ? 'bg-gradient-to-br from-white/90 to-blue-50/70 border-white text-indigo-600'
              : 'bg-gradient-to-br from-white/20 to-purple-500/20 border-white/30 text-amber-300'
          }`}
        >
          <CloudSun className="w-7 h-7" />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-300/40 text-[11px] font-mono flex items-center justify-between">
        <span className={isWeiss ? 'text-slate-600' : 'text-slate-400'}>p50 Latenz:</span>
        <span className="text-emerald-500 font-bold">23 ms (FTS5 + vec0)</span>
      </div>
    </div>
  );
};

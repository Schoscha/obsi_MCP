import { useState, useEffect } from 'react';
import { Sparkles, Activity, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  completedCount: number;
  totalCount: number;
  activePhaseTitle: string;
}

export const MountainSunsetBanner = ({ completedCount, totalCount, activePhaseTitle }: Props) => {
  const [wavePoints, setWavePoints] = useState<number[]>([]);
  const [animating, setAnimating] = useState(true);

  // Generate dynamic waveform bars inspired by the audio visualizer in the reference
  useEffect(() => {
    const generateInitialPoints = () => {
      const points = [];
      for (let i = 0; i < 70; i++) {
        const x = i / 70;
        // Layered harmonic sine curves
        const base = Math.sin(x * Math.PI * 4) * 0.35 + 0.5;
        const spike = Math.random() * 0.45;
        points.push(Math.max(0.1, Math.min(1.0, base * 0.6 + spike)));
      }
      return points;
    };

    setWavePoints(generateInitialPoints());

    if (!animating) return;

    const interval = setInterval(() => {
      setWavePoints(prev =>
        prev.map((val, idx) => {
          const shift = (Math.random() - 0.5) * 0.2;
          const harmonic = Math.sin(Date.now() / 800 + idx * 0.25) * 0.2;
          return Math.max(0.08, Math.min(0.98, val * 0.7 + (0.5 + harmonic) * 0.3 + shift * 0.2));
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [animating]);

  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#ff7b39]/30 shadow-2xl bg-[#0e0b1c] group">
      {/* SVG Canvas for the Sunset Mountain Landscape matching vorlage.jpg */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          preserveAspectRatio="none"
          viewBox="0 0 1000 400"
        >
          <defs>
            {/* Sky Gradient: Sunset warm amber to rich twilight violet */}
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9654" />
              <stop offset="35%" stopColor="#ff6f3c" />
              <stop offset="65%" stopColor="#a83279" />
              <stop offset="88%" stopColor="#431863" />
              <stop offset="100%" stopColor="#140b2b" />
            </linearGradient>

            {/* Glowing Sun/Atmosphere Glow */}
            <radialGradient id="sunGlow" cx="28%" cy="30%" r="45%">
              <stop offset="0%" stopColor="#ffeed4" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#ffab66" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#ff7b39" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ff7b39" stopOpacity="0" />
            </radialGradient>

            {/* Mountain Layer 1 (Far background - pinkish peach) */}
            <linearGradient id="mountainFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f38181" />
              <stop offset="100%" stopColor="#922b7a" />
            </linearGradient>

            {/* Mountain Layer 2 (Mid distance - warm magenta/burgundy) */}
            <linearGradient id="mountainMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b83b5e" />
              <stop offset="100%" stopColor="#4e1a5e" />
            </linearGradient>

            {/* Mountain Layer 3 (Foreground ridges - deep slate purple) */}
            <linearGradient id="mountainClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6a1b63" />
              <stop offset="100%" stopColor="#170c2d" />
            </linearGradient>

            {/* Glowing Cyan Waveform Gradient */}
            <linearGradient id="cyanWaveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect width="1000" height="400" fill="url(#skyGradient)" />

          {/* Glowing Radial Sun Halo */}
          <circle cx="280" cy="110" r="190" fill="url(#sunGlow)" />

          {/* Sun disc */}
          <circle cx="280" cy="110" r="38" fill="#fff5ea" opacity="0.85" filter="blur(1px)" />

          {/* Far Mountain Range */}
          <polygon
            points="0,400 0,260 90,210 180,240 280,180 370,225 450,170 550,215 670,150 780,210 880,175 1000,220 1000,400"
            fill="url(#mountainFar)"
            opacity="0.65"
          />

          {/* Mid Mountain Range */}
          <polygon
            points="0,400 0,300 120,240 230,285 340,210 440,260 520,195 620,245 740,190 850,250 940,215 1000,270 1000,400"
            fill="url(#mountainMid)"
            opacity="0.85"
          />

          {/* Foreground Sharp Ridges with pine silhouettes */}
          <polygon
            points="0,400 0,330 80,290 190,325 310,250 420,310 510,240 600,295 720,245 830,305 920,265 1000,320 1000,400"
            fill="url(#mountainClose)"
          />

          {/* Silhouetted Pine Trees on slopes */}
          <g fill="#120824" opacity="0.95">
            {/* Clustered pines on right ridge */}
            <polygon points="860,285 864,250 868,285" />
            <polygon points="870,290 875,240 880,290" />
            <polygon points="878,295 883,255 888,295" />
            <polygon points="915,275 920,230 925,275" />
            <polygon points="930,280 934,245 938,280" />
            <polygon points="950,285 956,235 962,285" />
            {/* Clustered pines on left ridge */}
            <polygon points="40,325 44,285 48,325" />
            <polygon points="52,330 57,275 62,330" />
            <polygon points="110,310 114,270 118,310" />
          </g>

          {/* Waveform baseline glowing horizon */}
          <line x1="0" y1="365" x2="1000" y2="365" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>

        {/* HUD Circular Gauges superimposed over the banner - strictly replicating vorlage.jpg */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center gap-4 sm:gap-6 z-10">
          {/* Main Orange Dial Gauge (e.g. 176 - 28) */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 shadow-lg">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#352445"
                  strokeWidth="3.5"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#ff7b39"
                  strokeWidth="3.5"
                  strokeDasharray={`${(percentage / 100) * 113} 113`}
                  strokeLinecap="round"
                  className="transition-all duration-700 glow-orange"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono font-bold text-white tracking-tighter">
                  {completedCount}
                </span>
                <span className="text-[9px] text-orange-400 font-mono -mt-0.5">/ {totalCount}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-300">
                Tasks Gelöst
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 font-display">
                <span>{percentage}% Fertig</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Second HUD Telemetry Ring (e.g. 28 ✓) */}
          <div className="hidden md:flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 shadow-lg">
            <div className="w-9 h-9 rounded-full border-2 border-emerald-400/80 bg-emerald-950/40 flex items-center justify-center text-emerald-300 glow-cyan">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-300">
                Vault Status
              </div>
              <div className="text-xs font-semibold text-emerald-300 font-mono">
                HYBRID READY (23ms)
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Vault Metrics Badge */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-2 z-10">
          <div className="flex items-center gap-2 bg-[#120a22]/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-orange-500/40 text-xs font-mono text-orange-300 shadow-xl">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">2026 AUDIT COMPLIANT</span>
            <span>v1.13.7</span>
          </div>
        </div>

        {/* Bottom Title & Audio/Retrieval Frequency Visualizer Bar (Identical to vorlage.jpg) */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0b0914] via-[#0b0914]/85 to-transparent pt-6 pb-2 px-4 sm:px-8 z-10 flex flex-col justify-end">
          {/* Audio Waveform Equalizer Line along base of mountain */}
          <div className="flex items-end justify-between gap-1 h-12 w-full px-1 overflow-hidden opacity-90">
            {wavePoints.map((height, i) => (
              <div
                key={i}
                className="w-full rounded-t-sm transition-all duration-150"
                style={{
                  height: `${height * 100}%`,
                  background: `linear-gradient(180deg, #22d3ee 0%, rgba(34, 211, 238, 0.2) 100%)`,
                  boxShadow: height > 0.6 ? '0 0 6px rgba(34, 211, 238, 0.6)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Subtitle Telemetry bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-cyan-500/20 pt-2 mt-1">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                RETRIEVAL EQUALIZER
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="hidden sm:inline text-slate-300">
                BM25 FTS5 (1.0/0.5/0.3) &harr; Model2Vec (256d)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-orange-400 font-semibold">{activePhaseTitle}</span>
              <button
                onClick={() => setAnimating(!animating)}
                className="hover:text-cyan-300 transition-colors text-[10px] uppercase tracking-wider underline cursor-pointer"
              >
                {animating ? 'Wellen Pause' : 'Wellen Start'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

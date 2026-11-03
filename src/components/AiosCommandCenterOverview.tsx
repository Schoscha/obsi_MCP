import React, { useState } from 'react';
import {
  Check,
  Circle,
  HelpCircle,
  Settings,
  RefreshCw,
  Box,
  Cpu,
  Inbox,
  Users,
  ListOrdered,
  CheckSquare,
  Activity,
  Share2,
  Sparkles,
  Headphones,
} from 'lucide-react';
import { FuselabGraphCanvas } from './FuselabGraphCanvas';

interface DriverItem {
  id: string;
  label: string;
  done: boolean;
}

interface AiosCommandCenterOverviewProps {
  themeMode: 'weiss' | 'bunt';
  completedChapters: number;
  totalChapters: number;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  onOpenNote: (filename: string) => void;
  onOpenChecklist: () => void;
  onOpenSimulator: () => void;
  onOpenAnalysis: () => void;
  onOpenAudio: () => void;
  onOpenFullGraph: () => void;
}

export const AiosCommandCenterOverview: React.FC<AiosCommandCenterOverviewProps> = ({
  themeMode,
  completedChapters,
  totalChapters,
  activeTab,
  onSelectTab,
  onOpenNote,
  onOpenChecklist,
  onOpenSimulator,
  onOpenAnalysis,
  onOpenAudio,
  onOpenFullGraph,
}) => {
  const isWeiss = themeMode === 'weiss';

  const [drivers, setDrivers] = useState<DriverItem[]>([
    { id: 'd1', label: 'SQLite FTS5 + sqlite-vec Index synchron (49.7k Chunks)', done: true },
    { id: 'd2', label: 'Model2Vec 256d Float32 Embeddings aktiv (30 MB RAM)', done: true },
    { id: 'd3', label: 'Inbox triage (18 neue Captures in 00-inbox/)', done: false },
    { id: 'd4', label: 'Claude Hook ~/.claude.json & 4.000 Token-Cap prüfen', done: false },
    { id: 'd5', label: 'Central.station Agenten-Sync (8 Rechner · 17 Agenten)', done: true },
  ]);

  const [syncPulse, setSyncPulse] = useState(false);

  const toggleDriver = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, done: !d.done } : d))
    );
  };

  const doneDriversCount = drivers.filter((d) => d.done).length;

  const topPrepItems = [
    {
      num: 1,
      title: 'Use Hybrid RRF Fusion (k=60) as primary context engine: BM25 #1 + vec0 #2',
      file: '15 die-vollständige-retrieval-pipeline.md',
    },
    {
      num: 2,
      title: 'Run SQLite FTS5 Porter Stemmer with 10:5:1 column weights on 16.894 notes',
      file: '09 volltextsuche-mit-sqlite-fts5.md',
    },
    {
      num: 3,
      title: 'Use UserPromptSubmit Hook in ~/.claude.json as automatic injection layer',
      file: '20 claude-code-integration.md',
    },
  ];

  const signalsFeeding = [
    {
      col1: 'RETRIEVAL',
      col2: '23 ms p50',
      col3: '1.840 / 4.000 Token Cap',
      action: () => onOpenSimulator(),
    },
    {
      col1: 'INBOX',
      col2: '18 unrouted',
      col3: 'raw capture needs a home',
      action: () => onOpenNote('09 volltextsuche-mit-sqlite-fts5.md'),
    },
    {
      col1: 'AGENTS',
      col2: '17 running',
      col3: 'omarchy (4) · vps (13) live',
      action: () => onOpenFullGraph(),
    },
    {
      col1: 'SECOND.BRAIN',
      col2: '84% Erholung',
      col3: '7h 24m Schlaf · Ring 08:49',
      action: () => onOpenAnalysis(),
    },
  ];

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 ${
        isWeiss ? 'bg-[#f0f7f5] text-[#06201b]' : 'bg-[#060f0d] text-[#ecfdf5]'
      }`}
    >
      {/* =====================================================================
          1. AIOS COMMAND CENTER V3 PANORAMIC HERO BANNER (Emerald/Teal Edition)
         ===================================================================== */}
      <div
        className={`relative rounded-sm border overflow-hidden ${
          isWeiss
            ? 'bg-[#e4f0ec] border-[#9ec2b8]'
            : 'bg-[#081513] border-[#1f4a42] shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
        }`}
      >
        {/* Atmospheric Sci-Fi Horizon / Moon / Mesa SVG Artwork in Emerald & Teal */}
        <svg
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-45"
          viewBox="0 0 1200 120"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="aios-sky" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#050e0c" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#0b2923" stopOpacity="0.65" />
              <stop offset="70%" stopColor="#113832" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#050e0c" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="aios-moon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#34d399" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#081513" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="120" fill="url(#aios-sky)" />
          {/* Rising Cyber Moon */}
          <circle cx="640" cy="48" r="54" fill="url(#aios-moon)" />
          <circle
            cx="640"
            cy="48"
            r="38"
            fill="none"
            stroke="#34d399"
            strokeWidth="0.75"
            strokeDasharray="3 5"
            opacity="0.5"
          />
          {/* Starfield dots */}
          <circle cx="480" cy="22" r="1.2" fill="#a7f3d0" opacity="0.7" />
          <circle cx="525" cy="36" r="1" fill="#22d3ee" opacity="0.6" />
          <circle cx="740" cy="18" r="1.4" fill="#a7f3d0" opacity="0.8" />
          <circle cx="810" cy="32" r="1" fill="#34d399" opacity="0.6" />
          <circle cx="890" cy="20" r="1.2" fill="#22d3ee" opacity="0.5" />
          {/* Desert Mesa / Tectonic Silhouette */}
          <path
            d="M 350 120 L 420 78 L 465 78 L 490 95 L 555 64 L 605 64 L 635 88 L 710 72 L 770 55 L 820 55 L 855 85 L 940 68 L 1040 120 Z"
            fill="#0a201c"
            stroke="#34d399"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
          <path
            d="M 0 104 L 1200 104"
            stroke="#34d399"
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />
        </svg>

        <div className="relative z-10 px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          {/* Left: AIOS Stencil Title */}
          <div className="flex items-baseline gap-3.5">
            <span className="text-3xl sm:text-4xl font-display font-extrabold tracking-[0.08em] text-[#34d399] drop-shadow-[0_0_14px_rgba(52,211,153,0.35)]">
              AIOS
            </span>
            <span
              className={`text-base sm:text-lg font-display font-bold tracking-[0.14em] uppercase ${
                isWeiss ? 'text-[#06201b]' : 'text-[#ecfdf5]'
              }`}
            >
              COMMAND CENTER V3
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono text-[#22d3ee] uppercase tracking-widest">
              // SECOND.BRAIN & CENTRAL.STATION
            </span>
          </div>

          {/* Right: Mode Status Pill + 3 Framed Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <div
              className={`px-3 py-1.5 rounded-sm border flex items-center gap-2 ${
                isWeiss
                  ? 'bg-[#f0f7f5]/90 border-[#9ec2b8] text-[#06201b]'
                  : 'bg-[#050c0a]/85 border-[#1f4a42] text-[#b2d8ce]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span>Mode: Hybrid Sync active · 23ms</span>
            </div>

            <button
              onClick={onOpenAnalysis}
              className={`px-2.5 py-1.5 rounded-sm border flex items-center gap-1.5 cursor-pointer transition-colors ${
                isWeiss
                  ? 'bg-[#f0f7f5] border-[#9ec2b8] hover:border-[#0d9488] text-[#06201b]'
                  : 'bg-[#071311]/90 border-[#285e53] hover:border-[#34d399] text-[#ecfdf5]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#34d399]" />
              <span>SHOW HELP</span>
            </button>

            <button
              onClick={onOpenSimulator}
              className={`px-2.5 py-1.5 rounded-sm border flex items-center gap-1.5 cursor-pointer transition-colors ${
                isWeiss
                  ? 'bg-[#f0f7f5] border-[#9ec2b8] hover:border-[#0d9488] text-[#06201b]'
                  : 'bg-[#071311]/90 border-[#285e53] hover:border-[#34d399] text-[#ecfdf5]'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-[#22d3ee]" />
              <span>SETUP</span>
            </button>

            <button
              onClick={() => {
                setSyncPulse(true);
                setTimeout(() => setSyncPulse(false), 600);
              }}
              className={`px-2.5 py-1.5 rounded-sm border flex items-center gap-1.5 cursor-pointer transition-colors ${
                isWeiss
                  ? 'bg-[#f0f7f5] border-[#9ec2b8] hover:border-[#0d9488] text-[#06201b]'
                  : 'bg-[#071311]/90 border-[#285e53] hover:border-[#34d399] text-[#ecfdf5]'
              }`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#34d399] ${syncPulse ? 'animate-spin' : ''}`}
              />
              <span>REFRESH</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. FLUSH BOXED TAB STRIP (OVERVIEW | METRICS | CONTENT | INBOX | CRM | SETTINGS)
         ===================================================================== */}
      <div className="flex flex-wrap items-center">
        {[
          { id: 'overview', label: 'OVERVIEW' },
          { id: 'canvas', label: 'TOPOLOGY GRAPH' },
          { id: 'rrf', label: 'METRICS & RRF' },
          { id: 'split', label: 'SPLIT STUDIO' },
          { id: 'chapters', label: `32-KAPITEL (${completedChapters}/${totalChapters})` },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-5 py-2 text-xs font-mono font-bold uppercase tracking-[0.12em] border -mr-px transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#34d399] text-[#041311] border-[#34d399] shadow-[0_0_16px_rgba(52,211,153,0.3)] z-10'
                  : isWeiss
                  ? 'bg-[#e4f0ec] text-[#3b6e63] border-[#9ec2b8] hover:text-[#06201b]'
                  : 'bg-[#081513] text-[#99bab2] border-[#1f4a42] hover:text-[#ecfdf5] hover:bg-[#0d211d]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        <button
          onClick={onOpenAudio}
          className={`ml-auto px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 cursor-pointer transition-all ${
            isWeiss
              ? 'bg-[#e4f0ec] border-[#9ec2b8] text-[#06201b]'
              : 'bg-[#0b1f1b] border-[#285e53] text-[#34d399] hover:border-[#34d399]'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>AUDIO BRIEFING</span>
        </button>
      </div>

      {/* =====================================================================
          3. SECTION TITLE: OVERVIEW
         ===================================================================== */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-[0.14em] text-[#22d3ee]">
          OVERVIEW
        </h2>
        <span className="text-[11px] font-mono text-[#689187]">
          Second.brain · Central.station · SQLite FTS5 + vec0
        </span>
      </div>

      {/* =====================================================================
          4. TOP HERO MISSION STRIP + 4 FRAMED KPI COUNTER CARDS
         ===================================================================== */}
      <div
        className={`rounded-sm border p-5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5 ${
          isWeiss
            ? 'bg-[#e4f0ec] border-[#9ec2b8]'
            : 'bg-[#081513] border-[#1f4a42]'
        }`}
      >
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-[#34d399]">
            <Circle className="w-3 h-3 fill-[#34d399]/25" />
            <span>TODAY // AKTUELLER FOKUS</span>
          </div>
          <h3 className="text-lg sm:text-xl font-display font-extrabold uppercase tracking-wide">
            HYBRID RETRIEVAL COCKPIT & AGENTEN-NETZ AUF UNSER GRÜN SYNCHRONISIERT.
          </h3>
          <p className="text-xs font-mono text-[#99bab2] leading-relaxed">
            Kombiniert lexikalische SQLite FTS5 (BM25) Suche, 256d Model2Vec Vektoren und das 11-Rechner Central.station Agenten-Netz in einer Ansicht.
          </p>
        </div>

        {/* 4 Framed Square KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto shrink-0">
          <div
            onClick={onOpenChecklist}
            className={`p-3 rounded-sm border cursor-pointer transition-colors ${
              isWeiss
                ? 'bg-[#f0f7f5] border-[#9ec2b8] hover:border-[#0d9488]'
                : 'bg-[#060f0d] border-[#285e53] hover:border-[#34d399]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#689187]">
              <Box className="w-3 h-3 text-[#34d399]" />
              <span>SETUP</span>
            </div>
            <div className="text-2xl font-display font-extrabold mt-1 text-[#ecfdf5]">
              {completedChapters}/{totalChapters}
            </div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-[#689187] mt-0.5">
              READY CHECKS
            </div>
          </div>

          <div
            className={`p-3 rounded-sm border ${
              isWeiss
                ? 'bg-[#f0f7f5] border-[#9ec2b8]'
                : 'bg-[#060f0d] border-[#285e53]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#689187]">
              <Cpu className="w-3 h-3 text-[#22d3ee]" />
              <span>DRIVERS</span>
            </div>
            <div className="text-2xl font-display font-extrabold mt-1 text-[#34d399]">
              {doneDriversCount}/{drivers.length}
            </div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-[#689187] mt-0.5">
              TODAY DONE
            </div>
          </div>

          <div
            onClick={() => onOpenNote('.indexignore')}
            className={`p-3 rounded-sm border cursor-pointer transition-colors ${
              isWeiss
                ? 'bg-[#f0f7f5] border-[#9ec2b8] hover:border-[#0d9488]'
                : 'bg-[#060f0d] border-[#285e53] hover:border-[#34d399]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#689187]">
              <Inbox className="w-3 h-3 text-[#34d399]" />
              <span>INBOX</span>
            </div>
            <div className="text-2xl font-display font-extrabold mt-1 text-[#22d3ee]">
              18
            </div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-[#689187] mt-0.5">
              CAPTURES
            </div>
          </div>

          <div
            onClick={onOpenFullGraph}
            className={`p-3 rounded-sm border cursor-pointer transition-colors ${
              isWeiss
                ? 'bg-[#f0f7f5] border-[#9ec2b8] hover:border-[#0d9488]'
                : 'bg-[#060f0d] border-[#285e53] hover:border-[#34d399]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#689187]">
              <Users className="w-3 h-3 text-[#34d399]" />
              <span>AGENTS</span>
            </div>
            <div className="text-2xl font-display font-extrabold mt-1 text-[#ecfdf5]">
              17
            </div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-[#689187] mt-0.5">
              8 ONLINE · 2 OFF
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          5. 3-COLUMN TACTICAL COMMAND GRID (TOP 3 PREP | DAILY DRIVERS | SIGNALS)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* COLUMN 1: TOP 3 PREP LIST */}
        <div
          className={`rounded-sm border p-4 flex flex-col justify-between ${
            isWeiss
              ? 'bg-[#e4f0ec] border-[#9ec2b8]'
              : 'bg-[#081513] border-[#1f4a42]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.14em] text-[#34d399]">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>TOP 3 PREP LIST</span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#689187] mt-1 mb-3">
              WHY THESE SURFACED (RRF FUSION)
            </div>

            <div className="space-y-2.5">
              {topPrepItems.map((item) => (
                <div
                  key={item.num}
                  onClick={() => onOpenNote(item.file)}
                  className={`p-3 rounded-sm border flex items-center gap-3 cursor-pointer transition-all ${
                    isWeiss
                      ? 'bg-[#f0f7f5] border-[#9ec2b8] hover:border-[#0d9488]'
                      : 'bg-[#060f0d] border-[#285e53] hover:border-[#34d399]'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full border border-[#285e53] bg-[#0b1f1b] text-[#34d399] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {item.num}
                  </span>
                  <span className="text-xs font-mono leading-snug line-clamp-2">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#1f4a42] flex items-center justify-between text-[10px] font-mono text-[#689187]">
            <span>QUERY: &quot;OAuth Token Rotation&quot;</span>
            <button
              onClick={onOpenSimulator}
              className="text-[#34d399] hover:underline cursor-pointer font-bold"
            >
              [RRF LAB ›]
            </button>
          </div>
        </div>

        {/* COLUMN 2: DAILY DRIVERS (Interactive Green-Tinted Rows!) */}
        <div
          className={`rounded-sm border p-4 flex flex-col justify-between ${
            isWeiss
              ? 'bg-[#e4f0ec] border-[#9ec2b8]'
              : 'bg-[#081513] border-[#1f4a42]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.14em] text-[#34d399]">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>DAILY DRIVERS</span>
              </div>
              <span className="text-[10px] font-mono text-[#22d3ee]">
                {doneDriversCount}/{drivers.length} erledigt
              </span>
            </div>

            <div className="space-y-2">
              {drivers.map((drv) => (
                <button
                  key={drv.id}
                  onClick={() => toggleDriver(drv.id)}
                  className={`w-full px-3 py-2.5 rounded-sm border text-left font-mono text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                    drv.done
                      ? isWeiss
                        ? 'bg-emerald-500/15 border-emerald-600/50 text-[#06201b] font-semibold'
                        : 'bg-[#102d25] border-[#34d399]/60 text-[#ecfdf5] shadow-[inset_0_0_12px_rgba(52,211,153,0.12)]'
                      : isWeiss
                      ? 'bg-[#f0f7f5] border-[#9ec2b8] text-[#3b6e63]'
                      : 'bg-[#060f0d] border-[#285e53] text-[#b2d8ce] hover:border-[#34d399]/50'
                  }`}
                >
                  {drv.done ? (
                    <Check className="w-4 h-4 text-[#34d399] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#689187] shrink-0" />
                  )}
                  <span className="truncate">{drv.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#1f4a42] flex items-center justify-between text-[10px] font-mono text-[#689187]">
            <span>KLICKEN ZUM ABHAKEN</span>
            <button
              onClick={onOpenChecklist}
              className="text-[#34d399] hover:underline cursor-pointer font-bold"
            >
              [ALLE 32 KAPITEL ›]
            </button>
          </div>
        </div>

        {/* COLUMN 3: SIGNALS FEEDING TODAY */}
        <div
          className={`rounded-sm border p-4 flex flex-col justify-between ${
            isWeiss
              ? 'bg-[#e4f0ec] border-[#9ec2b8]'
              : 'bg-[#081513] border-[#1f4a42]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.14em] text-[#34d399] mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>SIGNALS FEEDING TODAY</span>
            </div>

            <div className="divide-y divide-[#1f4a42] font-mono text-xs">
              {signalsFeeding.map((sig) => (
                <div
                  key={sig.col1}
                  onClick={sig.action}
                  className="py-3 flex items-center justify-between gap-2 cursor-pointer hover:bg-emerald-500/5 px-1.5 rounded transition-colors"
                >
                  <span className="font-bold text-[#ecfdf5] tracking-wider w-28 shrink-0">
                    {sig.col1}
                  </span>
                  <span className="text-[#34d399] font-semibold w-24 shrink-0">
                    {sig.col2}
                  </span>
                  <span className="text-[#99bab2] text-right truncate flex-1">
                    {sig.col3}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#1f4a42] flex items-center justify-between text-[10px] font-mono text-[#689187]">
            <span>LIVE TELEMETRIE · :8798</span>
            <button
              onClick={() => onSelectTab('split')}
              className="text-[#22d3ee] hover:underline cursor-pointer font-bold"
            >
              [SPLIT STUDIO ÖFFNEN ›]
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          6. INTEGRATED COMPACT 2.5D SPHERE GRAPH & AGENTEN-NETZ IN OVERVIEW
         ===================================================================== */}
      <div
        className={`rounded-sm border overflow-hidden flex flex-col ${
          isWeiss
            ? 'bg-[#e4f0ec] border-[#9ec2b8]'
            : 'bg-[#081513] border-[#1f4a42]'
        }`}
      >
        <div className="px-4 py-2.5 border-b border-[#1f4a42] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#34d399]" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.14em] text-[#34d399]">
              INTERACTIVE TOPOLOGY // SECOND.BRAIN & CENTRAL.STATION AGENTEN-NETZ
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              2.5D HUD + LUPE
            </span>
          </div>

          <button
            onClick={onOpenFullGraph}
            className="px-3 py-1 rounded-sm text-[10px] font-mono font-bold bg-[#34d399] text-[#041311] hover:bg-[#10b981] cursor-pointer transition-colors"
          >
            [VOLLBILD GRAPH ÖFFNEN]
          </button>
        </div>

        <div className="h-[540px] w-full relative">
          <FuselabGraphCanvas
            themeMode={themeMode}
            onSelectNode={(nodeName, linkedNote) => {
              if (linkedNote) onOpenNote(linkedNote);
            }}
          />
        </div>
      </div>
    </div>
  );
};

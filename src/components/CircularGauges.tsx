import { Database, Cpu, Zap, Radio, Search, Terminal } from 'lucide-react';

interface Props {
  completedTasks: number;
  totalTasks: number;
  criticalCompleted: number;
  totalCritical: number;
}

export const CircularGauges = ({
  completedTasks,
  totalTasks,
  criticalCompleted,
  totalCritical,
}: Props) => {
  const overallPercent = Math.round((completedTasks / totalTasks) * 100);
  const criticalPercent = totalCritical > 0 ? Math.round((criticalCompleted / totalCritical) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* HUD Dial Card 1: Speedometer / Score (Replicating the 275 & circular gauge in vorlage.jpg) */}
      <div className="hud-card-orange p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono text-orange-300">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            VAULT INDEX CORE
          </span>
          <span className="text-[10px] text-slate-400 font-mono">16.894 FILES</span>
        </div>

        <div className="my-3 flex items-center justify-around">
          {/* Radial Circular Meter */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
              {/* Outer tick-track ring */}
              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="#2a1a36"
                strokeWidth="4"
                strokeDasharray="2 3"
              />
              {/* Orange Glowing progress arc */}
              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="#ff7b39"
                strokeWidth="4.5"
                strokeDasharray={`${(overallPercent / 100) * 150} 150`}
                strokeLinecap="round"
                className="transition-all duration-700 glow-orange"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-mono text-white tracking-tight">
                {overallPercent}%
              </span>
              <span className="text-[9px] uppercase font-mono text-orange-400">STATUS</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="bg-black/30 border border-orange-500/20 px-2.5 py-1 rounded">
              <div className="text-[9px] text-slate-400 font-mono">CHUNKS</div>
              <div className="text-sm font-bold font-mono text-orange-200">49.746</div>
            </div>
            <div className="bg-black/30 border border-orange-500/20 px-2.5 py-1 rounded">
              <div className="text-[9px] text-slate-400 font-mono">DB GRÖSSE</div>
              <div className="text-sm font-bold font-mono text-cyan-300">83 MB</div>
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between border-t border-orange-500/20 pt-2">
          <span>Inkrementell: &lt;10s</span>
          <span className="text-emerald-400">WAL aktiv</span>
        </div>
      </div>

      {/* HUD Dial Card 2: Percentage Meter 35% / 60% (Replicating exact card in vorlage.jpg) */}
      <div className="hud-card p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            HYBRID RETRIEVAL RATIO
          </span>
          <span className="text-slate-400 text-[10px]">RRF k=60</span>
        </div>

        <div className="my-3 flex items-center justify-between px-2">
          <div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight flex items-baseline gap-1">
              <span>{criticalPercent}%</span>
              <span className="text-xs text-orange-400 font-normal">Kritisch</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {criticalCompleted} / {totalCritical} Core Tasks
            </div>
          </div>

          <div className="h-12 w-px bg-slate-700/50" />

          <div>
            <div className="text-2xl font-bold font-mono text-cyan-300 tracking-tight flex items-baseline gap-1">
              <span>23<span className="text-sm">ms</span></span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              p50 Query Latenz
            </div>
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="space-y-1 border-t border-purple-500/20 pt-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>BM25 FTS5 (12ms)</span>
            <span>Vektor KNN (8ms)</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="h-full bg-orange-500 w-[55%]" />
            <div className="h-full bg-cyan-400 w-[45%]" />
          </div>
        </div>
      </div>

      {/* HUD Card 3: Metrics 4-Box (Replicating the 611, 700, 1062, 1910 widget in vorlage.jpg) */}
      <div className="hud-card p-4 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-purple-300">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            SYSTEM SPECS 2026
          </span>
          <span className="text-emerald-400 text-[10px]">VERIFIZIERT</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 my-2.5 text-center">
          <div className="bg-black/40 border border-purple-500/20 p-1.5 rounded">
            <div className="text-sm font-bold font-mono text-orange-400">256</div>
            <div className="text-[9px] text-slate-400 font-mono">DIM</div>
          </div>
          <div className="bg-black/40 border border-purple-500/20 p-1.5 rounded">
            <div className="text-sm font-bold font-mono text-cyan-300">30<span className="text-[10px]">MB</span></div>
            <div className="text-[9px] text-slate-400 font-mono">MODEL</div>
          </div>
          <div className="bg-black/40 border border-purple-500/20 p-1.5 rounded">
            <div className="text-sm font-bold font-mono text-purple-300">500x</div>
            <div className="text-[9px] text-slate-400 font-mono">SPEED</div>
          </div>
          <div className="bg-black/40 border border-purple-500/20 p-1.5 rounded">
            <div className="text-sm font-bold font-mono text-emerald-400">0$</div>
            <div className="text-[9px] text-slate-400 font-mono">API COST</div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-400 border-t border-purple-500/20 pt-2 flex items-center justify-between">
          <span>Modell: potion-base-8M</span>
          <span className="text-cyan-400">Reine CPU / NumPy</span>
        </div>
      </div>

      {/* HUD Card 4: Agent & MCP Protocol Bridge */}
      <div className="hud-card p-4 rounded-xl flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            AGENT PROTOKOLL
          </span>
          <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded">
            STDIO
          </span>
        </div>

        <div className="space-y-1.5 my-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Claude Code:</span>
            <span className="text-emerald-400 font-semibold">UserPromptSubmit</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Codex CLI:</span>
            <span className="text-cyan-300">AGENTS.md Bridge</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Obsidian CLI:</span>
            <span className="text-orange-300">v1.12+ Native</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-400 border-t border-slate-700/50 pt-2 flex items-center justify-between">
          <span>Sicherheit: Read-Only Jail</span>
          <span className="text-slate-300">25 Regex Filter</span>
        </div>
      </div>
    </div>
  );
};

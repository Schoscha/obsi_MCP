import { CheckCircle2, ChevronRight, ListTodo } from 'lucide-react';
import { GlassShimmer } from './GlassShimmer';

interface Props {
  themeMode: 'weiss' | 'bunt';
  completedCount: number;
  totalCount: number;
  onOpenChecklist: () => void;
}

export const GlassTodoWidget = ({
  themeMode,
  completedCount,
  totalCount,
  onOpenChecklist,
}: Props) => {
  const isWeiss = themeMode === 'weiss';

  const todoItems = [
    { label: 'Heute (Sprint 2026)', count: 7 },
    { label: 'Diese Woche (Pipeline)', count: 15 },
    { label: 'In Bearbeitung', count: totalCount - completedCount },
    { label: 'Erledigt', count: completedCount, isDone: true },
  ];

  return (
    <div
      onClick={onOpenChecklist}
      className={`rounded-2xl p-4 flex flex-col justify-between glass-rainbow-edge cursor-pointer group glass-telemetry-hover transition-all duration-300 relative ${
        isWeiss ? 'glass-white text-slate-800' : 'glass-bunt text-slate-100'
      }`}
    >
      {/* Futuristic Telemetry Shimmer & Sparkle on Hover */}
      <GlassShimmer themeMode={themeMode} sparklePosition="top-right" />

      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className={`w-4 h-4 ${isWeiss ? 'text-emerald-600' : 'text-emerald-400'}`} />
          <span className={isWeiss ? 'text-slate-900' : 'text-white'}>To-dos</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
          <span>{completedCount}/{totalCount}</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="space-y-1.5 my-1">
        {todoItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors ${
              isWeiss ? 'hover:bg-white/70 text-slate-700' : 'hover:bg-white/10 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isDone
                    ? 'bg-emerald-500'
                    : isWeiss
                    ? 'border border-slate-400'
                    : 'border border-slate-300'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </div>
            <span
              className={`text-[10px] font-mono tabular-nums font-semibold ${
                item.isDone ? 'text-emerald-500' : isWeiss ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

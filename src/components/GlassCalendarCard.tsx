import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassShimmer } from './GlassShimmer';

interface Props {
  themeMode: 'weiss' | 'bunt';
  onSelectDate?: (day: number) => void;
}

export const GlassCalendarCard = ({ themeMode, onSelectDate }: Props) => {
  const isWeiss = themeMode === 'weiss';
  const [selectedDay, setSelectedDay] = useState(22);

  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  // Days in September 2026 (starting Tuesday)
  // August 31 is previous Monday
  const days = [
    { day: 31, isPrev: true },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10 },
    { day: 11 },
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22, isAuditDay: true },
    { day: 23 },
    { day: 24 },
    { day: 25 },
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 1, isNext: true },
    { day: 2, isNext: true },
    { day: 3, isNext: true },
    { day: 4, isNext: true },
  ];

  return (
    <div
      className={`rounded-2xl p-4 flex flex-col justify-between glass-rainbow-edge group glass-telemetry-hover transition-all duration-300 relative ${
        isWeiss ? 'glass-white text-slate-800' : 'glass-bunt text-slate-100'
      }`}
    >
      {/* Futuristic Telemetry Shimmer & Sparkle on Hover */}
      <GlassShimmer themeMode={themeMode} sparklePosition="top-right" />

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-xs font-bold">
          <CalendarIcon className={`w-4 h-4 ${isWeiss ? 'text-indigo-600' : 'text-cyan-400'}`} />
          <span className={isWeiss ? 'text-slate-900' : 'text-white'}>Kalender</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium">
          <span className={isWeiss ? 'text-slate-700' : 'text-slate-200'}>September 2026</span>
          <div className="flex items-center ml-1">
            <button
              className={`p-0.5 rounded hover:scale-110 transition-transform ${
                isWeiss ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-white/20 text-slate-300'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              className={`p-0.5 rounded hover:scale-110 transition-transform ${
                isWeiss ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-white/20 text-slate-300'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-500 mb-1">
        {weekdays.map((wd) => (
          <div key={wd} className="py-0.5">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
        {days.map((item, idx) => {
          const isSelected = selectedDay === item.day && !item.isPrev && !item.isNext;
          const isMuted = item.isPrev || item.isNext;

          return (
            <button
              key={idx}
              onClick={() => {
                if (!isMuted) {
                  setSelectedDay(item.day);
                  if (onSelectDate) onSelectDate(item.day);
                }
              }}
              className={`py-1 rounded-md transition-all cursor-pointer relative ${
                isSelected
                  ? isWeiss
                    ? 'bg-white text-indigo-700 font-bold shadow-md border border-indigo-400/50 scale-105'
                    : 'bg-white/30 text-white font-bold shadow-lg border border-cyan-400/80 scale-105'
                  : isMuted
                  ? 'text-slate-400/60'
                  : isWeiss
                  ? 'hover:bg-white/60 text-slate-700'
                  : 'hover:bg-white/10 text-slate-200'
              }`}
            >
              <span>{item.day}</span>
              {item.isAuditDay && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500 dark:bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

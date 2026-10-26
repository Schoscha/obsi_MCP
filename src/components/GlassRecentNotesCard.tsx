import { Clock, FileText, ChevronRight } from 'lucide-react';
import { GlassShimmer } from './GlassShimmer';

interface Props {
  themeMode: 'weiss' | 'bunt';
  onSelectNote?: (filename: string) => void;
}

export const GlassRecentNotesCard = ({ themeMode, onSelectNote }: Props) => {
  const isWeiss = themeMode === 'weiss';

  const notes = [
    { name: '15 die-vollständige-retrieval-pipeline.md', time: 'Heute, 17:42', tag: 'Hybrid' },
    { name: '04 obsidian-mcp-einrichten.md', time: 'Heute, 15:20', tag: 'MCP' },
    { name: '11 embedding-modelle-auswahl.md', time: 'Heute, 11:08', tag: 'Model2Vec' },
    { name: '14 reciprocal-rank-fusion-rrf.md', time: 'Gestern, 21:37', tag: 'RRF' },
    { name: '20 claude-code-integration.md', time: 'Gestern, 19:14', tag: 'Claude' },
    { name: '09 vault-architektur-ai.md', time: 'Gestern, 16:50', tag: 'Architektur' },
  ];

  return (
    <div
      className={`rounded-2xl p-4 flex flex-col justify-between glass-rainbow-edge group glass-telemetry-hover transition-all duration-300 relative ${
        isWeiss ? 'glass-white text-slate-800' : 'glass-bunt text-slate-100'
      }`}
    >
      {/* Futuristic Telemetry Shimmer & Sparkle on Hover */}
      <GlassShimmer themeMode={themeMode} sparklePosition="top-right" />

      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Clock className={`w-4 h-4 ${isWeiss ? 'text-indigo-600' : 'text-cyan-400'}`} />
          <span className={isWeiss ? 'text-slate-900' : 'text-white'}>Zuletzt geöffnet</span>
        </div>
        <span className={`text-[11px] ${isWeiss ? 'text-slate-600' : 'text-slate-400'}`}>
          6 Dokumente
        </span>
      </div>

      <div className="space-y-1 mt-1">
        {notes.map((note) => (
          <div
            key={note.name}
            onClick={() => onSelectNote && onSelectNote(note.name)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer group ${
              isWeiss
                ? 'hover:bg-white/80 hover:shadow-sm text-slate-700'
                : 'hover:bg-white/15 hover:shadow-md text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <FileText
                className={`w-3.5 h-3.5 shrink-0 ${
                  isWeiss ? 'text-indigo-500' : 'text-cyan-400'
                }`}
              />
              <span className="truncate font-medium text-[11px]">{note.name}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-[10px] font-mono ${
                  isWeiss ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {note.time}
              </span>
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

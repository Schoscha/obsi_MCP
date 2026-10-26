import { useEffect } from 'react';
import {
  X,
  BookOpen,
  CheckCircle,
  ShieldCheck,
  Zap,
  Layers,
  AlertTriangle,
  Headphones,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeMode: 'weiss' | 'bunt';
  onOpenChecklist: () => void;
  onOpenAudio?: () => void;
}

export const GlassAnalysisModal = ({
  isOpen,
  onClose,
  themeMode,
  onOpenChecklist,
  onOpenAudio,
}: Props) => {
  const isWeiss = themeMode === 'weiss';

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="analysis-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl max-h-[92vh] rounded flex flex-col overflow-hidden border shadow-2xl transition-colors duration-150 ${
          isWeiss
            ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C]'
            : 'bg-[#1e1b14] border-[#2E2A20] text-[#e8e2d6]'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isWeiss ? 'bg-[#EBE8DF] border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-[#E54D2E] text-[#F5F3EC]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="analysis-modal-title"
                className="text-base sm:text-lg font-bold font-display uppercase tracking-tight"
              >
                Architektur-Audit & Sinnhaftigkeits-Analyse
              </h2>
              <p className="text-xs font-mono text-[#9b968a]">
                Blake Crosley 2026 Leitfaden · Ist die kombinierte Version umsetzbar?
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Analyse schließen"
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              isWeiss
                ? 'border-[#D6D2C4] hover:bg-[#E2DFD5] text-[#15130C]'
                : 'border-[#2E2A20] hover:bg-[#2c2a22] text-[#cac6ba]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs font-mono leading-relaxed">
          <div
            className={`p-4 rounded border ${
              isWeiss
                ? 'bg-emerald-950/5 border-emerald-600/40 text-[#15130C]'
                : 'bg-emerald-950/20 border-emerald-500/40 text-[#e8e2d6]'
            }`}
          >
            <div className="flex items-center gap-2 font-display font-bold text-sm mb-1 text-emerald-500">
              <CheckCircle className="w-4 h-4" />
              <span>FAZIT: HOCHGRADIG SINNVOLL & 100% PRAXISTAUGLICH</span>
            </div>
            <p>
              Die Kombination aus <strong>Obsidian MCP</strong>, <strong>SQLite FTS5 (BM25)</strong>,{' '}
              <strong>sqlite-vec</strong>, <strong>Model2Vec</strong> und <strong>Claude Code</strong> löst das
              größte Problem moderner KI-Agenten: <em>Fehlender lokaler Kontext ohne Latenz oder Cloud-Abhängigkeit.</em>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`p-4 rounded border ${
                isWeiss ? 'bg-[#EBE8DF]/70 border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
              }`}
            >
              <div className="flex items-center gap-2 font-display font-bold mb-2">
                <Zap className="w-4 h-4 text-[#E54D2E]" />
                <span>1. Sinn & Fusion</span>
              </div>
              <p className={isWeiss ? 'text-[#5C584D]' : 'text-[#cac6ba]'}>
                Reine Vektorsuche scheitert bei exakten Bezeichnern (Funktionsnamen, Ticket-IDs). Reine Keyword-Suche scheitert bei Synonymen. Die RRF-Fusion (k = 60) kombiniert beide Ranglisten verlustfrei.
              </p>
            </div>

            <div
              className={`p-4 rounded border ${
                isWeiss ? 'bg-[#EBE8DF]/70 border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
              }`}
            >
              <div className="flex items-center gap-2 font-display font-bold mb-2">
                <ShieldCheck className="w-4 h-4 text-[#7bd0ff]" />
                <span>2. Machbarkeit</span>
              </div>
              <p className={isWeiss ? 'text-[#5C584D]' : 'text-[#cac6ba]'}>
                Vollständig lokal. Durch <strong>Model2Vec (30 MB)</strong> und <strong>SQLite</strong> entfällt jeglicher GPU- oder Cloud-Zwang. 16.000 Notizen indizieren in 4 Minuten, Abfragen dauern 23 ms.
              </p>
            </div>

            <div
              className={`p-4 rounded border ${
                isWeiss ? 'bg-[#EBE8DF]/70 border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
              }`}
            >
              <div className="flex items-center gap-2 font-display font-bold mb-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>3. Agenten-Hooks</span>
              </div>
              <p className={isWeiss ? 'text-[#5C584D]' : 'text-[#cac6ba]'}>
                Über <code>UserPromptSubmit</code>-Hooks in Claude Code injiziert das System den relevanten Kontext (max. 1.500–4.000 Tokens), ohne den Prompt Cache zu invalidieren.
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded border ${
              isWeiss
                ? 'bg-amber-500/10 border-amber-500/40'
                : 'bg-amber-950/20 border-amber-500/30'
            }`}
          >
            <div className="flex items-center gap-2 font-display font-bold text-amber-500 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>DIE 3 KRITISCHEN FALLSTRICKE AUS DEM LEITFADEN:</span>
            </div>
            <ul className="space-y-1.5 pl-1">
              <li>
                <strong>1. NPM Namenskollision:</strong> <code>obsidian-mcp</code> (StevenStavrakis) verwenden – nicht das Plugin-gebundene Paket.
              </li>
              <li>
                <strong>2. Pfad für Claude Code MCP:</strong> Muss in <code>~/.claude.json</code> registriert werden (nicht in <code>settings.json</code>).
              </li>
              <li>
                <strong>3. Token-Budget-Deckelung:</strong> Kontext zwingend auf max. 4.000 Tokens kappen, um Kontext-Rotting zu verhindern.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3.5 border-t flex flex-wrap gap-2 items-center justify-between ${
            isWeiss ? 'bg-[#EBE8DF] border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
          }`}
        >
          <span className="text-xs font-mono text-[#9b968a]">
            Alle 32 Kapitel stehen als interaktive Taskliste & Audio-Erklärung bereit.
          </span>
          <div className="flex items-center gap-2">
            {onOpenAudio && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAudio();
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isWeiss
                    ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C]'
                    : 'bg-[#221f18] border-[#2E2A20] text-[#7bd0ff]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>AUDIO BRIEFING</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenChecklist();
              }}
              className="px-3.5 py-1.5 rounded text-xs font-mono font-semibold transition-colors cursor-pointer bg-[#E54D2E] hover:bg-[#ff5c3d] text-[#F5F3EC]"
            >
              ZUR 32-KAPITEL MATRIX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

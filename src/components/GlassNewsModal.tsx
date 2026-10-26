import { useEffect } from 'react';
import { X, Newspaper, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeMode: 'weiss' | 'bunt';
}

export const GlassNewsModal = ({ isOpen, onClose, themeMode }: Props) => {
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

  const articles = [
    {
      title: 'Obsidian 1.13.7 & Bases Release',
      date: '22. September 2026',
      badge: 'OBSIDIAN CORE',
      summary:
        'Obsidian führt native Bases als Alternative zu Dataview ein. Frontmatter-Schema-Validierung und verbesserte Canvas-Leistung für Großvaults (>100.000 Markdown-Dateien).',
      highlights: [
        'Schnellere Indizierung ohne UI-Lag',
        'Native Properties-Filterung direkt im Core',
        'Strikte Markdown-Konformität (keine Vendor-Locks)',
      ],
    },
    {
      title: 'sqlite-vec v0.1.9 Update',
      date: '21. September 2026',
      badge: 'C EXTENSION',
      summary:
        'Null-Abhängigkeiten C-Erweiterung für SQLite. 256-dimensionale Model2Vec Vektoren können jetzt mit SIMD-beschleunigtem Kosinus-Abstand direkt in SQL abgefragt werden.',
      highlights: [
        'AVX-512 & NEON Beschleunigung',
        'Nur 3 Millisekunden für 50.000 Vektoren',
        'Transaktionssichere Speicherung in derselben .sqlite-Datei wie FTS5',
      ],
    },
    {
      title: 'MCP Spezifikation Update (Model Context Protocol)',
      date: '20. September 2026',
      badge: 'ANTHROPIC SPEC',
      summary:
        'Klarstellung zur Standard-Einbindung von MCP-Servern über STDIO. Claude Code bindet lokale Vaults über UserPromptSubmit Hooks ein und verhindert das Auslaufen interner Notizen.',
      highlights: [
        'Lokaler STDIO Transport ohne offene HTTP-Ports',
        'Token-Budget-Begrenzung auf 4.000 Tokens',
        '.indexignore Konvention wird nativ respektiert',
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl max-h-[90vh] rounded flex flex-col overflow-hidden border shadow-2xl transition-colors duration-150 ${
          isWeiss
            ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C]'
            : 'bg-[#1e1b14] border-[#2E2A20] text-[#e8e2d6]'
        }`}
      >
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isWeiss ? 'bg-[#EBE8DF] border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-[#E54D2E] text-[#F5F3EC]">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="news-modal-title"
                className="text-base sm:text-lg font-bold font-display uppercase tracking-tight"
              >
                Changelog & System-Releases 2026
              </h2>
              <p className="text-xs font-mono text-[#9b968a]">
                Aktuelle Updates aus dem Obsidian-, SQLite- und MCP-Ökosystem
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Changelog schließen"
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              isWeiss
                ? 'border-[#D6D2C4] hover:bg-[#E2DFD5] text-[#15130C]'
                : 'border-[#2E2A20] hover:bg-[#2c2a22] text-[#cac6ba]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {articles.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded border transition-colors ${
                isWeiss
                  ? 'bg-[#EBE8DF]/60 border-[#D6D2C4]'
                  : 'bg-[#15130c] border-[#2E2A20]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-[#E54D2E]/15 text-[#E54D2E] border border-[#E54D2E]/30">
                  {item.badge}
                </span>
                <span className="text-[11px] font-mono text-[#9b968a]">{item.date}</span>
              </div>

              <h3 className="text-sm font-display font-bold mb-1.5">{item.title}</h3>

              <p
                className={`text-xs font-mono leading-relaxed mb-3 ${
                  isWeiss ? 'text-[#5C584D]' : 'text-[#cac6ba]'
                }`}
              >
                {item.summary}
              </p>

              <div className="space-y-1 font-mono text-xs">
                {item.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

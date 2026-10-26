import { useState, useEffect } from 'react';
import { X, Cpu, Search } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeMode: 'weiss' | 'bunt';
}

export const GlassSimulatorModal = ({ isOpen, onClose, themeMode }: Props) => {
  const isWeiss = themeMode === 'weiss';

  const [kParam, setKParam] = useState(60);
  const [bm25Weight, setBm25Weight] = useState(1.0);
  const [vecWeight, setVecWeight] = useState(1.0);
  const [testQuery, setTestQuery] = useState('OAuth Token Rotation');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sampleChunks = [
    {
      id: 1,
      file: '03-resources/security/oauth-rotation.md',
      section: '## Token Rotation Strategy',
      keywords: ['oauth', 'token', 'rotation', 'refresh', 'security', 'jwt'],
      bm25Rank: 1,
      vecRank: 2,
      text: 'Der Refresh-Token-Flow erfordert strikte Rotation. Bei jedem Austausch wird ein neuer Refresh-Token generiert und das Vorgänger-Token invalidiert.',
    },
    {
      id: 2,
      file: '01-projects/auth-service/session.md',
      section: '## Session Expiry & FastAPI Middleware',
      keywords: ['session', 'expiry', 'fastapi', 'middleware', 'jwt', 'oauth'],
      bm25Rank: 14,
      vecRank: 1,
      text: 'Behandlung abgelaufener Benutzersitzungen in der FastAPI-Middleware: Vor dem API-Aufruf prüft der Dependency-Injector die JWT-Gültigkeit.',
    },
    {
      id: 3,
      file: '05-signals/security/token-storage.md',
      section: '## Secure Cookie Storage',
      keywords: ['token', 'storage', 'cookie', 'httponly', 'security'],
      bm25Rank: 3,
      vecRank: 8,
      text: 'Tokens niemals im LocalStorage speichern. Verwende stattdessen HttpOnly-Cookies mit SameSite=Strict und kurzem TTL.',
    },
    {
      id: 4,
      file: '05-signals/ai-tooling/mcp-auth.md',
      section: '## MCP STDIO & Review Aggregator',
      keywords: ['mcp', 'stdio', 'review', 'aggregator', 'claude', 'hook'],
      bm25Rank: null,
      vecRank: 4,
      text: 'Der MCP-Server läuft im lokalen STDIO-Modus. Der wöchentliche Review-Aggregator konsolidiert 00-inbox und 06-daily unter dem 4.000-Token-Cap.',
    },
  ];

  const qLower = testQuery.trim().toLowerCase();

  const calculatedResults = sampleChunks
    .map((chunk) => {
      const matchesQuery =
        !qLower ||
        chunk.file.toLowerCase().includes(qLower) ||
        chunk.section.toLowerCase().includes(qLower) ||
        chunk.text.toLowerCase().includes(qLower) ||
        chunk.keywords.some((kw) => qLower.includes(kw));

      const boost = matchesQuery ? 1.0 : 0.65;
      const bm25Score = chunk.bm25Rank ? (bm25Weight * boost) / (kParam + chunk.bm25Rank) : 0;
      const vecScore = chunk.vecRank ? (vecWeight * boost) / (kParam + chunk.vecRank) : 0;
      const totalScore = bm25Score + vecScore;
      return {
        ...chunk,
        bm25Score,
        vecScore,
        totalScore,
        inBoth: chunk.bm25Rank !== null && chunk.vecRank !== null,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const presets = ['OAuth Token Rotation', 'FastAPI Middleware', 'MCP Review Aggregator'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="simulator-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl max-h-[90vh] rounded flex flex-col overflow-hidden border shadow-2xl transition-colors duration-150 ${
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
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="simulator-modal-title"
                className="text-base sm:text-lg font-bold font-display uppercase tracking-tight"
              >
                RRF Simulator & Hybrides Ranking
              </h2>
              <p className="text-xs font-mono text-[#9b968a]">
                Reciprocal Rank Fusion (k = {kParam}) · SQLite FTS5 + sqlite-vec (256d)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Simulator schließen"
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              isWeiss
                ? 'border-[#D6D2C4] hover:bg-[#E2DFD5] text-[#15130C]'
                : 'border-[#2E2A20] hover:bg-[#2c2a22] text-[#cac6ba]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input & Presets + Sliders */}
        <div
          className={`p-4 sm:p-5 border-b space-y-4 ${
            isWeiss ? 'bg-[#EBE8DF]/60 border-[#D6D2C4]' : 'bg-[#221f18] border-[#2E2A20]'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9b968a]" />
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Hybrid-Query testen (z.B. OAuth Token Rotation)..."
                aria-label="Test-Suchanfrage"
                className={`w-full pl-8 pr-3 py-1.5 rounded text-xs font-mono outline-none border transition-colors ${
                  isWeiss
                    ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C] focus:border-[#E54D2E]'
                    : 'bg-[#15130c] border-[#2E2A20] text-[#e8e2d6] focus:border-[#E54D2E]'
                }`}
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setTestQuery(preset)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono border cursor-pointer transition-colors ${
                    testQuery === preset
                      ? 'bg-[#E54D2E] text-[#F5F3EC] border-[#E54D2E] font-semibold'
                      : isWeiss
                      ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#5C584D] hover:text-[#15130C]'
                      : 'bg-[#15130c] border-[#2E2A20] text-[#9b968a] hover:text-[#e8e2d6]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>RRF KONSTANTE (k):</span>
                <span className="text-[#E54D2E] font-bold">{kParam}</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                value={kParam}
                onChange={(e) => setKParam(Number(e.target.value))}
                className="w-full accent-[#E54D2E] cursor-pointer"
              />
              <div className="text-[10px] text-[#9b968a] mt-0.5">Standard: k = 60</div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>BM25 GEWICHTUNG:</span>
                <span className="text-amber-500 font-bold">{bm25Weight.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={bm25Weight}
                onChange={(e) => setBm25Weight(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="text-[10px] text-[#9b968a] mt-0.5">FTS5 Porter Stemmer</div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>VEKTOR GEWICHTUNG:</span>
                <span className="text-[#7bd0ff] font-bold">{vecWeight.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={vecWeight}
                onChange={(e) => setVecWeight(Number(e.target.value))}
                className="w-full accent-[#7bd0ff] cursor-pointer"
              />
              <div className="text-[10px] text-[#9b968a] mt-0.5">Model2Vec 256d KNN</div>
            </div>
          </div>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          <div className="text-[10px] font-mono font-bold text-[#9b968a] uppercase tracking-[0.12em] mb-2">
            FUSED RETRIEVAL RANKING (SCORE = w_bm25/(k + r_bm25) + w_vec/(k + r_vec)):
          </div>

          {calculatedResults.map((item, idx) => (
            <div
              key={item.id}
              className={`p-3.5 rounded border transition-colors ${
                idx === 0
                  ? isWeiss
                    ? 'bg-[#EBE8DF] border-[#E54D2E]'
                    : 'bg-[#15130c] border-[#E54D2E]'
                  : isWeiss
                  ? 'bg-[#F5F3EC] border-[#D6D2C4]'
                  : 'bg-[#15130c] border-[#2E2A20]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      idx === 0
                        ? 'bg-[#E54D2E] text-[#F5F3EC]'
                        : isWeiss
                        ? 'bg-[#EBE8DF] text-[#15130C] border border-[#D6D2C4]'
                        : 'bg-[#221f18] text-[#cac6ba] border border-[#2E2A20]'
                    }`}
                  >
                    #{idx + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold truncate">{item.file}</div>
                    <div className="text-[11px] font-mono text-[#9b968a]">{item.section}</div>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-xs font-bold text-emerald-500">
                    RRF: {item.totalScore.toFixed(4)}
                  </div>
                  {item.inBoth && (
                    <span className="text-[10px] font-semibold text-[#E54D2E]">
                      ★ DUAL HIT (BM25 + VEC0)
                    </span>
                  )}
                </div>
              </div>

              <p
                className={`text-xs mt-2 font-mono p-2.5 rounded border ${
                  isWeiss
                    ? 'bg-[#EBE8DF]/70 border-[#D6D2C4] text-[#15130C]'
                    : 'bg-[#100e07] border-[#2E2A20] text-[#cac6ba]'
                }`}
              >
                {item.text}
              </p>

              <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-[#9b968a]">
                <span>
                  BM25 Rang:{' '}
                  <strong className="text-amber-500">
                    {item.bm25Rank !== null ? `#${item.bm25Rank}` : '—'}
                  </strong>
                </span>
                <span>
                  Vektor Rang:{' '}
                  <strong className="text-[#7bd0ff]">
                    {item.vecRank !== null ? `#${item.vecRank}` : '—'}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

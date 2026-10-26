import { useState } from 'react';
import {
  Layers,
  Search,
  Cpu,
  Database,
  ArrowRight,
  Shield,
  Zap,
  Sliders,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';

interface MockChunk {
  id: string;
  title: string;
  section: string;
  file: string;
  textSnippet: string;
  bm25Rank: number | null;
  vecRank: number | null;
}

export const ArchitectureSimulator = () => {
  const [activeTab, setActiveTab] = useState<'rrf' | 'layers'>('rrf');

  // RRF Calculator State
  const [queryPreset, setQueryPreset] = useState<'oauth' | 'fastapi' | 'review' | 'custom'>('review');
  const [customQuery, setCustomQuery] = useState('how does the review aggregator handle disagreements');
  const [rrfK, setRrfK] = useState<number>(60);
  const [bm25Weight, setBm25Weight] = useState<number>(1.0);
  const [vecWeight, setVecWeight] = useState<number>(1.0);

  // Mock candidates based on Blake Crosley's reference dataset
  const sampleDatasets: Record<string, MockChunk[]> = {
    review: [
      {
        id: 'c-1',
        title: 'Disagreement Resolution Engine',
        section: '## Disagreement Resolution',
        file: '01-projects/review-aggregator.py',
        textSnippet: 'When two reviewers give conflicting classifications, apply weighted majority scoring...',
        bm25Rank: 3,
        vecRank: 1,
      },
      {
        id: 'c-2',
        title: 'Multi-Reviewer Consensus Patterns',
        section: '## Multi-Reviewer Deliberation',
        file: '03-resources/programming/code-review-patterns.md',
        textSnippet: 'Strategies for handling architectural disputes across pull requests in distributed teams...',
        bm25Rank: 4,
        vecRank: 2,
      },
      {
        id: 'c-3',
        title: 'Review Aggregator Config',
        section: '## Review Weights & Rules',
        file: '01-projects/deliberation-config.json',
        textSnippet: '{"review": {"weight": 1.0, "aggregator": true, "strict": false}}',
        bm25Rank: 1,
        vecRank: null, // Missed by vector search because it's raw JSON!
      },
      {
        id: 'c-4',
        title: 'Team Conflict Resolution in Code',
        section: '## Conflict Mediation',
        file: '02-areas/engineering-management.md',
        textSnippet: 'Navigating technical deadlock when consensus cannot be achieved through asynchronous comments...',
        bm25Rank: null, // Missed by BM25 (no exact match for "aggregator")
        vecRank: 3,
      },
      {
        id: 'c-5',
        title: 'PostToolUse Review Hooks',
        section: '## PostToolUse Review',
        file: '05-signals/ai-tooling/claude-hooks.md',
        textSnippet: 'Capturing tool output review signals to summarize test failures and linter warnings...',
        bm25Rank: 2,
        vecRank: 5,
      },
    ],
    oauth: [
      {
        id: 'o-1',
        title: 'Token Rotation Strategy',
        section: '## Token Rotation Strategy',
        file: '03-resources/security/oauth-token-rotation.md',
        textSnippet: 'The rotation interval depends on the threat model. Invalidate refresh token on reuse...',
        bm25Rank: 1,
        vecRank: 1,
      },
      {
        id: 'o-2',
        title: 'OAuth Error Recovery & Session Expiry',
        section: '## Expired Tokens Handling',
        file: '03-resources/security/session-management.md',
        textSnippet: 'Handling mid-flight token expiration gracefully in API client middleware...',
        bm25Rank: 2,
        vecRank: 2,
      },
      {
        id: 'o-3',
        title: 'FastAPI Auth Middleware',
        section: '## Bearer Token Dependency',
        file: '01-projects/api-gateway/auth.py',
        textSnippet: 'async def get_current_user(token: str = Depends(oauth2_scheme)): ...',
        bm25Rank: 3,
        vecRank: 4,
      },
    ],
    fastapi: [
      {
        id: 'f-1',
        title: 'Async Generator Dependencies',
        section: '## Yield Dependencies in FastAPI',
        file: '03-resources/programming/fastapi-di.md',
        textSnippet: 'FastAPI dependency injection with async generators requires yield, not return. The generator handles lifecycle.',
        bm25Rank: 1,
        vecRank: 1,
      },
      {
        id: 'f-2',
        title: 'Database Session Lifecycle',
        section: '## Session Scoping with Depends',
        file: '03-resources/programming/sqlalchemy-async.md',
        textSnippet: 'Ensuring transactions close reliably upon request completion...',
        bm25Rank: 2,
        vecRank: 3,
      },
    ],
    custom: [
      {
        id: 'cu-1',
        title: 'Query Result A (Exact Match)',
        section: '## Exact Definition',
        file: '01-projects/core-engine.py',
        textSnippet: 'Direct syntactic match on queried symbols and keywords.',
        bm25Rank: 1,
        vecRank: 4,
      },
      {
        id: 'cu-2',
        title: 'Query Result B (Conceptual Match)',
        section: '## Conceptual Architecture',
        file: '03-resources/architecture-patterns.md',
        textSnippet: 'Semantically rich explanation describing the queried concept using alternative terminology.',
        bm25Rank: 4,
        vecRank: 1,
      },
      {
        id: 'cu-3',
        title: 'Query Result C (Balanced Match)',
        section: '## Implementation & Synthesis',
        file: '05-signals/systems/synthesis.md',
        textSnippet: 'Cohesive synthesis matching both technical terminology and conceptual intent.',
        bm25Rank: 2,
        vecRank: 2,
      },
    ],
  };

  const currentChunks = sampleDatasets[queryPreset] || sampleDatasets.review;

  // Calculate RRF scores: score = sum(weight / (k + rank))
  const fusedResults = currentChunks
    .map((chunk) => {
      let rrfScore = 0;
      if (chunk.bm25Rank !== null) {
        rrfScore += bm25Weight / (rrfK + chunk.bm25Rank);
      }
      if (chunk.vecRank !== null) {
        rrfScore += vecWeight / (rrfK + chunk.vecRank);
      }
      return {
        ...chunk,
        rrfScore,
      };
    })
    .sort((a, b) => b.rrfScore - a.rrfScore);

  return (
    <div className="space-y-4">
      {/* Navigation sub-tabs */}
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3">
        <button
          onClick={() => setActiveTab('rrf')}
          className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer flex items-center gap-2 transition-all ${
            activeTab === 'rrf'
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 bg-black/20'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Interaktiver RRF Fusion Rechner</span>
        </button>

        <button
          onClick={() => setActiveTab('layers')}
          className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer flex items-center gap-2 transition-all ${
            activeTab === 'layers'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
              : 'text-slate-400 hover:text-slate-200 bg-black/20'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3-Ebenen Architektur-Explorer</span>
        </button>
      </div>

      {activeTab === 'rrf' ? (
        <div className="space-y-4">
          {/* Controls Panel */}
          <div className="hud-card p-4 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold font-display text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  Reciprocal Rank Fusion (RRF) Mathematischer Simulator
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Formel: <span className="text-cyan-300 font-bold">score(d) = Σ [ weight / (k + rank) ]</span>
                </p>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => {
                    setQueryPreset('review');
                    setCustomQuery('how does the review aggregator handle disagreements');
                  }}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    queryPreset === 'review'
                      ? 'bg-orange-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Review Disagreements
                </button>
                <button
                  onClick={() => {
                    setQueryPreset('oauth');
                    setCustomQuery('oauth token rotation strategy and refresh');
                  }}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    queryPreset === 'oauth'
                      ? 'bg-orange-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  OAuth Rotation
                </button>
                <button
                  onClick={() => {
                    setQueryPreset('fastapi');
                    setCustomQuery('fastapi dependency injection async generator');
                  }}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    queryPreset === 'fastapi'
                      ? 'bg-orange-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  FastAPI DI
                </button>
              </div>
            </div>

            {/* Slider Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-purple-500/20 text-xs font-mono">
              {/* k Constant */}
              <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300">Glättungskonstante k:</span>
                  <span className="text-orange-400 font-bold text-sm">{rrfK}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={rrfK}
                  onChange={(e) => setRrfK(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>k=10 (Top dominiert)</span>
                  <span>k=60 (Standard Cormack)</span>
                  <span>k=100 (Dual-Treffer)</span>
                </div>
              </div>

              {/* BM25 Weight */}
              <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300">BM25 Gewichtung:</span>
                  <span className="text-amber-400 font-bold text-sm">{bm25Weight.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={bm25Weight}
                  onChange={(e) => setBm25Weight(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 mt-1">
                  Exakte Schlüsselwörter, Dateinamen, Fehlercodes
                </div>
              </div>

              {/* Vector Weight */}
              <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300">Vektor (KNN) Gewichtung:</span>
                  <span className="text-cyan-400 font-bold text-sm">{vecWeight.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={vecWeight}
                  onChange={(e) => setVecWeight(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500 mt-1">
                  Semantische Synonyme, Konzepte & Beschreibungen
                </div>
              </div>
            </div>
          </div>

          {/* Fusion Live Results Table */}
          <div className="hud-card p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">FUSIONSERGEBNISSE NACH RRF-RANKING</span>
              <span className="text-emerald-400">
                Top {fusedResults.length} Kandidaten aggregiert
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-purple-500/30 text-slate-400 pb-2">
                    <th className="py-2 px-2">Rang</th>
                    <th className="py-2 px-2">Dokument & Abschnitt</th>
                    <th className="py-2 px-2 text-center">BM25 Rang</th>
                    <th className="py-2 px-2 text-center">Vektor Rang</th>
                    <th className="py-2 px-2 text-right">RRF Score</th>
                    <th className="py-2 px-2">Dual Source?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {fusedResults.map((item, idx) => {
                    const isDual = item.bm25Rank !== null && item.vecRank !== null;
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-purple-950/20 transition-colors ${
                          idx === 0 ? 'bg-orange-950/20 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-2">
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                              idx === 0
                                ? 'bg-[#E54D2E] text-[#F5F3EC]'
                                : idx === 1
                                ? 'bg-[#2c2a22] text-[#e8e2d6] border border-[#2E2A20]'
                                : 'bg-[#1e1b14] text-[#9b968a] border border-[#2E2A20]'
                            }`}
                          >
                            #{idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2 max-w-xs">
                          <div className="text-slate-100 font-medium truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {item.file} · {item.section}
                          </div>
                          <div className="text-[10px] text-slate-500 italic truncate mt-0.5">
                            "{item.textSnippet}"
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {item.bm25Rank ? (
                            <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
                              #{item.bm25Rank}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {item.vecRank ? (
                            <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-400/30">
                              #{item.vecRank}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="text-orange-300 font-bold font-mono">
                            {item.rrfScore.toFixed(5)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {isDual ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                              <CheckCircle className="w-3 h-3" /> Beides
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Einseitig</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-[#120e28] p-3 rounded-lg border border-purple-500/20 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-mono">
                <span className="text-cyan-300 font-bold">Erkenntnis aus der Forschung (MS MARCO & TREC):</span> Chunks, die sowohl in BM25 als auch in der Vektorsuche auftreten, werden durch RRF mathematisch massiv nach oben katapultiert. Reines Keyword-Matching (wie die Konfigurationsdatei #1) stürzt ab, während die echte Kernlogik zur Konfliktauflösung gewinnt!
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 3-Ebenen Architecture Model Viewer */
        <div className="hud-card p-5 rounded-xl space-y-6">
          <div>
            <h4 className="text-base font-bold font-display text-white">
              Das 3-Ebenen Architektur-Modell (Blake Crosley Referenz 2026)
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Strikte Entkopplung von Intake (Kuratierung), Retrieval (Engine) und Integration (Agenten)
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Layer 3: Integration */}
            <div className="bg-[#1c1338]/80 border-2 border-amber-500/40 rounded-xl p-4 relative shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  3. INTEGRATION LAYER (AGENT PROTOKOLL)
                </div>
                <span className="text-[10px] bg-amber-950/80 border border-amber-500/40 text-amber-200 px-2 py-0.5 rounded">
                  MCP (STDIO) & HOOKS
                </span>
              </div>
              <p className="text-slate-300 mb-3">
                Liefert formatierten, tokenbegrenzten Kontext an Claude Code, Codex CLI, Cursor & Windsurf.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="bg-black/40 p-2 rounded border border-amber-500/20">
                  <div className="text-amber-400 font-semibold">UserPromptSubmit Hook</div>
                  <div className="text-slate-400">Automatische Kontextinjektion (1.500 Tokens)</div>
                </div>
                <div className="bg-black/40 p-2 rounded border border-amber-500/20">
                  <div className="text-amber-400 font-semibold">PostToolUse Hook</div>
                  <div className="text-slate-400">Erkenntniserfassung komprimierter Logs</div>
                </div>
                <div className="bg-black/40 p-2 rounded border border-amber-500/20">
                  <div className="text-amber-400 font-semibold">obsidian_bridge.py</div>
                  <div className="text-slate-400">Singleton Python API für Tooling</div>
                </div>
              </div>
            </div>

            {/* Connecting flow arrow */}
            <div className="flex justify-center text-cyan-400 -my-2">
              <span className="bg-black/60 px-3 py-1 rounded-full border border-cyan-500/30 text-[10px]">
                &uarr; &darr; Abfragen & Rank-Ergebnisse (23ms p50)
              </span>
            </div>

            {/* Layer 2: Retrieval */}
            <div className="bg-[#151a42]/80 border-2 border-cyan-500/40 rounded-xl p-4 relative shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  2. RETRIEVAL LAYER (HYBRIDE SUCHE)
                </div>
                <span className="text-[10px] bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 px-2 py-0.5 rounded">
                  FTS5 + SQLITE-VEC + RRF
                </span>
              </div>
              <p className="text-slate-300 mb-3">
                Verwandelt Markdown-Dateien in ein abfragbares Kontextreservoir mit Sub-30ms Latenz.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="bg-black/40 p-2 rounded border border-cyan-500/20">
                  <div className="text-cyan-400 font-semibold">SQLite FTS5 (BM25)</div>
                  <div className="text-slate-400">Exakte Bezeichner, Flags, Funktionsnamen</div>
                </div>
                <div className="bg-black/40 p-2 rounded border border-cyan-500/20">
                  <div className="text-cyan-400 font-semibold">Model2Vec (sqlite-vec)</div>
                  <div className="text-slate-400">256-dim statische Embeddings, 500x Speed</div>
                </div>
                <div className="bg-black/40 p-2 rounded border border-cyan-500/20">
                  <div className="text-cyan-400 font-semibold">RRF Fusion (k=60)</div>
                  <div className="text-slate-400">Parameterfreies Ranking ohne Score-Drift</div>
                </div>
              </div>
            </div>

            {/* Connecting flow arrow */}
            <div className="flex justify-center text-orange-400 -my-2">
              <span className="bg-black/60 px-3 py-1 rounded-full border border-orange-500/30 text-[10px]">
                &uarr; &darr; Gechunkt, gesäubert (Credential Filter) & indiziert
              </span>
            </div>

            {/* Layer 1: Intake */}
            <div className="bg-[#241328]/80 border-2 border-orange-500/40 rounded-xl p-4 relative shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-orange-300 font-bold text-sm">
                  <Database className="w-4 h-4 text-orange-400" />
                  1. INTAKE LAYER (KURATIERUNG & SPEICHER)
                </div>
                <span className="text-[10px] bg-orange-950/80 border border-orange-500/40 text-orange-200 px-2 py-0.5 rounded">
                  OBSIDIAN VAULT
                </span>
              </div>
              <p className="text-slate-300 mb-3">
                Bestimmt, was in den Vault gelangt und schützt vor Informationsrauschen und Datenmüll.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="bg-black/40 p-2 rounded border border-orange-500/20">
                  <div className="text-orange-400 font-semibold">4D Signal Scoring</div>
                  <div className="text-slate-400">Relevanz, Umsetzbarkeit, Tiefe, Autorität</div>
                </div>
                <div className="bg-black/40 p-2 rounded border border-orange-500/20">
                  <div className="text-orange-400 font-semibold">12 Domänen-Ordner</div>
                  <div className="text-slate-400">Automatische Weiterleitung bei Score &gt;= 0.55</div>
                </div>
                <div className="bg-black/40 p-2 rounded border border-orange-500/20">
                  <div className="text-orange-400 font-semibold">Credential Filter</div>
                  <div className="text-slate-400">25 Regex-Muster scrubben Secrets vor Index</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

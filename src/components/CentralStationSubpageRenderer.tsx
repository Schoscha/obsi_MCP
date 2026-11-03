import React, { useState } from 'react';
import {
  ALL_STATION_SUBPAGES,
  GREEN_TEMPLATES,
  KNOWLEDGE_GRAPH_PROJECTS,
  STATION_AREAS,
  StationSubpage
} from '../data/centralStationData';
import { FuselabGraphCanvas } from './FuselabGraphCanvas';
import { ArchifyCanvasStudioView } from './ArchifyCanvasStudioView';

interface CentralStationSubpageRendererProps {
  activeSubpageId: string;
  onSelectSubpage: (id: string) => void;
  onOpenHybridSearch?: () => void;
}

export const CentralStationSubpageRenderer: React.FC<CentralStationSubpageRendererProps> = ({
  activeSubpageId,
  onSelectSubpage,
  onOpenHybridSearch
}) => {
  const page: StationSubpage =
    ALL_STATION_SUBPAGES.find((p) => p.id === activeSubpageId) || ALL_STATION_SUBPAGES[0];

  const [selectedGraphProject, setSelectedGraphProject] = useState(KNOWLEDGE_GRAPH_PROJECTS[0]);
  const [graphViewTab, setGraphViewTab] = useState<'spheres' | 'archify'>('spheres');
  const [graphQuestion, setGraphQuestion] = useState('');
  const [graphAnswer, setGraphAnswer] = useState<string | null>(null);
  const [werkbankLayer, setWerkbankLayer] = useState<'archify' | 'vscode' | 'terminal' | 'obsidian'>('archify');
  const [abnahmeSlider, setAbnahmeSlider] = useState(58);
  const [rundeInput, setRundeInput] = useState('');
  const [rundeLogs, setRundeLogs] = useState([
    { time: '20:14', agent: '@claude-main', project: 'central', text: 'Alle 5 Archify/Canvas-Seiten von Braun/Orange (#E54D2E) auf Central.station Smaragdgrün (#34d399) umgebaut.' },
    { time: '19:52', agent: '@hermes', project: 'second-brain', text: 'Hybrid Retrieval Index (BM25 + Qdrant bge-m3) für 342 Notizen abgeglichen (0 Waisen in 10-wissen).' },
    { time: '19:30', agent: '@vera (cadence)', project: 'annkon', text: '3 neue Fachbeiträge über llama-qwen3-14b (:11435) generiert → liegen in Studio › Abnahme.' },
    { time: '19:05', agent: '@opencode', project: 'sk-coding', text: 'Vorher/Nachher-Schieber für Auto-Webseiten getestet (Lighthouse 99/100).' }
  ]);
  const [kanbanCards, setKanbanCards] = useState([
    { id: 'k1', title: 'Neue Central Station lokal in Smaragdgrün vorbereiten', col: 'in_arbeit', tag: 'Central.station', assignee: '@claude' },
    { id: 'k2', title: '5 Archify & Canvas Studio Vorlagen von Orange auf Grün umfärben', col: 'erledigt', tag: 'Design', assignee: '@claude' },
    { id: 'k3', title: '2.5D Sphären-Graph mit Sci-Fi HUD-Lupe in KI-Agenten & Graphen einbetten', col: 'erledigt', tag: 'Graphen', assignee: '@claude' },
    { id: 'k4', title: 'Qdrant Hybrid-RRF Pipeline (k=60) mit NexusMem :8765 koppeln', col: 'pruefung', tag: 'Second.brain', assignee: '@hermes' },
    { id: 'k5', title: 'Auto-Webseiten Briefing für Flurförderzeug-Ratgeber freigeben', col: 'offen', tag: 'Annkon', assignee: '@atlas' },
    { id: 'k6', title: 'Weekly Backup-Prüfung Vaultwarden & Gitea auf sascha-kruss-1', col: 'offen', tag: 'System', assignee: '@paperclip' }
  ]);
  const [llmPrompt, setLlmPrompt] = useState('Fasse den aktuellen Status von Central.station und Second.brain kurz zusammen.');
  const [llmReply, setLlmReply] = useState(
    'llama-qwen3-14b (annkon :11435 · 48.2 tok/s): Alle 6 Bereiche (45 Unterseiten) sind im lokalen Central.station Ordnerbaum aktiv. Die 5 Archify/Canvas-Seiten laufen komplett im Smaragd/Mint-Farbsystem (#080d0f / #34d399).'
  );
  const [seoUrl, setSeoUrl] = useState('https://central.sascha-kruss.de');

  const moveKanbanCard = (id: string, dir: -1 | 1) => {
    const order = ['offen', 'in_arbeit', 'pruefung', 'erledigt', 'neu_machen'];
    setKanbanCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = order.indexOf(c.col);
        const nextIdx = Math.max(0, Math.min(order.length - 1, idx + dir));
        return { ...c, col: order[nextIdx] };
      })
    );
  };

  const handleGraphAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!graphQuestion.trim()) return;
    setGraphAnswer(
      `[Graph-RRF Antwort aus ${selectedGraphProject.title} (${selectedGraphProject.nodes} Knoten, ${selectedGraphProject.edges} Kanten)]: Gefundene Hauptpfade über ${selectedGraphProject.topEntities.slice(0, 3).join(' → ')}. Bi-direktionale Konsistenz 99.4%, 0 isolierte Cluster.`
    );
  };

  const handleSendRunde = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rundeInput.trim()) return;
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setRundeLogs((prev) => [
      { time: t, agent: 'Sascha', project: 'station', text: rundeInput.trim() },
      ...prev
    ]);
    setRundeInput('');
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-full text-[#e6f1f3]">
      {/* STATION SUBPAGE HEADER BAR (MATCHES central.sascha-kruss.de/neu/ & main/index.html) */}
      <div className="rounded-xl border border-[#173037] bg-[#0b1417]/95 p-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] sm:text-[11px] text-[#7e9ea5]">
            <span className="text-[#34d399] font-bold uppercase tracking-wider">{page.areaLabel}</span>
            <span>›</span>
            <span className="text-[#e6f1f3] truncate">{page.title}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 ${
                page.status === 'neu'
                  ? 'bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/40'
                  : page.status === 'eigen'
                  ? 'bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30'
                  : 'bg-[#13252a] text-[#99f6e4]'
              }`}
            >
              {page.status}
            </span>
            {page.host && (
              <span className="px-1.5 py-0.2 rounded bg-[#080d0f] border border-[#173037] text-[#99f6e4] text-[9.5px] shrink-0">
                {page.host} {page.port || ''}
              </span>
            )}
          </div>
          <h1 className="text-[17px] sm:text-[22px] md:text-[24px] font-bold tracking-tight text-[#e6f1f3] flex flex-wrap items-baseline gap-2">
            <span>{page.title}</span>
            <span className="text-[#34d399] font-normal text-[12.5px] sm:text-[15px]">— {page.subtitle}</span>
          </h1>
          <p className="text-[11.5px] sm:text-[12.5px] text-[#7e9ea5] max-w-4xl">{page.description}</p>
        </div>

        {/* Quick Area Jump Pills (Horizontal scroll on mobile, wrap on tablet+) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap shrink-0">
          <button
            onClick={() => onSelectSubpage('cockpit')}
            className={`px-2.5 py-1 rounded font-mono text-[10.5px] sm:text-[11px] border whitespace-nowrap cursor-pointer transition-all ${
              page.id === 'cockpit'
                ? 'bg-[#34d399] text-[#041310] border-[#34d399] font-bold'
                : 'bg-[#0e1b1e] text-[#99f6e4] border-[#173037] hover:border-[#34d399]/50'
            }`}
          >
            ⌂ Cockpit
          </button>
          <button
            onClick={() => onSelectSubpage('agenten')}
            className={`px-2.5 py-1 rounded font-mono text-[10.5px] sm:text-[11px] border whitespace-nowrap cursor-pointer transition-all ${
              page.id === 'agenten'
                ? 'bg-[#34d399] text-[#041310] border-[#34d399] font-bold'
                : 'bg-[#0e1b1e] text-[#99f6e4] border-[#173037] hover:border-[#34d399]/50'
            }`}
          >
            ◉ Agenten (11)
          </button>
          <button
            onClick={() => onSelectSubpage('graphen')}
            className={`px-2.5 py-1 rounded font-mono text-[10.5px] sm:text-[11px] border whitespace-nowrap cursor-pointer transition-all ${
              page.id === 'graphen'
                ? 'bg-[#34d399] text-[#041310] border-[#34d399] font-bold'
                : 'bg-[#0e1b1e] text-[#99f6e4] border-[#173037] hover:border-[#34d399]/50'
            }`}
          >
            ▤ Graphen (10)
          </button>
          <button
            onClick={() => onSelectSubpage('design')}
            className={`px-2.5 py-1 rounded font-mono text-[10.5px] sm:text-[11px] border whitespace-nowrap cursor-pointer transition-all ${
              page.id === 'design'
                ? 'bg-[#34d399] text-[#041310] border-[#34d399] font-bold'
                : 'bg-[#0e1b1e] text-[#99f6e4] border-[#173037] hover:border-[#34d399]/50'
            }`}
          >
            ▶ Studio
          </button>
          <button
            onClick={() => onSelectSubpage('galerie')}
            className={`px-2.5 py-1 rounded font-mono text-[10.5px] sm:text-[11px] border whitespace-nowrap cursor-pointer transition-all ${
              page.id === 'galerie'
                ? 'bg-[#34d399] text-[#041310] border-[#34d399] font-bold'
                : 'bg-[#0e1b1e] text-[#99f6e4] border-[#173037] hover:border-[#34d399]/50'
            }`}
          >
            ★ 5 Vorlagen
          </button>
        </div>
      </div>

      {/* =====================================================================
          1. START › COCKPIT (CENTRAL.STATION LEITSTAND MIT QUELLEN-ANGABEN)
         ===================================================================== */}
      {page.id === 'cockpit' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2 px-1">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#99f6e4]">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span>Central.station Leitstand · Echtzeit-Telemetrie mit Quellen-Transparenz</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#7e9ea5]">
              <span className="px-2 py-0.5 rounded bg-[#0b1417] border border-[#173037]">
                Live-Sync: sascha-kruss-1 (:8895)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* 4 LEITSTAND KPI CARDS MIT EXAKTEN QUELLENANGABEN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11.5px] sm:text-[12px] text-[#7e9ea5]">
                    <span className="font-semibold text-[#e6f1f3]">Erledigt heute</span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded bg-[#34d399]/15 text-[#34d399] font-mono text-[9.5px] sm:text-[10px] font-bold">
                      +18% ggü. gestern
                    </span>
                  </div>
                  <div className="text-[26px] sm:text-[32px] font-bold font-mono text-[#e6f1f3] my-0.5 sm:my-1">38</div>
                  <div className="text-[10.5px] sm:text-[11px] text-[#99f6e4]">Aufträge über 4 aktive Agenten</div>
                </div>
                <div className="mt-2.5 sm:mt-3 pt-2 border-t border-[#173037]/70 font-mono text-[9px] sm:text-[9.5px] text-[#7e9ea5] leading-relaxed">
                  <span className="text-[#34d399] font-bold">Quelle:</span> Central Auftrags-Queue (:8895)
                </div>
              </div>

              <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11.5px] sm:text-[12px] text-[#7e9ea5]">
                    <span className="font-semibold text-[#e6f1f3]">Offen</span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded bg-[#22d3ee]/15 text-[#22d3ee] font-mono text-[9.5px] sm:text-[10px] font-bold">
                      3 laufen gerade
                    </span>
                  </div>
                  <div className="text-[26px] sm:text-[32px] font-bold font-mono text-[#e6f1f3] my-0.5 sm:my-1">14</div>
                  <div className="text-[10.5px] sm:text-[11px] text-[#99f6e4]">Warteschlange in Central &amp; Paperclip</div>
                </div>
                <div className="mt-2.5 sm:mt-3 pt-2 border-t border-[#173037]/70 font-mono text-[9px] sm:text-[9.5px] text-[#7e9ea5] leading-relaxed">
                  <span className="text-[#22d3ee] font-bold">Quelle:</span> Paperclip (:3100) &amp; /ablaeufe/board
                </div>
              </div>

              <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11.5px] sm:text-[12px] text-[#7e9ea5]">
                    <span className="font-semibold text-[#e6f1f3]">Fehler (24 Std.)</span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded bg-[#fbbf24]/15 text-[#fbbf24] font-mono text-[9.5px] sm:text-[10px] font-bold">
                      1 Timeout
                    </span>
                  </div>
                  <div className="text-[26px] sm:text-[32px] font-bold font-mono text-[#e6f1f3] my-0.5 sm:my-1">2</div>
                  <div className="text-[10.5px] sm:text-[11px] text-[#fbbf24]">1x Cadence Timeout, 1x RSS Fetch</div>
                </div>
                <div className="mt-2.5 sm:mt-3 pt-2 border-t border-[#173037]/70 font-mono text-[9px] sm:text-[9.5px] text-[#7e9ea5] leading-relaxed">
                  <span className="text-[#fbbf24] font-bold">Quelle:</span> journalctl systemd-Dienste auf VPS
                </div>
              </div>

              <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11.5px] sm:text-[12px] text-[#7e9ea5]">
                    <span className="font-semibold text-[#e6f1f3]">Token-Kontingent</span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded bg-[#34d399]/15 text-[#34d399] font-mono text-[9.5px] sm:text-[10px] font-bold">
                      Woche · 29% frei
                    </span>
                  </div>
                  <div className="text-[26px] sm:text-[32px] font-bold font-mono text-[#34d399] my-0.5 sm:my-1">71%</div>
                  <div className="w-full h-1.5 rounded-full bg-[#080d0f] overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-[#34d399] to-[#22d3ee] w-[71%]" />
                  </div>
                  <div className="text-[9.5px] sm:text-[10px] text-[#7e9ea5] mt-1.5 flex justify-between font-mono">
                    <span>355k verbraucht</span>
                    <span className="text-[#99f6e4]">145k frei von 500k</span>
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3 pt-2 border-t border-[#173037]/70 font-mono text-[9px] sm:text-[9.5px] text-[#7e9ea5] leading-relaxed">
                  <span className="text-[#34d399] font-bold">Quelle:</span> Central API /ablaeufe/nutzung &amp; secrets.env (Wochenbudget: Claude + Gemini Flash)
                </div>
              </div>
            </div>

            {/* LEITSTAND 2-COLUMN GRID: AGENTEN LISTE + AUFTRÄGE PRO STUNDE & DIENSTE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7 rounded-xl border border-[#173037] bg-[#0e1b1e] p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-[#173037] pb-2">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#e6f1f3]">Agenten im Einsatz</h3>
                    <p className="text-[11px] text-[#7e9ea5]">
                      <span className="text-[#34d399] font-bold font-mono">Quelle:</span> status.json (:8895) &amp; tmux sessions auf 4 Servern
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectSubpage('agenten')}
                    className="px-2.5 py-1 rounded bg-[#13252a] hover:bg-[#34d399] hover:text-[#041310] text-[#34d399] font-mono text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Alle 11 Geräte &amp; 2.5D Graph →
                  </button>
                </div>

                {[
                  { id: 'claude', name: 'Claude', sub: 'claude-main · sascha-kruss-1 · räumt Server-Konfiguration auf', stat: 'arbeitet', color: '#34d399', src: 'Claude Code Session PID 14210' },
                  { id: 'hermes', name: 'Hermes', sub: 'Homeserver · 42 Skills · Telegram & Weckruf alle 30 Min.', stat: 'bereit', color: '#34d399', src: 'Hermes Agent Port 8000' },
                  { id: 'opencode', name: 'OpenCode', sub: 'opencode.sascha-kruss.de · Coding-Agent Port 4096', stat: 'bereit', color: '#34d399', src: 'opencode serve Port 4096' },
                  { id: 'cadence', name: 'Cadence Studio', sub: 'Atlas · Vera · Kite · Orin · 2 Entwürfe warten auf Freigabe', stat: 'wartet', color: '#fbbf24', src: 'Cadence Docker on VPS' },
                  { id: 'paperclip', name: 'Paperclip', sub: 'Agenten-Firma (:3100) · Ziele, Aufgaben & Budgets', stat: 'bereit', color: '#22d3ee', src: 'Paperclip SQLite Port 3100' }
                ].map((ag) => (
                  <div
                    key={ag.id}
                    onClick={() => onSelectSubpage(ag.id)}
                    className="p-2.5 rounded-lg bg-[#0b1417] border border-[#173037] hover:border-[#34d399]/60 flex items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: ag.color, boxShadow: `0 0 8px ${ag.color}` }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-[13px] text-[#e6f1f3] flex items-center gap-2">
                          <span>{ag.name}</span>
                          <span className="font-mono text-[9px] text-[#7e9ea5]">({ag.src})</span>
                        </div>
                        <div className="text-[11px] text-[#7e9ea5] truncate">{ag.sub}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#0e1b1e] border border-[#173037] font-mono text-[10px] text-[#99f6e4] shrink-0">
                      {ag.stat}
                    </span>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                {/* Dienste Status mit Quellen */}
                <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-[#173037] pb-2">
                    <div>
                      <span className="font-bold text-[14px] text-[#e6f1f3]">Dienste &amp; Endpunkte</span>
                      <div className="font-mono text-[9.5px] text-[#7e9ea5]">
                        <span className="text-[#34d399] font-bold">Quelle:</span> systemd &amp; nginx upstream checks
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#34d399]">5 / 5 ONLINE</span>
                  </div>
                  {[
                    { name: 'Central API (:8895)', lat: '12 ms', ok: true, src: 'sascha-kruss-1' },
                    { name: 'agent-memory MCP (:8798)', lat: '18 ms', ok: true, src: 'homeserver' },
                    { name: 'opencode.sascha-kruss.de (:4096)', lat: '34 ms', ok: true, src: 'vps' },
                    { name: 'llama-qwen3-14b (annkon :11435)', lat: '41 ms', ok: true, src: 'annkon-01 (20GB)' },
                    { name: 'Vaultwarden & Gitea Backup', lat: 'vor 4 Std.', ok: true, src: 'backup cron' }
                  ].map((srv) => (
                    <div
                      key={srv.name}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded bg-[#0b1417] border border-[#173037]/80 font-mono text-[11px]"
                    >
                      <span className="flex items-center gap-2 text-[#e6f1f3]">
                        <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                        <span>{srv.name}</span>
                      </span>
                      <span className="text-[#99f6e4]">{srv.lat}</span>
                    </div>
                  ))}
                </div>

                {/* Schnellzugriff auf die 6 Hauptbereiche */}
                <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-4">
                  <div className="font-bold text-[13px] text-[#e6f1f3] mb-1">
                    6 Hauptbereiche · 45 Unterseiten
                  </div>
                  <div className="font-mono text-[9.5px] text-[#7e9ea5] mb-2">
                    <span className="text-[#34d399] font-bold">Quelle:</span> central.sascha-kruss.de/neu/station.js
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STATION_AREAS.map((area) => (
                      <button
                        key={area.id}
                        onClick={() => onSelectSubpage(area.pages[0].id)}
                        className="p-2 rounded-lg bg-[#0b1417] hover:bg-[#13252a] border border-[#173037] hover:border-[#34d399]/60 text-left transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between font-mono text-[11px] text-[#34d399] font-bold">
                          <span>
                            {area.icon} {area.title}
                          </span>
                          <span>{area.pages.length}</span>
                        </div>
                        <div className="text-[10px] text-[#7e9ea5] truncate mt-0.5">{area.hint}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. AGENTEN › KI-AGENTEN (11 GERÄTE + 2.5D SPHÄREN-GRAPH + PROZESSE)
         ===================================================================== */}
      {page.id === 'agenten' && (
        <div className="flex flex-col gap-4">
          {/* Top 4 KPI Tiles matching Central.station KI-Agenten screenshot */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#7e9ea5]">GERÄTE</div>
              <div className="text-[26px] sm:text-[32px] font-bold font-mono text-[#e6f1f3] mt-0.5 sm:mt-1">11</div>
              <div className="text-[10.5px] sm:text-[11px] text-[#99f6e4]">im Tailscale-Netz</div>
            </div>
            <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#7e9ea5]">ONLINE</div>
              <div className="text-[26px] sm:text-[32px] font-bold font-mono text-[#34d399] mt-0.5 sm:mt-1">8</div>
              <div className="text-[10.5px] sm:text-[11px] text-[#99f6e4]">gerade erreichbar</div>
            </div>
            <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#7e9ea5] truncate">
                PROZESSE
              </div>
              <div className="text-[26px] sm:text-[32px] font-bold font-mono text-[#22d3ee] mt-0.5 sm:mt-1">17</div>
              <div className="text-[10.5px] sm:text-[11px] text-[#99f6e4]">über alle Server</div>
            </div>
            <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#7e9ea5]">AKTIV</div>
              <div className="text-[26px] sm:text-[32px] font-bold font-mono text-[#34d399] mt-0.5 sm:mt-1">1</div>
              <div className="text-[10.5px] sm:text-[11px] text-[#99f6e4]">Rest wartet</div>
            </div>
          </div>

          {/* CENTER: 2.5D SPHERE AGENTEN-NETZ + RIGHT: 11 GERÄTE LISTE */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
            <div className="xl:col-span-8 rounded-xl border border-[#173037] bg-[#0b1417] overflow-hidden min-h-[380px] sm:min-h-[500px]">
              <FuselabGraphCanvas initialDataset="central-station" height={420} />
            </div>

            <div className="xl:col-span-4 rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#173037] pb-2 sm:pb-2.5 mb-2.5 sm:mb-3">
                  <span className="font-bold text-[13px] sm:text-[14px] text-[#e6f1f3]">Geräte im Tailnet</span>
                  <span className="font-mono text-[10px] sm:text-[11px] text-[#7e9ea5]">11 Einträge</span>
                </div>
                <div className="space-y-1.5 sm:space-y-2 max-h-[340px] sm:max-h-[460px] overflow-y-auto pr-1">
                  {[
                    { name: 'sascha-kruss-1', ip: '100.89.43.82 · linux · Server · 9 Prozesse', status: 'arbeitet (1)', col: '#34d399' },
                    { name: 'crm', ip: '100.119.222.54 · linux · Server · 6 Prozesse', status: 'wartet (6)', col: '#22d3ee' },
                    { name: 'homeserver-omarchy', ip: '100.68.221.38 · linux · Server · 2 Prozesse', status: 'wartet (2)', col: '#22d3ee' },
                    { name: 'annkon-01', ip: '100.117.163.53 · linux · Server (20GB VRAM)', status: 'online', col: '#34d399' },
                    { name: 'desktop-i773411', ip: '100.113.151.116 · windows · PC/Laptop', status: 'online', col: '#34d399' },
                    { name: 'google-pixel-10-pro', ip: '100.86.103.56 · android · Handy', status: 'online', col: '#34d399' },
                    { name: 'laptop-omarchy', ip: '100.78.238.104 · linux · PC/Laptop', status: 'online', col: '#34d399' },
                    { name: 'sascha-precision-5540', ip: '100.90.165.118 · linux · PC/Laptop', status: 'online', col: '#34d399' },
                    { name: 'macbook-pro-von-sascha', ip: '100.116.161.36 · macOS · PC/Laptop', status: 'aus', col: '#64748b' },
                    { name: 'oppo-cph2695', ip: '100.94.23.112 · android · Handy', status: 'aus', col: '#64748b' },
                    { name: 'vivo-v2219', ip: '100.72.81.14 · android · Handy', status: 'aus', col: '#64748b' }
                  ].map((dev) => (
                    <div
                      key={dev.name}
                      className="p-2.5 rounded-lg bg-[#0b1417] border border-[#173037] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: dev.col, boxShadow: `0 0 6px ${dev.col}` }}
                        />
                        <div className="min-w-0">
                          <div className="font-mono text-[12px] font-bold text-[#e6f1f3] truncate">{dev.name}</div>
                          <div className="font-mono text-[10px] text-[#7e9ea5] truncate">{dev.ip}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#0e1b1e] border border-[#173037] font-mono text-[10px] text-[#99f6e4] shrink-0">
                        {dev.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. ABLAGE › GRAPHEN (10 PROJEKT-WISSENSGRAPHEN + ARCHIFY + 2.5D)
         ===================================================================== */}
      {page.id === 'graphen' && (
        <div className="flex flex-col gap-4">
          {/* 10 Project Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {KNOWLEDGE_GRAPH_PROJECTS.map((proj) => {
              const active = proj.id === selectedGraphProject.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedGraphProject(proj)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    active
                      ? 'bg-[#112226] border-[#34d399] shadow-[0_0_20px_rgba(52,211,153,0.18)]'
                      : 'bg-[#0e1b1e] border-[#173037] hover:border-[#34d399]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#34d399]/15 text-[#34d399]">
                        {proj.nodes} Knoten · {proj.edges} Kanten
                      </span>
                      {proj.hasArchify && (
                        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#22d3ee]/15 text-[#22d3ee]">
                          Archify
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-[13px] text-[#e6f1f3]">{proj.title}</div>
                  </div>
                  <div className="text-[10.5px] text-[#7e9ea5] line-clamp-2">{proj.description}</div>
                </button>
              );
            })}
          </div>

          {/* Ask the Graph Bar + View Mode Switcher */}
          <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-3.5 flex flex-col gap-2.5 sm:gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <form onSubmit={handleGraphAsk} className="flex-1 flex items-center gap-2 min-w-0">
                <input
                  type="text"
                  value={graphQuestion}
                  onChange={(e) => setGraphQuestion(e.target.value)}
                  placeholder={`Frage an den Graphen „${selectedGraphProject.title}“ stellen ...`}
                  className="flex-1 bg-[#080d0f] border border-[#173037] focus:border-[#34d399] rounded-lg px-2.5 py-1.5 text-[11px] sm:text-[12px] text-[#e6f1f3] focus:outline-none font-mono min-w-0"
                />
                <button
                  type="submit"
                  className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#34d399] text-[#041310] font-mono text-[10.5px] sm:text-[11px] font-bold cursor-pointer hover:opacity-90 whitespace-nowrap shrink-0"
                >
                  Abfragen
                </button>
              </form>

              <div className="flex items-center self-start sm:self-auto p-0.5 rounded bg-[#080d0f] border border-[#173037] font-mono text-[10.5px] sm:text-[11px] shrink-0">
                <button
                  onClick={() => setGraphViewTab('spheres')}
                  className={`px-2.5 sm:px-3 py-1 rounded cursor-pointer ${
                    graphViewTab === 'spheres' ? 'bg-[#34d399] text-[#041310] font-bold' : 'text-[#7e9ea5]'
                  }`}
                >
                  2.5D Sphären
                </button>
                <button
                  onClick={() => setGraphViewTab('archify')}
                  className={`px-2.5 sm:px-3 py-1 rounded cursor-pointer ${
                    graphViewTab === 'archify' ? 'bg-[#34d399] text-[#041310] font-bold' : 'text-[#7e9ea5]'
                  }`}
                >
                  Archify Studio
                </button>
              </div>
            </div>

            {graphAnswer && (
              <div className="p-2.5 rounded-lg bg-[#080d0f] border border-[#34d399]/40 font-mono text-[11.5px] text-[#99f6e4] flex items-center justify-between gap-2">
                <span>{graphAnswer}</span>
                <button
                  onClick={() => setGraphAnswer(null)}
                  className="text-[#7e9ea5] hover:text-[#e6f1f3] text-[11px] cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {graphViewTab === 'spheres' ? (
            <div className="rounded-xl border border-[#173037] bg-[#0b1417] overflow-hidden">
              <FuselabGraphCanvas
                initialDataset={selectedGraphProject.id === 'central' || selectedGraphProject.id === 'claude-code' ? 'central-station' : 'second-brain'}
                height={550}
              />
            </div>
          ) : (
            <ArchifyCanvasStudioView initialViewMode="studio" />
          )}
        </div>
      )}

      {/* =====================================================================
          4. STUDIO › DESIGN, VORLAGEN, GALERIE & ARBEITEN › ARBEITSPLATZ
         ===================================================================== */}
      {(page.id === 'design' ||
        page.id === 'galerie' ||
        page.id === 'galerie-ablage' ||
        page.id === 'vorlagen' ||
        page.id === 'arbeitsplatz') && (
        <div className="flex flex-col gap-3">
          {page.id === 'arbeitsplatz' && (
            <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 font-mono text-[10.5px] sm:text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[#34d399]/15 text-[#34d399] font-bold">
                  WERKBANK
                </span>
                <span className="text-[#7e9ea5] truncate">
                  Arbeitsschicht bleibt im Hintergrund aktiv
                </span>
              </div>
              <div className="flex items-center overflow-x-auto pb-1 sm:pb-0 p-0.5 rounded bg-[#080d0f] border border-[#173037] font-mono text-[10.5px] sm:text-[11px] shrink-0">
                {[
                  { id: 'archify', label: 'Archify IDE' },
                  { id: 'vscode', label: 'VS Code' },
                  { id: 'terminal', label: 'Terminal' },
                  { id: 'obsidian', label: 'Obsidian' }
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setWerkbankLayer(l.id as any)}
                    className={`px-2.5 sm:px-3 py-1 rounded cursor-pointer whitespace-nowrap ${
                      werkbankLayer === l.id ? 'bg-[#34d399] text-[#041310] font-bold' : 'text-[#7e9ea5]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ArchifyCanvasStudioView
            initialViewMode={page.id === 'galerie' || page.id === 'galerie-ablage' ? 'templates' : 'studio'}
            initialTemplateId={page.id === 'vorlagen' ? 'archify-refined' : 'canvas-drag-drop'}
          />
        </div>
      )}

      {/* =====================================================================
          5. ARBEITEN › AUFGABEN-BOARD (INTERACTIVE KANBAN)
         ===================================================================== */}
      {page.id === 'board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: 'offen', title: 'Offen', col: '#7e9ea5' },
            { id: 'in_arbeit', title: 'In Arbeit', col: '#22d3ee' },
            { id: 'pruefung', title: 'Prüfung', col: '#fbbf24' },
            { id: 'erledigt', title: 'Erledigt', col: '#34d399' },
            { id: 'neu_machen', title: 'Neu machen', col: '#f87171' }
          ].map((column) => {
            const colCards = kanbanCards.filter((c) => c.col === column.id);
            return (
              <div
                key={column.id}
                className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 flex flex-col gap-2.5 min-h-[420px]"
              >
                <div className="flex items-center justify-between border-b border-[#173037] pb-2">
                  <span className="font-mono text-[12px] font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: column.col }} />
                    {column.title}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#080d0f] font-mono text-[10px] text-[#99f6e4]">
                    {colCards.length}
                  </span>
                </div>

                {colCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 rounded-lg bg-[#0b1417] border border-[#173037] hover:border-[#34d399]/60 flex flex-col gap-2 transition-all"
                  >
                    <div className="flex items-center justify-between font-mono text-[9.5px]">
                      <span className="px-1.5 py-0.5 rounded bg-[#34d399]/15 text-[#34d399]">{card.tag}</span>
                      <span className="text-[#22d3ee]">{card.assignee}</span>
                    </div>
                    <div className="text-[12px] font-medium text-[#e6f1f3] leading-snug">{card.title}</div>
                    <div className="flex items-center justify-between pt-1 border-t border-[#173037]/60">
                      <button
                        onClick={() => moveKanbanCard(card.id, -1)}
                        className="px-2 py-0.5 rounded bg-[#0e1b1e] hover:bg-[#13252a] font-mono text-[10px] text-[#99f6e4] cursor-pointer"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => moveKanbanCard(card.id, 1)}
                        className="px-2 py-0.5 rounded bg-[#0e1b1e] hover:bg-[#13252a] font-mono text-[10px] text-[#34d399] cursor-pointer"
                      >
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          6. START › ABNAHME (VORHER / NACHHER SCHIEBER & FREIGABEN)
         ===================================================================== */}
      {page.id === 'abnahme' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 rounded-xl border border-[#173037] bg-[#0e1b1e] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[15px] text-[#e6f1f3]">
                  Auto-Webseiten &amp; Design-Abnahme: Vorher (Orange) vs. Neu (Smaragdgrün)
                </h3>
                <p className="text-[11.5px] text-[#7e9ea5]">
                  Schieber bewegen, um das alte braun-orange Archify-Template mit dem neuen Central.station Smaragdgrün zu vergleichen
                </p>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#34d399]/15 text-[#34d399] font-bold">
                {abnahmeSlider}% NEU (GRÜN)
              </span>
            </div>

            <input
              type="range"
              min={5}
              max={95}
              value={abnahmeSlider}
              onChange={(e) => setAbnahmeSlider(Number(e.target.value))}
              className="w-full accent-[#34d399] cursor-pointer"
            />

            <div className="relative h-64 rounded-xl overflow-hidden border border-[#173037] bg-[#080d0f] flex">
              <div
                style={{ width: `${abnahmeSlider}%` }}
                className="h-full bg-gradient-to-br from-[#080d0f] via-[#0e1b1e] to-[#112a26] border-r-2 border-[#34d399] p-4 flex flex-col justify-between overflow-hidden"
              >
                <span className="px-2 py-0.5 rounded bg-[#34d399] text-[#041310] font-mono text-[10px] font-bold w-fit">
                  NEU · CENTRAL.STATION SMARAGD (#34d399 / #080d0f)
                </span>
                <div className="font-mono text-[13px] font-bold text-[#e6f1f3]">
                  Archify Canvas Studio + 2.5D Sphären-Graph + 45 Unterseiten
                </div>
                <div className="text-[11px] text-[#99f6e4]">
                  Konsistente Smaragd-Mint-Cyan-Tokens über alle 5 hochgeladenen Seiten &amp; Sub-Modals.
                </div>
              </div>
              <div className="flex-1 h-full bg-[#15130c] p-4 flex flex-col justify-between text-[#e8e2d6]">
                <span className="px-2 py-0.5 rounded bg-[#E54D2E] text-white font-mono text-[10px] font-bold w-fit">
                  ALT · TECTONIC AMBER (#E54D2E / #15130c)
                </span>
                <div className="font-mono text-[13px] font-bold text-[#ffb4a4]">
                  Ursprüngliche hochgeladene Vorlage (Braun/Orange)
                </div>
                <div className="text-[11px] text-[#cac6ba]">Komplett abgelöst durch Central.station Grün.</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-[#173037] bg-[#0e1b1e] p-4 flex flex-col gap-2.5">
            <h3 className="font-bold text-[15px] text-[#e6f1f3] border-b border-[#173037] pb-2">
              Wartende Abnahmen (4)
            </h3>
            {GREEN_TEMPLATES.slice(0, 4).map((tpl) => (
              <div
                key={tpl.id}
                className="p-2.5 rounded-lg bg-[#0b1417] border border-[#173037] flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-[12px] text-[#e6f1f3] truncate">{tpl.title}</div>
                  <div className="text-[10.5px] text-[#7e9ea5] truncate">{tpl.subtitle}</div>
                </div>
                <a
                  href={tpl.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-[#34d399] text-[#041310] font-mono text-[10px] font-bold shrink-0"
                >
                  Öffnen ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          7. AGENTEN › AGENTEN-RUNDE (LOGBUCH.MD LIVE STREAM)
         ===================================================================== */}
      {page.id === 'runde' && (
        <div className="rounded-xl border border-[#173037] bg-[#0e1b1e] p-3 sm:p-4 flex flex-col gap-3">
          <form onSubmit={handleSendRunde} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={rundeInput}
              onChange={(e) => setRundeInput(e.target.value)}
              placeholder="Nachricht ins LOGBUCH.md schreiben (@claude, @hermes) ..."
              className="flex-1 bg-[#080d0f] border border-[#173037] focus:border-[#34d399] rounded-lg px-3 py-2 text-[11.5px] sm:text-[12px] font-mono text-[#e6f1f3] focus:outline-none min-w-0"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#34d399] text-[#041310] font-mono text-[11px] font-bold cursor-pointer shrink-0"
            >
              Senden
            </button>
          </form>
          <div className="space-y-2">
            {rundeLogs.map((l, i) => (
              <div
                key={i}
                className="p-2.5 sm:p-3 rounded-lg bg-[#0b1417] border border-[#173037] flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3 font-mono text-[11px] sm:text-[11.5px]"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[#7e9ea5] text-[10px]">{l.time}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#34d399]/15 text-[#34d399] font-bold text-[10.5px]">{l.agent}</span>
                  <span className="px-1 py-0.2 rounded bg-[#13252a] text-[#22d3ee] text-[9.5px]">{l.project}</span>
                  <span className="text-[#e6f1f3] font-sans text-[12px] sm:text-[12.5px] break-words">{l.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          8. ABLAGE › AUSGABE (SKILL-DECK 3D ORDNER-KACHELN)
         ===================================================================== */}
      {page.id === 'ausgabe' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { kat: 'Webseiten & Grüne Vorlagen', count: '14 Dateien', info: '5 Archify/Canvas Grün + 9 Kunden-Entwürfe', action: () => onSelectSubpage('galerie') },
            { kat: 'Wissensgraphen & Archify', count: '10 Projekte', info: 'central, second-brain, nexusmem, skills ...', action: () => onSelectSubpage('graphen') },
            { kat: 'Flyer & Cadence Slides', count: '28 Dateien', info: '/ausgabe/flyer/cadence (Annkon)', action: () => onSelectSubpage('social') },
            { kat: 'Bilder (Gemini & Flow)', count: '64 Dateien', info: '/ausgabe/bilder/gemini/', action: () => onSelectSubpage('bilder') },
            { kat: 'Videos & Motion', count: '19 Dateien', info: '/ausgabe/video/ (OpenMontage & Studio)', action: () => onSelectSubpage('motionstudio') },
            { kat: 'Audio & Voice Studio', count: '22 Dateien', info: '/ausgabe/audio/ (VoiceStudio :3900)', action: () => onSelectSubpage('voice') },
            { kat: 'SEO- & GEO-Berichte', count: '31 Berichte', info: '/ausgabe/dokumente/seo/', action: () => onSelectSubpage('seo') },
            { kat: 'Vault-Exports & Briefings', count: '32 Kapitel', info: 'Second.brain Hybrid Retrieval Rollout', action: () => onSelectSubpage('wissen') }
          ].map((folder) => (
            <div
              key={folder.kat}
              onClick={folder.action}
              className="group rounded-xl border border-[#173037] hover:border-[#34d399] bg-gradient-to-b from-[#112529] to-[#0b1417] p-4 cursor-pointer transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between min-h-[148px]"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-t-md bg-[#34d399]/20 border border-[#34d399]/40 font-mono text-[10px] text-[#34d399] font-bold">
                  ORDNER
                </span>
                <span className="font-mono text-[11px] text-[#99f6e4]">{folder.count}</span>
              </div>
              <div>
                <div className="font-bold text-[15px] text-[#e6f1f3] group-hover:text-[#34d399] transition-colors">
                  {folder.kat}
                </div>
                <div className="text-[11px] text-[#7e9ea5] mt-1">{folder.info}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          9. SYSTEM › MODELLE (LLAMA-QWEN3-14B ANNKON + GEMINI + ROUTER)
         ===================================================================== */}
      {page.id === 'lokal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 rounded-xl border border-[#173037] bg-[#0e1b1e] p-4 space-y-2.5">
            <h3 className="font-bold text-[15px] text-[#e6f1f3]">Aktive Sprachmodelle &amp; Router</h3>
            {[
              { name: 'llama-qwen3-14b (Lokales Modell)', host: 'annkon-01 (:11435 · 20 GB VRAM)', status: 'ONLINE · 48 tok/s' },
              { name: 'Claude Opus 4.7 / Sonnet 4.6', host: 'Claude Code & Central Agenten', status: 'ONLINE · Kontingent 71%' },
              { name: 'Google Gemini 2.5 Flash / Pro', host: 'Google AI Studio (secrets.env)', status: 'ONLINE · API bereit' },
              { name: 'FreeLLMAPI Router (:3456)', host: 'llm.sascha-kruss.de (Docker VPS)', status: 'ONLINE · 14 Provider' },
              { name: 'bge-m3 + reranker-v2-m3', host: 'homeserver-omarchy (:8798 Qdrant)', status: 'ONLINE · 1024-dim' }
            ].map((m) => (
              <div
                key={m.name}
                className="p-2.5 rounded-lg bg-[#0b1417] border border-[#173037] flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[12.5px] text-[#e6f1f3]">{m.name}</div>
                  <div className="font-mono text-[10.5px] text-[#7e9ea5]">{m.host}</div>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#34d399]/15 text-[#34d399] font-bold">
                  {m.status}
                </span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7 rounded-xl border border-[#173037] bg-[#0e1b1e] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[15px] text-[#e6f1f3]">
                Live-Testfeld · llama-qwen3-14b auf annkon (:11435)
              </span>
              <span className="font-mono text-[10px] text-[#34d399]">OpenAI-kompatibel · 0 Kosten</span>
            </div>
            <textarea
              value={llmPrompt}
              onChange={(e) => setLlmPrompt(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-[#080d0f] border border-[#173037] p-3 font-mono text-[12px] text-[#e6f1f3] focus:border-[#34d399] focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setLlmReply(
                    `[Antwort von llama-qwen3-14b @ annkon:11435]: Anfrage "${llmPrompt.slice(0, 60)}..." verarbeitet in 310ms. Alle 45 Central.station Routen und die grünen Archify-Komponenten sind synchron.`
                  )
                }
                className="px-4 py-1.5 rounded-lg bg-[#34d399] text-[#041310] font-mono text-[11px] font-bold cursor-pointer"
              >
                An lokales Modell senden
              </button>
            </div>
            <div className="p-3 rounded-lg bg-[#080d0f] border border-[#34d399]/30 font-mono text-[11.5px] text-[#99f6e4]">
              {llmReply}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          10. UNIVERSAL RICH VIEW FOR ALL REMAINING SUBPAGES (WISSEN, SEO, SERVER, ETC.)
         ===================================================================== */}
      {![
        'cockpit',
        'agenten',
        'graphen',
        'design',
        'galerie',
        'galerie-ablage',
        'vorlagen',
        'arbeitsplatz',
        'board',
        'abnahme',
        'runde',
        'ausgabe',
        'lokal'
      ].includes(page.id) && (
        <div className="flex flex-col gap-4">
          {/* Contextual Interactive Panel for the Selected Subpage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 rounded-xl border border-[#173037] bg-[#0e1b1e] p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-[#34d399]/15 text-[#34d399] font-mono text-[10px] font-bold uppercase">
                    {page.areaLabel} › {page.title} · LOKALE VORBEREITUNG
                  </span>
                  <span className="font-mono text-[11px] text-[#99f6e4]">Ziel-Pfad: {page.url}</span>
                </div>
                <h2 className="text-[20px] font-bold text-[#e6f1f3]">{page.subtitle}</h2>
                <p className="text-[13px] text-[#7e9ea5] leading-relaxed">{page.description}</p>
              </div>

              {page.id === 'seo' && (
                <div className="p-3.5 rounded-lg bg-[#080d0f] border border-[#173037] space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={seoUrl}
                      onChange={(e) => setSeoUrl(e.target.value)}
                      className="flex-1 bg-[#0e1b1e] border border-[#173037] rounded px-3 py-1.5 font-mono text-[12px] text-[#e6f1f3]"
                    />
                    <span className="px-3 py-1.5 rounded bg-[#34d399] text-[#041310] font-mono text-[11px] font-bold">
                      SEO + GEO Score: 96 / 100
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 font-mono text-[11px]">
                    <div className="p-2 rounded bg-[#0e1b1e] border border-[#173037]">Technik: <b className="text-[#34d399]">98%</b></div>
                    <div className="p-2 rounded bg-[#0e1b1e] border border-[#173037]">Inhalt: <b className="text-[#34d399]">94%</b></div>
                    <div className="p-2 rounded bg-[#0e1b1e] border border-[#173037]">Struktur: <b className="text-[#34d399]">97%</b></div>
                    <div className="p-2 rounded bg-[#0e1b1e] border border-[#173037]">KI-GEO: <b className="text-[#22d3ee]">95%</b></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#173037]">
                <button
                  onClick={() => onSelectSubpage('design')}
                  className="p-3 rounded-lg bg-[#0b1417] hover:bg-[#13252a] border border-[#173037] hover:border-[#34d399]/60 text-left cursor-pointer transition-all"
                >
                  <div className="font-mono text-[11px] text-[#34d399] font-bold">▶ Im Canvas Studio öffnen</div>
                  <div className="text-[10.5px] text-[#7e9ea5] mt-0.5">Architektur &amp; Knoten für {page.title}</div>
                </button>
                <button
                  onClick={() => onSelectSubpage('graphen')}
                  className="p-3 rounded-lg bg-[#0b1417] hover:bg-[#13252a] border border-[#173037] hover:border-[#34d399]/60 text-left cursor-pointer transition-all"
                >
                  <div className="font-mono text-[11px] text-[#22d3ee] font-bold">▤ Im Wissensgraphen zeigen</div>
                  <div className="text-[10.5px] text-[#7e9ea5] mt-0.5">2.5D Sphären-Verknüpfungen</div>
                </button>
                {onOpenHybridSearch && (
                  <button
                    onClick={onOpenHybridSearch}
                    className="p-3 rounded-lg bg-[#0b1417] hover:bg-[#13252a] border border-[#173037] hover:border-[#34d399]/60 text-left cursor-pointer transition-all"
                  >
                    <div className="font-mono text-[11px] text-[#5ef6c4] font-bold">⌕ Hybrid Retrieval RRF Lab</div>
                    <div className="text-[10.5px] text-[#7e9ea5] mt-0.5">BM25 + Qdrant + Graph testen</div>
                  </button>
                )}
              </div>
            </div>

            {/* Sibling Pages in Same Area */}
            <div className="lg:col-span-4 rounded-xl border border-[#173037] bg-[#0e1b1e] p-4 flex flex-col gap-2">
              <div className="font-bold text-[13px] text-[#e6f1f3] border-b border-[#173037] pb-2">
                Weitere Seiten in „{page.areaLabel}“
              </div>
              {STATION_AREAS.find((a) => a.id === page.areaId)?.pages.map((sib) => (
                <button
                  key={sib.id}
                  onClick={() => onSelectSubpage(sib.id)}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-all ${
                    sib.id === page.id
                      ? 'bg-[#13252a] border-[#34d399] text-[#34d399] font-bold'
                      : 'bg-[#0b1417] border-[#173037] text-[#e6f1f3] hover:border-[#34d399]/50'
                  }`}
                >
                  <span className="text-[12px]">{sib.title}</span>
                  <span className="font-mono text-[10px] text-[#7e9ea5]">{sib.status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* If on Wissen, also show the Second.brain 32-Chapter & RRF overview */}
          {page.id === 'wissen' && childrenCockpitFallback}
        </div>
      )}
    </div>
  );
};

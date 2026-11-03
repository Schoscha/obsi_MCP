import React, { useState } from 'react';
import { GREEN_TEMPLATES, GreenTemplatePage } from '../data/centralStationData';

interface CanvasNodeItem {
  id: string;
  title: string;
  kind: string;
  category: 'compute' | 'storage' | 'network';
  badge: string;
  runtime: string;
  replicas: number;
  cpuPct: number;
  cpuText: string;
  memPct: number;
  memText: string;
  sla: string;
  p99: string;
  x: number;
  y: number;
  modulePath: string;
}

const INITIAL_CANVAS_NODES: CanvasNodeItem[] = [
  {
    id: 'edgeGateway',
    title: 'centralNginx',
    kind: 'GatewayNode • NGINX_TAILNET',
    category: 'network',
    badge: 'INGRESS',
    runtime: 'nginx + Tailscale TLS',
    replicas: 4,
    cpuPct: 31,
    cpuText: '1.2 / 4 Core',
    memPct: 42,
    memText: '1.68 / 4 GiB',
    sla: '99.99%',
    p99: '9ms',
    x: 28,
    y: 95,
    modulePath: 'central/nginx/station-routes'
  },
  {
    id: 'authCluster',
    title: 'centralApiCluster',
    kind: 'ServiceNode • CENTRAL_API_8895',
    category: 'compute',
    badge: 'ACTIVE',
    runtime: 'sascha-kruss-1 (:8895)',
    replicas: 12,
    cpuPct: 48,
    cpuText: '2.4 / 4 Core',
    memPct: 62,
    memText: '2.48 / 4 GiB',
    sla: '99.98%',
    p99: '18ms',
    x: 245,
    y: 145,
    modulePath: 'central/api/station-controller'
  },
  {
    id: 'sessionCache',
    title: 'qdrantHybridIndex',
    kind: 'VectorNode • QDRANT_BGE_M3',
    category: 'storage',
    badge: 'VECTOR',
    runtime: 'Qdrant + SQLite FTS5 (:8798)',
    replicas: 6,
    cpuPct: 39,
    cpuText: '1.6 / 4 Core',
    memPct: 54,
    memText: '4.3 / 8 GiB',
    sla: '99.95%',
    p99: '11ms',
    x: 515,
    y: 55,
    modulePath: 'second-brain/mcp/hybrid-rrf'
  },
  {
    id: 'eventMesh',
    title: 'llamaAnnkonNode',
    kind: 'InferenceNode • QWEN3_14B',
    category: 'compute',
    badge: 'LLM GPU',
    runtime: 'annkon-01 (:11435 · 20GB VRAM)',
    replicas: 3,
    cpuPct: 72,
    cpuText: '14.4 / 20 GB VRAM',
    memPct: 68,
    memText: '13.6 / 20 GiB',
    sla: '99.90%',
    p99: '42ms',
    x: 515,
    y: 265,
    modulePath: 'annkon/docker/llama-qwen3-14b'
  }
];

interface ArchifyCanvasStudioViewProps {
  initialViewMode?: 'studio' | 'templates';
  initialTemplateId?: string;
}

export const ArchifyCanvasStudioView: React.FC<ArchifyCanvasStudioViewProps> = ({
  initialViewMode = 'studio',
  initialTemplateId = 'canvas-drag-drop'
}) => {
  const [topTab, setTopTab] = useState<'studio' | 'templates'>(initialViewMode);
  const [selectedTemplate, setSelectedTemplate] = useState<GreenTemplatePage>(
    GREEN_TEMPLATES.find((t) => t.id === initialTemplateId) || GREEN_TEMPLATES[0]
  );
  const [editorMode, setEditorMode] = useState<'split' | 'canvas' | 'code' | 'diff'>('split');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'compute' | 'storage' | 'network'>('all');
  const [inspectorTab, setInspectorTab] = useState<'attributes' | 'security' | 'drift' | 'telemetry'>('attributes');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [nodes, setNodes] = useState<CanvasNodeItem[]>(INITIAL_CANVAS_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('authCluster');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [compilerLogs, setCompilerLogs] = useState<string[]>([
    '[✓] Parsed 4 active Central.station nodes, 3 directional Tailscale/MCP links in real-time.',
    '[i] Zero drift detected against sascha-kruss-1 & homeserver-omarchy state snapshot.',
    '[•] AST target: central.sascha-kruss.de/neu/station.js (Emerald-Teal v3.12)'
  ]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];

  const pushLog = (msg: string) => {
    setCompilerLogs((prev) => [`[✓] ${msg}`, ...prev.slice(0, 5)]);
  };

  const handleReplicaChange = (delta: number) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== selectedNode.id) return n;
        const nextRep = Math.max(1, Math.min(24, n.replicas + delta));
        pushLog(`Updated \`${n.title}.replicas\` = ${nextRep} in central-mesh.arch.ts`);
        return { ...n, replicas: nextRep };
      })
    );
  };

  const handleAddPaletteNode = (preset: {
    title: string;
    kind: string;
    category: 'compute' | 'storage' | 'network';
    badge: string;
    runtime: string;
  }) => {
    const suffix = Math.floor(10 + Math.random() * 89);
    const id = `${preset.title}_${suffix}`;
    const newNode: CanvasNodeItem = {
      id,
      title: `${preset.title}${suffix}`,
      kind: preset.kind,
      category: preset.category,
      badge: preset.badge,
      runtime: preset.runtime,
      replicas: 2,
      cpuPct: 28,
      cpuText: '1.1 / 4 Core',
      memPct: 36,
      memText: '1.4 / 4 GiB',
      sla: '99.95%',
      p99: '14ms',
      x: 260 + ((nodes.length * 20) % 120),
      y: 60 + ((nodes.length * 35) % 180),
      modulePath: `central/modules/${preset.title.toLowerCase()}`
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    pushLog(`Instantiated new DSL node \`${newNode.title}\` (${preset.kind}) into AST`);
  };

  const handleAutoLayout = () => {
    setNodes((prev) =>
      prev.map((n, idx) => {
        if (idx === 0) return { ...n, x: 28, y: 110 };
        if (idx === 1) return { ...n, x: 245, y: 145 };
        if (idx === 2) return { ...n, x: 515, y: 55 };
        if (idx === 3) return { ...n, x: 515, y: 265 };
        return { ...n, x: 250 + ((idx - 4) * 140), y: 295 };
      })
    );
    pushLog('Dagre hierarchical auto-layout recalculated (20px grid snap)');
  };

  const handlePointerDownNode = (e: React.PointerEvent<HTMLDivElement>, node: CanvasNodeItem) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    const container = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!container) return;
    setDraggingId(node.id);
    setDragOffset({
      x: e.clientX - container.left - node.x,
      y: e.clientY - container.top - node.y
    });
  };

  const handlePointerMoveCanvas = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let nx = e.clientX - rect.left - dragOffset.x;
    let ny = e.clientY - rect.top - dragOffset.y;
    nx = Math.max(12, Math.min(rect.width - 210, nx));
    ny = Math.max(48, Math.min(rect.height - 150, ny));
    if (snapToGrid) {
      nx = Math.round(nx / 20) * 20;
      ny = Math.round(ny / 20) * 20;
    }
    setNodes((prev) => prev.map((n) => (n.id === draggingId ? { ...n, x: nx, y: ny } : n)));
  };

  const handlePointerUpCanvas = () => {
    if (draggingId) {
      const moved = nodes.find((n) => n.id === draggingId);
      if (moved) {
        pushLog(`Topology repositioned: \`${moved.title}\` at (${moved.x}px, ${moved.y}px)`);
      }
      setDraggingId(null);
    }
  };

  const nGateway = nodes[0];
  const nAuth = nodes[1];
  const nCache = nodes[2];
  const nEvent = nodes[3];

  const makeCurve = (from: CanvasNodeItem, to: CanvasNodeItem) => {
    const fx = from.x + 185;
    const fy = from.y + 62;
    const tx = to.x;
    const ty = to.y + 62;
    const dx = Math.max(40, Math.abs(tx - fx) * 0.5);
    return {
      d: `M ${fx} ${fy} C ${fx + dx} ${fy}, ${tx - dx} ${ty}, ${tx} ${ty}`,
      mx: (fx + tx) / 2 - 30,
      my: (fy + ty) / 2 - 10
    };
  };

  const wire1 = makeCurve(nGateway, nAuth);
  const wire2 = makeCurve(nAuth, nCache);
  const wire3 = makeCurve(nAuth, nEvent);

  return (
    <div className="flex flex-col gap-3 w-full text-[#e6f1f3]">
      {/* TOP BAR: SWITCH BETWEEN INTERACTIVE REACT STUDIO & 5 CONVERTED GREEN HTML TEMPLATES */}
      <div className="rounded-lg border border-[#173037] bg-[#0b1417] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-[#34d399]/15 border border-[#34d399]/40 text-[#34d399] font-mono text-[10px] font-bold uppercase tracking-wider">
            ARCHIFY // CENTRAL.STATION GRÜN
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[12px] text-[#7e9ea5]">
            <span>Projekt:</span>
            <span className="text-[#e6f1f3] font-semibold">central.sascha-kruss.de</span>
            <span className="text-[#173037]">/</span>
            <span className="text-[#34d399]">central-mesh.arch.ts</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded bg-[#080d0f] border border-[#173037] font-mono text-[11px]">
            <button
              onClick={() => setTopTab('studio')}
              className={`px-3 py-1 rounded transition-all cursor-pointer ${
                topTab === 'studio'
                  ? 'bg-[#34d399] text-[#041310] font-bold'
                  : 'text-[#7e9ea5] hover:text-[#e6f1f3]'
              }`}
            >
              Interaktives Canvas Studio (Grün)
            </button>
            <button
              onClick={() => setTopTab('templates')}
              className={`px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                topTab === 'templates'
                  ? 'bg-[#34d399] text-[#041310] font-bold'
                  : 'text-[#7e9ea5] hover:text-[#e6f1f3]'
              }`}
            >
              <span>5 Umgefärbte HTML-Seiten (Vorschau)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#0e1b1e] text-[#34d399] text-[9px] font-bold">5</span>
            </button>
          </div>
        </div>
      </div>

      {topTab === 'templates' ? (
        <div className="flex flex-col gap-3">
          {/* 5 GREEN TEMPLATES SELECTOR STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {GREEN_TEMPLATES.map((tpl) => {
              const active = tpl.id === selectedTemplate.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    active
                      ? 'bg-[#112226] border-[#34d399] shadow-[0_0_20px_rgba(52,211,153,0.18)]'
                      : 'bg-[#0e1b1e] border-[#173037] hover:border-[#34d399]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#34d399]/15 text-[#34d399]">
                        {tpl.category}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                    </div>
                    <div className="font-semibold text-[12px] text-[#e6f1f3] leading-snug">{tpl.title}</div>
                  </div>
                  <div className="text-[10px] text-[#7e9ea5] line-clamp-2">{tpl.subtitle}</div>
                </button>
              );
            })}
          </div>

          {/* IFRAME PREVIEW OF CONVERTED GREEN TEMPLATE */}
          <div className="rounded-lg border border-[#173037] bg-[#0b1417] overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-[#0e1b1e] border-b border-[#173037] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
                <span className="font-mono text-[12px] font-bold text-[#e6f1f3]">{selectedTemplate.title}</span>
                <span className="font-mono text-[11px] text-[#7e9ea5]">({selectedTemplate.path})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1.5">
                  {selectedTemplate.features.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded bg-[#080d0f] border border-[#173037] font-mono text-[10px] text-[#99f6e4]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <a
                  href={selectedTemplate.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded bg-[#34d399] text-[#041310] font-mono text-[11px] font-bold hover:opacity-90 transition-opacity"
                >
                  In neuem Tab öffnen ↗
                </a>
              </div>
            </div>
            <iframe
              src={selectedTemplate.path}
              title={selectedTemplate.title}
              className="w-full h-[680px] border-0 bg-[#080d0f]"
            />
          </div>
        </div>
      ) : (
        /* INTERACTIVE 3-PANEL ARCHIFY CANVAS STUDIO IN EMERALD-TEAL */
        <div className="rounded-lg border border-[#173037] bg-[#0b1417] overflow-hidden flex flex-col">
          {/* SUB-HEADER CONTROL & SYNC STATUS BAR */}
          <div className="px-4 py-2 bg-[#0e1b1e] border-b border-[#173037] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Palette Quick-Inject Buttons */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#7e9ea5] mr-1">
                  + Knoten einfügen:
                </span>
                <button
                  onClick={() =>
                    handleAddPaletteNode({
                      title: 'postgresVault',
                      kind: 'StorageNode • AURORA_PG',
                      category: 'storage',
                      badge: 'DB',
                      runtime: 'PostgreSQL 16 (Multi-AZ)'
                    })
                  }
                  className="px-2.5 py-1 rounded bg-[#0b1417] hover:bg-[#13252a] border border-[#173037] hover:border-[#34d399]/60 font-mono text-[11px] text-[#e6f1f3] flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-[#22d3ee]" />
                  <span>+ Database</span>
                </button>
                <button
                  onClick={() =>
                    handleAddPaletteNode({
                      title: 'hermesWorker',
                      kind: 'ServiceNode • HERMES_SKILL',
                      category: 'compute',
                      badge: 'SERVICE',
                      runtime: 'homeserver-omarchy (:8000)'
                    })
                  }
                  className="px-2.5 py-1 rounded bg-[#0b1417] hover:bg-[#13252a] border border-[#173037] hover:border-[#34d399]/60 font-mono text-[11px] text-[#e6f1f3] flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-[#34d399]" />
                  <span>+ Service</span>
                </button>
                <button
                  onClick={() =>
                    handleAddPaletteNode({
                      title: 'nexusCache',
                      kind: 'CacheNode • NEXUS_MEM',
                      category: 'storage',
                      badge: 'CACHE',
                      runtime: 'NexusMem (:8765)'
                    })
                  }
                  className="px-2.5 py-1 rounded bg-[#0b1417] hover:bg-[#13252a] border border-[#173037] hover:border-[#34d399]/60 font-mono text-[11px] text-[#e6f1f3] flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-[#5ef6c4]" />
                  <span>+ Cache</span>
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center p-0.5 rounded bg-[#080d0f] border border-[#173037] font-mono text-[11px]">
                {(['split', 'canvas', 'code', 'diff'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setEditorMode(m)}
                    className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                      editorMode === m
                        ? 'bg-[#34d399] text-[#041310] font-bold'
                        : 'text-[#7e9ea5] hover:text-[#e6f1f3]'
                    }`}
                  >
                    {m === 'split'
                      ? 'Split View'
                      : m === 'canvas'
                      ? 'Canvas Only'
                      : m === 'code'
                      ? 'Code Only'
                      : 'IaC Diff (2)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-[#080d0f] border border-[#173037] text-[#99f6e4]">
                <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                <span>Bi-directional Sync Active (18ms)</span>
              </div>
              <button
                onClick={handleAutoLayout}
                className="px-2.5 py-1 rounded bg-[#080d0f] hover:bg-[#13252a] border border-[#173037] text-[#e6f1f3] cursor-pointer"
              >
                Auto-Layout
              </button>
            </div>
          </div>

          {/* 3-PANEL WORKSPACE BODY */}
          <div className="grid grid-cols-12 min-h-[480px] lg:min-h-[590px] bg-[#080d0f]">
            {/* LEFT PANEL: MONACO-STYLE DSL EDITOR */}
            {editorMode !== 'canvas' && (
              <div
                className={`${
                  editorMode === 'code' || editorMode === 'diff'
                    ? 'col-span-12 lg:col-span-9'
                    : 'col-span-12 lg:col-span-4'
                } flex flex-col bg-[#05090b] border-r border-[#173037] justify-between max-h-[360px] lg:max-h-none overflow-y-auto`}
              >
                <div>
                  <div className="h-9 px-3 bg-[#0b1417] border-b border-[#173037] flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#22d3ee] font-bold">TS</span>
                      <span className="text-[#e6f1f3]">central-mesh.arch.ts</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#0e1b1e] text-[#7e9ea5] text-[10px]">AST-v3.12</span>
                  </div>

                  {editorMode === 'diff' ? (
                    <div className="p-3 font-mono text-[11px] leading-6 space-y-1">
                      <div className="text-[#7e9ea5]">// IaC Diff gegen sascha-kruss-1 Live-Zustand</div>
                      <div className="bg-[#f87171]/10 border-l-2 border-[#f87171] px-2 text-[#f87171]">
                        - themePalette: &apos;tectonic-amber (#E54D2E)&apos;,
                      </div>
                      <div className="bg-[#34d399]/15 border-l-2 border-[#34d399] px-2 text-[#5ef6c4]">
                        + themePalette: &apos;central-station-emerald (#34d399 / #22d3ee)&apos;,
                      </div>
                      <div className="bg-[#f87171]/10 border-l-2 border-[#f87171] px-2 text-[#f87171]">
                        - replicas: 8, // centralApiCluster
                      </div>
                      <div className="bg-[#34d399]/15 border-l-2 border-[#34d399] px-2 text-[#5ef6c4]">
                        + replicas: {selectedNode.replicas}, // {selectedNode.title} (Live-Sync)
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 font-mono text-[11.5px] leading-6 overflow-x-auto select-text">
                      <div className="text-[#7e9ea5] italic">// Central.station Architecture-as-Code DSL</div>
                      <div>
                        <span className="text-[#34d399] font-semibold">import</span> {'{ '}
                        <span className="text-[#22d3ee]">Station</span>,{' '}
                        <span className="text-[#22d3ee]">Gateway</span>,{' '}
                        <span className="text-[#22d3ee]">Service</span>,{' '}
                        <span className="text-[#22d3ee]">VectorDB</span>,{' '}
                        <span className="text-[#22d3ee]">LLMNode</span> {'} '}
                        <span className="text-[#34d399] font-semibold">from</span>{' '}
                        <span className="text-[#99f6e4]">&apos;@central/core&apos;</span>;
                      </div>
                      <div className="h-2" />
                      <div>
                        <span className="text-[#34d399] font-semibold">export const</span>{' '}
                        <span className="text-[#e6f1f3] font-bold">centralStation</span> ={' '}
                        <span className="text-[#34d399]">new</span> <span className="text-[#22d3ee]">Station</span>({'{'}
                      </div>
                      <div className="pl-4 text-[#99f6e4]">
                        domain: &apos;central.sascha-kruss.de&apos;, areas: <span className="text-[#34d399]">6</span>, subpages:{' '}
                        <span className="text-[#34d399]">45</span>,
                      </div>
                      <div className="pl-4 text-[#99f6e4]">
                        tailnet: [&apos;sascha-kruss-1&apos;, &apos;homeserver-omarchy&apos;, &apos;annkon-01&apos;, &apos;crm-vps&apos;]
                      </div>
                      <div>{'}'});</div>
                      <div className="h-2" />
                      {nodes.map((n) => {
                        const isSel = n.id === selectedNode.id;
                        return (
                          <div
                            key={n.id}
                            onClick={() => setSelectedNodeId(n.id)}
                            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                              isSel
                                ? 'bg-[#34d399]/15 border-l-2 border-[#34d399]'
                                : 'hover:bg-[#0e1b1e]'
                            }`}
                          >
                            <span className="text-[#34d399] font-semibold">export const</span>{' '}
                            <span className={isSel ? 'text-[#5ef6c4] font-bold' : 'text-[#e6f1f3]'}>{n.title}</span> ={' '}
                            <span className="text-[#22d3ee]">Node</span>({'{ '}
                            <span className="text-[#7e9ea5]">replicas:</span>{' '}
                            <span className="text-[#34d399] font-bold">{n.replicas}</span>,{' '}
                            <span className="text-[#7e9ea5]">x:</span> {n.x}, <span className="text-[#7e9ea5]">y:</span>{' '}
                            {n.y} {'}'});
                          </div>
                        );
                      })}
                      <div className="h-2" />
                      <div className="text-[#7e9ea5] italic">// Declarative Tailnet &amp; MCP Links</div>
                      <div>
                        centralNginx.<span className="text-[#22d3ee]">connectTo</span>(
                        <span className="text-[#34d399]">centralApiCluster</span>, {'{ tls: '}
                        <span className="text-[#99f6e4]">&apos;mTLS-1.3&apos;</span> {'}'});
                      </div>
                      <div>
                        centralApiCluster.<span className="text-[#22d3ee]">bindMemory</span>(
                        <span className="text-[#34d399]">qdrantHybridIndex</span>, {'{ rrfK: '}
                        <span className="text-[#34d399]">60</span> {'}'});
                      </div>
                      <div>
                        centralApiCluster.<span className="text-[#22d3ee]">routeInference</span>(
                        <span className="text-[#34d399]">llamaAnnkonNode</span>, {'{ port: '}
                        <span className="text-[#34d399]">11435</span> {'}'});
                      </div>
                    </div>
                  )}
                </div>

                {/* AST COMPILER EXECUTION DRAWER */}
                <div className="h-32 bg-[#0b1417] border-t border-[#173037] p-2.5 font-mono text-[11px] flex flex-col">
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#173037]/60">
                    <span className="text-[#e6f1f3] font-bold text-[10px] tracking-wider">
                      ▸ AST COMPILER EXECUTION
                    </span>
                    <span className="text-[#34d399] text-[10px] font-bold">STATE: NOMINAL</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 text-[#99f6e4]">
                    {compilerLogs.map((log, i) => (
                      <div key={i} className={i === 0 ? 'text-[#34d399]' : 'text-[#7e9ea5]'}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CENTER PANEL: INTERACTIVE DRAG & DROP TOPOLOGY CANVAS */}
            {editorMode !== 'code' && editorMode !== 'diff' && (
              <div
                onPointerMove={handlePointerMoveCanvas}
                onPointerUp={handlePointerUpCanvas}
                className={`${
                  editorMode === 'canvas' ? 'col-span-12 lg:col-span-9' : 'col-span-12 lg:col-span-5'
                } relative overflow-hidden bg-[#080d0f] select-none min-h-[420px] sm:min-h-[560px]`}
                style={{
                  backgroundImage: 'radial-gradient(rgba(52, 211, 153, 0.22) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              >
                {/* Top Canvas HUD */}
                <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1 p-1 rounded bg-[#0e1b1e]/90 backdrop-blur border border-[#173037] font-mono text-[10px]">
                    <button
                      onClick={() => setSnapToGrid((s) => !s)}
                      className={`px-2 py-1 rounded cursor-pointer ${
                        snapToGrid ? 'bg-[#34d399]/20 text-[#34d399] font-bold' : 'text-[#7e9ea5]'
                      }`}
                    >
                      Grid 20px: {snapToGrid ? 'AN' : 'AUS'}
                    </button>
                    <button
                      onClick={handleAutoLayout}
                      className="px-2 py-1 rounded hover:bg-[#13252a] text-[#99f6e4] cursor-pointer"
                    >
                      Auto-Layout
                    </button>
                  </div>

                  {/* Layer Filter */}
                  <div className="flex items-center p-0.5 rounded bg-[#0e1b1e]/90 backdrop-blur border border-[#173037] font-mono text-[10px]">
                    {(['all', 'compute', 'storage', 'network'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-2 py-0.5 rounded uppercase cursor-pointer ${
                          categoryFilter === cat
                            ? 'bg-[#34d399] text-[#041310] font-bold'
                            : 'text-[#7e9ea5] hover:text-[#e6f1f3]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <path
                    d={wire1.d}
                    fill="none"
                    stroke="#34d399"
                    strokeDasharray="4 3"
                    strokeWidth="1.8"
                    opacity="0.85"
                  />
                  <path d={wire2.d} fill="none" stroke="#22d3ee" strokeWidth="1.8" opacity="0.9" />
                  <path d={wire3.d} fill="none" stroke="#5ef6c4" strokeWidth="1.8" opacity="0.9" />

                  <g transform={`translate(${wire1.mx}, ${wire1.my})`}>
                    <rect width="62" height="18" rx="3" fill="#0e1b1e" stroke="#173037" />
                    <text x="31" y="12" fill="#34d399" fontFamily="Neurath X Mono, JetBrains Mono, monospace" fontSize="9" textAnchor="middle">
                      mTLS 1.3
                    </text>
                  </g>
                  <g transform={`translate(${wire2.mx}, ${wire2.my})`}>
                    <rect width="60" height="18" rx="3" fill="#0e1b1e" stroke="#173037" />
                    <text x="30" y="12" fill="#22d3ee" fontFamily="Neurath X Mono, JetBrains Mono, monospace" fontSize="9" textAnchor="middle">
                      MCP RRF
                    </text>
                  </g>
                  <g transform={`translate(${wire3.mx}, ${wire3.my})`}>
                    <rect width="68" height="18" rx="3" fill="#0e1b1e" stroke="#173037" />
                    <text x="34" y="12" fill="#5ef6c4" fontFamily="Neurath X Mono, JetBrains Mono, monospace" fontSize="9" textAnchor="middle">
                      TAILNET
                    </text>
                  </g>
                </svg>

                {/* Draggable Nodes */}
                {nodes.map((node) => {
                  const isSelected = node.id === selectedNode.id;
                  const dimmed = categoryFilter !== 'all' && node.category !== categoryFilter;
                  return (
                    <div
                      key={node.id}
                      onPointerDown={(e) => handlePointerDownNode(e, node)}
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        opacity: dimmed ? 0.28 : 1
                      }}
                      className={`absolute w-48 rounded-lg bg-[#0e1b1e]/95 p-2.5 transition-shadow cursor-grab active:cursor-grabbing z-20 ${
                        isSelected
                          ? 'border-2 border-[#34d399] shadow-[0_0_24px_rgba(52,211,153,0.28)]'
                          : 'border border-[#173037] hover:border-[#34d399]/50 shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#173037]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-[#34d399] shrink-0" />
                          <span className="font-mono text-[11px] font-bold text-[#e6f1f3] truncate">
                            {node.title}
                          </span>
                        </div>
                        <span
                          className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            isSelected
                              ? 'bg-[#34d399] text-[#041310]'
                              : 'bg-[#13252a] text-[#22d3ee]'
                          }`}
                        >
                          {node.badge}
                        </span>
                      </div>

                      <div className="space-y-1 font-mono text-[10px]">
                        <div className="flex justify-between text-[#7e9ea5]">
                          <span>Runtime:</span>
                          <span className="text-[#e6f1f3] truncate max-w-[110px]">{node.runtime}</span>
                        </div>
                        <div className="flex justify-between text-[#7e9ea5]">
                          <span>Replicas:</span>
                          <span className="text-[#34d399] font-bold">{node.replicas} Active</span>
                        </div>
                        <div className="pt-0.5">
                          <div className="flex justify-between text-[9px] text-[#7e9ea5] mb-0.5">
                            <span>CPU ({node.cpuPct}%)</span>
                            <span className="text-[#99f6e4]">{node.cpuText}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#080d0f] overflow-hidden">
                            <div
                              className="h-full bg-[#34d399] rounded-full transition-all"
                              style={{ width: `${node.cpuPct}%` }}
                            />
                          </div>
                        </div>
                        <div className="pt-0.5">
                          <div className="flex justify-between text-[9px] text-[#7e9ea5] mb-0.5">
                            <span>MEM ({node.memPct}%)</span>
                            <span className="text-[#22d3ee]">{node.memText}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#080d0f] overflow-hidden">
                            <div
                              className="h-full bg-[#22d3ee] rounded-full transition-all"
                              style={{ width: `${node.memPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-[#173037] flex items-center justify-between font-mono text-[9px] text-[#7e9ea5]">
                        <span className="text-[#34d399]">P99: {node.p99}</span>
                        <span>SLA {node.sla}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Bottom Status Pill & Minimap */}
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-3 py-1 rounded bg-[#0e1b1e]/90 border border-[#173037] font-mono text-[10px] text-[#99f6e4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-ping" />
                  <span>Drag &amp; Drop aktiv: Knoten ziehen aktualisiert AST-Koordinaten</span>
                </div>
              </div>
            )}

            {/* RIGHT PANEL: NODE PROPERTIES & CONFIGURATION INSPECTOR */}
            <div className="col-span-12 lg:col-span-3 flex flex-col bg-[#0b1417] border-l border-[#173037]">
              <div className="h-9 px-3 bg-[#0e1b1e] border-b border-[#173037] flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#e6f1f3]">⚙ NODE INSPECTOR</span>
                <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#34d399]/15 text-[#34d399] font-bold">
                  SYNCHRONIZED
                </span>
              </div>

              <div className="p-3 bg-[#112226] border-b border-[#173037]">
                <div className="font-mono text-[14px] font-bold text-[#e6f1f3]">{selectedNode.title}</div>
                <div className="font-mono text-[10px] text-[#7e9ea5]">Kind: {selectedNode.kind}</div>
              </div>

              <div className="flex items-center px-2 bg-[#080d0f] border-b border-[#173037] font-mono text-[10px]">
                {(['attributes', 'security', 'drift', 'telemetry'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setInspectorTab(t)}
                    className={`py-2 px-2.5 border-b-2 capitalize cursor-pointer ${
                      inspectorTab === t
                        ? 'border-[#34d399] text-[#34d399] font-bold'
                        : 'border-transparent text-[#7e9ea5] hover:text-[#e6f1f3]'
                    }`}
                  >
                    {t === 'drift' ? 'Drift (0)' : t}
                  </button>
                ))}
              </div>

              <div className="p-3 space-y-3 font-mono text-[11px] flex-1">
                {/* Interactive Replicas Stepper */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#7e9ea5]">
                    <span>DESIRED REPLICAS</span>
                    <span className="text-[#22d3ee]">autoscale min:1 max:24</span>
                  </div>
                  <div className="flex items-center rounded bg-[#080d0f] border border-[#173037] p-1">
                    <button
                      onClick={() => handleReplicaChange(-1)}
                      className="w-8 h-7 rounded bg-[#0e1b1e] hover:bg-[#13252a] text-[#e6f1f3] font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-bold text-[#34d399] text-[14px]">
                      {selectedNode.replicas}
                    </div>
                    <button
                      onClick={() => handleReplicaChange(1)}
                      className="w-8 h-7 rounded bg-[#0e1b1e] hover:bg-[#13252a] text-[#e6f1f3] font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-[9.5px] text-[#7e9ea5]">
                    Schreibt `replicas` direkt in `central-mesh.arch.ts`
                  </div>
                </div>

                {/* Hardware Spec */}
                <div className="space-y-1">
                  <div className="text-[10px] text-[#7e9ea5]">INSTANCE HARDWARE SPEC</div>
                  <div className="p-2.5 rounded bg-[#080d0f] border border-[#173037] space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#7e9ea5]">Runtime:</span>
                      <span className="text-[#e6f1f3] font-semibold">{selectedNode.runtime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7e9ea5]">CPU Last:</span>
                      <span className="text-[#34d399]">{selectedNode.cpuText}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7e9ea5]">Speicher:</span>
                      <span className="text-[#22d3ee]">{selectedNode.memText}</span>
                    </div>
                  </div>
                </div>

                {/* Zero Trust */}
                <div className="space-y-1">
                  <div className="text-[10px] text-[#7e9ea5]">ZERO TRUST TAILNET</div>
                  <div className="p-2.5 rounded bg-[#080d0f] border border-[#173037] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#7e9ea5]">Tailscale ACL:</span>
                      <span className="text-[#34d399] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                        STRICT mTLS
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7e9ea5]">Modul-Pfad:</span>
                      <span className="text-[#99f6e4] text-[10px]">{selectedNode.modulePath}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ScanSearch,
  GitFork,
  Network,
  Orbit,
  Sparkles,
  ArrowUpDown,
  ChevronRight,
  Activity,
  Layers,
  Check,
  Search,
  FileText,
  Cpu,
  Server,
  Database,
} from 'lucide-react';

export type FuselabTier = 'core' | 'retrieval' | 'mcp' | 'folders' | 'signals';
export type GraphLayoutMode = 'radial' | 'hierarchy' | 'focus';
export type GraphDatasetMode = 'second-brain' | 'central-station';

export interface FuselabNode {
  id: string;
  name: string;
  shortMetric: string;
  tier: FuselabTier;
  parentId?: string;
  recallScore: number;
  gapScore: number;
  latencyMs: number;
  chunksCount: number;
  description: string;
  codeSnippet: string;
  linkedNote?: string;
  rx: number;
  ry: number;
  hx: number;
  hy: number;
  radius: number;
}

export interface FuselabLink {
  source: string;
  target: string;
  strength: number;
}

// Second.brain & Central.station Emerald-Mint-Cyan Color System
const TIER_META: Record<
  FuselabTier,
  {
    labelVault: string;
    labelStation: string;
    countVault: number;
    countStation: number;
    color: string;
    glowColor: string;
    gradId: string;
    badgeBg: string;
  }
> = {
  core: {
    labelVault: 'Second.brain Core',
    labelStation: 'Central Hub',
    countVault: 1,
    countStation: 1,
    color: '#2dd4bf', // Luminous Mint-Teal
    glowColor: 'rgba(45, 212, 191, 0.55)',
    gradId: 'sphere-core-mint',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
  },
  retrieval: {
    labelVault: 'Retrieval Engines',
    labelStation: 'Online Rechner (8)',
    countVault: 4,
    countStation: 8,
    color: '#34d399', // Second.brain Emerald
    glowColor: 'rgba(52, 211, 153, 0.5)',
    gradId: 'sphere-emerald',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  },
  mcp: {
    labelVault: 'MCP & Agenten-Hooks',
    labelStation: 'Aktive KI-Agenten (7)',
    countVault: 4,
    countStation: 7,
    color: '#22d3ee', // Central.station Cyan
    glowColor: 'rgba(34, 211, 238, 0.5)',
    gradId: 'sphere-cyan',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  },
  folders: {
    labelVault: 'Vault Ordner & Filter',
    labelStation: 'Wartet / Lokal (3)',
    countVault: 6,
    countStation: 3,
    color: '#fbbf24', // Amber Status (6/7 / wartet / idle)
    glowColor: 'rgba(251, 191, 36, 0.45)',
    gradId: 'sphere-amber',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  },
  signals: {
    labelVault: 'Signal-Chunks & Specs',
    labelStation: 'Offline / Alarme (2)',
    countVault: 8,
    countStation: 2,
    color: '#f87171', // Coral Status (offline / Fehler)
    glowColor: 'rgba(248, 113, 113, 0.45)',
    gradId: 'sphere-coral',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
  },
};

// DATASET 1: SECOND.BRAIN // OBSIDIAN HYBRID RETRIEVAL (Compact crisp radii)
const SECOND_BRAIN_NODES: FuselabNode[] = [
  {
    id: 'core-vault',
    name: 'Second.brain Vault',
    shortMetric: '100%',
    tier: 'core',
    recallScore: 99,
    gapScore: 8,
    latencyMs: 1.2,
    chunksCount: 49746,
    description:
      'Zentraler Markdown-Wissenskern (16.894 Dateien). Speist simultan den lexikalischen FTS5-Index und die 256d-Vektortabelle.',
    codeSnippet: 'vault_root = Path("~/second-brain").resolve() # 49.746 Chunks · synchron',
    linkedNote: '.indexignore',
    rx: 540,
    ry: 335,
    hx: 135,
    hy: 335,
    radius: 24,
  },
  {
    id: 'ret-fts5',
    name: 'SQLite FTS5 (BM25)',
    shortMetric: '96%',
    tier: 'retrieval',
    parentId: 'core-vault',
    recallScore: 96,
    gapScore: 14,
    latencyMs: 4.2,
    chunksCount: 49746,
    description:
      'Porter-Stemmer Volltextsuche mit Spaltengewichtung 10:5:1 (Heading > Section > Body) für exakte Fachbegriffe.',
    codeSnippet: 'SELECT rowid, bm25(chunks_fts, 10.0, 5.0, 1.0) FROM chunks_fts WHERE chunks_fts MATCH ?;',
    linkedNote: '09 volltextsuche-mit-sqlite-fts5.md',
    rx: 375,
    ry: 210,
    hx: 345,
    hy: 165,
    radius: 17,
  },
  {
    id: 'ret-vec0',
    name: 'sqlite-vec (vec0)',
    shortMetric: '94%',
    tier: 'retrieval',
    parentId: 'core-vault',
    recallScore: 94,
    gapScore: 18,
    latencyMs: 11.4,
    chunksCount: 49746,
    description:
      'Reine C-Erweiterung für schnelle Cosine-KNN-Suche über 256-dimensionale Float32-Vektoren direkt in SQLite.',
    codeSnippet: 'SELECT id, distance FROM chunk_vecs WHERE embedding MATCH ? ORDER BY distance LIMIT 60;',
    linkedNote: '11 vektor-einbettungen-mit-sqlite-vec.md',
    rx: 705,
    ry: 210,
    hx: 345,
    hy: 275,
    radius: 17,
  },
  {
    id: 'ret-model2vec',
    name: 'Model2Vec 256d',
    shortMetric: '30MB',
    tier: 'retrieval',
    parentId: 'ret-vec0',
    recallScore: 91,
    gapScore: 12,
    latencyMs: 0.8,
    chunksCount: 49746,
    description:
      'Statisches potion-base-8M Modell (30 MB RAM). Erzeugt Embeddings auf CPU in <1ms ohne PyTorch-Overhead.',
    codeSnippet: 'model = StaticModel.from_pretrained("MinishLab/potion-base-8M")',
    linkedNote: '11 vektor-einbettungen-mit-sqlite-vec.md',
    rx: 825,
    ry: 130,
    hx: 345,
    hy: 385,
    radius: 14,
  },
  {
    id: 'ret-rrf',
    name: 'RRF Fusion (k=60)',
    shortMetric: '98%',
    tier: 'retrieval',
    parentId: 'core-vault',
    recallScore: 98,
    gapScore: 6,
    latencyMs: 1.8,
    chunksCount: 120,
    description:
      'Reciprocal Rank Fusion kombiniert BM25-Rang und Vektor-Rang parameterfrei. Dual-Hits erhalten maximalen Boost.',
    codeSnippet: 'score = 1.0 / (60 + rank_bm25) + 1.0 / (60 + rank_vec)',
    linkedNote: '15 die-vollständige-retrieval-pipeline.md',
    rx: 540,
    ry: 155,
    hx: 345,
    hy: 495,
    radius: 18,
  },
  {
    id: 'mcp-server',
    name: 'agent-memory MCP',
    shortMetric: ':8798',
    tier: 'mcp',
    parentId: 'core-vault',
    recallScore: 97,
    gapScore: 9,
    latencyMs: 3.1,
    chunksCount: 12,
    description:
      'Lokaler STDIO & HTTP Model Context Protocol Server (:8798 · active). Verbindet Second.brain mit Central.station.',
    codeSnippet: '"obsidian-mcp": { "command": "uvx", "args": ["obsidian-mcp", "--vault", "~/vault"] }',
    linkedNote: '20 claude-code-integration.md',
    rx: 540,
    ry: 485,
    hx: 565,
    hy: 185,
    radius: 17,
  },
  {
    id: 'mcp-claude',
    name: 'Claude Code CLI',
    shortMetric: '23ms',
    tier: 'mcp',
    parentId: 'mcp-server',
    recallScore: 95,
    gapScore: 11,
    latencyMs: 23.0,
    chunksCount: 5,
    description:
      'Agentischer Coding-Client, der über MCP und Hooks bei jedem Prompt kontextrelevante Vault-Notizen injiziert.',
    codeSnippet: 'claude --mcp-config ~/.claude.json "Prüfe OAuth Rotation Pattern"',
    linkedNote: '20 claude-code-integration.md',
    rx: 385,
    ry: 525,
    hx: 565,
    hy: 300,
    radius: 15,
  },
  {
    id: 'mcp-hook',
    name: 'UserPromptSubmit',
    shortMetric: 'AUTO',
    tier: 'mcp',
    parentId: 'mcp-server',
    recallScore: 93,
    gapScore: 15,
    latencyMs: 19.4,
    chunksCount: 5,
    description:
      'Intercepted jeden Nutzer-Prompt vor dem LLM-Call, führt Hybrid-Suche aus und hängt Top-Chunks automatisch an.',
    codeSnippet: 'hooks.UserPromptSubmit -> python3 ~/.claude/hooks/vault_inject.py',
    linkedNote: '20 claude-code-integration.md',
    rx: 695,
    ry: 525,
    hx: 565,
    hy: 415,
    radius: 15,
  },
  {
    id: 'mcp-budget',
    name: 'Token-Kontingent',
    shortMetric: '71%',
    tier: 'mcp',
    parentId: 'mcp-hook',
    recallScore: 92,
    gapScore: 10,
    latencyMs: 0.4,
    chunksCount: 5,
    description:
      'Striktes Kontextfenster-Budget (max. 4.000 Tokens pro Injektion), verhindert Context-Bloat.',
    codeSnippet: 'MAX_INJECT_TOKENS = 4000 # 71% frei bis Mo 00:00',
    linkedNote: '15 die-vollständige-retrieval-pipeline.md',
    rx: 840,
    ry: 475,
    hx: 565,
    hy: 525,
    radius: 13,
  },
  {
    id: 'fld-projects',
    name: '01-projects/',
    shortMetric: '612',
    tier: 'folders',
    parentId: 'core-vault',
    recallScore: 89,
    gapScore: 19,
    latencyMs: 2.1,
    chunksCount: 2480,
    description: 'Aktive Architektur- und Sprint-Spezifikationen mit hoher Änderungsfrequenz.',
    codeSnippet: 'vault/01-projects/obsidian-mcp-hybrid-cockpit.md',
    rx: 265,
    ry: 305,
    hx: 780,
    hy: 120,
    radius: 14,
  },
  {
    id: 'fld-areas',
    name: '02-areas/gesundheit',
    shortMetric: '1.2k',
    tier: 'folders',
    parentId: 'core-vault',
    recallScore: 86,
    gapScore: 24,
    latencyMs: 2.8,
    chunksCount: 5120,
    description: 'Dauerhafte Bereiche (Gesundheit KW 44, Ring-Tagesdaten, Security, Finanzen).',
    codeSnippet: 'vault/02-areas/gesundheit/2026-10-26.jsonl',
    rx: 250,
    ry: 395,
    hx: 780,
    hy: 205,
    radius: 14,
  },
  {
    id: 'fld-resources',
    name: '03-resources/',
    shortMetric: '2.9k',
    tier: 'folders',
    parentId: 'core-vault',
    recallScore: 91,
    gapScore: 16,
    latencyMs: 3.4,
    chunksCount: 11400,
    description: 'Kuratierte Referenz-Dokumentation, Benchmarks und technische Deep-Dives.',
    codeSnippet: 'vault/03-resources/ai-engineering/sqlite-vec-benchmarks.md',
    rx: 815,
    ry: 295,
    hx: 780,
    hy: 295,
    radius: 14,
  },
  {
    id: 'fld-signals',
    name: '05-signals/',
    shortMetric: '3.4k',
    tier: 'folders',
    parentId: 'core-vault',
    recallScore: 95,
    gapScore: 12,
    latencyMs: 3.8,
    chunksCount: 14200,
    description: '12 kuratierte Signal-Domänen mit hoher semantischer Dichte für RAG-Retrieval.',
    codeSnippet: 'vault/05-signals/ai-tooling/mcp-stdio-patterns.md',
    rx: 830,
    ry: 385,
    hx: 780,
    hy: 385,
    radius: 15,
  },
  {
    id: 'fld-daily',
    name: '06-daily/',
    shortMetric: '1.8k',
    tier: 'folders',
    parentId: 'core-vault',
    recallScore: 74,
    gapScore: 38,
    latencyMs: 1.9,
    chunksCount: 4100,
    description: 'Tägliche Arbeitsprotokolle & Ring-Synchronisation (08:49 Uhr).',
    codeSnippet: 'vault/06-daily/2026-10-26.md',
    rx: 275,
    ry: 485,
    hx: 780,
    hy: 475,
    radius: 13,
  },
  {
    id: 'fld-ignore',
    name: '.indexignore',
    shortMetric: '-41%',
    tier: 'folders',
    parentId: 'core-vault',
    recallScore: 99,
    gapScore: 4,
    latencyMs: 0.2,
    chunksCount: 1,
    description: 'Schließt 07-templates/, 08-attachments/ und private Ordner aus. Reduziert Index-Rauschen um 41 %.',
    codeSnippet: '07-templates/\n08-attachments/\n02-areas/finance/personal/',
    linkedNote: '.indexignore',
    rx: 275,
    ry: 215,
    hx: 780,
    hy: 560,
    radius: 13,
  },
  {
    id: 'sig-oauth',
    name: 'OAuth Rotation',
    shortMetric: '0.033',
    tier: 'signals',
    parentId: 'ret-rrf',
    recallScore: 98,
    gapScore: 7,
    latencyMs: 1.1,
    chunksCount: 8,
    description: 'Top-1 Dual-Hit Chunk (BM25 #1 + VEC0 #2). Beschreibt Refresh-Token-Grace-Periods.',
    codeSnippet: 'RRF Score: 0.0328 (BM25 #1 + VEC0 #2) · 380 Tokens',
    rx: 460,
    ry: 72,
    hx: 980,
    hy: 100,
    radius: 11,
  },
  {
    id: 'sig-porter',
    name: 'Porter 10:5:1',
    shortMetric: 'BM25',
    tier: 'signals',
    parentId: 'ret-fts5',
    recallScore: 93,
    gapScore: 15,
    latencyMs: 1.4,
    chunksCount: 14,
    description: 'Gewichtet H1/H2-Überschriften 10-fach und Sektionen 5-fach gegenüber Fließtext.',
    codeSnippet: 'bm25(chunks_fts, 10.0, 5.0, 1.0)',
    rx: 245,
    ry: 115,
    hx: 980,
    hy: 170,
    radius: 11,
  },
  {
    id: 'sig-cosine',
    name: 'Float32 KNN',
    shortMetric: '256d',
    tier: 'signals',
    parentId: 'ret-vec0',
    recallScore: 91,
    gapScore: 17,
    latencyMs: 2.9,
    chunksCount: 19,
    description: 'Kompakte 1-KB-Vektoren pro Chunk ermöglichen kompletten Index im OS-Page-Cache.',
    codeSnippet: 'embedding float[256] -- 1.024 Bytes pro Chunk',
    rx: 635,
    ry: 72,
    hx: 980,
    hy: 240,
    radius: 11,
  },
  {
    id: 'sig-heading',
    name: 'Heading ~400 Tok',
    shortMetric: '400T',
    tier: 'signals',
    parentId: 'fld-projects',
    recallScore: 95,
    gapScore: 11,
    latencyMs: 0.9,
    chunksCount: 32,
    description: 'Markdown-Splitter trennt strikt an ## Headings statt mitten im Satz.',
    codeSnippet: 'chunk_size = 400 # Breadcrumb: File > H1 > H2',
    rx: 145,
    ry: 265,
    hx: 980,
    hy: 310,
    radius: 11,
  },
  {
    id: 'sig-sync',
    name: 'mtime_ns Sync',
    shortMetric: '23ms',
    tier: 'signals',
    parentId: 'fld-ignore',
    recallScore: 96,
    gapScore: 9,
    latencyMs: 1.5,
    chunksCount: 11,
    description: 'Inkrementeller Index-Abgleich über Nanosekunden-Timestamps (mtime_ns) in unter 25 ms.',
    codeSnippet: 'WHERE mtime_ns > last_indexed_mtime_ns',
    rx: 145,
    ry: 365,
    hx: 980,
    hy: 380,
    radius: 11,
  },
  {
    id: 'sig-daemon',
    name: 'STDIO Daemon',
    shortMetric: '0 GUI',
    tier: 'signals',
    parentId: 'mcp-claude',
    recallScore: 94,
    gapScore: 13,
    latencyMs: 2.0,
    chunksCount: 9,
    description: 'Kein Electron-Overhead: Server liest SQLite & Markdown direkt im Hintergrund.',
    codeSnippet: 'stdio_server() # Kein laufendes Obsidian-Fenster nötig',
    rx: 460,
    ry: 595,
    hx: 980,
    hy: 450,
    radius: 11,
  },
  {
    id: 'sig-yaml',
    name: 'YAML Router',
    shortMetric: 'META',
    tier: 'signals',
    parentId: 'fld-signals',
    recallScore: 88,
    gapScore: 21,
    latencyMs: 1.2,
    chunksCount: 27,
    description: 'Extrahiert type, domain, tags und status aus dem YAML-Header für präzises Pre-Filtering.',
    codeSnippet: 'domain: security | status: active | type: signal',
    rx: 950,
    ry: 340,
    hx: 980,
    hy: 520,
    radius: 11,
  },
  {
    id: 'sig-dualhit',
    name: 'Dual-Hit Boost',
    shortMetric: '+64%',
    tier: 'signals',
    parentId: 'mcp-hook',
    recallScore: 99,
    gapScore: 5,
    latencyMs: 0.7,
    chunksCount: 16,
    description: 'Chunks, die sowohl lexikalisch (BM25) als auch semantisch (vec0) treffen, dominieren das RRF-Ranking.',
    codeSnippet: 'is_dual_hit = doc_id in bm25_top60 and doc_id in vec_top60',
    rx: 625,
    ry: 595,
    hx: 980,
    hy: 590,
    radius: 11,
  },
];

const SECOND_BRAIN_LINKS: FuselabLink[] = [
  { source: 'core-vault', target: 'ret-fts5', strength: 1.0 },
  { source: 'core-vault', target: 'ret-vec0', strength: 1.0 },
  { source: 'core-vault', target: 'ret-rrf', strength: 1.0 },
  { source: 'ret-fts5', target: 'ret-rrf', strength: 0.95 },
  { source: 'ret-vec0', target: 'ret-rrf', strength: 0.95 },
  { source: 'ret-model2vec', target: 'ret-vec0', strength: 0.9 },
  { source: 'core-vault', target: 'mcp-server', strength: 1.0 },
  { source: 'ret-rrf', target: 'mcp-hook', strength: 0.85 },
  { source: 'mcp-server', target: 'mcp-claude', strength: 0.95 },
  { source: 'mcp-server', target: 'mcp-hook', strength: 0.95 },
  { source: 'mcp-hook', target: 'mcp-budget', strength: 0.85 },
  { source: 'core-vault', target: 'fld-projects', strength: 0.85 },
  { source: 'core-vault', target: 'fld-areas', strength: 0.85 },
  { source: 'core-vault', target: 'fld-resources', strength: 0.85 },
  { source: 'core-vault', target: 'fld-signals', strength: 0.9 },
  { source: 'core-vault', target: 'fld-daily', strength: 0.75 },
  { source: 'core-vault', target: 'fld-ignore', strength: 0.9 },
  { source: 'ret-rrf', target: 'sig-oauth', strength: 0.95 },
  { source: 'ret-fts5', target: 'sig-porter', strength: 0.85 },
  { source: 'ret-vec0', target: 'sig-cosine', strength: 0.85 },
  { source: 'fld-projects', target: 'sig-heading', strength: 0.8 },
  { source: 'fld-ignore', target: 'sig-sync', strength: 0.85 },
  { source: 'mcp-claude', target: 'sig-daemon', strength: 0.8 },
  { source: 'fld-signals', target: 'sig-yaml', strength: 0.85 },
  { source: 'mcp-hook', target: 'sig-dualhit', strength: 0.9 },
];

// DATASET 2: CENTRAL.STATION // AGENTEN-NETZ (From User Screenshot 4, zero label collisions!)
const CENTRAL_STATION_NODES: FuselabNode[] = [
  {
    id: 'cs-central',
    name: 'Central.station',
    shortMetric: 'LIVE',
    tier: 'core',
    recallScore: 99,
    gapScore: 4,
    latencyMs: 1.0,
    chunksCount: 479,
    description: 'Zentraler Leitstand (100.71.9.93:8798). 11 Geräte registriert, 8 online, 17 laufende Agenten-Prozesse.',
    codeSnippet: 'Central API 127.0.0.1:8895 · HTTP 200 · agent-memory MCP :8798 active',
    rx: 540,
    ry: 340,
    hx: 135,
    hy: 340,
    radius: 23,
  },
  // 8 ONLINE MACHINES (Emerald)
  {
    id: 'cs-omarchy',
    name: 'homeserver-omarchy',
    shortMetric: '4 Ag.',
    tier: 'retrieval',
    parentId: 'cs-central',
    recallScore: 97,
    gapScore: 8,
    latencyMs: 2.4,
    chunksCount: 4,
    description: 'Homeserver (Omarchy) — Nextcloud, Hermes, Claude. 4 aktive Agenten-Prozesse.',
    codeSnippet: 'ssh omarchy · 4 Agenten aktiv · Sync vor 12 s',
    rx: 465,
    ry: 185,
    hx: 355,
    hy: 110,
    radius: 17,
  },
  {
    id: 'cs-vps',
    name: 'sascha-kruss-1',
    shortMetric: '13 Ag.',
    tier: 'retrieval',
    parentId: 'cs-central',
    recallScore: 99,
    gapScore: 5,
    latencyMs: 3.8,
    chunksCount: 13,
    description: 'VPS — Webhosting, Central Station, OpenCode x2, Gemini [code-server], Claude. Speicher 62%.',
    codeSnippet: 'VPS · SASCHA-KRUSS-1 · 13 Agenten · Speicher 62%',
    rx: 650,
    ry: 205,
    hx: 355,
    hy: 175,
    radius: 18,
  },
  {
    id: 'cs-annkon',
    name: 'annkon-01',
    shortMetric: 'ON',
    tier: 'retrieval',
    parentId: 'cs-central',
    recallScore: 92,
    gapScore: 12,
    latencyMs: 8.1,
    chunksCount: 1,
    description: 'Linux Node · Tailscale 100.87.246.36 · Status: online.',
    codeSnippet: 'ping 100.87.246.36 -> 8.1 ms (online)',
    rx: 760,
    ry: 280,
    hx: 355,
    hy: 240,
    radius: 14,
  },
  {
    id: 'cs-crm',
    name: 'crm',
    shortMetric: 'ON',
    tier: 'retrieval',
    parentId: 'cs-central',
    recallScore: 95,
    gapScore: 9,
    latencyMs: 6.4,
    chunksCount: 2,
    description: 'CRM-Maschine (Linux) · Hoster für portfolio.sascha-kruss.de & Webseiten-Monitor.',
    codeSnippet: 'ssh crm-vps · HTTP 200 · 0,4 s',
    rx: 775,
    ry: 385,
    hx: 355,
    hy: 305,
    radius: 14,
  },
  {
    id: 'cs-laptopgross',
    name: 'laptopgross',
    shortMetric: 'ON',
    tier: 'retrieval',
    parentId: 'cs-central',
    recallScore: 94,
    gapScore: 10,
    latencyMs: 4.5,
    chunksCount: 3,
    description: 'Laptop (Windows) · Primäre Antigravity & Studio Workstation.',
    codeSnippet: 'Windows Workstation · Lokal & Tailscale aktiv',
    rx: 700,
    ry: 485,
    hx: 355,
    hy: 370,
    radius: 14,
  },
  {
    id: 'cs-notebook1',
    name: 'notebook-1',
    shortMetric: 'ON',
    tier: 'retrieval',
    parentId: 'cs-central',
    recallScore: 90,
    gapScore: 14,
    latencyMs: 7.2,
    chunksCount: 1,
    description: 'Notebook (Linux) · Mobiler Entwicklungs-Knoten.',
    codeSnippet: 'notebook-1 · Linux · Status: online',
    rx: 555,
    ry: 530,
    hx: 355,
    hy: 435,
    radius: 14,
  },
  {
    id: 'cs-nothing',
    name: 'nothing-phone-3a',
    shortMetric: 'ON',
    tier: 'retrieval',
    parentId: 'cs-central',
    recallScore: 88,
    gapScore: 16,
    latencyMs: 14.2,
    chunksCount: 1,
    description: 'Android · Tailscale 100.93.123.57 · Mobile Telemetry & Ring Sync.',
    codeSnippet: 'android · 100.93.123.57 · online',
    rx: 410,
    ry: 515,
    hx: 355,
    hy: 500,
    radius: 14,
  },
  {
    id: 'cs-lenovo',
    name: 'sascha-lenovo',
    shortMetric: 'ON',
    tier: 'retrieval',
    parentId: 'cs-central',
    recallScore: 91,
    gapScore: 13,
    latencyMs: 5.9,
    chunksCount: 2,
    description: 'Lenovo (Windows) · Secondary Workstation.',
    codeSnippet: 'sascha-lenovo · Windows · online',
    rx: 325,
    ry: 445,
    hx: 355,
    hy: 565,
    radius: 14,
  },

  // 7 RUNNING AGENTS (Cyan satellites — cleanly spaced around omarchy & sascha-kruss-1!)
  {
    id: 'ag-claude',
    name: 'Claude (Station)',
    shortMetric: '1m',
    tier: 'mcp',
    parentId: 'cs-omarchy',
    recallScore: 99,
    gapScore: 3,
    latencyMs: 1.2,
    chunksCount: 38,
    description: 'Status: läuft · Aufgabe: Station bauen · stand · vor 1 min.',
    codeSnippet: '● läuft | Claude -> Station bauen (vor 1 min)',
    rx: 370,
    ry: 95,
    hx: 600,
    hy: 115,
    radius: 13,
  },
  {
    id: 'ag-hermes',
    name: 'Hermes (Skill Deck)',
    shortMetric: '3m',
    tier: 'mcp',
    parentId: 'cs-omarchy',
    recallScore: 97,
    gapScore: 6,
    latencyMs: 1.8,
    chunksCount: 479,
    description: 'Status: läuft · Aufgabe: Skill Deck (479 Skills) · second-brain · vor 3 min.',
    codeSnippet: '● läuft | Hermes -> second-brain Skill Deck (vor 3 min)',
    rx: 485,
    ry: 78,
    hx: 600,
    hy: 195,
    radius: 13,
  },
  {
    id: 'ag-opencode',
    name: 'OpenCode x2',
    shortMetric: '6m',
    tier: 'mcp',
    parentId: 'cs-vps',
    recallScore: 96,
    gapScore: 8,
    latencyMs: 2.1,
    chunksCount: 14,
    description: 'Status: läuft · Aufgabe: FreeLLMAPI & code-server · opencode.sascha-kruss.de HTTP 200.',
    codeSnippet: '● läuft | OpenCode -> FreeLLMAPI (vor 6 min)',
    rx: 615,
    ry: 85,
    hx: 600,
    hy: 275,
    radius: 13,
  },
  {
    id: 'ag-claudefrei',
    name: 'claude-frei (TG)',
    shortMetric: '9m',
    tier: 'mcp',
    parentId: 'cs-vps',
    recallScore: 95,
    gapScore: 9,
    latencyMs: 2.5,
    chunksCount: 9,
    description: 'Status: läuft · Telegram-Bridge Agent · stand · vor 9 min.',
    codeSnippet: '● läuft | claude-frei -> Telegram Bridge (vor 9 min)',
    rx: 735,
    ry: 105,
    hx: 600,
    hy: 355,
    radius: 13,
  },
  {
    id: 'ag-gemini',
    name: 'Gemini [code-srv]',
    shortMetric: '1h',
    tier: 'mcp',
    parentId: 'cs-vps',
    recallScore: 91,
    gapScore: 14,
    latencyMs: 3.2,
    chunksCount: 6,
    description: 'Status: aktiv auf sascha-kruss-1 · Recherche & Code-Server.',
    codeSnippet: '● aktiv | Gemini CLI -> Recherche · logbuch',
    rx: 835,
    ry: 170,
    hx: 600,
    hy: 435,
    radius: 12,
  },
  {
    id: 'ag-paperclip',
    name: 'Paperclip (Board)',
    shortMetric: 'OK',
    tier: 'mcp',
    parentId: 'cs-omarchy',
    recallScore: 93,
    gapScore: 11,
    latencyMs: 1.9,
    chunksCount: 12,
    description: 'Status: bereit · Board & Kommentar-Synchronisation.',
    codeSnippet: '● bereit | Paperclip -> Board · kommentar',
    rx: 275,
    ry: 145,
    hx: 600,
    hy: 515,
    radius: 12,
  },
  {
    id: 'ag-memory',
    name: 'agent-memory :8798',
    shortMetric: 'MCP',
    tier: 'mcp',
    parentId: 'cs-central',
    recallScore: 99,
    gapScore: 2,
    latencyMs: 0.9,
    chunksCount: 67,
    description: 'Zentraler Gedächtnis-Dienst 100.71.9.93:8798 · HTTP 200 active.',
    codeSnippet: 'agent-memory MCP :8798 · active · 67 Dienste',
    rx: 555,
    ry: 245,
    hx: 600,
    hy: 585,
    radius: 13,
  },

  // 3 WARTET / LOKAL (Amber)
  {
    id: 'cs-iphone',
    name: 'iPhone 6 (lokal)',
    shortMetric: 'LOKAL',
    tier: 'folders',
    parentId: 'cs-central',
    recallScore: 82,
    gapScore: 22,
    latencyMs: 12.0,
    chunksCount: 1,
    description: 'Terminal-Phone — Befehle h / v / a / hilfe · Status: lokal.',
    codeSnippet: 'iPhone 6 · Terminal-Phone · lokal',
    rx: 350,
    ry: 240,
    hx: 810,
    hy: 180,
    radius: 14,
  },
  {
    id: 'cs-cadence',
    name: 'Cadence Studio',
    shortMetric: 'WARTET',
    tier: 'folders',
    parentId: 'cs-vps',
    recallScore: 76,
    gapScore: 34,
    latencyMs: 22.0,
    chunksCount: 4,
    description: 'Status: wartet · Aufgabe: Carousel (/ausgabe/flyer · vor 22 min).',
    codeSnippet: '● wartet | Cadence Studio -> Carousel',
    rx: 900,
    ry: 255,
    hx: 810,
    hy: 320,
    radius: 13,
  },
  {
    id: 'cs-kimi',
    name: 'Kimi Code',
    shortMetric: 'IDLE',
    tier: 'folders',
    parentId: 'cs-omarchy',
    recallScore: 84,
    gapScore: 19,
    latencyMs: 4.0,
    chunksCount: 3,
    description: 'Status: idle · Aufgabe: Refactoring · logbuch · vor 4 h.',
    codeSnippet: '● idle | Kimi Code -> Refactoring',
    rx: 235,
    ry: 225,
    hx: 810,
    hy: 460,
    radius: 12,
  },

  // 2 OFFLINE / FEHLER (Coral Red)
  {
    id: 'cs-a16',
    name: 'a16-von-sascha',
    shortMetric: 'OFF',
    tier: 'signals',
    parentId: 'cs-central',
    recallScore: 42,
    gapScore: 68,
    latencyMs: 0,
    chunksCount: 0,
    description: 'Handy Sascha (Android) · Status: offline · zuletzt vor 18 T.',
    codeSnippet: '● offline | a16-von-sascha (zuletzt vor 18 T)',
    rx: 280,
    ry: 315,
    hx: 980,
    hy: 230,
    radius: 14,
  },
  {
    id: 'cs-a12',
    name: 'a12-von-leonard',
    shortMetric: 'OFF',
    tier: 'signals',
    parentId: 'cs-central',
    recallScore: 35,
    gapScore: 75,
    latencyMs: 0,
    chunksCount: 0,
    description: 'Handy Leonard (Android) · Status: offline · zuletzt vor 30 T.',
    codeSnippet: '● offline | a12-von-leonard (zuletzt vor 30 T)',
    rx: 280,
    ry: 385,
    hx: 980,
    hy: 410,
    radius: 14,
  },
];

const CENTRAL_STATION_LINKS: FuselabLink[] = [
  { source: 'cs-central', target: 'cs-omarchy', strength: 1.0 },
  { source: 'cs-central', target: 'cs-vps', strength: 1.0 },
  { source: 'cs-central', target: 'cs-annkon', strength: 0.9 },
  { source: 'cs-central', target: 'cs-crm', strength: 0.9 },
  { source: 'cs-central', target: 'cs-laptopgross', strength: 0.9 },
  { source: 'cs-central', target: 'cs-notebook1', strength: 0.85 },
  { source: 'cs-central', target: 'cs-nothing', strength: 0.85 },
  { source: 'cs-central', target: 'cs-lenovo', strength: 0.85 },
  { source: 'cs-central', target: 'cs-iphone', strength: 0.7 },
  { source: 'cs-central', target: 'cs-a16', strength: 0.5 },
  { source: 'cs-central', target: 'cs-a12', strength: 0.5 },
  { source: 'cs-central', target: 'ag-memory', strength: 1.0 },
  { source: 'cs-omarchy', target: 'ag-claude', strength: 0.95 },
  { source: 'cs-omarchy', target: 'ag-hermes', strength: 0.95 },
  { source: 'cs-omarchy', target: 'ag-paperclip', strength: 0.85 },
  { source: 'cs-omarchy', target: 'cs-kimi', strength: 0.75 },
  { source: 'cs-vps', target: 'ag-opencode', strength: 0.95 },
  { source: 'cs-vps', target: 'ag-claudefrei', strength: 0.95 },
  { source: 'cs-vps', target: 'ag-gemini', strength: 0.9 },
  { source: 'cs-vps', target: 'cs-cadence', strength: 0.75 },
];

const TIMELINE_EPOCHS = [
  { year: 2022, files: '1.240', chunks: '3.8k', recall: 72, gap: 48, scale: 0.88 },
  { year: 2023, files: '4.820', chunks: '14.1k', recall: 81, gap: 39, scale: 0.92 },
  { year: 2024, files: '9.410', chunks: '27.6k', recall: 88, gap: 31, scale: 0.95 },
  { year: 2025, files: '13.150', chunks: '38.9k', recall: 93, gap: 22, scale: 0.98 },
  { year: 2026, files: '16.894', chunks: '49.7k', recall: 96, gap: 14, scale: 1.0 },
];

interface FuselabGraphCanvasProps {
  themeMode: 'weiss' | 'bunt';
  onSelectNode?: (nodeName: string, linkedNote?: string) => void;
  compact?: boolean;
}

export const FuselabGraphCanvas: React.FC<FuselabGraphCanvasProps> = ({
  themeMode,
  onSelectNode,
  compact = false,
}) => {
  const isWeiss = themeMode === 'weiss';

  // Dataset Mode ('second-brain' | 'central-station')
  const [datasetMode, setDatasetMode] = useState<GraphDatasetMode>('second-brain');

  // Layout & Interactive Modes
  const [layoutMode, setLayoutMode] = useState<GraphLayoutMode>('radial');
  const [scannerActive, setScannerActive] = useState<boolean>(true);
  const [activeEpoch, setActiveEpoch] = useState<number>(2026);
  const [zoom, setZoom] = useState<number>(1);
  const [sortBy, setSortBy] = useState<'recall' | 'latency'>('recall');
  const [showInspector, setShowInspector] = useState<boolean>(!compact);

  // Active Tier Filters
  const [enabledTiers, setEnabledTiers] = useState<Record<FuselabTier, boolean>>({
    core: true,
    retrieval: true,
    mcp: true,
    folders: true,
    signals: true,
  });

  const activeDatasetNodes = useMemo(
    () => (datasetMode === 'second-brain' ? SECOND_BRAIN_NODES : CENTRAL_STATION_NODES),
    [datasetMode]
  );

  const activeDatasetLinks = useMemo(
    () => (datasetMode === 'second-brain' ? SECOND_BRAIN_LINKS : CENTRAL_STATION_LINKS),
    [datasetMode]
  );

  // Selected & Hovered Nodes
  const [selectedNodeId, setSelectedNodeId] = useState<string>('core-vault');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Switch default selected node when dataset changes
  useEffect(() => {
    setSelectedNodeId(datasetMode === 'second-brain' ? 'core-vault' : 'cs-central');
  }, [datasetMode]);

  // AI Query Path Pulse Simulation
  const [aiQueryText, setAiQueryText] = useState<string>('OAuth Token Rotation');
  const [pulsingPathIds, setPulsingPathIds] = useState<string[]>([
    'core-vault',
    'ret-fts5',
    'ret-vec0',
    'ret-rrf',
    'sig-oauth',
    'mcp-hook',
    'cs-central',
    'cs-vps',
    'cs-omarchy',
    'ag-claude',
    'ag-hermes',
  ]);

  // Animated Node Positions
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const init: Record<string, { x: number; y: number }> = {};
    [...SECOND_BRAIN_NODES, ...CENTRAL_STATION_NODES].forEach((n) => {
      init[n.id] = { x: n.rx, y: n.ry };
    });
    return init;
  });

  // Pointer coordinates in SVG viewBox space for Reticle Loupe
  const [reticlePos, setReticlePos] = useState<{ x: number; y: number }>({ x: 540, y: 240 });
  const [isPointerInside, setIsPointerInside] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const epochData = useMemo(
    () => TIMELINE_EPOCHS.find((e) => e.year === activeEpoch) || TIMELINE_EPOCHS[4],
    [activeEpoch]
  );

  // Compute target coordinates based on layoutMode ('radial' | 'hierarchy' | 'focus')
  const targetPositions = useMemo(() => {
    const targets: Record<string, { x: number; y: number }> = {};
    const selectedNode =
      activeDatasetNodes.find((n) => n.id === selectedNodeId) || activeDatasetNodes[0];

    if (layoutMode === 'radial') {
      activeDatasetNodes.forEach((n) => {
        targets[n.id] = { x: n.rx, y: n.ry };
      });
    } else if (layoutMode === 'hierarchy') {
      activeDatasetNodes.forEach((n) => {
        targets[n.id] = { x: n.hx, y: n.hy };
      });
    } else {
      const connectedIds = new Set<string>();
      activeDatasetLinks.forEach((l) => {
        if (l.source === selectedNode.id) connectedIds.add(l.target);
        if (l.target === selectedNode.id) connectedIds.add(l.source);
      });

      const firstDeg = activeDatasetNodes.filter((n) => connectedIds.has(n.id));
      const others = activeDatasetNodes.filter(
        (n) => n.id !== selectedNode.id && !connectedIds.has(n.id)
      );

      targets[selectedNode.id] = { x: 540, y: 335 };

      firstDeg.forEach((n, idx) => {
        const angle = (idx / Math.max(1, firstDeg.length)) * Math.PI * 2 - Math.PI / 2;
        targets[n.id] = {
          x: 540 + Math.cos(angle) * 170,
          y: 335 + Math.sin(angle) * 155,
        };
      });

      others.forEach((n, idx) => {
        const angle = (idx / Math.max(1, others.length)) * Math.PI * 2;
        targets[n.id] = {
          x: 540 + Math.cos(angle) * 340,
          y: 335 + Math.sin(angle) * 245,
        };
      });
    }

    return targets;
  }, [layoutMode, selectedNodeId, activeDatasetNodes, activeDatasetLinks]);

  // Smooth spring interpolation loop
  useEffect(() => {
    let frameId: number;
    let tick = 0;

    const animate = () => {
      tick += 0.022;
      setNodePositions((prev) => {
        const next: Record<string, { x: number; y: number }> = { ...prev };
        for (const node of activeDatasetNodes) {
          const cur = prev[node.id] || { x: node.rx, y: node.ry };
          if (draggedNodeId === node.id) {
            next[node.id] = cur;
            continue;
          }

          const isVisible = enabledTiers[node.tier];
          const target = isVisible
            ? targetPositions[node.id] || { x: node.rx, y: node.ry }
            : { x: 540, y: 335 };

          const floatX = isVisible ? Math.sin(tick + node.rx * 0.02) * 1.4 : 0;
          const floatY = isVisible ? Math.cos(tick + node.ry * 0.02) * 1.4 : 0;

          const nx = cur.x + (target.x + floatX - cur.x) * 0.14;
          const ny = cur.y + (target.y + floatY - cur.y) * 0.14;

          next[node.id] = { x: nx, y: ny };
        }
        return next;
      });
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [targetPositions, enabledTiers, draggedNodeId, activeDatasetNodes]);

  // Visible nodes & links
  const visibleNodes = useMemo(
    () => activeDatasetNodes.filter((n) => enabledTiers[n.tier]),
    [activeDatasetNodes, enabledTiers]
  );

  const visibleLinks = useMemo(() => {
    const visibleSet = new Set(visibleNodes.map((n) => n.id));
    return activeDatasetLinks.filter(
      (l) => visibleSet.has(l.source) && visibleSet.has(l.target)
    );
  }, [activeDatasetLinks, visibleNodes]);

  // Closest node to Reticle Loupe
  const scannedNode = useMemo(() => {
    if (hoveredNodeId) {
      const h = visibleNodes.find((n) => n.id === hoveredNodeId);
      if (h) return h;
    }
    let best = visibleNodes[0] || activeDatasetNodes[0];
    let minDist = Infinity;
    for (const n of visibleNodes) {
      const pos = nodePositions[n.id] || { x: n.rx, y: n.ry };
      const d = Math.hypot(pos.x - reticlePos.x, pos.y - reticlePos.y);
      if (d < minDist) {
        minDist = d;
        best = n;
      }
    }
    return best;
  }, [hoveredNodeId, visibleNodes, activeDatasetNodes, nodePositions, reticlePos]);

  const selectedNode = useMemo(
    () =>
      activeDatasetNodes.find((n) => n.id === selectedNodeId) ||
      activeDatasetNodes[0],
    [activeDatasetNodes, selectedNodeId]
  );

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 1100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 680;

    setReticlePos({ x: rawX, y: rawY });

    if (draggedNodeId) {
      setNodePositions((prev) => ({
        ...prev,
        [draggedNodeId]: { x: rawX, y: rawY },
      }));
    }
  };

  const handleTriggerAiPulse = (queryOverride?: string) => {
    const q = (queryOverride ?? aiQueryText).toLowerCase();
    const rootId = datasetMode === 'second-brain' ? 'core-vault' : 'cs-central';
    const matchedIds = new Set<string>([rootId]);

    activeDatasetNodes.forEach((n) => {
      if (
        n.name.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.codeSnippet.toLowerCase().includes(q)
      ) {
        matchedIds.add(n.id);
        if (n.parentId) matchedIds.add(n.parentId);
      }
    });

    if (matchedIds.size <= 1) {
      activeDatasetNodes.slice(0, 6).forEach((n) => matchedIds.add(n.id));
    }

    setPulsingPathIds(Array.from(matchedIds));
  };

  const toggleTier = (tier: FuselabTier) => {
    if (tier === 'core') return;
    setEnabledTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  // Multi-strand bundled cubic Bezier beams (delicate spread for compact spheres)
  const buildMultiStrandBeams = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;

    const spread = Math.min(18, len * 0.085);

    const centerPath = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
    const upperStrand = `M ${x1} ${y1} Q ${mx + nx * spread} ${my + ny * spread} ${x2} ${y2}`;
    const lowerStrand = `M ${x1} ${y1} Q ${mx - nx * spread} ${my - ny * spread} ${x2} ${y2}`;

    return { centerPath, upperStrand, lowerStrand };
  };

  // Compact Reticle Loupe (radius 62)
  const reticleRadius = 62;
  const halfCircumference = Math.PI * reticleRadius;
  const recallArcLen = (scannedNode.recallScore / 100) * halfCircumference;
  const gapArcLen = (scannedNode.gapScore / 100) * halfCircumference;

  return (
    <div
      className={`relative w-full h-full min-h-[520px] flex overflow-hidden select-none ${
        isWeiss ? 'fuselab-canvas-paper text-[#06201b]' : 'fuselab-canvas-dark text-[#ecfdf5]'
      }`}
    >
      {/* =====================================================================
          1. LEFT VERTICAL TIMELINE / EPOCH SCRUBBER + EMERALD WAVEFORM
         ===================================================================== */}
      <div className="absolute left-2.5 top-14 bottom-14 w-14 z-20 flex flex-col items-center justify-between pointer-events-none">
        <svg
          className="absolute inset-y-0 left-0 w-12 h-full opacity-50 pointer-events-none"
          viewBox="0 0 50 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="timeline-wave-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.06" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 0 L 0 400 L 10 400 C 16 350, ${18 + (activeEpoch - 2022) * 4} 300, 14 250 C 8 200, ${
              32 + (activeEpoch - 2022) * 3.5
            } 160, 20 110 C 12 60, 24 30, 6 0 Z`}
            fill="url(#timeline-wave-emerald)"
          />
          <path
            d={`M 6 0 C 24 30, 12 60, 20 110 C ${
              32 + (activeEpoch - 2022) * 3.5
            } 160, 8 200, 14 250 C ${18 + (activeEpoch - 2022) * 4} 300, 16 350, 10 400`}
            fill="none"
            stroke="#34d399"
            strokeWidth="1.4"
            strokeOpacity="0.75"
          />
        </svg>

        <div className="relative z-10 flex flex-col justify-between h-full py-3 pointer-events-auto">
          {TIMELINE_EPOCHS.map((ep) => {
            const isActive = ep.year === activeEpoch;
            return (
              <button
                key={ep.year}
                onClick={() => setActiveEpoch(ep.year)}
                className={`group flex flex-col items-start px-2 py-0.5 rounded-full text-[9px] font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_10px_rgba(52,211,153,0.35)] font-bold'
                    : isWeiss
                    ? 'text-[#3b6e63] hover:text-[#06201b]'
                    : 'text-[#5e8279] hover:text-[#ecfdf5]'
                }`}
                title={`Stand ${ep.year}: ${ep.files} Dateien (${ep.chunks} Chunks)`}
              >
                <span>{ep.year}</span>
                {isActive && (
                  <span className="text-[9px] text-cyan-300 leading-none">
                    {ep.files}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          2. TOP FLOATING HUD TOOLBAR (Dataset Switch, Layout, Zoom, Scanner)
         ===================================================================== */}
      <div className="absolute top-2.5 left-16 right-3 z-20 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
        {/* Left: Dataset Preset Switcher (Second.brain vs Central.station) + Layout Mode */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          {/* Dataset Switcher */}
          <div
            className={`flex items-center gap-0.5 p-0.5 rounded-lg fuselab-border-glow ${
              isWeiss ? 'fuselab-hud-panel-paper' : 'fuselab-hud-panel'
            }`}
          >
            <button
              onClick={() => setDatasetMode('second-brain')}
              className={`px-2 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                datasetMode === 'second-brain'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 font-bold'
                  : 'text-[#99bab2] hover:text-white'
              }`}
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Second.brain</span>
            </button>
            <button
              onClick={() => setDatasetMode('central-station')}
              className={`px-2 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                datasetMode === 'central-station'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold'
                  : 'text-[#99bab2] hover:text-white'
              }`}
            >
              <Server className="w-3 h-3 text-cyan-400" />
              <span>Agenten-Netz (11)</span>
            </button>
          </div>

          {/* Layout Mode Switcher */}
          <div
            className={`flex items-center gap-0.5 p-0.5 rounded-lg ${
              isWeiss ? 'fuselab-hud-panel-paper' : 'fuselab-hud-panel'
            }`}
          >
            {[
              { id: 'radial', label: 'Netz', icon: Network },
              { id: 'hierarchy', label: 'Baum', icon: GitFork },
              { id: 'focus', label: 'Fokus', icon: Orbit },
            ].map((m) => {
              const Icon = m.icon;
              const active = layoutMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setLayoutMode(m.id as GraphLayoutMode)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 font-semibold'
                      : isWeiss
                      ? 'text-[#3b6e63] hover:text-[#06201b]'
                      : 'text-[#99bab2] hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Zoom + Sort + Sci-Fi HUD Lupe + Inspector Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <div
            className={`flex items-center gap-0.5 p-0.5 rounded-lg ${
              isWeiss ? 'fuselab-hud-panel-paper' : 'fuselab-hud-panel'
            }`}
          >
            <button
              onClick={() => setZoom((z) => Math.min(1.65, +(z + 0.15).toFixed(2)))}
              className="p-1 rounded hover:bg-emerald-500/20 text-emerald-300 transition-colors cursor-pointer"
              title="Vergrößern"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[9px] font-mono px-1 text-[#99bab2]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.15).toFixed(2)))}
              className="p-1 rounded hover:bg-emerald-500/20 text-emerald-300 transition-colors cursor-pointer"
              title="Verkleinern"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setLayoutMode('radial');
                setEnabledTiers({
                  core: true,
                  retrieval: true,
                  mcp: true,
                  folders: true,
                  signals: true,
                });
              }}
              className="p-1 rounded hover:bg-emerald-500/20 text-[#99bab2] transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() =>
              setSortBy((prev) => (prev === 'recall' ? 'latency' : 'recall'))
            }
            className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
              isWeiss ? 'fuselab-hud-panel-paper' : 'fuselab-hud-panel'
            }`}
          >
            <ArrowUpDown className="w-3 h-3 text-cyan-400" />
            <span className="px-1 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
              {sortBy === 'recall' ? 'Effizienz' : 'Latenz'}
            </span>
          </button>

          <button
            onClick={() => setScannerActive((s) => !s)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all fuselab-border-glow ${
              scannerActive
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                : isWeiss
                ? 'fuselab-hud-panel-paper text-[#3b6e63]'
                : 'fuselab-hud-panel text-[#99bab2]'
            }`}
            title="HUD Radar-Lupe ein-/ausschalten"
          >
            <ScanSearch className="w-3.5 h-3.5 text-emerald-400" />
            <span>HUD Lupe</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                scannerActive ? 'bg-emerald-400 animate-ping' : 'bg-[#5e8279]'
              }`}
            />
          </button>

          <button
            onClick={() => setShowInspector((v) => !v)}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 cursor-pointer ${
              isWeiss ? 'fuselab-hud-panel-paper' : 'fuselab-hud-panel'
            }`}
          >
            <Layers className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">{showInspector ? 'Details ‹' : 'Details ›'}</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          3. CENTER COMPACT 2.5D EMERALD/CYAN SPHERE & MULTI-BEAM GRAPH
         ===================================================================== */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 1100 680"
          onPointerMove={handleSvgPointerMove}
          onPointerEnter={() => setIsPointerInside(true)}
          onPointerLeave={() => {
            setIsPointerInside(false);
            setDraggedNodeId(null);
          }}
          onPointerUp={() => setDraggedNodeId(null)}
          style={{
            transform: `scale(${zoom * epochData.scale})`,
            transformOrigin: 'center center',
            transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className={`w-full h-full ${
            scannerActive ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
          }`}
        >
          <defs>
            {/* 1. Core Mint-Cyan Orb (Matches Central.station & Second.brain Logo) */}
            <radialGradient id="sphere-core-mint" cx="50%" cy="50%" r="50%" fx="28%" fy="24%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="28%" stopColor="#99f6e4" />
              <stop offset="65%" stopColor="#2dd4bf" />
              <stop offset="90%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#042f2e" />
            </radialGradient>

            {/* 2. Emerald Green Sphere (Online / Retrieval) */}
            <radialGradient id="sphere-emerald" cx="50%" cy="50%" r="50%" fx="30%" fy="26%">
              <stop offset="0%" stopColor="#ecfdf5" />
              <stop offset="28%" stopColor="#6ee7b7" />
              <stop offset="65%" stopColor="#10b981" />
              <stop offset="92%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#022c22" />
            </radialGradient>

            {/* 3. Electric Cyan Sphere (Active Agents / MCP) */}
            <radialGradient id="sphere-cyan" cx="50%" cy="50%" r="50%" fx="30%" fy="26%">
              <stop offset="0%" stopColor="#ecfeff" />
              <stop offset="28%" stopColor="#67e8f9" />
              <stop offset="65%" stopColor="#06b6d4" />
              <stop offset="92%" stopColor="#155e75" />
              <stop offset="100%" stopColor="#083344" />
            </radialGradient>

            {/* 4. Warm Amber Sphere (Wartet / Idle / Folders) */}
            <radialGradient id="sphere-amber" cx="50%" cy="50%" r="50%" fx="30%" fy="26%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="28%" stopColor="#fcd34d" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="92%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </radialGradient>

            {/* 5. Soft Coral Sphere (Offline / Signals) */}
            <radialGradient id="sphere-coral" cx="50%" cy="50%" r="50%" fx="30%" fy="26%">
              <stop offset="0%" stopColor="#fff1f2" />
              <stop offset="28%" stopColor="#fda4af" />
              <stop offset="65%" stopColor="#f43f5e" />
              <stop offset="92%" stopColor="#881337" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>

            <filter id="fuselab-bloom" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="fuselab-core-corona" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation="12" result="bigBlur" />
              <feMerge>
                <feMergeNode in="bigBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Subtle Concentric Radar Rings */}
          <g className="pointer-events-none" opacity={isWeiss ? 0.2 : 0.14}>
            <circle
              cx="540"
              cy="335"
              r="140"
              fill="none"
              stroke="#34d399"
              strokeWidth="0.9"
              strokeDasharray="3 8"
            />
            <circle
              cx="540"
              cy="335"
              r="265"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="0.9"
              strokeDasharray="4 10"
            />
            <circle
              cx="540"
              cy="335"
              r="390"
              fill="none"
              stroke="#34d399"
              strokeWidth="0.7"
              strokeDasharray="2 12"
            />
          </g>

          {/* Hierarchy Mode Column Headers */}
          {layoutMode === 'hierarchy' && (
            <g className="pointer-events-none font-mono text-[9px]" opacity={0.8}>
              {[
                { x: 135, label: '01 // CORE HUB' },
                { x: 350, label: '02 // ENGINES & NODES' },
                { x: 580, label: '03 // AGENTEN & MCP' },
                { x: 795, label: '04 // DOMÄNEN & IDLE' },
                { x: 980, label: '05 // SIGNALE & STATUS' },
              ].map((col) => (
                <g key={col.label} transform={`translate(${col.x}, 56)`}>
                  <line
                    x1="0"
                    y1="10"
                    x2="0"
                    y2="555"
                    stroke="#34d399"
                    strokeWidth="0.8"
                    strokeDasharray="2 6"
                    strokeOpacity="0.3"
                  />
                  <text
                    textAnchor="middle"
                    fill="#34d399"
                    className="font-bold tracking-widest"
                  >
                    {col.label}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* =================================================================
              MULTI-STRAND BUNDLED LIGHT BEAMS
             ================================================================= */}
          <g className="pointer-events-none">
            {visibleLinks.map((link, idx) => {
              const sPos = nodePositions[link.source];
              const tPos = nodePositions[link.target];
              const sNode = activeDatasetNodes.find((n) => n.id === link.source);
              const tNode = activeDatasetNodes.find((n) => n.id === link.target);
              if (!sPos || !tPos || !sNode || !tNode) return null;

              const isSelectedLink =
                selectedNodeId === link.source || selectedNodeId === link.target;
              const isPulsing =
                pulsingPathIds.includes(link.source) &&
                pulsingPathIds.includes(link.target);

              const targetMeta = TIER_META[tNode.tier];
              const { centerPath, upperStrand, lowerStrand } = buildMultiStrandBeams(
                sPos.x,
                sPos.y,
                tPos.x,
                tPos.y
              );

              const baseOpacity = isSelectedLink || isPulsing ? 0.88 : 0.32;

              return (
                <g key={`${link.source}-${link.target}-${idx}`} opacity={baseOpacity}>
                  <path
                    d={upperStrand}
                    fill="none"
                    stroke={targetMeta.color}
                    strokeWidth={isSelectedLink ? 1.1 : 0.7}
                    strokeOpacity={0.42}
                  />
                  <path
                    d={lowerStrand}
                    fill="none"
                    stroke={targetMeta.color}
                    strokeWidth={isSelectedLink ? 1.1 : 0.7}
                    strokeOpacity={0.42}
                  />
                  <path
                    d={centerPath}
                    fill="none"
                    stroke={targetMeta.color}
                    strokeWidth={isSelectedLink || isPulsing ? 1.9 : 1.1}
                    strokeOpacity={0.85}
                  />
                  {(isSelectedLink || isPulsing) && (
                    <path
                      d={centerPath}
                      fill="none"
                      stroke="#ecfdf5"
                      strokeWidth={1.7}
                      className="fuselab-beam-pulse"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* =================================================================
              COMPACT 2.5D GLOSSY SPHERE NODES
             ================================================================= */}
          <g>
            {visibleNodes.map((node) => {
              const pos = nodePositions[node.id] || { x: node.rx, y: node.ry };
              const meta = TIER_META[node.tier];
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isScanned = scannerActive && scannedNode.id === node.id;
              const isPulsing = pulsingPathIds.includes(node.id);
              const isCore = node.tier === 'core';

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                    setDraggedNodeId(node.id);
                    if (onSelectNode) {
                      onSelectNode(node.name, node.linkedNote);
                    }
                  }}
                  onPointerEnter={() => setHoveredNodeId(node.id)}
                  onPointerLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer"
                >
                  {/* Soft Mint/Emerald Corona Halo (like Central.station Hub) */}
                  {(isCore || isSelected || isHovered || isScanned || isPulsing) && (
                    <circle
                      r={node.radius * (isCore ? 2.1 : 1.65)}
                      fill={meta.glowColor}
                      opacity={isCore ? 0.34 : 0.24}
                      filter="url(#fuselab-core-corona)"
                    />
                  )}

                  {/* Fine Orbital Ring */}
                  {(isSelected || isScanned || isCore) && (
                    <circle
                      r={node.radius + 4.5}
                      fill="none"
                      stroke={meta.color}
                      strokeWidth={isSelected ? 1.5 : 1}
                      strokeDasharray={isCore ? '4 3' : '3 2'}
                      opacity={0.85}
                    />
                  )}

                  {/* Compact 2.5D Glossy Sphere */}
                  <circle
                    r={node.radius}
                    fill={`url(#${meta.gradId})`}
                    stroke="rgba(236, 253, 245, 0.45)"
                    strokeWidth={isSelected ? 1.6 : 0.8}
                    filter="url(#fuselab-bloom)"
                  />

                  {/* Specular Highlight */}
                  <ellipse
                    cx={-node.radius * 0.28}
                    cy={-node.radius * 0.32}
                    rx={node.radius * 0.36}
                    ry={node.radius * 0.18}
                    transform="rotate(-28)"
                    fill="rgba(255, 255, 255, 0.6)"
                    className="pointer-events-none"
                  />

                  {/* Metric Inside Sphere */}
                  <text
                    y={2.5}
                    textAnchor="middle"
                    fill="#041311"
                    className="font-mono font-bold text-[9px] pointer-events-none select-none"
                  >
                    {node.shortMetric}
                  </text>

                  {/* Crisp Compact Label Below Sphere */}
                  <g transform={`translate(0, ${node.radius + 11})`} className="pointer-events-none">
                    <rect
                      x={-Math.max(38, node.name.length * 2.9)}
                      y={-8}
                      width={Math.max(76, node.name.length * 5.8)}
                      height={14}
                      rx={7}
                      fill={isWeiss ? 'rgba(240, 247, 245, 0.92)' : 'rgba(6, 16, 14, 0.86)'}
                      stroke={isSelected || isScanned ? meta.color : 'rgba(52, 211, 153, 0.22)'}
                      strokeWidth={isSelected || isScanned ? 1.2 : 0.7}
                    />
                    <text
                      y={1.5}
                      textAnchor="middle"
                      fill={isWeiss ? '#06201b' : '#ecfdf5'}
                      className="font-mono text-[8.5px] font-medium"
                    >
                      {node.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* =================================================================
              4. COMPACT SCI-FI RADAR / RETICLE SCANNER LOUPE (Emerald/Cyan)
             ================================================================= */}
          {scannerActive && (
            <g
              transform={`translate(${reticlePos.x}, ${reticlePos.y})`}
              className="pointer-events-none"
              style={{
                transition: isPointerInside ? 'none' : 'transform 350ms ease-out',
              }}
            >
              <circle
                r={reticleRadius}
                fill="rgba(6, 18, 16, 0.52)"
                stroke="rgba(52, 211, 153, 0.35)"
                strokeWidth="1.2"
              />

              <g className="fuselab-reticle-spin">
                <circle
                  r={reticleRadius + 8}
                  fill="none"
                  stroke="rgba(34, 211, 238, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="2 7 10 7"
                />
                <line x1="0" y1={-(reticleRadius + 13)} x2="0" y2={-(reticleRadius + 5)} stroke="#34d399" strokeWidth="1.5" />
                <line x1="0" y1={reticleRadius + 5} x2="0" y2={reticleRadius + 13} stroke="#34d399" strokeWidth="1.5" />
                <line x1={-(reticleRadius + 13)} y1="0" x2={-(reticleRadius + 5)} y2="0" stroke="#34d399" strokeWidth="1.5" />
                <line x1={reticleRadius + 5} y1="0" x2={reticleRadius + 13} y2="0" stroke="#34d399" strokeWidth="1.5" />
              </g>

              {/* Left Rim Curved Gauge: EFFIZIENZ / RECALL (Emerald) */}
              <path
                d={`M 0 ${-reticleRadius} A ${reticleRadius} ${reticleRadius} 0 0 0 0 ${reticleRadius}`}
                fill="none"
                stroke="rgba(52, 211, 153, 0.18)"
                strokeWidth="4"
              />
              <path
                d={`M 0 ${-reticleRadius} A ${reticleRadius} ${reticleRadius} 0 0 0 0 ${reticleRadius}`}
                fill="none"
                stroke="#34d399"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${recallArcLen} ${halfCircumference}`}
              />

              {/* Right Rim Curved Gauge: GAPS / NOISE (Cyan/Amber) */}
              <path
                d={`M 0 ${-reticleRadius} A ${reticleRadius} ${reticleRadius} 0 0 1 0 ${reticleRadius}`}
                fill="none"
                stroke="rgba(34, 211, 238, 0.18)"
                strokeWidth="4"
              />
              <path
                d={`M 0 ${-reticleRadius} A ${reticleRadius} ${reticleRadius} 0 0 1 0 ${reticleRadius}`}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${gapArcLen} ${halfCircumference}`}
              />

              {/* Internal Frequency Spline Wave */}
              <path
                d={`M ${-reticleRadius + 12} 12 Q -26 ${
                  -18 - (scannedNode.recallScore % 16)
                }, 0 4 T ${reticleRadius - 12} -8`}
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
                strokeOpacity="0.85"
              />
              <path
                d={`M ${-reticleRadius + 14} 18 Q -16 ${
                  10 + (scannedNode.gapScore % 14)
                }, 10 -6 T ${reticleRadius - 14} 10`}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.1"
                strokeDasharray="3 3"
                strokeOpacity="0.75"
              />

              <circle r="2.5" fill="#34d399" />

              {/* Left Rim Pill */}
              <g transform={`translate(${-reticleRadius - 36}, -6)`}>
                <rect x="-28" y="-9" width="56" height="18" rx="5" fill="rgba(5, 16, 14, 0.92)" stroke="#34d399" strokeWidth="0.9" />
                <text y="2.5" textAnchor="middle" fill="#34d399" className="font-mono text-[9px] font-bold">
                  EFF {scannedNode.recallScore}%
                </text>
              </g>

              {/* Right Rim Pill */}
              <g transform={`translate(${reticleRadius + 36}, -6)`}>
                <rect x="-28" y="-9" width="56" height="18" rx="5" fill="rgba(5, 16, 14, 0.92)" stroke="#22d3ee" strokeWidth="0.9" />
                <text y="2.5" textAnchor="middle" fill="#22d3ee" className="font-mono text-[9px] font-bold">
                  GAP {scannedNode.gapScore}%
                </text>
              </g>

              <text
                y={-reticleRadius + 19}
                textAnchor="middle"
                fill="#6ee7b7"
                className="font-mono text-[9px] uppercase tracking-widest font-bold"
              >
                SCAN // {scannedNode.tier.toUpperCase()}
              </text>

              <text
                y={reticleRadius - 18}
                textAnchor="middle"
                fill="#ecfdf5"
                className="font-mono text-[8.5px] font-bold"
              >
                {scannedNode.name.slice(0, 18)}
              </text>
              <text
                y={reticleRadius - 8}
                textAnchor="middle"
                fill="#34d399"
                className="font-mono text-[9px]"
              >
                {scannedNode.latencyMs}ms · {scannedNode.chunksCount} Eintr.
              </text>
            </g>
          )}
        </svg>

        {/* ===================================================================
            5. COMPACT BOTTOM-LEFT FLOATING LEGEND CARD (Second.brain Emerald)
           =================================================================== */}
        <div
          className={`absolute left-16 bottom-3 z-20 w-52 rounded-xl p-2.5 fuselab-border-glow ${
            isWeiss ? 'fuselab-hud-panel-paper' : 'fuselab-hud-panel'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-emerald-500/20">
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-emerald-400">
              LEGENDE // EBENEN
            </span>
            <span className="text-[8.5px] font-mono text-[#99bab2]">
              {visibleNodes.length}/{activeDatasetNodes.length} aktiv
            </span>
          </div>

          <div className="space-y-1 font-mono text-[10px]">
            {(Object.keys(TIER_META) as FuselabTier[]).map((tier) => {
              const meta = TIER_META[tier];
              const active = enabledTiers[tier];
              const label =
                datasetMode === 'second-brain' ? meta.labelVault : meta.labelStation;
              const count =
                datasetMode === 'second-brain' ? meta.countVault : meta.countStation;
              return (
                <button
                  key={tier}
                  onClick={() => toggleTier(tier)}
                  className={`w-full px-1.5 py-0.5 rounded flex items-center justify-between transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500/10 text-[#ecfdf5] hover:bg-emerald-500/15'
                      : 'opacity-40 text-[#5e8279] hover:opacity-70'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: meta.color,
                        boxShadow: active ? `0 0 6px ${meta.color}` : 'none',
                      }}
                    >
                      {active && <Check className="w-1.5 h-1.5 text-slate-950 stroke-[3]" />}
                    </span>
                    <span className={isWeiss ? 'text-[#06201b] font-medium' : 'text-[#ecfdf5]'}>
                      {label}
                    </span>
                  </span>
                  <span className="text-[9px] px-1 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-emerald-500/20 space-y-1.5 font-mono text-[9px]">
            <div>
              <div className="flex justify-between mb-0.5">
                <span className="text-[#99bab2] uppercase">RAUSCHFILTER / GAPS</span>
                <span className="text-cyan-300 font-bold">{epochData.gap}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-[#050a09] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-300"
                  style={{ width: `${epochData.gap}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-0.5">
                <span className="text-[#99bab2] uppercase">EFFIZIENZ / RECALL</span>
                <span className="text-emerald-400 font-bold">{epochData.recall}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-[#050a09] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300"
                  style={{ width: `${epochData.recall}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            6. COMPACT BOTTOM-RIGHT LEITSTAND & AI RETRIEVAL DOCK
           =================================================================== */}
        <div
          className={`absolute right-3 bottom-3 z-20 rounded-xl p-2.5 fuselab-border-glow flex flex-col gap-2 max-w-sm ${
            isWeiss ? 'fuselab-hud-panel-paper' : 'fuselab-hud-panel'
          }`}
        >
          <div className="grid grid-cols-4 gap-2 text-center font-mono border-b border-emerald-500/20 pb-1.5">
            <div>
              <div className="text-[9px] text-[#99bab2] uppercase">Synchron</div>
              <div className="text-[11px] font-bold text-emerald-400">23 ms</div>
            </div>
            <div>
              <div className="text-[9px] text-[#99bab2] uppercase">Chunks</div>
              <div className="text-[11px] font-bold text-cyan-300">{epochData.chunks}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#99bab2] uppercase">Effizienz</div>
              <div className="text-[11px] font-bold text-emerald-300">{epochData.recall}%</div>
            </div>
            <div>
              <div className="text-[9px] text-[#99bab2] uppercase">Kontingent</div>
              <div className="text-[11px] font-bold text-cyan-400">71%</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3 h-3 text-emerald-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={aiQueryText}
                onChange={(e) => {
                  setAiQueryText(e.target.value);
                  handleTriggerAiPulse(e.target.value);
                }}
                placeholder="Notiz, Agent oder Dienst suchen..."
                className="w-full pl-6 pr-2 py-1 rounded-lg text-[10px] font-mono bg-[#050a09]/80 border border-emerald-500/30 text-[#ecfdf5] outline-none focus:border-emerald-400"
              />
            </div>
            <button
              onClick={() => handleTriggerAiPulse()}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-[#041311] flex items-center gap-1 cursor-pointer hover:brightness-110 transition-all shrink-0 shadow-[0_0_12px_rgba(52,211,153,0.35)]"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Pfad-Puls</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          7. RIGHT SLIDE-OVER NODE INSPECTOR DRAWER (Second.brain Card Style)
         ===================================================================== */}
      {showInspector && (
        <aside
          className={`w-72 border-l z-20 flex flex-col justify-between p-3.5 overflow-y-auto shrink-0 ${
            isWeiss
              ? 'bg-[#e4f0ec]/95 border-[#bdd6cf] text-[#06201b]'
              : 'bg-[#081311]/95 backdrop-blur-xl border-[#16302b] text-[#ecfdf5]'
          }`}
        >
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                  TIER_META[selectedNode.tier].badgeBg
                }`}
              >
                {datasetMode === 'second-brain'
                  ? TIER_META[selectedNode.tier].labelVault.toUpperCase()
                  : TIER_META[selectedNode.tier].labelStation.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {selectedNode.latencyMs} ms
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-mono font-bold text-[9px] text-[#041311] shadow-md"
                style={{
                  background: `radial-gradient(circle at 30% 28%, #ffffff, ${
                    TIER_META[selectedNode.tier].color
                  } 60%, #051210 100%)`,
                  boxShadow: `0 0 14px ${TIER_META[selectedNode.tier].glowColor}`,
                }}
              >
                {selectedNode.shortMetric}
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-xs truncate">
                  {selectedNode.name}
                </h3>
                <div className="text-[10px] font-mono text-cyan-400">
                  {selectedNode.chunksCount.toLocaleString('de-DE')} Einträge
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono leading-relaxed text-[#99bab2]">
              {selectedNode.description}
            </p>

            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#050a09]/70 border border-[#16302b] font-mono">
              <div>
                <div className="text-[8.5px] text-[#5e8279] uppercase">Effizienz / Recall</div>
                <div className="text-xs font-bold text-emerald-400">
                  {selectedNode.recallScore}%
                </div>
                <div className="w-full h-1 rounded bg-[#132824] mt-1 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${selectedNode.recallScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-[8.5px] text-[#5e8279] uppercase">Rauschen / Gap</div>
                <div className="text-xs font-bold text-cyan-300">
                  {selectedNode.gapScore}%
                </div>
                <div className="w-full h-1 rounded bg-[#132824] mt-1 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400"
                    style={{ width: `${selectedNode.gapScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[9px] font-mono uppercase tracking-wider text-[#99bab2] flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-400" />
                <span>SPEZIFIKATION // TELEMETRIE</span>
              </div>
              <pre className="p-2 rounded-lg bg-[#050a09] border border-[#16302b] text-[9.5px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                {selectedNode.codeSnippet}
              </pre>
            </div>

            <div className="space-y-1">
              <div className="text-[9px] font-mono uppercase tracking-wider text-[#99bab2]">
                VERBUNDENE KNOTEN
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {activeDatasetLinks
                  .filter(
                    (l) => l.source === selectedNode.id || l.target === selectedNode.id
                  )
                  .map((l, i) => {
                    const otherId =
                      l.source === selectedNode.id ? l.target : l.source;
                    const other = activeDatasetNodes.find((n) => n.id === otherId);
                    if (!other) return null;
                    return (
                      <button
                        key={`${other.id}-${i}`}
                        onClick={() => {
                          setSelectedNodeId(other.id);
                          setEnabledTiers((prev) => ({ ...prev, [other.tier]: true }));
                        }}
                        className="w-full px-2 py-1 rounded bg-emerald-500/5 hover:bg-emerald-500/15 border border-[#16302b] flex items-center justify-between text-left font-mono text-[10px] transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: TIER_META[other.tier].color }}
                          />
                          <span className="truncate">{other.name}</span>
                        </span>
                        <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0" />
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#16302b] space-y-1.5">
            <button
              onClick={() =>
                setLayoutMode((m) => (m === 'focus' ? 'radial' : 'focus'))
              }
              className="w-full py-1.5 rounded-lg text-[11px] font-mono font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Orbit className="w-3 h-3" />
              <span>
                {layoutMode === 'focus'
                  ? 'Gesamt-Netz anzeigen'
                  : 'Knoten-Orbit fokussieren'}
              </span>
            </button>

            {onSelectNode && (
              <button
                onClick={() => onSelectNode(selectedNode.name, selectedNode.linkedNote)}
                className="w-full py-1.5 rounded-lg text-[11px] font-mono font-bold bg-[#34d399] hover:bg-[#10b981] text-[#041311] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <FileText className="w-3 h-3" />
                <span>In Vault & RRF öffnen</span>
              </button>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

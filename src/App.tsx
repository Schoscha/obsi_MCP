import { useState, useEffect, useRef } from 'react';
import { CHAPTER_TASKS, TaskItem } from './data/tasksData';
import { SAMPLE_VAULT_NOTES, VaultNote } from './data/notesData';
import { GlassChecklistModal } from './components/GlassChecklistModal';
import { GlassSimulatorModal } from './components/GlassSimulatorModal';
import { GlassNoteModal } from './components/GlassNoteModal';
import { GlassGraphModal } from './components/GlassGraphModal';
import { FuselabGraphCanvas } from './components/FuselabGraphCanvas';
import { CentralStationSidebarTree } from './components/CentralStationSidebarTree';
import { CentralStationSubpageRenderer } from './components/CentralStationSubpageRenderer';
import { GlassAnalysisModal } from './components/GlassAnalysisModal';
import { GlassNewsModal } from './components/GlassNewsModal';
import { GlassAudioPlayerModal } from './components/GlassAudioPlayerModal';
import {
  Search,
  CheckSquare,
  Square,
  FileText,
  Folder,
  Cpu,
  Terminal,
  Sliders,
  Headphones,
  FilePlus,
  CalendarDays,
  Share2,
  BookOpen,
  Newspaper,
  Sun,
  Moon,
  RotateCcw,
  CheckCheck,
  Code,
  Layers,
  Activity,
  ArrowUpRight,
  Database,
  ShieldCheck,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

interface CanvasNode {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: 'retrieval' | 'vault' | 'mcp';
  metricLabel: string;
  metricValue: string;
  status: 'ACTIVE' | 'READY' | 'SYNCED';
  x: number;
  y: number;
  linkedNoteFilename?: string;
}

const INITIAL_CANVAS_NODES: CanvasNode[] = [
  {
    id: 'node-vault',
    code: 'FS // VAULT_ROOT',
    title: 'Obsidian Markdown Vault',
    subtitle: '16.894 .md Dateien · .indexignore aktiv',
    category: 'vault',
    metricLabel: 'CHUNKS',
    metricValue: '49.746 (~400 Tok)',
    status: 'SYNCED',
    x: 40,
    y: 55,
    linkedNoteFilename: '.indexignore',
  },
  {
    id: 'node-fts5',
    code: 'SQLITE // FTS5_BM25',
    title: 'SQLite FTS5 Volltext-Index',
    subtitle: 'Porter Stemmer · Spaltengewichte 10 / 5 / 1',
    category: 'retrieval',
    metricLabel: 'LATENZ',
    metricValue: '4.2 ms (Top-60)',
    status: 'ACTIVE',
    x: 330,
    y: 35,
    linkedNoteFilename: '09 volltextsuche-mit-sqlite-fts5.md',
  },
  {
    id: 'node-vec0',
    code: 'SQLITE // VEC0_KNN',
    title: 'sqlite-vec + Model2Vec',
    subtitle: 'potion-base-8M · 256d Float32 Cosine KNN',
    category: 'retrieval',
    metricLabel: 'LATENZ',
    metricValue: '11.4 ms (Top-60)',
    status: 'ACTIVE',
    x: 330,
    y: 195,
    linkedNoteFilename: '11 vektor-einbettungen-mit-sqlite-vec.md',
  },
  {
    id: 'node-rrf',
    code: 'FUSION // RRF_ENGINE',
    title: 'Reciprocal Rank Fusion',
    subtitle: 'Score = 1/(k + r_bm25) + 1/(k + r_vec)',
    category: 'retrieval',
    metricLabel: 'PARAMETER',
    metricValue: 'k = 60 · Dual-Hit Boost',
    status: 'ACTIVE',
    x: 630,
    y: 115,
    linkedNoteFilename: '15 die-vollständige-retrieval-pipeline.md',
  },
  {
    id: 'node-mcp',
    code: 'STDIO // MCP_SERVER',
    title: 'Obsidian MCP Server',
    subtitle: 'Lokaler STDIO Transport · 4.000 Token Cap',
    category: 'mcp',
    metricLabel: 'BUDGET',
    metricValue: '1.840 / 4.000 Tok',
    status: 'READY',
    x: 630,
    y: 295,
    linkedNoteFilename: '20 claude-code-integration.md',
  },
  {
    id: 'node-claude',
    code: 'AGENT // CLAUDE_CODE',
    title: 'Claude Code CLI Hook',
    subtitle: 'UserPromptSubmit · ~/.claude.json',
    category: 'mcp',
    metricLabel: 'ROUNDTRIP',
    metricValue: '23 ms End-to-End',
    status: 'ACTIVE',
    x: 40,
    y: 295,
    linkedNoteFilename: '20 claude-code-integration.md',
  },
];

const VAULT_FOLDERS = [
  { id: 'ALL', label: 'Alle Ordner', count: '16.894' },
  { id: '00-inbox', label: '00-inbox/', count: '18' },
  { id: '01-projects', label: '01-projects/', count: '612' },
  { id: '02-areas', label: '02-areas/', count: '1.240' },
  { id: '03-resources', label: '03-resources/', count: '2.890' },
  { id: '05-signals', label: '05-signals/', count: '3.412' },
  { id: '06-daily', label: '06-daily/', count: '1.825' },
  { id: '07-templates', label: '07-templates/', count: '24' },
];

export function App() {
  // Default to 'bunt' which maps to Tectonic Precision Dark Obsidian (#07100e)
  // 'weiss' maps to Canvas Paper (#f0f7f5) high-contrast light mode
  const [themeMode, setThemeMode] = useState<'weiss' | 'bunt'>('bunt');
  const isWeiss = themeMode === 'weiss';

  // Workspace View Mode (Default to 'station' -> Central.station 6 Areas / 45 Subpages!)
  const [workspaceMode, setWorkspaceMode] = useState<
    'station' | 'canvas' | 'split' | 'rrf' | 'chapters'
  >('station');
  const [activeStationSubpageId, setActiveStationSubpageId] = useState<string>('cockpit');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Left Panel Tab ('rrf' | 'code')
  const [leftConsoleTab, setLeftConsoleTab] = useState<'rrf' | 'code'>('rrf');

  // Right Inspector Tab ('inspector' | 'notes' | 'phases')
  const [rightInspectorTab, setRightInspectorTab] = useState<
    'inspector' | 'notes' | 'phases'
  >('inspector');

  // Active Folder Filter (real filter!)
  const [activeFolderFilter, setActiveFolderFilter] = useState<string>('ALL');

  // Canvas Layer Filter
  const [canvasLayerFilter, setCanvasLayerFilter] = useState<
    'all' | 'retrieval' | 'vault' | 'mcp'
  >('all');
  const [canvasEngine, setCanvasEngine] = useState<'fuselab' | 'cards'>('fuselab');

  // Interactive RRF Engine State
  const [rrfQuery, setRrfQuery] = useState('OAuth Token Rotation');
  const [kParam, setKParam] = useState(60);
  const [bm25Weight, setBm25Weight] = useState(1.0);
  const [vecWeight, setVecWeight] = useState(1.0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Draggable 2D Canvas Nodes State
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>(INITIAL_CANVAS_NODES);
  const [selectedCanvasNodeId, setSelectedCanvasNodeId] = useState<string>('node-rrf');
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // 32 Chapter Tasks with localStorage persistence
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('obsidian-cockpit-tasks-2026');
    if (saved) {
      try {
        const completedIds: string[] = JSON.parse(saved);
        return CHAPTER_TASKS.map((t) => ({
          ...t,
          completed: completedIds.includes(t.id),
        }));
      } catch {
        // fallback
      }
    }
    return CHAPTER_TASKS.map((t, i) => ({ ...t, completed: i < 9 }));
  });

  // Vault Notes State
  const [vaultNotes, setVaultNotes] = useState<Record<string, VaultNote>>(SAMPLE_VAULT_NOTES);
  const [selectedNote, setSelectedNote] = useState<VaultNote | null>(null);
  const [noteSearchFilter, setNoteSearchFilter] = useState('');

  // Modal States
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);

  // Execution Log entries
  const [execLogs, setExecLogs] = useState<string[]>([
    '[14:02:11] INIT sqlite-vec v0.1.9 + FTS5 Porter Stemmer (49.746 Chunks geladen)',
    '[14:02:12] APPLY .indexignore -> 06-daily/, 07-templates/, 99-archive/ ausgeschlossen',
    '[14:02:15] HOOK UserPromptSubmit -> Query "OAuth Token Rotation" -> 23ms (1.840 / 4.000 Tok)',
  ]);

  // Save tasks to localStorage
  useEffect(() => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    localStorage.setItem('obsidian-cockpit-tasks-2026', JSON.stringify(completedIds));
  }, [tasks]);

  // Global keyboard shortcut Cmd/Ctrl+K to focus RRF search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleBatchTogglePhase = (phase: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((t) => (t.phase === phase ? { ...t, completed } : t))
    );
    setExecLogs((prev) => [
      `[${new Date().toLocaleTimeString('de-DE')}] PHASE_SYNC "${phase}" -> ${
        completed ? 'COMPLETED' : 'RESET'
      }`,
      ...prev.slice(0, 14),
    ]);
  };

  const handleOpenNoteByName = (filename: string) => {
    const existing = vaultNotes[filename];
    if (existing) {
      setSelectedNote(existing);
      setIsNoteModalOpen(true);
    } else {
      const firstNote = Object.values(vaultNotes)[0];
      setSelectedNote(firstNote);
      setIsNoteModalOpen(true);
    }
  };

  const handleSaveNote = (updated: VaultNote) => {
    setVaultNotes((prev) => ({
      ...prev,
      [updated.filename]: updated,
    }));
    setSelectedNote(updated);
    setExecLogs((prev) => [
      `[${new Date().toLocaleTimeString('de-DE')}] WRITE_NOTE "${updated.filename}" -> FTS5 + vec0 inkrementell aktualisiert (14ms)`,
      ...prev.slice(0, 14),
    ]);
  };

  const handleCreateNewNote = () => {
    const id = `custom-${Date.now()}`;
    const filename = `notiz-${new Date().toISOString().slice(0, 10)}.md`;
    const targetFolder =
      activeFolderFilter === 'ALL' ? '00-inbox' : activeFolderFilter;
    const newNote: VaultNote = {
      id,
      filename,
      title: 'Neue Architektur-Notiz',
      folder: targetFolder,
      updated: 'Gerade eben',
      tags: ['inbox', '2026', 'mcp'],
      content: `---\ntitle: "Neue Architektur-Notiz"\ncreated: ${new Date()
        .toISOString()
        .slice(0, 10)}\nstatus: draft\ndomain: ai-tooling\n---\n\n# Neue Architektur-Notiz\n\nSchreibe hier deine Markdown-Gedanken für den hybriden Index...\n`,
    };
    setVaultNotes((prev) => ({ ...prev, [filename]: newNote }));
    setSelectedNote(newNote);
    setIsNoteModalOpen(true);
  };

  const handleOpenDailyNote = () => {
    const filename = `2026-09-22.md`;
    const dailyNote: VaultNote = vaultNotes[filename] || {
      id: 'daily-2026-09-22',
      filename,
      title: 'Tagesnotiz: 22. September 2026',
      folder: '06-daily',
      updated: 'Heute, 17:42',
      tags: ['daily', '2026-09', 'log'],
      content: `---\ndate: 2026-09-22\ntype: daily\n---\n\n# Dienstag, 22. September 2026\n\n## Fokus heute\n- [x] SQLite FTS5 Trigger für Markdown-Sync prüfen\n- [x] Model2Vec (256d) Embeddings testen\n- [ ] Claude Code \`UserPromptSubmit\` Hook feinjustieren\n\n## Notizen & Signale\nDie hybride Suche liefert unter 25ms Ergebnisse über alle 16.894 Dateien.\n`,
    };
    setVaultNotes((prev) => ({ ...prev, [filename]: dailyNote }));
    setSelectedNote(dailyNote);
    setIsNoteModalOpen(true);
  };

  // Filtered Vault Notes (respects BOTH sidebar folder filter and search filter!)
  const allNotesList = Object.values(vaultNotes);
  const filteredVaultNotes = allNotesList.filter((note) => {
    const matchesFolder =
      activeFolderFilter === 'ALL' || note.folder === activeFolderFilter;
    const q = noteSearchFilter.trim().toLowerCase();
    const matchesQuery =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.filename.toLowerCase().includes(q) ||
      note.folder.toLowerCase().includes(q) ||
      note.tags.some((t) => t.toLowerCase().includes(q));
    return matchesFolder && matchesQuery;
  });

  // Live RRF Ranking calculation for the Left Studio Console
  const rrfChunks = [
    {
      id: 'chunk-1',
      file: '15 die-vollständige-retrieval-pipeline.md',
      folder: '01-projects',
      section: '## 1. Architektur-Fluss & RRF',
      bm25Rank: 1,
      vecRank: 2,
      tokens: 410,
      keywords: ['oauth', 'token', 'rotation', 'rrf', 'pipeline', 'hybrid', 'bm25'],
      snippet:
        'Score = Σ w_i / (60 + rank_i) -> Führt FTS5 BM25 Top-60 und sqlite-vec 256d KNN unter 4.000 Token-Budget zusammen.',
    },
    {
      id: 'chunk-2',
      file: '09 volltextsuche-mit-sqlite-fts5.md',
      folder: '03-resources',
      section: '## BM25 Spaltengewichtung',
      bm25Rank: 2,
      vecRank: 6,
      tokens: 380,
      keywords: ['fts5', 'bm25', 'sqlite', 'porter', 'token', 'oauth', 'suche'],
      snippet:
        'bm25(chunks_fts, 10.0, 5.0, 1.0) gewichtet Dateititel 10-fach und H1-H3 Überschriften 5-fach gegenüber Fließtext.',
    },
    {
      id: 'chunk-3',
      file: '11 vektor-einbettungen-mit-sqlite-vec.md',
      folder: '03-resources',
      section: '## Model2Vec 256d Statische Embeddings',
      bm25Rank: 11,
      vecRank: 1,
      tokens: 440,
      keywords: ['vektor', 'sqlite-vec', 'model2vec', '256d', 'embedding', 'knn', 'rotation'],
      snippet:
        'MinishLab/potion-base-8M erzeugt 256d Float32-Vektoren in 8ms auf CPU ohne PyTorch-Overhead.',
    },
    {
      id: 'chunk-4',
      file: '20 claude-code-integration.md',
      folder: '01-projects',
      section: '## UserPromptSubmit Hook & ~/.claude.json',
      bm25Rank: 4,
      vecRank: 3,
      tokens: 610,
      keywords: ['claude', 'hook', 'mcp', 'stdio', 'token', 'budget'],
      snippet:
        'Registrierung zwingend in ~/.claude.json. Hook injiziert Top-5 RRF-Chunks (max. 1.500–4.000 Tokens) vor dem Prompt.',
    },
  ];

  const qLower = rrfQuery.trim().toLowerCase();
  const rankedRrfChunks = rrfChunks
    .filter((c) => activeFolderFilter === 'ALL' || c.folder === activeFolderFilter)
    .map((chunk) => {
      const matches =
        !qLower ||
        chunk.file.toLowerCase().includes(qLower) ||
        chunk.section.toLowerCase().includes(qLower) ||
        chunk.snippet.toLowerCase().includes(qLower) ||
        chunk.keywords.some((kw) => qLower.includes(kw));
      const boost = matches ? 1.0 : 0.65;
      const bm25Score = chunk.bm25Rank ? (bm25Weight * boost) / (kParam + chunk.bm25Rank) : 0;
      const vecScore = chunk.vecRank ? (vecWeight * boost) / (kParam + chunk.vecRank) : 0;
      const totalScore = bm25Score + vecScore;
      return {
        ...chunk,
        bm25Score,
        vecScore,
        totalScore,
        isDualHit: chunk.bm25Rank !== null && chunk.vecRank !== null,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  // Canvas Drag Handlers
  const handleNodePointerDown = (e: React.PointerEvent, node: CanvasNode) => {
    e.stopPropagation();
    setSelectedCanvasNodeId(node.id);
    setRightInspectorTab('inspector');
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggingNodeId(node.id);
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const nextX = Math.max(12, Math.min(rect.width - 230, Math.round(e.clientX - rect.left - dragOffset.x)));
    const nextY = Math.max(12, Math.min(rect.height - 120, Math.round(e.clientY - rect.top - dragOffset.y)));
    setCanvasNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: nextX, y: nextY } : n))
    );
  };

  const handleCanvasPointerUp = () => {
    setDraggingNodeId(null);
  };

  const selectedCanvasNode =
    canvasNodes.find((n) => n.id === selectedCanvasNodeId) || canvasNodes[0];

  const visibleCanvasNodes = canvasNodes.filter(
    (n) => canvasLayerFilter === 'all' || n.category === canvasLayerFilter
  );

  // Progress Stats
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const phasesList = Array.from(new Set(tasks.map((t) => t.phase)));

  return (
    <div
      className={`min-h-screen flex flex-col select-none transition-colors duration-150 ${
        isWeiss
          ? 'bg-[#f0f7f5] text-[#06201b]'
          : 'bg-[#07100e] text-[#ecfdf5]'
      }`}
    >
      {/* TOP GLOBAL HEADER BAR (h-14) */}
      <header
        className={`h-14 border-b px-2 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-3 shrink-0 z-30 ${
          isWeiss
            ? 'bg-[#e4f0ec] border-[#bdd6cf]'
            : 'bg-[#07100e] border-[#16302b]'
        }`}
      >
        {/* Brand & Breadcrumb (Second.brain / Central.station Style) */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Drawer Toggle (Mobile only) */}
          <button
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label={isMobileNavOpen ? 'Menü schließen' : 'Menü öffnen'}
            className="p-2 rounded-lg border border-[#16302b] bg-[#0b1715] text-[#34d399] lg:hidden hover:bg-[#112a24] active:scale-95 transition-all cursor-pointer shrink-0"
            title="45-Seiten Ordnerbaum öffnen"
          >
            {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 pr-1.5 sm:pr-3 border-r border-[#16302b]/60">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6ee7b7] via-[#34d399] to-[#22d3ee] shadow-[0_0_14px_rgba(52,211,153,0.55)] shrink-0" />
            <div className="leading-none">
              <div className="font-display font-bold text-sm tracking-tight">
                <span className={isWeiss ? 'text-[#06201b]' : 'text-[#ecfdf5]'}>Second.</span>
                <span className="text-[#22d3ee]">brain</span>
              </div>
              <div className="text-[9px] font-mono text-[#689187] tracking-[0.12em] uppercase mt-0.5">
                CENTRAL.STATION
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-[#689187] truncate">
            <span>Second Brain</span>
            <span>/</span>
            <span>Hybrid Retrieval</span>
            <span>/</span>
            <span className={isWeiss ? 'text-[#06201b] font-semibold' : 'text-[#ecfdf5] font-semibold'}>
              Leitstand
            </span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-[#34d399] border border-emerald-400/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
              synchron · 23ms
            </span>
          </div>
        </div>

        {/* Center Mode Switcher Tabs (Desktop horizontal tabs) */}
        <nav
          aria-label="Workspace Modi"
          className={`hidden md:flex items-center p-0.5 rounded border overflow-x-auto max-w-[50vw] lg:max-w-none shrink-0 ${
            isWeiss
              ? 'bg-[#f0f7f5] border-[#bdd6cf]'
              : 'bg-[#0b1715] border-[#16302b]'
          }`}
        >
          {[
            { id: 'station', label: 'Central.station (45 Seiten)' },
            { id: 'split', label: 'Split Studio' },
            { id: 'canvas', label: 'Topology Canvas' },
            { id: 'rrf', label: 'RRF & Code Lab' },
            { id: 'chapters', label: `32-Kapitel (${completedCount}/${totalCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setWorkspaceMode(tab.id as any);
                setIsMobileNavOpen(false);
              }}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                workspaceMode === tab.id
                  ? 'bg-[#34d399] text-[#041311] font-semibold'
                  : isWeiss
                  ? 'text-[#3b6e63] hover:text-[#06201b]'
                  : 'text-[#689187] hover:text-[#ecfdf5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Action Controls & Theme Switch */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setIsAudioOpen(true)}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 bg-[#34d399] hover:bg-[#10b981] text-[#041310] transition-colors cursor-pointer"
            title="Audio Briefing abspielen"
            aria-label="Audio Briefing"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AUDIO</span>
          </button>

          <button
            onClick={handleCreateNewNote}
            className={`hidden sm:flex px-2.5 py-1.5 rounded text-xs font-mono items-center gap-1.5 border transition-colors cursor-pointer ${
              isWeiss
                ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] hover:border-[#06201b]'
                : 'bg-[#0b1715] border-[#16302b] text-[#b2d8ce] hover:border-[#ecfdf5] hover:text-[#ecfdf5]'
            }`}
            title="Neue Markdown-Notiz im aktiven Ordner anlegen"
          >
            <FilePlus className="w-3.5 h-3.5 text-[#34d399]" />
            <span className="hidden md:inline">+ NOTIZ</span>
          </button>

          <button
            onClick={handleOpenDailyNote}
            className={`hidden md:flex px-2.5 py-1.5 rounded text-xs font-mono items-center gap-1.5 border transition-colors cursor-pointer ${
              isWeiss
                ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] hover:border-[#06201b]'
                : 'bg-[#0b1715] border-[#16302b] text-[#b2d8ce] hover:border-[#ecfdf5] hover:text-[#ecfdf5]'
            }`}
            title="Heutige Tagesnotiz (06-daily) öffnen"
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span className="hidden lg:inline">DAILY</span>
          </button>

          <button
            onClick={() => setIsAnalysisOpen(true)}
            className={`hidden sm:flex px-2.5 py-1.5 rounded text-xs font-mono items-center gap-1.5 border transition-colors cursor-pointer ${
              isWeiss
                ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] hover:border-[#06201b]'
                : 'bg-[#0b1715] border-[#16302b] text-[#b2d8ce] hover:border-[#ecfdf5] hover:text-[#ecfdf5]'
            }`}
            title="Architektur-Audit & Sinnhaftigkeit"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#34d399]" />
            <span className="hidden lg:inline">AUDIT</span>
          </button>

          <button
            onClick={() => setThemeMode(isWeiss ? 'bunt' : 'weiss')}
            aria-label={isWeiss ? 'Zu Dark Obsidian Modus wechseln' : 'Zu Canvas Paper Modus wechseln'}
            className={`p-2 sm:px-2.5 sm:py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
              isWeiss
                ? 'bg-[#06201b] text-[#f0f7f5] border-[#06201b]'
                : 'bg-[#f0f7f5] text-[#06201b] border-[#bdd6cf]'
            }`}
            title={isWeiss ? 'Zu OBSIDIAN (#07100e) wechseln' : 'Zu PAPER (#f0f7f5) wechseln'}
          >
            {isWeiss ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#34d399]" />
                <span className="hidden sm:inline">DARK</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#34d399]" />
                <span className="hidden sm:inline">PAPER</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* SUB-HEADER MARQUEE TELEMETRY & QUICK-ACTION STRIP */}
      <div
        className={`h-9 border-b px-3 flex items-center justify-between text-[11px] font-mono shrink-0 overflow-hidden ${
          isWeiss
            ? 'bg-[#e4f0ec]/60 border-[#bdd6cf] text-[#3b6e63]'
            : 'bg-[#0b1715] border-[#16302b] text-[#689187]'
        }`}
      >
        <div className="flex-1 marquee-container py-1 overflow-hidden">
          <div className="marquee-track">
            {/* 1st copy of ticker items */}
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className={isWeiss ? 'text-[#06201b]' : 'text-[#ecfdf5]'}>
                Bi-directional Sync Active (23ms p50)
              </strong>
              <span className="text-[9.5px] text-[#22d3ee] bg-cyan-950/40 px-1 py-0.2 rounded border border-cyan-800/40">
                Quelle: WebSocket Daemon /ws/telemetry :8765
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>TOKEN-KONTINGENT:</span>
              <strong className="text-emerald-400">71% verbraucht (355k / 500k)</strong>
              <span className="text-[9.5px] text-[#34d399] bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-800/40">
                Quelle: Central API /ablaeufe/nutzung & secrets.env (Gemini 2.5: 210k | Claude Opus: 145k · 145k frei)
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>HYBRID RETRIEVAL:</span>
              <strong className="text-[#22d3ee]">SQLite FTS5 Porter + sqlite-vec v0.1.9</strong>
              <span className="text-[9.5px] text-[#689187] bg-[#07100e] px-1 py-0.2 rounded border border-[#16302b]">
                Quelle: Vault Indexer DB :8765 (49.746 Chunks)
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>EMBEDDING:</span>
              <strong className="text-[#34d399]">Model2Vec potion-base-8M 256d</strong>
              <span className="text-[9.5px] text-[#689187] bg-[#07100e] px-1 py-0.2 rounded border border-[#16302b]">
                Quelle: CPU-Inference (8ms · 30 MB RAM)
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>MCP PROTOCOL:</span>
              <strong className="text-emerald-400">1.840 / 4.000 Tokens STDIO Cap</strong>
              <span className="text-[9.5px] text-[#689187] bg-[#07100e] px-1 py-0.2 rounded border border-[#16302b]">
                Quelle: ~/.claude.json & Obsidian MCP
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>HOST:</span>
              <strong className="text-[#22d3ee]">sascha-kruss-1 (100.89.43.82)</strong>
              <span className="text-[9.5px] text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-800/40">
                Quelle: htop Telemetrie (62% RAM · 24.8 GB frei)
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>AGENTEN:</span>
              <strong className="text-[#34d399]">5 aktiv (@hermes, @vera, @opencode, @atlas, @claude)</strong>
              <span className="text-[9.5px] text-[#689187] bg-[#07100e] px-1 py-0.2 rounded border border-[#16302b]">
                Quelle: Central Process Supervisor systemd
              </span>
            </span>

            {/* 2nd identical copy of ticker items for seamless infinite loop */}
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <strong className={isWeiss ? 'text-[#06201b]' : 'text-[#ecfdf5]'}>
                Bi-directional Sync Active (23ms p50)
              </strong>
              <span className="text-[9.5px] text-[#22d3ee] bg-cyan-950/40 px-1 py-0.2 rounded border border-cyan-800/40">
                Quelle: WebSocket Daemon /ws/telemetry :8765
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>TOKEN-KONTINGENT:</span>
              <strong className="text-emerald-400">71% verbraucht (355k / 500k)</strong>
              <span className="text-[9.5px] text-[#34d399] bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-800/40">
                Quelle: Central API /ablaeufe/nutzung & secrets.env (Gemini 2.5: 210k | Claude Opus: 145k · 145k frei)
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>HYBRID RETRIEVAL:</span>
              <strong className="text-[#22d3ee]">SQLite FTS5 Porter + sqlite-vec v0.1.9</strong>
              <span className="text-[9.5px] text-[#689187] bg-[#07100e] px-1 py-0.2 rounded border border-[#16302b]">
                Quelle: Vault Indexer DB :8765 (49.746 Chunks)
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>EMBEDDING:</span>
              <strong className="text-[#34d399]">Model2Vec potion-base-8M 256d</strong>
              <span className="text-[9.5px] text-[#689187] bg-[#07100e] px-1 py-0.2 rounded border border-[#16302b]">
                Quelle: CPU-Inference (8ms · 30 MB RAM)
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>MCP PROTOCOL:</span>
              <strong className="text-emerald-400">1.840 / 4.000 Tokens STDIO Cap</strong>
              <span className="text-[9.5px] text-[#689187] bg-[#07100e] px-1 py-0.2 rounded border border-[#16302b]">
                Quelle: ~/.claude.json & Obsidian MCP
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>HOST:</span>
              <strong className="text-[#22d3ee]">sascha-kruss-1 (100.89.43.82)</strong>
              <span className="text-[9.5px] text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-800/40">
                Quelle: htop Telemetrie (62% RAM · 24.8 GB frei)
              </span>
            </span>
            <span className="text-[#16302b]">✦</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span>AGENTEN:</span>
              <strong className="text-[#34d399]">5 aktiv (@hermes, @vera, @opencode, @atlas, @claude)</strong>
              <span className="text-[9.5px] text-[#689187] bg-[#07100e] px-1 py-0.2 rounded border border-[#16302b]">
                Quelle: Central Process Supervisor systemd
              </span>
            </span>
          </div>
        </div>

        {/* Quick Modal Actions on Desktop */}
        <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-[#16302b] whitespace-nowrap shrink-0">
          <button
            onClick={() => setIsGraphOpen(true)}
            className="hover:text-[#34d399] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Share2 className="w-3 h-3 text-[#22d3ee]" />
            <span>[Graph]</span>
          </button>
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="hover:text-[#34d399] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Sliders className="w-3 h-3 text-[#34d399]" />
            <span>[RRF Lab]</span>
          </button>
          <button
            onClick={() => setIsChecklistOpen(true)}
            className="hover:text-[#34d399] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <CheckSquare className="w-3 h-3 text-emerald-500" />
            <span>[32-Kapitel]</span>
          </button>
          <button
            onClick={() => setIsNewsOpen(true)}
            className="hover:text-[#34d399] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Newspaper className="w-3 h-3 text-amber-500" />
            <span>[Releases]</span>
          </button>
        </div>
      </div>

      {/* MAIN STUDIO WORKBENCH (OBSIDIAN RIBBON + SIDEBAR + WORKSPACE) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop when Off-Canvas Drawer is open */}
        {isMobileNavOpen && (
          <div
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 top-14 bg-black/60 backdrop-blur-sm z-30 lg:hidden cursor-pointer"
            aria-hidden="true"
          />
        )}

        {/* FAR-LEFT NARROW OBSIDIAN ICON RIBBON (Hidden on phone to save 44px) */}
        <div
          className={`hidden md:flex w-11 border-r flex-col items-center justify-between py-3 shrink-0 z-20 ${
            isWeiss
              ? 'bg-[#d7e8e2] border-[#bdd6cf]'
              : 'bg-[#050c0a] border-[#16302b]'
          }`}
        >
          <div className="flex flex-col items-center gap-2.5">
            {[
              { id: 'station', title: 'Central.station (45 Seiten)', icon: Cpu },
              { id: 'canvas', title: '2.5D Topology Graph', icon: Share2 },
              { id: 'split', title: '3-Pane Split Studio', icon: Layers },
              { id: 'rrf', title: 'RRF & Code Console', icon: Terminal },
              { id: 'chapters', title: '32-Kapitel Rollout', icon: CheckSquare },
            ].map((btn) => {
              const Icon = btn.icon;
              const active = workspaceMode === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => setWorkspaceMode(btn.id as any)}
                  title={btn.title}
                  className={`p-2 rounded transition-all cursor-pointer ${
                    active
                      ? 'bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/50 shadow-[0_0_10px_rgba(52,211,153,0.25)]'
                      : 'text-[#689187] hover:text-[#ecfdf5] hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-2.5">
            <button
              onClick={() => setIsGraphOpen(true)}
              title="Vollbild 2.5D Graph Modal"
              className="p-2 rounded text-[#22d3ee] hover:bg-cyan-500/15 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              title="RRF Simulator"
              className="p-2 rounded text-[#689187] hover:text-[#34d399] transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAnalysisOpen(true)}
              title="Architektur Audit"
              className="p-2 rounded text-[#689187] hover:text-[#34d399] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LEFT DOCKED OBSIDIAN TREE SIDEBAR (Responsive: Off-Canvas Drawer on mobile, Static on lg+) */}
        <aside
          className={`fixed inset-y-14 left-0 z-40 w-80 max-w-[85vw] border-r flex flex-col justify-between overflow-y-auto transform transition-transform duration-200 lg:static lg:translate-x-0 ${
            isMobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          } ${
            isWeiss
              ? 'bg-[#e4f0ec] border-[#bdd6cf]'
              : 'bg-[#081311] border-[#16302b]'
          }`}
        >
          <div className="p-3 space-y-4">
            {/* Mobile Workspace Selector (Only visible on mobile screens < md) */}
            <div className="md:hidden pb-3 border-b border-[#16302b]/70">
              <div className="px-1 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#22d3ee]">
                HAUPTANSICHT WÄHLEN
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                {[
                  { id: 'station', label: 'Central (45)' },
                  { id: 'split', label: 'Split Studio' },
                  { id: 'canvas', label: 'Topology' },
                  { id: 'rrf', label: 'RRF Lab' },
                  { id: 'chapters', label: '32-Kapitel' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setWorkspaceMode(tab.id as any);
                      setIsMobileNavOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer border ${
                      workspaceMode === tab.id
                        ? 'bg-[#34d399] text-[#041311] font-bold border-[#34d399]'
                        : 'bg-[#0b1715] text-[#7e9ea5] border-[#173037] hover:text-[#ecfdf5]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 0: CENTRAL.STATION 6 BEREICHE / 45 UNTERSEITEN ORDNERBAUM */}
            <div>
              <div className="px-1 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#34d399] flex items-center justify-between">
                <span>CENTRAL.STATION // BAUM</span>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="lg:hidden text-[#34d399] hover:text-white font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#112a24] border border-[#34d399]/40 cursor-pointer"
                >
                  ✕ Schließen
                </button>
              </div>
              <CentralStationSidebarTree
                activeSubpageId={workspaceMode === 'station' ? activeStationSubpageId : ''}
                onSelectSubpage={(id) => {
                  setActiveStationSubpageId(id);
                  setWorkspaceMode('station');
                  setIsMobileNavOpen(false);
                }}
              />
            </div>

            {/* Section 2: Working Vault Folder Tree (Obsidian Style with > chevrons & CANVAS badges) */}
            <div>
              <div className="px-2 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#689187] flex items-center justify-between">
                <span>SECOND.BRAIN // TREE</span>
                {activeFolderFilter !== 'ALL' && (
                  <button
                    onClick={() => setActiveFolderFilter('ALL')}
                    className="text-[#34d399] hover:underline cursor-pointer"
                  >
                    [RESET]
                  </button>
                )}
              </div>
              <div className="space-y-0.5 font-mono text-xs">
                {VAULT_FOLDERS.map((folder) => {
                  const isSelected = activeFolderFilter === folder.id;
                  return (
                    <button
                      key={folder.id}
                      onClick={() => setActiveFolderFilter(folder.id)}
                      className={`w-full px-2 py-1 rounded-r flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? isWeiss
                            ? 'bg-[#d7e8e2] text-[#06201b] border-l-2 border-[#34d399] font-semibold'
                            : 'bg-[#112a24] text-[#34d399] border-l-2 border-[#34d399] font-semibold'
                          : isWeiss
                          ? 'text-[#3b6e63] hover:bg-[#f0f7f5] hover:text-[#06201b]'
                          : 'text-[#99bab2] hover:bg-[#0e1d1a] hover:text-[#ecfdf5]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="text-[#689187] text-[10px]">›</span>
                        <span className="truncate">{folder.label}</span>
                      </span>
                      <span className="text-[10px] text-[#689187]">{folder.count}</span>
                    </button>
                  );
                })}

                {/* Obsidian CANVAS shortcuts like in AIOS Command Center V3 */}
                <button
                  onClick={() => setWorkspaceMode('canvas')}
                  className="w-full px-2 py-1 rounded-r flex items-center justify-between text-[#99bab2] hover:bg-[#0e1d1a] hover:text-[#ecfdf5] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="text-[#689187] text-[10px]">›</span>
                    <span className="truncate">Second.brain</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#112a24] text-[#34d399] border border-[#1f4a42] font-bold">
                    CANVAS
                  </span>
                </button>
                <button
                  onClick={() => setIsGraphOpen(true)}
                  className="w-full px-2 py-1 rounded-r flex items-center justify-between text-[#99bab2] hover:bg-[#0e1d1a] hover:text-[#ecfdf5] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="text-[#689187] text-[10px]">›</span>
                    <span className="truncate">Agenten-Netz</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-[#22d3ee] border border-cyan-500/30 font-bold">
                    CANVAS
                  </span>
                </button>
              </div>
            </div>

            {/* Section 3: Quick Vault Markdown Files */}
            <div>
              <div className="px-2 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#689187] flex items-center justify-between">
                <span>INDEXED NOTES ({filteredVaultNotes.length})</span>
                <span>[.MD]</span>
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                {filteredVaultNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsNoteModalOpen(true);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isWeiss
                        ? 'bg-[#f0f7f5] border-[#bdd6cf] hover:border-[#34d399] text-[#06201b]'
                        : 'bg-[#060f0d] border-[#16302b] hover:border-[#34d399] text-[#b2d8ce]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3 h-3 text-[#22d3ee] shrink-0" />
                      <span className="truncate">{note.filename}</span>
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[#689187] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Telemetry Box */}
          <div
            className={`p-3 border-t font-mono text-[11px] space-y-2 ${
              isWeiss
                ? 'bg-[#f0f7f5] border-[#bdd6cf]'
                : 'bg-[#060f0d] border-[#16302b]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[#689187] uppercase text-[10px]">ROLLOUT FORTSCHRITT</span>
              <span className="text-[#34d399] font-bold">{progressPercent}%</span>
            </div>
            <div
              className={`w-full h-1.5 rounded overflow-hidden ${
                isWeiss ? 'bg-[#bdd6cf]' : 'bg-[#0e1d1a]'
              }`}
            >
              <div
                className="h-full bg-[#34d399] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#689187]">
              <span>VPS · SASCHA-KRUSS-1</span>
              <span className="text-[#34d399]">● 62% RAM</span>
            </div>
          </div>
        </aside>

        {/* CENTER 12-COLUMN WORKSPACE */}
        {workspaceMode === 'station' ? (
          <main className="flex-1 overflow-y-auto p-2.5 sm:p-4 md:p-5 bg-[#080d0f] w-full max-w-full">
            <CentralStationSubpageRenderer
              activeSubpageId={activeStationSubpageId}
              onSelectSubpage={(id) => {
                setActiveStationSubpageId(id);
                setWorkspaceMode('station');
              }}
              onOpenHybridSearch={() => setIsSimulatorOpen(true)}
            />
          </main>
        ) : workspaceMode === 'chapters' ? (
          /* FULL 32-CHAPTER MATRIX VIEW */
          <main className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 sm:space-y-5 w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-[#16302b]">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#34d399]">
                  [ROLLOUT MATRIX // BLAKE CROSLEY 2026 LEITFADEN]
                </div>
                <h1 className="text-xl font-display font-bold uppercase tracking-tight mt-0.5">
                  Alle 32 Kapitel & Phasen-Checkliste ({completedCount}/{totalCount} erledigt)
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChecklistOpen(true)}
                  className="px-3 py-1.5 rounded text-xs font-mono font-semibold bg-[#34d399] text-[#041311] hover:bg-[#10b981] cursor-pointer"
                >
                  ALS .MD EXPORTIEREN / VOLLBILD
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {phasesList.map((phase) => {
                const phaseTasks = tasks.filter((t) => t.phase === phase);
                const phaseDone = phaseTasks.filter((t) => t.completed).length;
                const allDone = phaseDone === phaseTasks.length;

                return (
                  <div
                    key={phase}
                    className={`rounded border p-4 flex flex-col justify-between ${
                      isWeiss
                        ? 'bg-[#e4f0ec]/70 border-[#bdd6cf]'
                        : 'bg-[#0b1715] border-[#16302b]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[#16302b]">
                        <div>
                          <h2 className="font-display font-bold text-sm uppercase">{phase}</h2>
                          <span className="text-[11px] font-mono text-[#689187]">
                            {phaseDone} von {phaseTasks.length} Kapiteln abgeschlossen
                          </span>
                        </div>
                        <button
                          onClick={() => handleBatchTogglePhase(phase, !allDone)}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold border flex items-center gap-1.5 cursor-pointer ${
                            allDone
                              ? 'bg-[#0e1d1a] text-[#689187] border-[#16302b]'
                              : 'bg-[#34d399] text-[#041311] border-[#34d399]'
                          }`}
                        >
                          {allDone ? (
                            <>
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset</span>
                            </>
                          ) : (
                            <>
                              <CheckCheck className="w-3 h-3" />
                              <span>Phase abhaken</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {phaseTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTask(task.id)}
                            className={`p-2.5 rounded border flex items-start gap-2.5 cursor-pointer transition-colors ${
                              task.completed
                                ? isWeiss
                                  ? 'bg-emerald-950/5 border-emerald-600/30'
                                  : 'bg-emerald-950/15 border-emerald-500/30'
                                : isWeiss
                                ? 'bg-[#f0f7f5] border-[#bdd6cf] hover:border-[#34d399]'
                                : 'bg-[#07100e] border-[#16302b] hover:border-[#34d399]'
                            }`}
                          >
                            {task.completed ? (
                              <CheckSquare className="w-4 h-4 text-[#34d399] shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-[#689187] shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                                <span className="font-bold text-[#34d399]">
                                  KAP. {String(task.chapterNumber).padStart(2, '0')}
                                </span>
                                <span className="text-[#22d3ee] truncate">{task.filename}</span>
                              </div>
                              <div
                                className={`text-xs font-display font-bold mt-0.5 ${
                                  task.completed ? 'line-through opacity-60' : ''
                                }`}
                              >
                                {task.title}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        ) : (
          /* 3-PANEL SPLIT / CANVAS / RRF STUDIO GRID */
          <main className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* PANEL 1: LEFT RRF HYBRID ENGINE & CODE CONSOLE */}
            {workspaceMode !== 'canvas' && (
              <section
                className={`${
                  workspaceMode === 'rrf' ? 'col-span-12 lg:col-span-8' : 'col-span-12 lg:col-span-4'
                } border-r flex flex-col overflow-hidden ${
                  isWeiss
                    ? 'bg-[#f0f7f5] border-[#bdd6cf]'
                    : 'bg-[#07100e] border-[#16302b]'
                }`}
              >
                {/* Console Header Tabs */}
                <div
                  className={`h-10 px-3 border-b flex items-center justify-between shrink-0 ${
                    isWeiss
                      ? 'bg-[#e4f0ec] border-[#bdd6cf]'
                      : 'bg-[#0e1d1a] border-[#16302b]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setLeftConsoleTab('rrf')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer ${
                        leftConsoleTab === 'rrf'
                          ? 'bg-[#34d399] text-[#041311]'
                          : 'text-[#689187] hover:text-[#ecfdf5]'
                      }`}
                    >
                      <Cpu className="w-3 h-3" />
                      <span>RRF HYBRID ENGINE</span>
                    </button>
                    <button
                      onClick={() => setLeftConsoleTab('code')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer ${
                        leftConsoleTab === 'code'
                          ? 'bg-[#34d399] text-[#041311]'
                          : 'text-[#689187] hover:text-[#ecfdf5]'
                      }`}
                    >
                      <Code className="w-3 h-3" />
                      <span>ARCH.TS / .INDEXIGNORE</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-[#22d3ee]">
                    k = {kParam}
                  </span>
                </div>

                {leftConsoleTab === 'rrf' ? (
                  /* INTERACTIVE RRF CONSOLE BODY */
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
                    {/* Search Input */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-[#689187] mb-1">
                        <span>HYBRID QUERY (FTS5 BM25 + VEC0 KNN)</span>
                        <span>[CTRL+K]</span>
                      </div>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#689187]" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={rrfQuery}
                          onChange={(e) => {
                            setRrfQuery(e.target.value);
                            setExecLogs((prev) => [
                              `[${new Date().toLocaleTimeString('de-DE')}] RRF_QUERY "${
                                e.target.value
                              }" -> 23ms (k=${kParam})`,
                              ...prev.slice(0, 14),
                            ]);
                          }}
                          placeholder="Suchbegriff oder Architektur-Konzept..."
                          aria-label="Hybrid Retrieval Suchanfrage"
                          className={`w-full pl-8 pr-3 py-1.5 rounded text-xs font-mono outline-none border transition-colors ${
                            isWeiss
                              ? 'bg-[#e4f0ec] border-[#bdd6cf] text-[#06201b] focus:border-[#34d399]'
                              : 'bg-[#0b1715] border-[#16302b] text-[#ecfdf5] focus:border-[#34d399]'
                          }`}
                        />
                      </div>

                      {/* Quick Query Chips */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {['OAuth Token Rotation', 'BM25 Spaltengewichtung', 'Model2Vec 256d', 'Claude Hook'].map(
                          (preset) => (
                            <button
                              key={preset}
                              onClick={() => setRrfQuery(preset)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer transition-colors ${
                                rrfQuery === preset
                                  ? 'bg-[#34d399]/20 text-[#34d399] border-[#34d399]'
                                  : isWeiss
                                  ? 'bg-[#e4f0ec] border-[#bdd6cf] text-[#3b6e63]'
                                  : 'bg-[#0b1715] border-[#16302b] text-[#689187] hover:text-[#ecfdf5]'
                              }`}
                            >
                              {preset}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Sliders */}
                    <div
                      className={`p-3 rounded border grid grid-cols-3 gap-2.5 font-mono text-[11px] ${
                        isWeiss
                          ? 'bg-[#e4f0ec]/70 border-[#bdd6cf]'
                          : 'bg-[#0b1715] border-[#16302b]'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#689187]">RRF k:</span>
                          <span className="text-[#34d399] font-bold">{kParam}</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="120"
                          value={kParam}
                          onChange={(e) => setKParam(Number(e.target.value))}
                          aria-label="RRF Konstante k"
                          className="w-full accent-[#34d399] cursor-pointer mt-1"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#689187]">BM25:</span>
                          <span className="text-amber-500 font-bold">{bm25Weight.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="2.0"
                          step="0.1"
                          value={bm25Weight}
                          onChange={(e) => setBm25Weight(Number(e.target.value))}
                          aria-label="BM25 Gewichtung"
                          className="w-full accent-amber-500 cursor-pointer mt-1"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-[#689187]">VEC0:</span>
                          <span className="text-[#22d3ee] font-bold">{vecWeight.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="2.0"
                          step="0.1"
                          value={vecWeight}
                          onChange={(e) => setVecWeight(Number(e.target.value))}
                          aria-label="Vektor Gewichtung"
                          className="w-full accent-[#22d3ee] cursor-pointer mt-1"
                        />
                      </div>
                    </div>

                    {/* Ranked Results Stream */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-[#689187]">
                        <span>FUSED CHUNKS ({rankedRrfChunks.length})</span>
                        <span className="text-emerald-500">CAP: 1.840 / 4.000 TOK</span>
                      </div>

                      {rankedRrfChunks.map((chunk, index) => (
                        <div
                          key={chunk.id}
                          onClick={() => handleOpenNoteByName(chunk.file)}
                          className={`p-3 rounded border transition-colors cursor-pointer ${
                            index === 0
                              ? isWeiss
                                ? 'bg-[#e4f0ec] border-[#34d399]'
                                : 'bg-[#0b1715] border-[#34d399]'
                              : isWeiss
                              ? 'bg-[#e4f0ec]/50 border-[#bdd6cf] hover:border-[#06201b]'
                              : 'bg-[#0b1715] border-[#16302b] hover:border-[#1f423b]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                                  index === 0
                                    ? 'bg-[#34d399] text-[#041311]'
                                    : 'bg-[#0e1d1a] text-[#b2d8ce] border border-[#16302b]'
                                }`}
                              >
                                #{index + 1}
                              </span>
                              <span className="font-mono text-xs font-bold truncate">
                                {chunk.file}
                              </span>
                            </div>
                            <span className="font-mono text-xs font-bold text-emerald-500 shrink-0">
                              {chunk.totalScore.toFixed(4)}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-[#22d3ee] mt-1">
                            {chunk.section}
                          </div>

                          <p
                            className={`text-[11px] font-mono mt-1.5 line-clamp-2 ${
                              isWeiss ? 'text-[#3b6e63]' : 'text-[#b2d8ce]'
                            }`}
                          >
                            {chunk.snippet}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#16302b]/60 text-[10px] font-mono text-[#689187]">
                            <div className="flex items-center gap-3">
                              <span>
                                BM25: <strong className="text-amber-500">#{chunk.bm25Rank}</strong>
                              </span>
                              <span>
                                VEC0: <strong className="text-[#22d3ee]">#{chunk.vecRank}</strong>
                              </span>
                              <span>{chunk.tokens} Tok</span>
                            </div>
                            {chunk.isDualHit && (
                              <span className="text-[#34d399] font-bold">★ DUAL HIT</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* CODE / .INDEXIGNORE DSL VIEW WITH LINE NUMBERS */
                  <div className="flex-1 overflow-y-auto p-3.5 font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[#689187]">
                      <span>hybrid_retriever.py // RRF FUSION & .INDEXIGNORE</span>
                      <button
                        onClick={() => handleOpenNoteByName('.indexignore')}
                        className="text-[#34d399] hover:underline cursor-pointer"
                      >
                        [.indexignore bearbeiten]
                      </button>
                    </div>
                    <pre
                      className={`p-3 rounded border overflow-x-auto leading-relaxed text-[11px] ${
                        isWeiss
                          ? 'bg-[#06201b] text-[#ecfdf5] border-[#06201b]'
                          : 'bg-[#050a09] text-[#ecfdf5] border-[#16302b]'
                      }`}
                    >
                      <code>{`01  from model2vec import StaticModel
02  import sqlite3, struct
03  
04  # 1. Lade 30MB CPU Embedding Modell (256d Float32)
05  model = StaticModel.from_pretrained("MinishLab/potion-base-8M")
06  
07  def reciprocal_rank_fusion(bm25_hits, vec_hits, k=${kParam}):
08      scores = {}
09      for rank, doc_id in enumerate(bm25_hits, start=1):
10          scores[doc_id] = scores.get(doc_id, 0.0) + ${bm25Weight.toFixed(1)} / (k + rank)
11      for rank, doc_id in enumerate(vec_hits, start=1):
12          scores[doc_id] = scores.get(doc_id, 0.0) + ${vecWeight.toFixed(1)} / (k + rank)
13      return sorted(scores.items(), key=lambda x: x[1], reverse=True)
14  
15  # 2. .indexignore Regeln (41% weniger Rauschen):
16  # 06-daily/
17  # 07-templates/
18  # 99-archive/
19  # .obsidian/`}</code>
                    </pre>
                  </div>
                )}

                {/* BOTTOM STDIO / HOOK EXECUTION LOG DRAWER */}
                <div
                  className={`h-36 border-t flex flex-col shrink-0 ${
                    isWeiss
                      ? 'bg-[#e4f0ec] border-[#bdd6cf]'
                      : 'bg-[#050a09] border-[#16302b]'
                  }`}
                >
                  <div
                    className={`px-3 py-1.5 border-b flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] ${
                      isWeiss
                        ? 'bg-[#d7e8e2] border-[#bdd6cf] text-[#06201b]'
                        : 'bg-[#0b1715] border-[#16302b] text-[#689187]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-bold">
                      <Terminal className="w-3 h-3 text-[#34d399]" />
                      <span>STDIO // HOOK EXECUTION LOG</span>
                    </span>
                    <span className="text-emerald-500">● STREAMING</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2.5 font-mono text-[11px] space-y-1">
                    {execLogs.map((log, i) => (
                      <div
                        key={i}
                        className={
                          i === 0
                            ? isWeiss
                              ? 'text-[#06201b] font-semibold'
                              : 'text-[#ecfdf5]'
                            : 'text-[#689187]'
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* PANEL 2: CENTER 2.5D FUSELAB SPHERE GRAPH / 2D TOPOLOGY CANVAS */}
            {workspaceMode !== 'rrf' && (
              <section
                ref={canvasRef}
                onPointerMove={canvasEngine === 'cards' ? handleCanvasPointerMove : undefined}
                onPointerUp={canvasEngine === 'cards' ? handleCanvasPointerUp : undefined}
                className={`${
                  workspaceMode === 'canvas' ? 'col-span-12 lg:col-span-9' : 'col-span-12 lg:col-span-5'
                } relative overflow-hidden flex flex-col border-r ${
                  isWeiss
                    ? 'bg-[#f0f7f5] tectonic-grid-paper border-[#bdd6cf]'
                    : 'bg-[#07100e] tectonic-grid-dark border-[#16302b]'
                }`}
              >
                {/* Engine Mode Sub-Header (2.5D Sphere HUD vs 2D Blueprint Cards) */}
                <div
                  className={`h-10 px-3 border-b flex items-center justify-between gap-2 shrink-0 z-30 ${
                    isWeiss
                      ? 'bg-[#e4f0ec] border-[#bdd6cf]'
                      : 'bg-[#071519] border-sky-500/25'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCanvasEngine('fuselab')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                        canvasEngine === 'fuselab'
                          ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                          : 'text-[#689187] hover:text-[#ecfdf5]'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>2.5D SPHERE HUD (FUSELAB)</span>
                    </button>
                    <button
                      onClick={() => setCanvasEngine('cards')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                        canvasEngine === 'cards'
                          ? 'bg-[#34d399] text-[#041311]'
                          : 'text-[#689187] hover:text-[#ecfdf5]'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>2D BLUEPRINT CARDS</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsGraphOpen(true)}
                    className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>[VOLLBILD GRAPH]</span>
                  </button>
                </div>

                {canvasEngine === 'fuselab' ? (
                  <div className="flex-1 relative overflow-hidden">
                    <FuselabGraphCanvas
                      themeMode={themeMode}
                      compact={workspaceMode === 'split'}
                      onSelectNode={(nodeName, linkedNote) => {
                        setRrfQuery(nodeName);
                        if (linkedNote) {
                          handleOpenNoteByName(linkedNote);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Top Floating Canvas HUD Toolbar */}
                    <div className="p-3 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
                  <div
                    className={`pointer-events-auto flex items-center gap-1 p-1 rounded border font-mono text-[11px] ${
                      isWeiss
                        ? 'bg-[#e4f0ec] border-[#bdd6cf]'
                        : 'bg-[#0b1715] border-[#16302b]'
                    }`}
                  >
                    {[
                      { id: 'all', label: 'ALL LAYERS' },
                      { id: 'retrieval', label: 'RETRIEVAL' },
                      { id: 'vault', label: 'VAULT' },
                      { id: 'mcp', label: 'MCP & HOOKS' },
                    ].map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => setCanvasLayerFilter(layer.id as any)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          canvasLayerFilter === layer.id
                            ? 'bg-[#34d399] text-[#041311]'
                            : isWeiss
                            ? 'text-[#3b6e63] hover:text-[#06201b]'
                            : 'text-[#689187] hover:text-[#ecfdf5]'
                        }`}
                      >
                        {layer.label}
                      </button>
                    ))}
                  </div>

                  <div
                    className={`pointer-events-auto flex items-center gap-2 px-2.5 py-1 rounded border font-mono text-[10px] ${
                      isWeiss
                        ? 'bg-[#e4f0ec] border-[#bdd6cf] text-[#06201b]'
                        : 'bg-[#0b1715] border-[#16302b] text-[#b2d8ce]'
                    }`}
                  >
                    <span>
                      POS: [{selectedCanvasNode.x}, {selectedCanvasNode.y}]
                    </span>
                    <button
                      onClick={() => setCanvasNodes(INITIAL_CANVAS_NODES)}
                      className="text-[#34d399] hover:underline cursor-pointer ml-1"
                      title="Knoten-Positionen zurücksetzen"
                    >
                      [RESET]
                    </button>
                  </div>
                </div>

                {/* Interactive SVG Wires + Draggable Architectural Nodes */}
                <div className="flex-1 relative min-h-[480px]">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Wire 1: Vault -> FTS5 */}
                    <path
                      d={`M ${canvasNodes[0].x + 190} ${canvasNodes[0].y + 45} C ${
                        canvasNodes[0].x + 250
                      } ${canvasNodes[0].y + 45}, ${canvasNodes[1].x - 40} ${
                        canvasNodes[1].y + 45
                      }, ${canvasNodes[1].x} ${canvasNodes[1].y + 45}`}
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="1.75"
                    />
                    {/* Wire 2: Vault -> vec0 */}
                    <path
                      d={`M ${canvasNodes[0].x + 190} ${canvasNodes[0].y + 65} C ${
                        canvasNodes[0].x + 250
                      } ${canvasNodes[0].y + 160}, ${canvasNodes[2].x - 40} ${
                        canvasNodes[2].y + 45
                      }, ${canvasNodes[2].x} ${canvasNodes[2].y + 45}`}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.75"
                    />
                    {/* Wire 3: FTS5 -> RRF */}
                    <path
                      d={`M ${canvasNodes[1].x + 210} ${canvasNodes[1].y + 45} C ${
                        canvasNodes[1].x + 260
                      } ${canvasNodes[1].y + 45}, ${canvasNodes[3].x - 40} ${
                        canvasNodes[3].y + 35
                      }, ${canvasNodes[3].x} ${canvasNodes[3].y + 35}`}
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="1.75"
                    />
                    {/* Wire 4: vec0 -> RRF */}
                    <path
                      d={`M ${canvasNodes[2].x + 210} ${canvasNodes[2].y + 45} C ${
                        canvasNodes[2].x + 260
                      } ${canvasNodes[2].y + 45}, ${canvasNodes[3].x - 40} ${
                        canvasNodes[3].y + 60
                      }, ${canvasNodes[3].x} ${canvasNodes[3].y + 60}`}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.75"
                    />
                    {/* Wire 5: RRF -> MCP Server */}
                    <path
                      d={`M ${canvasNodes[3].x + 105} ${canvasNodes[3].y + 100} L ${
                        canvasNodes[4].x + 105
                      } ${canvasNodes[4].y}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.75"
                      strokeDasharray="4,3"
                    />
                    {/* Wire 6: Claude Code <-> MCP Server */}
                    <path
                      d={`M ${canvasNodes[5].x + 210} ${canvasNodes[5].y + 45} L ${
                        canvasNodes[4].x
                      } ${canvasNodes[4].y + 45}`}
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="1.75"
                    />
                  </svg>

                  {/* Draggable Node Cards */}
                  {visibleCanvasNodes.map((node) => {
                    const isSelected = selectedCanvasNodeId === node.id;
                    return (
                      <div
                        key={node.id}
                        onPointerDown={(e) => handleNodePointerDown(e, node)}
                        style={{
                          transform: `translate(${node.x}px, ${node.y}px)`,
                        }}
                        className={`absolute top-0 left-0 w-56 rounded border p-3 cursor-grab active:cursor-grabbing transition-shadow ${
                          isSelected
                            ? isWeiss
                              ? 'bg-[#e4f0ec] border-[#34d399] ring-1 ring-[#34d399]'
                              : 'bg-[#0e1d1a] border-[#34d399] ring-1 ring-[#34d399]'
                            : isWeiss
                            ? 'bg-[#f0f7f5] border-[#bdd6cf] hover:border-[#06201b]'
                            : 'bg-[#0b1715] border-[#16302b] hover:border-[#1f423b]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 text-[9px] font-mono uppercase tracking-wider">
                          <span className="text-[#34d399] font-bold">{node.code}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                            {node.status}
                          </span>
                        </div>

                        <div className="font-display font-bold text-xs mt-1 truncate">
                          {node.title}
                        </div>
                        <div className="text-[10px] font-mono text-[#689187] truncate mt-0.5">
                          {node.subtitle}
                        </div>

                        <div
                          className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[10px] font-mono ${
                            isWeiss ? 'border-[#bdd6cf]' : 'border-[#16302b]'
                          }`}
                        >
                          <span className="text-[#689187]">{node.metricLabel}:</span>
                          <span className="text-[#22d3ee] font-semibold">{node.metricValue}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                    {/* Bottom Canvas Status Bar & Minimap Indicator */}
                    <div
                      className={`h-9 px-3 border-t flex items-center justify-between text-[10px] font-mono ${
                        isWeiss
                          ? 'bg-[#e4f0ec] border-[#bdd6cf] text-[#3b6e63]'
                          : 'bg-[#0b1715] border-[#16302b] text-[#689187]'
                      }`}
                    >
                      <span>DRAG NODES TO RE-LAYOUT TOPOLOGY · CLICK NODE TO INSPECT</span>
                      <span className="text-[#22d3ee]">GRID: 20PX RADIAL DRAFTING</span>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* PANEL 3: RIGHT NODE & VAULT INSPECTOR */}
            <aside
              className={`${
                workspaceMode === 'rrf' ? 'col-span-12 lg:col-span-4' : 'col-span-12 lg:col-span-3'
              } flex flex-col overflow-hidden ${
                isWeiss ? 'bg-[#e4f0ec]' : 'bg-[#0b1715]'
              }`}
            >
              {/* Inspector Header & Sub-Tabs */}
              <div
                className={`h-10 px-3 border-b flex items-center justify-between shrink-0 ${
                  isWeiss
                    ? 'bg-[#d7e8e2] border-[#bdd6cf]'
                    : 'bg-[#0e1d1a] border-[#16302b]'
                }`}
              >
                <div className="flex items-center gap-1">
                  {[
                    { id: 'inspector', label: 'INSPECTOR' },
                    { id: 'notes', label: `NOTES (${filteredVaultNotes.length})` },
                    { id: 'phases', label: `PHASEN (${completedCount}/32)` },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setRightInspectorTab(t.id as any)}
                      className={`px-2 py-1 rounded text-[10px] font-mono font-semibold cursor-pointer transition-colors ${
                        rightInspectorTab === t.id
                          ? 'bg-[#34d399] text-[#041311]'
                          : isWeiss
                          ? 'text-[#3b6e63] hover:text-[#06201b]'
                          : 'text-[#689187] hover:text-[#ecfdf5]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  SYNC
                </span>
              </div>

              {/* Inspector Body */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
                {rightInspectorTab === 'inspector' && (
                  <>
                    {/* Selected Node Card */}
                    <div
                      className={`p-3.5 rounded border space-y-2.5 ${
                        isWeiss
                          ? 'bg-[#f0f7f5] border-[#bdd6cf]'
                          : 'bg-[#07100e] border-[#16302b]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#34d399] font-bold">{selectedCanvasNode.code}</span>
                        <span className="text-emerald-500">● {selectedCanvasNode.status}</span>
                      </div>
                      <h2 className="font-display font-bold text-base">
                        {selectedCanvasNode.title}
                      </h2>
                      <p className="text-xs font-mono text-[#689187]">
                        {selectedCanvasNode.subtitle}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#16302b]/60 font-mono text-[11px]">
                        <div>
                          <div className="text-[9px] text-[#689187]">KOORDINATEN</div>
                          <div>
                            X: {selectedCanvasNode.x} · Y: {selectedCanvasNode.y}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] text-[#689187]">
                            {selectedCanvasNode.metricLabel}
                          </div>
                          <div className="text-[#22d3ee] font-bold">
                            {selectedCanvasNode.metricValue}
                          </div>
                        </div>
                      </div>

                      {selectedCanvasNode.linkedNoteFilename && (
                        <button
                          onClick={() =>
                            handleOpenNoteByName(selectedCanvasNode.linkedNoteFilename!)
                          }
                          className="w-full mt-2 py-2 rounded text-xs font-mono font-semibold bg-[#34d399] hover:bg-[#10b981] text-[#041311] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>SPEZIFIKATIONS-NOTIZ ÖFFNEN</span>
                        </button>
                      )}
                    </div>

                    {/* System Architecture Telemetry Card */}
                    <div
                      className={`p-3.5 rounded border space-y-2 font-mono text-xs ${
                        isWeiss
                          ? 'bg-[#f0f7f5] border-[#bdd6cf]'
                          : 'bg-[#07100e] border-[#16302b]'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#689187]">
                        SYSTEM TELEMETRY // 2026 SPEC
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#16302b]/50">
                        <span className="text-[#689187]">MCP Package:</span>
                        <span className="text-emerald-500 font-semibold">
                          obsidian-mcp (STDIO)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#16302b]/50">
                        <span className="text-[#689187]">Claude Config:</span>
                        <span className="text-[#22d3ee]">~/.claude.json</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#16302b]/50">
                        <span className="text-[#689187]">Chunking:</span>
                        <span>Heading-First (~400 Tok)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#689187]">Aktiver Ordner:</span>
                        <span className="text-[#34d399] font-bold">{activeFolderFilter}</span>
                      </div>
                    </div>

                    {/* Quick Action Matrix */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#689187]">
                        DEEP-DIVE WERKZEUGE
                      </div>
                      <button
                        onClick={() => setIsChecklistOpen(true)}
                        className={`w-full p-2.5 rounded border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          isWeiss
                            ? 'bg-[#f0f7f5] border-[#bdd6cf] hover:border-[#34d399]'
                            : 'bg-[#07100e] border-[#16302b] hover:border-[#34d399]'
                        }`}
                      >
                        <span>32-Kapitel Master-Taskliste</span>
                        <span className="text-[#34d399] font-bold">
                          {completedCount}/{totalCount} ›
                        </span>
                      </button>
                      <button
                        onClick={() => setIsSimulatorOpen(true)}
                        className={`w-full p-2.5 rounded border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          isWeiss
                            ? 'bg-[#f0f7f5] border-[#bdd6cf] hover:border-[#34d399]'
                            : 'bg-[#07100e] border-[#16302b] hover:border-[#34d399]'
                        }`}
                      >
                        <span>RRF Simulator Vollbild</span>
                        <span className="text-[#22d3ee]">k = {kParam} ›</span>
                      </button>
                      <button
                        onClick={() => setIsAudioOpen(true)}
                        className={`w-full p-2.5 rounded border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          isWeiss
                            ? 'bg-[#f0f7f5] border-[#bdd6cf] hover:border-[#34d399]'
                            : 'bg-[#07100e] border-[#16302b] hover:border-[#34d399]'
                        }`}
                      >
                        <span>Audio-Erklärung (7 Kapitel)</span>
                        <span className="text-emerald-500">DE-TTS ›</span>
                      </button>
                    </div>
                  </>
                )}

                {rightInspectorTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#689187]" />
                      <input
                        type="text"
                        value={noteSearchFilter}
                        onChange={(e) => setNoteSearchFilter(e.target.value)}
                        placeholder="Vault-Notizen durchsuchen..."
                        aria-label="Notizen filtern"
                        className={`w-full pl-8 pr-3 py-1.5 rounded text-xs font-mono outline-none border ${
                          isWeiss
                            ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] focus:border-[#34d399]'
                            : 'bg-[#07100e] border-[#16302b] text-[#ecfdf5] focus:border-[#34d399]'
                        }`}
                      />
                    </div>

                    {filteredVaultNotes.length === 0 ? (
                      <div className="p-4 text-center font-mono text-xs text-[#689187]">
                        Keine Notizen im Ordner "{activeFolderFilter}" gefunden.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredVaultNotes.map((note) => (
                          <div
                            key={note.id}
                            onClick={() => {
                              setSelectedNote(note);
                              setIsNoteModalOpen(true);
                            }}
                            className={`p-3 rounded border cursor-pointer transition-colors ${
                              isWeiss
                                ? 'bg-[#f0f7f5] border-[#bdd6cf] hover:border-[#34d399]'
                                : 'bg-[#07100e] border-[#16302b] hover:border-[#34d399]'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-[#34d399] font-bold truncate">
                                {note.filename}
                              </span>
                              <span className="text-[#22d3ee] shrink-0">{note.folder}</span>
                            </div>
                            <div className="font-display font-bold text-xs mt-1">
                              {note.title}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {note.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0e1d1a] text-[#689187] border border-[#16302b]"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {rightInspectorTab === 'phases' && (
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#689187]">
                      7-PHASEN ROLLOUT & BATCH-STEUERUNG
                    </div>
                    {phasesList.map((phase) => {
                      const pTasks = tasks.filter((t) => t.phase === phase);
                      const pDone = pTasks.filter((t) => t.completed).length;
                      const isAllDone = pDone === pTasks.length;
                      const pct = Math.round((pDone / pTasks.length) * 100);

                      return (
                        <div
                          key={phase}
                          className={`p-3 rounded border space-y-2 ${
                            isWeiss
                              ? 'bg-[#f0f7f5] border-[#bdd6cf]'
                              : 'bg-[#07100e] border-[#16302b]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display font-bold text-xs truncate">
                              {phase}
                            </span>
                            <span className="font-mono text-[10px] text-[#34d399] font-bold shrink-0">
                              {pDone}/{pTasks.length}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded bg-[#0e1d1a] overflow-hidden">
                            <div
                              className="h-full bg-[#34d399] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={() => setIsChecklistOpen(true)}
                              className="text-[10px] font-mono text-[#22d3ee] hover:underline cursor-pointer"
                            >
                              Details ›
                            </button>
                            <button
                              onClick={() => handleBatchTogglePhase(phase, !isAllDone)}
                              className="text-[10px] font-mono text-[#34d399] hover:underline cursor-pointer"
                            >
                              {isAllDone ? '[Phase zurücksetzen]' : '[Phase komplett abhaken]'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </main>
        )}
      </div>

      {/* MODALS (Conditionally rendered with full Escape & Backdrop support) */}
      {isChecklistOpen && (
        <GlassChecklistModal
          isOpen={isChecklistOpen}
          onClose={() => setIsChecklistOpen(false)}
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onBatchTogglePhase={handleBatchTogglePhase}
          themeMode={themeMode}
        />
      )}

      {isSimulatorOpen && (
        <GlassSimulatorModal
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          themeMode={themeMode}
        />
      )}

      {isNoteModalOpen && (
        <GlassNoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          note={selectedNote}
          onSaveNote={handleSaveNote}
          themeMode={themeMode}
        />
      )}

      {isGraphOpen && (
        <GlassGraphModal
          isOpen={isGraphOpen}
          onClose={() => setIsGraphOpen(false)}
          themeMode={themeMode}
          onSelectNode={(nodeName) => {
            setRrfQuery(nodeName);
            setNoteSearchFilter(nodeName);
            setRightInspectorTab('notes');
          }}
        />
      )}

      {isAnalysisOpen && (
        <GlassAnalysisModal
          isOpen={isAnalysisOpen}
          onClose={() => setIsAnalysisOpen(false)}
          themeMode={themeMode}
          onOpenChecklist={() => setIsChecklistOpen(true)}
          onOpenAudio={() => setIsAudioOpen(true)}
        />
      )}

      {isNewsOpen && (
        <GlassNewsModal
          isOpen={isNewsOpen}
          onClose={() => setIsNewsOpen(false)}
          themeMode={themeMode}
        />
      )}

      {isAudioOpen && (
        <GlassAudioPlayerModal
          isOpen={isAudioOpen}
          onClose={() => setIsAudioOpen(false)}
          themeMode={themeMode}
        />
      )}
    </div>
  );
}

export default App;

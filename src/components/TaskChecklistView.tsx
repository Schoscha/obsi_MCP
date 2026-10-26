import { useState } from 'react';
import { TaskItem } from '../data/tasksData';
import {
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  Flame,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface Props {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onBatchTogglePhase: (phase: string, completed: boolean) => void;
  activePhase: string;
  setActivePhase: (phase: string) => void;
}

export const TaskChecklistView = ({
  tasks,
  onToggleTask,
  onBatchTogglePhase,
  activePhase,
  setActivePhase,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Kritisch' | 'Hoch' | 'Mittel'>('All');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const phases = [
    'Alle Phasen',
    'Phase 1: Fundament & Vault',
    'Phase 2: Indexierung & DB',
    'Phase 3: Hybride Retrieval Engine',
    'Phase 4: MCP Server & Protokoll',
    'Phase 5: Agent-Integrationen',
    'Phase 6: Intake, Caching & Graph',
    'Phase 7: Tuning, Ops & Wartung',
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesPhase = activePhase === 'Alle Phasen' || task.phase === activePhase;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.filename.toLowerCase().includes(query) ||
      task.summary.toLowerCase().includes(query) ||
      task.chapterNumber.toString().includes(query);
    return matchesPhase && matchesPriority && matchesSearch;
  });

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleExportObsidian = () => {
    const lines = [
      '---',
      'title: "Obsidian MCP & Hybride Retrieval - Master Checklist 2026"',
      'type: checklist',
      'author: "Blake Crosley (Architektur) & AI Studio Implementation"',
      `created: "${new Date().toISOString().split('T')[0]}"`,
      'status: active',
      'tags:',
      '  - mcp',
      '  - hybrid-retrieval',
      '  - fts5',
      '  - sqlite-vec',
      '  - model2vec',
      '---',
      '',
      '# 🎯 Master-Checkliste: Obsidian MCP + Hybrides Retrieval (Referenz 2026)',
      '',
      '> Vollständige Taskliste zum Abarbeiten und Nachschlagen für die Implementierung.',
      '',
    ];

    phases.slice(1).forEach((phaseName) => {
      lines.push(`## ${phaseName}`);
      const phaseTasks = tasks.filter((t) => t.phase === phaseName);
      phaseTasks.forEach((t) => {
        const checkMark = t.completed ? '[x]' : '[ ]';
        lines.push(
          `- ${checkMark} **${String(t.chapterNumber).padStart(2, '0')} ${t.title}** \`(${t.filename})\``
        );
        lines.push(`  - *Zusammenfassung:* ${t.summary}`);
        t.deliverables.forEach((d) => {
          lines.push(`  - [ ] ${d}`);
        });
      });
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Obsidian_MCP_Hybrid_Retrieval_Checklist_2026.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="hud-card p-4 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Suche nach Kapitel, Keyword (z.B. FTS5, RRF, Model2Vec, CLI, Hooks)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/40 border border-purple-500/20 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/40 transition-all font-mono"
            />
          </div>

          {/* Priority filter buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-slate-700/40 rounded-lg shrink-0">
            {(['All', 'Kritisch', 'Hoch', 'Mittel'] as const).map((prio) => (
              <button
                key={prio}
                onClick={() => setPriorityFilter(prio)}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                  priorityFilter === prio
                    ? 'bg-orange-500 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {prio === 'All' ? 'Alle Prioritäten' : prio}
              </button>
            ))}
          </div>

          {/* Export to Obsidian button */}
          <button
            onClick={handleExportObsidian}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-mono font-bold rounded-lg shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            {exportedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Exportiert! (.md)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Vault .md Export</span>
              </>
            )}
          </button>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono border-t border-purple-500/20 pt-2.5">
          {phases.map((phase) => {
            const count =
              phase === 'Alle Phasen'
                ? tasks.length
                : tasks.filter((t) => t.phase === phase).length;
            const completedInPhase =
              phase === 'Alle Phasen'
                ? tasks.filter((t) => t.completed).length
                : tasks.filter((t) => t.phase === phase && t.completed).length;

            return (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePhase === phase
                    ? 'bg-purple-900/60 text-cyan-300 border border-cyan-400/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-black/20 hover:bg-black/40 border border-transparent'
                }`}
              >
                <span>{phase}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/50 text-slate-400 font-mono">
                  {completedInPhase}/{count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List Header with Batch Controls */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
        <div>
          Zeige <span className="text-orange-400 font-bold">{filteredTasks.length}</span> von 32
          Kapiteln
        </div>
        {activePhase !== 'Alle Phasen' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onBatchTogglePhase(activePhase, true)}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Phase abhaken
            </button>
            <span>·</span>
            <button
              onClick={() => onBatchTogglePhase(activePhase, false)}
              className="text-slate-500 hover:underline cursor-pointer"
            >
              Phase zurücksetzen
            </button>
          </div>
        )}
      </div>

      {/* Task Cards Grid */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isExpanded = expandedTaskId === task.id;

          return (
            <div
              key={task.id}
              className={`rounded-xl transition-all border ${
                task.completed
                  ? 'bg-[#100d24]/70 border-emerald-500/30'
                  : 'hud-card hover:border-purple-500/50'
              }`}
            >
              {/* Main task row */}
              <div className="p-3.5 sm:p-4 flex items-start gap-3.5">
                {/* Interactive Checkbox */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-orange-400 transition-colors cursor-pointer shrink-0"
                  aria-label={task.completed ? 'Als unvollständig markieren' : 'Als erledigt markieren'}
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 glow-cyan" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 hover:border-orange-400" />
                  )}
                </button>

                {/* Content */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {/* Chapter Number Badge */}
                    <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950/40 border border-orange-500/30 px-2 py-0.5 rounded">
                      #{String(task.chapterNumber).padStart(2, '0')}
                    </span>

                    {/* Title */}
                    <h4
                      className={`text-sm sm:text-base font-semibold font-display truncate ${
                        task.completed ? 'text-slate-400 line-through' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {/* Priority Indicator */}
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        task.priority === 'Kritisch'
                          ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                          : task.priority === 'Hoch'
                          ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Phase identifier */}
                    <span className="text-xs text-slate-500 font-mono hidden md:inline">
                      · {task.phase.split(':')[0]}
                    </span>
                  </div>

                  {/* Summary & filename */}
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
                    {task.summary}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-500">
                    <span className="text-cyan-400/80 font-mono">{task.filename}</span>
                    <span>·</span>
                    <span>{task.deliverables.length} Kern-Aktionen</span>
                    {task.codeSnippets && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400/80 flex items-center gap-1">
                          <FileCode className="w-3 h-3" /> Code & Konfiguration
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Expand / Collapse icon */}
                <button
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                  className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-orange-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expanded details section */}
              {isExpanded && (
                <div className="border-t border-purple-500/20 p-4 bg-black/40 space-y-4 text-xs font-mono animate-fadeIn">
                  {/* Action Items / Deliverables */}
                  <div>
                    <h5 className="text-[11px] uppercase tracking-wider text-orange-400 font-bold mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Konkrete Umsetzungsschritte
                    </h5>
                    <ul className="space-y-1.5">
                      {task.deliverables.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-slate-300 bg-[#16122d]/60 border border-slate-800 p-2 rounded"
                        >
                          <span className="text-orange-400 font-bold mt-0.5">›</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Code Snippets & Config Blocks */}
                  {task.codeSnippets && task.codeSnippets.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5" /> Referenz-Konfiguration & Quellcode
                      </h5>
                      {task.codeSnippets.map((snippet, sIdx) => {
                        const snippetId = `${task.id}-snippet-${sIdx}`;
                        const isCopied = copiedCodeId === snippetId;

                        return (
                          <div
                            key={sIdx}
                            className="rounded-lg border border-slate-800 overflow-hidden bg-[#0c0918]"
                          >
                            <div className="flex items-center justify-between px-3 py-1.5 bg-[#17112c] border-b border-slate-800 text-[10px] text-slate-400">
                              <span>
                                {snippet.description} ({snippet.language})
                              </span>
                              <button
                                onClick={() => handleCopyCode(snippetId, snippet.code)}
                                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Kopiert!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Code kopieren</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-3 text-slate-200 overflow-x-auto text-[11px] leading-relaxed font-mono-code">
                              <code>{snippet.code}</code>
                            </pre>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`px-3 py-1 rounded text-xs cursor-pointer font-semibold transition-colors ${
                        task.completed
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                      }`}
                    >
                      {task.completed ? 'Als unvollständig markieren' : '✓ Dieses Kapitel als erledigt markieren'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

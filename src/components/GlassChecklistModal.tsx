import { useState, useEffect } from 'react';
import { TaskItem } from '../data/tasksData';
import {
  X,
  CheckSquare,
  Square,
  Search,
  Download,
  Code,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  RotateCcw,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onBatchTogglePhase: (phase: string, completed: boolean) => void;
  themeMode: 'weiss' | 'bunt';
}

export const GlassChecklistModal = ({
  isOpen,
  onClose,
  tasks,
  onToggleTask,
  onBatchTogglePhase,
  themeMode,
}: Props) => {
  const isWeiss = themeMode === 'weiss';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('Alle');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const phases = ['Alle', ...Array.from(new Set(tasks.map((t) => t.phase)))];

  const filteredTasks = tasks.filter((task) => {
    const matchesPhase = selectedPhase === 'Alle' || task.phase === selectedPhase;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(task.chapterNumber).includes(searchQuery);
    return matchesPhase && matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const selectedPhaseTasks =
    selectedPhase === 'Alle' ? tasks : tasks.filter((t) => t.phase === selectedPhase);
  const allSelectedPhaseDone =
    selectedPhaseTasks.length > 0 && selectedPhaseTasks.every((t) => t.completed);

  const handleExportMarkdown = () => {
    let md = `# Obsidian MCP + Hybrid Retrieval 2026 - Master Taskliste\n\n`;
    md += `*Generiert aus dem Obsidian Cockpit | Fortschritt: ${completedCount}/${tasks.length} (${progressPercent}%)*\n\n`;

    phases
      .filter((p) => p !== 'Alle')
      .forEach((phase) => {
        md += `## ${phase}\n\n`;
        tasks
          .filter((t) => t.phase === phase)
          .forEach((task) => {
            const check = task.completed ? '[x]' : '[ ]';
            md += `- ${check} **Kapitel ${task.chapterNumber}: ${task.title}** (\`${task.filename}\`)\n`;
            md += `  - Priorität: ${task.priority}\n`;
            md += `  - ${task.summary}\n`;
            task.deliverables.forEach((d) => {
              md += `    - [ ] ${d}\n`;
            });
            md += `\n`;
          });
      });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Obsidian-MCP-Hybrid-Tasks-2026.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checklist-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl max-h-[90vh] rounded flex flex-col overflow-hidden border shadow-2xl transition-colors duration-150 ${
          isWeiss
            ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C]'
            : 'bg-[#1e1b14] border-[#2E2A20] text-[#e8e2d6]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between gap-4 ${
            isWeiss ? 'bg-[#EBE8DF] border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#E54D2E]">
              <span>[SPEC // BLAKE CROSLEY 2026 REFERENZ]</span>
            </div>
            <h2
              id="checklist-modal-title"
              className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight mt-0.5"
            >
              32-Kapitel Master-Taskliste & Rollout-Matrix
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-[#E54D2E] text-[#F5F3EC] hover:bg-[#ff5c3d]"
              title="Als Markdown für Obsidian exportieren"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">EXPORT .MD</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Modal schließen"
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isWeiss
                  ? 'border-[#D6D2C4] hover:bg-[#E2DFD5] text-[#15130C]'
                  : 'border-[#2E2A20] hover:bg-[#2c2a22] text-[#cac6ba]'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Filter Bar */}
        <div
          className={`px-5 py-3 border-b space-y-3 ${
            isWeiss ? 'bg-[#EBE8DF]/60 border-[#D6D2C4]' : 'bg-[#221f18] border-[#2E2A20]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span>
              ROLLOUT STATUS: <strong>{completedCount}</strong> / {tasks.length} KAPITEL ({progressPercent}%)
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-semibold">
              {tasks.filter((t) => t.priority === 'Kritisch' && t.completed).length}/
              {tasks.filter((t) => t.priority === 'Kritisch').length} KRITISCHE TASKS VERIFIZIERT
            </span>
          </div>

          <div
            className={`w-full h-1.5 rounded overflow-hidden ${
              isWeiss ? 'bg-[#D6D2C4]' : 'bg-[#15130c]'
            }`}
          >
            <div
              className="h-full transition-all duration-300 bg-[#E54D2E]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Search & Phase Filter Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9b968a]" />
              <input
                type="text"
                placeholder="Kapitel, Dateipfad oder SQL/Python filtern..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Kapitel durchsuchen"
                className={`w-full pl-8 pr-3 py-1.5 rounded text-xs font-mono outline-none border transition-colors ${
                  isWeiss
                    ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C] focus:border-[#E54D2E]'
                    : 'bg-[#15130c] border-[#2E2A20] text-[#e8e2d6] focus:border-[#E54D2E]'
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {phases.map((phase) => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors cursor-pointer text-[11px] font-mono border ${
                    selectedPhase === phase
                      ? 'bg-[#E54D2E] text-[#F5F3EC] border-[#E54D2E] font-semibold'
                      : isWeiss
                      ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#5C584D] hover:text-[#15130C]'
                      : 'bg-[#15130c] border-[#2E2A20] text-[#9b968a] hover:text-[#e8e2d6]'
                  }`}
                >
                  {phase}
                </button>
              ))}

              {selectedPhase !== 'Alle' && (
                <button
                  onClick={() => onBatchTogglePhase(selectedPhase, !allSelectedPhaseDone)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    isWeiss
                      ? 'bg-[#15130C] text-[#F5F3EC] border-[#15130C]'
                      : 'bg-[#2c2a22] text-[#7bd0ff] border-[#7bd0ff]/40 hover:bg-[#3a372f]'
                  }`}
                  title="Gesamte Phase umschalten"
                >
                  {allSelectedPhaseDone ? (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      <span>Phase zurücksetzen</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck className="w-3 h-3" />
                      <span>Phase komplett abhaken</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tasks List Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-[#9b968a] font-mono text-xs">
              Keine Kapitel für diese Suchkriterien gefunden.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isExpanded = expandedTaskId === task.id;
              const isCritical = task.priority === 'Kritisch';

              return (
                <div
                  key={task.id}
                  className={`rounded border transition-colors duration-150 overflow-hidden ${
                    task.completed
                      ? isWeiss
                        ? 'bg-emerald-950/5 border-emerald-600/40'
                        : 'bg-emerald-950/15 border-emerald-500/30'
                      : isWeiss
                      ? 'bg-[#EBE8DF]/70 border-[#D6D2C4] hover:border-[#15130C]/40'
                      : 'bg-[#15130c] border-[#2E2A20] hover:border-[#4c453a]'
                  }`}
                >
                  {/* Task Summary Row */}
                  <div className="p-3 sm:p-3.5 flex items-start gap-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      aria-label={`Kapitel ${task.chapterNumber} abhaken`}
                      className="mt-0.5 text-[#9b968a] hover:text-[#E54D2E] transition-colors cursor-pointer shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-[#E54D2E]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-[#E54D2E]">
                          KAPITEL {String(task.chapterNumber).padStart(2, '0')}
                        </span>

                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold border ${
                            isCritical
                              ? 'bg-[#E54D2E]/15 text-[#E54D2E] border-[#E54D2E]/40'
                              : task.priority === 'Hoch'
                              ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                              : isWeiss
                              ? 'bg-[#F5F3EC] text-[#5C584D] border-[#D6D2C4]'
                              : 'bg-[#221f18] text-[#9b968a] border-[#2E2A20]'
                          }`}
                        >
                          {task.priority.toUpperCase()}
                        </span>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isWeiss
                              ? 'bg-[#F5F3EC] text-[#5C584D] border-[#D6D2C4]'
                              : 'bg-[#221f18] text-[#7bd0ff] border-[#2E2A20]'
                          }`}
                        >
                          {task.filename}
                        </span>

                        <span className="text-[10px] font-mono text-[#9b968a] ml-auto hidden sm:inline">
                          {task.phase}
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-display font-bold mt-1 ${
                          task.completed ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p
                        className={`text-xs mt-0.5 line-clamp-2 ${
                          isWeiss ? 'text-[#5C584D]' : 'text-[#cac6ba]'
                        }`}
                      >
                        {task.summary}
                      </p>
                    </div>

                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      aria-label="Details ein-/ausklappen"
                      className="p-1 rounded text-[#9b968a] hover:text-[#E54D2E] cursor-pointer shrink-0"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Detail Drawer */}
                  {isExpanded && (
                    <div
                      className={`px-4 pb-4 pt-3 border-t space-y-3 text-xs ${
                        isWeiss ? 'border-[#D6D2C4] bg-[#F5F3EC]' : 'border-[#2E2A20] bg-[#1e1b14]'
                      }`}
                    >
                      <div>
                        <div className="font-mono font-bold text-[10px] uppercase tracking-wider text-[#9b968a] mb-1.5">
                          LIEFERGEGENSTÄNDE & VERIFIKATIONSSCHRITTE:
                        </div>
                        <ul className="space-y-1 pl-1 font-mono text-[11px]">
                          {task.deliverables.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#E54D2E] font-bold">›</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {task.codeSnippets && task.codeSnippets.length > 0 && (
                        <div className="space-y-2">
                          {task.codeSnippets.map((cs, cIdx) => (
                            <div key={cIdx}>
                              <div className="flex items-center gap-1.5 font-mono font-bold text-[10px] uppercase tracking-wider text-[#9b968a] mb-1">
                                <Code className="w-3.5 h-3.5 text-[#7bd0ff]" />
                                <span>{cs.description || 'Referenz-Implementierung'}:</span>
                              </div>
                              <pre
                                className={`p-3 rounded font-mono text-[11px] overflow-x-auto border ${
                                  isWeiss
                                    ? 'bg-[#15130C] text-[#e8e2d6] border-[#15130C]'
                                    : 'bg-[#100e07] text-[#7bd0ff] border-[#2E2A20]'
                                }`}
                              >
                                <code>{cs.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { VaultNote } from '../data/notesData';
import {
  X,
  FileText,
  Edit3,
  Eye,
  Copy,
  Check,
  Tag,
  Clock,
  Save,
  RotateCcw,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  note: VaultNote | null;
  onSaveNote: (note: VaultNote) => void;
  themeMode: 'weiss' | 'bunt';
}

export const GlassNoteModal = ({
  isOpen,
  onClose,
  note,
  onSaveNote,
  themeMode,
}: Props) => {
  const isWeiss = themeMode === 'weiss';
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState(note?.content || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (note) {
      setCurrentContent(note.content);
      setIsEditing(false);
    }
  }, [note]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !note) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveNote({
      ...note,
      content: currentContent,
      updated: 'Gerade eben',
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setCurrentContent(note.content);
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl max-h-[92vh] rounded flex flex-col overflow-hidden border shadow-2xl transition-colors duration-150 ${
          isWeiss
            ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b]'
            : 'bg-[#0b1715] border-[#16302b] text-[#ecfdf5]'
        }`}
      >
        {/* Top Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between gap-3 ${
            isWeiss ? 'bg-[#e4f0ec] border-[#bdd6cf]' : 'bg-[#07100e] border-[#16302b]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 bg-[#34d399] text-[#041311]">
              <FileText className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#34d399] truncate">
                  {note.filename}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                    isWeiss
                      ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#3b6e63]'
                      : 'bg-[#0e1d1a] border-[#16302b] text-[#22d3ee]'
                  }`}
                >
                  {note.folder}
                </span>
              </div>
              <h2
                id="note-modal-title"
                className="text-base sm:text-lg font-bold font-display truncate"
              >
                {note.title}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    isWeiss
                      ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#3b6e63] hover:text-[#06201b]'
                      : 'bg-[#0e1d1a] border-[#16302b] text-[#b2d8ce] hover:text-[#ecfdf5]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Verwerfen</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded text-xs font-mono font-semibold bg-[#34d399] hover:bg-[#10b981] text-[#041311] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Speichern</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isWeiss
                    ? 'bg-[#f0f7f5] hover:bg-[#d7e8e2] text-[#06201b] border-[#bdd6cf]'
                    : 'bg-[#0e1d1a] hover:bg-[#132824] text-[#ecfdf5] border-[#16302b]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-[#34d399]" />
                <span className="hidden sm:inline">Bearbeiten</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              aria-label="Markdown kopieren"
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isWeiss
                  ? 'border-[#bdd6cf] hover:bg-[#d7e8e2] text-[#06201b]'
                  : 'border-[#16302b] hover:bg-[#132824] text-[#b2d8ce]'
              }`}
              title="Markdown kopieren"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              aria-label="Notiz schließen"
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isWeiss
                  ? 'border-[#bdd6cf] hover:bg-[#d7e8e2] text-[#06201b]'
                  : 'border-[#16302b] hover:bg-[#132824] text-[#b2d8ce]'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Note Metadata Bar */}
        <div
          className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isWeiss ? 'bg-[#e4f0ec]/60 border-[#bdd6cf]' : 'bg-[#0e1d1a] border-[#16302b]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#689187]" />
            <div className="flex flex-wrap items-center gap-1.5">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                    isWeiss
                      ? 'bg-[#f0f7f5] text-[#06201b] border-[#bdd6cf]'
                      : 'bg-[#07100e] text-[#22d3ee] border-[#16302b]'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#689187] text-[11px] font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Zuletzt bearbeitet: {note.updated}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {isEditing ? (
            <textarea
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              aria-label="Markdown Inhalt bearbeiten"
              className={`w-full h-full min-h-[380px] p-4 rounded font-mono text-xs leading-relaxed outline-none border resize-none ${
                isWeiss
                  ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b] focus:border-[#34d399]'
                  : 'bg-[#050a09] border-[#16302b] text-[#ecfdf5] focus:border-[#34d399]'
              }`}
            />
          ) : (
            <pre
              className={`p-4 rounded font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border ${
                isWeiss
                  ? 'bg-[#e4f0ec]/50 border-[#bdd6cf] text-[#06201b]'
                  : 'bg-[#050a09] border-[#16302b] text-[#ecfdf5]'
              }`}
            >
              <code>{currentContent}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

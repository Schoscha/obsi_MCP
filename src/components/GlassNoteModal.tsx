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
            ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C]'
            : 'bg-[#1e1b14] border-[#2E2A20] text-[#e8e2d6]'
        }`}
      >
        {/* Top Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between gap-3 ${
            isWeiss ? 'bg-[#EBE8DF] border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 bg-[#E54D2E] text-[#F5F3EC]">
              <FileText className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#E54D2E] truncate">
                  {note.filename}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                    isWeiss
                      ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#5C584D]'
                      : 'bg-[#221f18] border-[#2E2A20] text-[#7bd0ff]'
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
                      ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#5C584D] hover:text-[#15130C]'
                      : 'bg-[#221f18] border-[#2E2A20] text-[#cac6ba] hover:text-[#e8e2d6]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Verwerfen</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded text-xs font-mono font-semibold bg-[#E54D2E] hover:bg-[#ff5c3d] text-[#F5F3EC] flex items-center gap-1.5 transition-colors cursor-pointer"
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
                    ? 'bg-[#F5F3EC] hover:bg-[#E2DFD5] text-[#15130C] border-[#D6D2C4]'
                    : 'bg-[#221f18] hover:bg-[#2c2a22] text-[#e8e2d6] border-[#2E2A20]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-[#E54D2E]" />
                <span className="hidden sm:inline">Bearbeiten</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              aria-label="Markdown kopieren"
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isWeiss
                  ? 'border-[#D6D2C4] hover:bg-[#E2DFD5] text-[#15130C]'
                  : 'border-[#2E2A20] hover:bg-[#2c2a22] text-[#cac6ba]'
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
                  ? 'border-[#D6D2C4] hover:bg-[#E2DFD5] text-[#15130C]'
                  : 'border-[#2E2A20] hover:bg-[#2c2a22] text-[#cac6ba]'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Note Metadata Bar */}
        <div
          className={`px-5 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isWeiss ? 'bg-[#EBE8DF]/60 border-[#D6D2C4]' : 'bg-[#221f18] border-[#2E2A20]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#9b968a]" />
            <div className="flex flex-wrap items-center gap-1.5">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                    isWeiss
                      ? 'bg-[#F5F3EC] text-[#15130C] border-[#D6D2C4]'
                      : 'bg-[#15130c] text-[#7bd0ff] border-[#2E2A20]'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#9b968a] text-[11px] font-mono">
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
                  ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C] focus:border-[#E54D2E]'
                  : 'bg-[#100e07] border-[#2E2A20] text-[#e8e2d6] focus:border-[#E54D2E]'
              }`}
            />
          ) : (
            <pre
              className={`p-4 rounded font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border ${
                isWeiss
                  ? 'bg-[#EBE8DF]/50 border-[#D6D2C4] text-[#15130C]'
                  : 'bg-[#100e07] border-[#2E2A20] text-[#e8e2d6]'
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

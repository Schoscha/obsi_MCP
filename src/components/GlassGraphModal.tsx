import { useEffect } from 'react';
import { X, Share2, Sparkles } from 'lucide-react';
import { FuselabGraphCanvas } from './FuselabGraphCanvas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeMode: 'weiss' | 'bunt';
  onSelectNode?: (name: string) => void;
}

export const GlassGraphModal = ({
  isOpen,
  onClose,
  themeMode,
  onSelectNode,
}: Props) => {
  const isWeiss = themeMode === 'weiss';

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="graph-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[1440px] h-[92vh] rounded-xl flex flex-col overflow-hidden border shadow-2xl transition-colors duration-150 ${
          isWeiss
            ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b]'
            : 'bg-[#07100e] border-[#16302b] text-[#ecfdf5]'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-3 border-b flex items-center justify-between shrink-0 ${
            isWeiss
              ? 'bg-[#e4f0ec] border-[#bdd6cf]'
              : 'bg-[#0b1715] border-[#16302b]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br from-[#6ee7b7] via-[#34d399] to-[#22d3ee] text-[#041311] shadow-[0_0_14px_rgba(52,211,153,0.45)]">
              <Share2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="graph-modal-title"
                  className="text-sm sm:text-base font-bold font-display tracking-tight"
                >
                  Second.<span className="text-[#22d3ee]">brain</span> & Central.<span className="text-[#34d399]">station</span> — Topologie & Agenten-Netz
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  synchron · live
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#689187]">
                Kompakte 2.5D-Sphären · Multi-Beam Links · HUD Radar-Lupe · Second.brain & Agenten-Netz
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Graph schließen"
            className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isWeiss
                ? 'border-[#bdd6cf] hover:bg-[#d7e8e2] text-[#06201b]'
                : 'border-[#16302b] hover:bg-[#132824] text-[#b2d8ce]'
            }`}
          >
            <span>ESC</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Full Interactive Fuselab Graph Canvas */}
        <div className="flex-1 overflow-hidden">
          <FuselabGraphCanvas
            themeMode={themeMode}
            onSelectNode={(nodeName) => {
              if (onSelectNode) onSelectNode(nodeName);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

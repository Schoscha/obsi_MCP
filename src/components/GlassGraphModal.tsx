import { useState, useRef, useEffect } from 'react';
import { X, Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeMode: 'weiss' | 'bunt';
  onSelectNode?: (name: string) => void;
}

interface Node {
  id: string;
  name: string;
  group: 'mcp' | 'retrieval' | 'vault' | 'agent' | 'model';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Link {
  source: string;
  target: string;
}

const INITIAL_NODES: Node[] = [
  { id: '1', name: 'Obsidian Vault', group: 'vault', x: 250, y: 220, vx: 0, vy: 0, radius: 24 },
  { id: '2', name: 'SQLite FTS5 (BM25)', group: 'retrieval', x: 140, y: 130, vx: 0, vy: 0, radius: 18 },
  { id: '3', name: 'sqlite-vec (KNN)', group: 'retrieval', x: 360, y: 130, vx: 0, vy: 0, radius: 18 },
  { id: '4', name: 'Model2Vec (256d)', group: 'model', x: 440, y: 80, vx: 0, vy: 0, radius: 16 },
  { id: '5', name: 'Reciprocal Rank Fusion', group: 'retrieval', x: 250, y: 90, vx: 0, vy: 0, radius: 20 },
  { id: '6', name: 'Obsidian MCP Server', group: 'mcp', x: 250, y: 340, vx: 0, vy: 0, radius: 22 },
  { id: '7', name: 'Claude Code CLI', group: 'agent', x: 130, y: 410, vx: 0, vy: 0, radius: 18 },
  { id: '8', name: 'UserPromptSubmit Hook', group: 'agent', x: 370, y: 410, vx: 0, vy: 0, radius: 16 },
  { id: '9', name: '01-projects', group: 'vault', x: 100, y: 250, vx: 0, vy: 0, radius: 14 },
  { id: '10', name: '03-resources', group: 'vault', x: 400, y: 250, vx: 0, vy: 0, radius: 14 },
  { id: '11', name: '05-signals', group: 'vault', x: 160, y: 30, vx: 0, vy: 0, radius: 14 },
  { id: '12', name: '.indexignore', group: 'vault', x: 80, y: 180, vx: 0, vy: 0, radius: 13 },
];

const INITIAL_LINKS: Link[] = [
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  { source: '2', target: '5' },
  { source: '3', target: '5' },
  { source: '4', target: '3' },
  { source: '1', target: '6' },
  { source: '6', target: '7' },
  { source: '7', target: '8' },
  { source: '8', target: '5' },
  { source: '1', target: '9' },
  { source: '1', target: '10' },
  { source: '1', target: '11' },
  { source: '1', target: '12' },
];

export const GlassGraphModal = ({
  isOpen,
  onClose,
  themeMode,
  onSelectNode,
}: Props) => {
  const isWeiss = themeMode === 'weiss';

  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(nodes[0]);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === draggedNodeId) return node;

          const cx = 270;
          const cy = 240;
          const dx = cx - node.x;
          const dy = cy - node.y;

          const vx = (node.vx + dx * 0.0003) * 0.94;
          const vy = (node.vy + dy * 0.0003) * 0.94;

          return {
            ...node,
            x: node.x + vx,
            y: node.y + vy,
            vx,
            vy,
          };
        })
      );
    }, 50);

    return () => clearInterval(timer);
  }, [draggedNodeId, isOpen]);

  if (!isOpen) return null;

  const handlePointerDown = (id: string) => {
    setDraggedNodeId(id);
    const n = nodes.find((item) => item.id === id);
    if (n) setSelectedNode(n);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setNodes((prev) =>
      prev.map((n) => (n.id === draggedNodeId ? { ...n, x, y, vx: 0, vy: 0 } : n))
    );
  };

  const handlePointerUp = () => {
    setDraggedNodeId(null);
  };

  const getNodeColor = (group: Node['group']) => {
    switch (group) {
      case 'vault':
        return '#E54D2E';
      case 'retrieval':
        return '#7bd0ff';
      case 'model':
        return '#f59e0b';
      case 'mcp':
        return '#10b981';
      case 'agent':
        return '#e8e2d6';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="graph-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl max-h-[92vh] rounded flex flex-col overflow-hidden border shadow-2xl transition-colors duration-150 ${
          isWeiss
            ? 'bg-[#F5F3EC] border-[#D6D2C4] text-[#15130C]'
            : 'bg-[#1e1b14] border-[#2E2A20] text-[#e8e2d6]'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isWeiss ? 'bg-[#EBE8DF] border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-[#E54D2E] text-[#F5F3EC]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="graph-modal-title"
                className="text-base sm:text-lg font-bold font-display uppercase tracking-tight"
              >
                Obsidian Topology Graph View
              </h2>
              <p className="text-xs font-mono text-[#9b968a]">
                Interaktives Wissensnetz · 12 Kernknoten · Hybrides Retrieval & MCP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center rounded border p-0.5 gap-0.5 ${
                isWeiss ? 'bg-[#F5F3EC] border-[#D6D2C4]' : 'bg-[#221f18] border-[#2E2A20]'
              }`}
            >
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.15, 1.8))}
                aria-label="Vergrößern"
                className="p-1.5 rounded hover:bg-[#E54D2E]/20 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}
                aria-label="Verkleinern"
                className="p-1.5 rounded hover:bg-[#E54D2E]/20 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setNodes(INITIAL_NODES);
                }}
                aria-label="Ansicht zurücksetzen"
                className="p-1.5 rounded hover:bg-[#E54D2E]/20 transition-colors cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Graph schließen"
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

        {/* Canvas & Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`flex-1 h-[450px] md:h-auto min-h-[420px] relative overflow-hidden select-none cursor-grab active:cursor-grabbing ${
              isWeiss ? 'bg-[#F5F3EC] tectonic-grid-paper' : 'bg-[#15130c] tectonic-grid-dark'
            }`}
          >
            <svg
              className="w-full h-full"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              viewBox="0 0 540 480"
            >
              {INITIAL_LINKS.map((link, idx) => {
                const s = nodes.find((n) => n.id === link.source);
                const t = nodes.find((n) => n.id === link.target);
                if (!s || !t) return null;

                const isConnected =
                  selectedNode && (selectedNode.id === s.id || selectedNode.id === t.id);

                return (
                  <line
                    key={idx}
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={
                      isConnected
                        ? '#E54D2E'
                        : isWeiss
                        ? '#D6D2C4'
                        : '#2E2A20'
                    }
                    strokeWidth={isConnected ? 2 : 1.2}
                    strokeDasharray={isConnected ? 'none' : '4,2'}
                  />
                );
              })}

              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const color = getNodeColor(node.group);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onPointerDown={() => handlePointerDown(node.id)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle r={node.radius + 6} fill={color} opacity={0.22} />
                    )}

                    <circle
                      r={node.radius}
                      fill={color}
                      stroke={isSelected ? '#E54D2E' : '#15130c'}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />

                    <text
                      y={node.radius + 14}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-bold select-none pointer-events-none ${
                        isWeiss ? 'fill-[#15130C]' : 'fill-[#e8e2d6]'
                      }`}
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Node Inspector Drawer */}
          {selectedNode && (
            <div
              className={`w-full md:w-80 p-4 sm:p-5 border-t md:border-t-0 md:border-l flex flex-col justify-between ${
                isWeiss ? 'bg-[#EBE8DF] border-[#D6D2C4]' : 'bg-[#221f18] border-[#2E2A20]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: getNodeColor(selectedNode.group) }}
                  />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[#9b968a]">
                    GROUP // {selectedNode.group}
                  </span>
                </div>

                <h3 className="text-base font-bold font-display mb-2">
                  {selectedNode.name}
                </h3>

                <p
                  className={`text-xs font-mono leading-relaxed mb-4 ${
                    isWeiss ? 'text-[#5C584D]' : 'text-[#cac6ba]'
                  }`}
                >
                  {selectedNode.group === 'retrieval' &&
                    'Kernkomponente der hybriden Retrieval-Pipeline. Verbindet Volltext- mit Vektorsuche unter Beachtung des Token-Budgets.'}
                  {selectedNode.group === 'vault' &&
                    'Strukturierte Ordnerhierarchie im lokalen Markdown-Dateisystem mit .indexignore-Filtern.'}
                  {selectedNode.group === 'mcp' &&
                    'Model Context Protocol Server für direkten Dateisystemzugriff ohne laufende Obsidian GUI.'}
                  {selectedNode.group === 'agent' &&
                    'Claude Code CLI Hooks injizieren automatisch relevante Vault-Snippets in den Prompt.'}
                  {selectedNode.group === 'model' &&
                    'Ultraschnelles 30MB CPU-Embedding-Modell mit 256 Dimensionen ohne PyTorch-Abhängigkeit.'}
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div
                    className={`p-2.5 rounded border flex items-center justify-between ${
                      isWeiss ? 'bg-[#F5F3EC] border-[#D6D2C4]' : 'bg-[#15130c] border-[#2E2A20]'
                    }`}
                  >
                    <span className="text-[#9b968a]">KONNEKTIVITÄT:</span>
                    <span className="font-bold text-[#7bd0ff]">
                      {
                        INITIAL_LINKS.filter(
                          (l) => l.source === selectedNode.id || l.target === selectedNode.id
                        ).length
                      }{' '}
                      EDGES
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSelectNode) onSelectNode(selectedNode.name);
                  onClose();
                }}
                className="mt-4 w-full py-2 rounded text-xs font-mono font-semibold transition-colors cursor-pointer bg-[#E54D2E] hover:bg-[#ff5c3d] text-[#F5F3EC]"
              >
                IN VAULT FILTERN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

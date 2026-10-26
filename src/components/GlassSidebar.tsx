import {
  Compass,
  Search,
  FileText,
  Share2,
  Calendar,
  Settings,
  HelpCircle,
  ListTodo,
  Headphones,
} from 'lucide-react';

interface Props {
  themeMode: 'weiss' | 'bunt';
  activeSection: string;
  setActiveSection: (s: string) => void;
  onOpenChecklist: () => void;
  onOpenSimulator: () => void;
  onOpenGraph: () => void;
  onOpenAnalysis: () => void;
  onOpenAllNotes: () => void;
  onOpenAudio: () => void;
}

export const GlassSidebar = ({
  themeMode,
  activeSection,
  setActiveSection,
  onOpenChecklist,
  onOpenSimulator,
  onOpenGraph,
  onOpenAnalysis,
  onOpenAllNotes,
  onOpenAudio,
}: Props) => {
  const isWeiss = themeMode === 'weiss';

  const navItems = [
    { id: 'home', icon: Compass, label: 'Vault Cockpit', action: () => setActiveSection('home') },
    { id: 'audio', icon: Headphones, label: 'Audio-Erklärung anhören', action: onOpenAudio },
    { id: 'search', icon: Search, label: 'Suche (Hybrid & RRF)', action: onOpenSimulator },
    { id: 'checklist', icon: ListTodo, label: '32-Kapitel Tasks', action: onOpenChecklist },
    { id: 'notes', icon: FileText, label: 'Alle Notizen (16.894)', action: onOpenAllNotes },
    { id: 'graph', icon: Share2, label: 'Graph View (MOCs)', action: onOpenGraph },
    { id: 'calendar', icon: Calendar, label: 'Kalender 2026', action: () => setActiveSection('calendar') },
    { id: 'analysis', icon: HelpCircle, label: 'Architektur-Analyse & Sinn', action: onOpenAnalysis },
    { id: 'settings', icon: Settings, label: 'RRF & FTS5 Simulator', action: onOpenSimulator },
  ];

  return (
    <aside className="hidden md:flex flex-col items-center py-4 px-2 select-none z-20">
      <div
        className={`rounded py-4 px-2 flex flex-col items-center gap-3 border transition-colors duration-200 ${
          isWeiss
            ? 'bg-[#EBE8DF] border-[#D6D2C4] text-[#15130C]'
            : 'bg-[#1e1b14] border-[#2E2A20] text-[#e8e2d6]'
        }`}
      >
        <button
          onClick={() => setActiveSection('home')}
          className={`w-9 h-9 rounded flex items-center justify-center cursor-pointer border transition-colors ${
            isWeiss
              ? 'bg-[#F5F3EC] text-[#E54D2E] border-[#D6D2C4]'
              : 'bg-[#15130c] text-[#E54D2E] border-[#2E2A20]'
          }`}
          title="Obsidian AI Knowledge Vault"
          aria-label="Obsidian AI Knowledge Vault"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 100 100">
            <polygon points="50,5 92,30 75,95 25,95 8,30" opacity="0.85" />
            <polygon points="50,15 82,35 68,85 32,85 18,35" fill="none" stroke="currentColor" strokeWidth="6" />
          </svg>
        </button>

        <div className={`w-5 h-px ${isWeiss ? 'bg-[#D6D2C4]' : 'bg-[#2E2A20]'}`} />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={item.action}
              title={item.label}
              aria-label={item.label}
              className={`relative p-2 rounded transition-colors duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-[#E54D2E] text-[#F5F3EC]'
                  : isWeiss
                  ? 'hover:bg-[#F5F3EC] text-[#5C584D] hover:text-[#15130C]'
                  : 'hover:bg-[#2c2a22] text-[#9b968a] hover:text-[#e8e2d6]'
              }`}
            >
              <Icon className="w-4 h-4" />

              <span
                className={`absolute left-full ml-3 px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border ${
                  isWeiss
                    ? 'bg-[#F5F3EC] text-[#15130C] border-[#D6D2C4]'
                    : 'bg-[#1e1b14] text-[#e8e2d6] border-[#2E2A20]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

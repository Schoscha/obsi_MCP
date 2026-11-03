import React, { useState } from 'react';
import { STATION_AREAS } from '../data/centralStationData';

interface CentralStationSidebarTreeProps {
  activeSubpageId: string;
  onSelectSubpage: (id: string) => void;
}

export const CentralStationSidebarTree: React.FC<CentralStationSidebarTreeProps> = ({
  activeSubpageId,
  onSelectSubpage
}) => {
  const [search, setSearch] = useState('');
  // Find which area owns the active subpage (defaults to 'start')
  const initialActiveArea =
    STATION_AREAS.find((a) => a.pages.some((p) => p.id === activeSubpageId))?.id || 'start';

  // Accordion default: only the active area is open initially
  const [openAreas, setOpenAreas] = useState<Record<string, boolean>>({
    start: initialActiveArea === 'start',
    arbeiten: initialActiveArea === 'arbeiten',
    agenten: initialActiveArea === 'agenten',
    studio: initialActiveArea === 'studio',
    ablage: initialActiveArea === 'ablage',
    system: initialActiveArea === 'system'
  });

  // Accordion toggle: toggles clicked area, auto-closes others unless search is active
  const toggleArea = (id: string) => {
    setOpenAreas((prev) => {
      const willOpen = !prev[id];
      if (search.trim()) {
        return { ...prev, [id]: willOpen };
      }
      // Clean accordion: open only target area
      return {
        start: false,
        arbeiten: false,
        agenten: false,
        studio: false,
        ablage: false,
        system: false,
        [id]: willOpen
      };
    });
  };

  const toggleAll = (expand: boolean) => {
    setOpenAreas({
      start: expand,
      arbeiten: expand,
      agenten: expand,
      studio: expand,
      ablage: expand,
      system: expand
    });
  };

  const q = search.trim().toLowerCase();

  return (
    <div className="flex flex-col gap-2 select-none">
      {/* Search Filter matching /neu/station.js */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Seite im Ordnerbaum suchen …"
          className="w-full rounded-lg bg-[#080d0f] border border-[#173037] focus:border-[#34d399] px-2.5 py-1.5 text-[11.5px] text-[#e6f1f3] placeholder-[#7e9ea5] font-mono focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2 top-1.5 text-[11px] text-[#7e9ea5] hover:text-[#e6f1f3] cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Root Folder Header: Central (6 Bereiche · 45 Seiten) with Expand/Collapse toggle */}
      <div className="px-2 py-1 rounded bg-[#0e1b1e] border border-[#173037] flex items-center justify-between font-mono text-[10.5px]">
        <span className="text-[#34d399] font-bold flex items-center gap-1.5">
          <span>▾</span>
          <span>Central.station</span>
        </span>
        <div className="flex items-center gap-1 text-[10px]">
          <button
            onClick={() => toggleAll(true)}
            className="text-[#7e9ea5] hover:text-[#34d399] transition-colors cursor-pointer"
            title="Alle Ordner aufklappen"
          >
            [+]
          </button>
          <span className="text-[#173037]">/</span>
          <button
            onClick={() => toggleAll(false)}
            className="text-[#7e9ea5] hover:text-[#34d399] transition-colors cursor-pointer"
            title="Alle Ordner einklappen"
          >
            [-]
          </button>
        </div>
      </div>

      {/* 6 Collapsible Folder Branches */}
      <div className="space-y-1.5 pl-1">
        {STATION_AREAS.map((area) => {
          const filteredPages = q
            ? area.pages.filter(
                (p) =>
                  p.title.toLowerCase().includes(q) ||
                  p.subtitle.toLowerCase().includes(q) ||
                  p.areaLabel.toLowerCase().includes(q)
              )
            : area.pages;

          if (q && filteredPages.length === 0) return null;
          const isOpen = q ? true : !!openAreas[area.id];
          const hasActiveChild = area.pages.some((p) => p.id === activeSubpageId);

          return (
            <div key={area.id} className="flex flex-col">
              <button
                onClick={() => toggleArea(area.id)}
                className={`w-full px-2 py-1.5 rounded-md flex items-center justify-between text-left transition-colors cursor-pointer ${
                  hasActiveChild
                    ? 'bg-[#13252a] text-[#e6f1f3] border border-[#34d399]/35'
                    : 'hover:bg-[#0e1b1e] text-[#c4d6da]'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-[10px] text-[#34d399] w-3">
                    {isOpen ? '▾' : '▸'}
                  </span>
                  <span className="text-[#34d399] text-[12px]">{area.icon}</span>
                  <span className="font-semibold text-[12px] truncate">{area.title}</span>
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#080d0f] border border-[#173037] text-[#7e9ea5]">
                  {filteredPages.length}
                </span>
              </button>

              {isOpen && (
                <div className="ml-3 pl-2.5 border-l border-[#173037] mt-1 space-y-0.5">
                  {filteredPages.map((p) => {
                    const active = p.id === activeSubpageId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => onSelectSubpage(p.id)}
                        className={`w-full px-2 py-1 rounded flex items-center justify-between gap-1.5 text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-[#34d399]/18 border-l-2 border-[#34d399] text-[#5ef6c4] font-semibold'
                            : 'text-[#99f6e4]/80 hover:bg-[#0e1b1e] hover:text-[#e6f1f3]'
                        }`}
                      >
                        <span className="text-[11.5px] truncate">{p.title}</span>
                        <span
                          className={`font-mono text-[8.5px] uppercase px-1 py-0.2 rounded shrink-0 ${
                            p.status === 'neu'
                              ? 'bg-[#34d399]/20 text-[#34d399] font-bold'
                              : p.status === 'eigen'
                              ? 'bg-[#22d3ee]/15 text-[#22d3ee]'
                              : 'bg-[#080d0f] text-[#7e9ea5]'
                          }`}
                        >
                          {p.badge || p.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface StationSubpage {
  id: string;
  title: string;
  areaId: 'start' | 'arbeiten' | 'agenten' | 'studio' | 'ablage' | 'system';
  areaLabel: string;
  status: 'neu' | 'eigen' | 'alt';
  url: string;
  subtitle: string;
  description: string;
  port?: string;
  host?: 'sascha-kruss-1' | 'homeserver-omarchy' | 'annkon-01' | 'crm-vps' | 'tailnet';
  badge?: string;
}

export interface StationArea {
  id: 'start' | 'arbeiten' | 'agenten' | 'studio' | 'ablage' | 'system';
  title: string;
  icon: string;
  hint: string;
  pages: StationSubpage[];
}

export interface GreenTemplatePage {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  category: 'Canvas Workspace' | 'Archify Platform';
  features: string[];
}

export const GREEN_TEMPLATES: GreenTemplatePage[] = [
  {
    id: 'canvas-drag-drop',
    title: 'Canvas Studio — Interactive Drag & Drop IDE',
    subtitle: '3-Spalten Architektur-IDE mit Drag-to-Canvas, Live-AST-Sync & Replica-Inspector (Smaragdgrün)',
    path: '/vorlagen-gruen/canvas_studio_archify_interactive_drag_drop_workspace/code.html',
    category: 'Canvas Workspace',
    features: ['Drag & Drop Knoten', 'Live Bézier-Wires (mTLS 1.3)', 'Replica Stepper (-/+)', 'AST Compiler Log']
  },
  {
    id: 'canvas-workspace',
    title: 'Canvas Studio — Interactive Workspace',
    subtitle: 'Kompakte Split-Screen Topologie-Ansicht mit Ressourcen-Katalog & Telemetrie (Smaragdgrün)',
    path: '/vorlagen-gruen/canvas_studio_archify_interactive_workspace/code.html',
    category: 'Canvas Workspace',
    features: ['Split-View Editor', 'Zero-Trust Policy Check', 'Minimap HUD', 'Layer Filter']
  },
  {
    id: 'archify-motion',
    title: 'Archify Platform — Interactive Motion',
    subtitle: 'Architecture-as-Code Plattform mit animierten Datenflüssen, Bento-Grid & Live-Sandbox (Smaragdgrün)',
    path: '/vorlagen-gruen/archify_architecture_as_code_platform_interactive_motion/code.html',
    category: 'Archify Platform',
    features: ['Animierte Topologie', '4 Bento-Karten', 'CLI Quick-Copy', 'Drift Detection']
  },
  {
    id: 'archify-refined',
    title: 'Archify Platform — Refined Edition',
    subtitle: 'Präzisions-Layout nach Tectonic-Precision-System umgebaut auf Central.station Smaragd/Mint',
    path: '/vorlagen-gruen/archify_architecture_as_code_platform_refined/code.html',
    category: 'Archify Platform',
    features: ['Tectonic Grid', 'IaC Diff-Vorschau', 'Multi-Cloud Normalisierung', 'KPI-Leiste']
  },
  {
    id: 'archify-base',
    title: 'Archify Platform — Core Overview',
    subtitle: 'Basis-Übersichtsseite für Code-to-Cloud Architecture-as-Code in Smaragd/Cyan',
    path: '/vorlagen-gruen/archify_architecture_as_code_platform/code.html',
    category: 'Archify Platform',
    features: ['DSL Showcase', 'IAM Security Topologie', 'Bi-direktionaler Sync', 'metrische Kacheln']
  }
];

export interface KnowledgeGraphProject {
  id: string;
  title: string;
  group: 'Infrastruktur & Station' | 'Wissen & Agenten' | 'Webseiten & Design';
  nodes: number;
  edges: number;
  clusters: number;
  updated: string;
  description: string;
  hasArchify: boolean;
  topEntities: string[];
}

export const KNOWLEDGE_GRAPH_PROJECTS: KnowledgeGraphProject[] = [
  {
    id: 'central',
    title: 'Central Station',
    group: 'Infrastruktur & Station',
    nodes: 148,
    edges: 312,
    clusters: 8,
    updated: 'Heute, 19:40',
    description: 'Gesamtarchitektur von central.sascha-kruss.de: 6 Hauptbereiche, 45 Unterseiten, nginx-Routen, systemd-Dienste und Tailscale-Mesh.',
    hasArchify: true,
    topEntities: ['station.js', 'central-api :8895', 'sascha-kruss-1', 'homeserver-omarchy', 'annkon-01']
  },
  {
    id: 'second-brain',
    title: 'Second.brain (Hybrid Retrieval)',
    group: 'Wissen & Agenten',
    nodes: 342,
    edges: 618,
    clusters: 12,
    updated: 'Heute, 19:15',
    description: 'Obsidian-Vault + Hybrid Retrieval RRF Pipeline (BM25 + Qdrant bge-m3 + Graph-Traversal) über 32 Rollout-Kapitel.',
    hasArchify: true,
    topEntities: ['FastMCP Server', 'Qdrant Vector DB', 'RRF Fusion k=60', 'PARA + Zettelkasten', 'Claude Code MCP']
  },
  {
    id: 'nexusmem',
    title: 'NexusMem (Langzeitgedächtnis)',
    group: 'Wissen & Agenten',
    nodes: 96,
    edges: 184,
    clusters: 5,
    updated: 'Heute, 17:20',
    description: 'Zentrales Langzeitgedächtnis aller KI-Agenten auf dem Homeserver (Port 8765) inkl. Episoden-Speicher & Fakten-Extraktion.',
    hasArchify: true,
    topEntities: ['agent-memory :8798', 'NexusMem :8765', 'SQLite FTS5', 'Hermes Bridge', 'Session-Sync']
  },
  {
    id: 'skills',
    title: 'Hermes Skill Deck',
    group: 'Wissen & Agenten',
    nodes: 84,
    edges: 142,
    clusters: 7,
    updated: 'Gestern, 22:10',
    description: '42 wiederverwendbare Agenten-Skills in 7 Kategorien (Web, Design, SEO, Video, Server, Vault, Analyse) auf Port 8000.',
    hasArchify: true,
    topEntities: ['SKILL.md Parser', 'chaos-aufraeumen', 'auto-webseiten', 'seo-geo-check', 'motion-render']
  },
  {
    id: 'claude-code',
    title: 'Claude Code & Subagenten',
    group: 'Wissen & Agenten',
    nodes: 112,
    edges: 205,
    clusters: 6,
    updated: 'Heute, 18:05',
    description: 'Orchestrierung der 17 laufenden Agenten-Prozesse über 11 Geräte im Tailscale-Netz (Claude, Hermes, OpenCode, Cadence).',
    hasArchify: true,
    topEntities: ['claude-main', 'claude-frei', 'opencode :4096', 'LOGBUCH.md', 'Paperclip :3100']
  },
  {
    id: 'software-kompass',
    title: 'Software-Kompass',
    group: 'Webseiten & Design',
    nodes: 78,
    edges: 134,
    clusters: 5,
    updated: 'vor 2 Tagen',
    description: 'Vergleichs- und Analyseplattform für Unternehmenssoftware mit strukturierten Bewertungsmatrizen.',
    hasArchify: true,
    topEntities: ['Next.js Frontend', 'Bewertungs-Engine', 'SEO-Schema', 'Vergleichs-API']
  },
  {
    id: 'sk-coding-design',
    title: 'SK Coding & Design',
    group: 'Webseiten & Design',
    nodes: 64,
    edges: 119,
    clusters: 4,
    updated: 'Heute, 16:30',
    description: 'Agentur-Plattform, Vorlagen-Bibliothek (vorlagen.sascha-kruss.de) und Auto-Webseiten-Pipeline mit Vorher/Nachher-Schieber.',
    hasArchify: true,
    topEntities: ['DESIGN.md Generator', 'Vorlagen-Deck', 'Crawl4AI :47821', 'Abnahme-Schieber']
  },
  {
    id: 'flurfoerderzeug-info',
    title: 'Flurförderzeug-Info (Annkon)',
    group: 'Webseiten & Design',
    nodes: 92,
    edges: 168,
    clusters: 6,
    updated: 'Gestern, 19:50',
    description: 'Fachportal, Cadence Content-Pipeline (Atlas, Vera, Kite, Orin) und lokales Sprachmodell llama-qwen3-14b auf annkon.',
    hasArchify: false,
    topEntities: ['Cadence Studio', 'llama-qwen3-14b :11435', 'Flyer-Ausgabe', 'SEO-Ratgeber']
  },
  {
    id: 'awesome-skills',
    title: 'Awesome Skills Sammlung',
    group: 'Wissen & Agenten',
    nodes: 120,
    edges: 210,
    clusters: 9,
    updated: 'vor 3 Tagen',
    description: 'Kuratierte Sammlung externer & eigener MCP-Server, Prompt-Pipelines und Automatisierungs-Rezepte.',
    hasArchify: false,
    topEntities: ['Context7 MCP', 'Playwright MCP', 'Obsidian REST', 'Skill-Installer']
  },
  {
    id: 'muster-webseite-lambo',
    title: 'Muster-Webseite Showroom',
    group: 'Webseiten & Design',
    nodes: 45,
    edges: 76,
    clusters: 3,
    updated: 'vor 4 Tagen',
    description: 'Referenz-Showcase für hochdynamische Fahrzeug- & Produktpräsentationen mit 60fps Scroll-Trigger-Sequenzen.',
    hasArchify: false,
    topEntities: ['Hero-Canvas', 'Spec-Konfigurator', 'Performance-Audit']
  }
];

export const STATION_AREAS: StationArea[] = [
  {
    id: 'start',
    title: 'Start',
    icon: '⌂',
    hint: 'Täglicher Einstieg, Freigaben & One Place',
    pages: [
      {
        id: 'cockpit',
        title: 'Cockpit',
        areaId: 'start',
        areaLabel: 'Start',
        status: 'neu',
        url: '/main/#cockpit',
        subtitle: 'AIOS Command Center V3 & Leitstand',
        description: 'Rechner, Dienste, Agenten, Ausgabe und Notizen auf einen Blick – kombiniert mit dem AIOS Command Center V3 und dem 2.5D Sphären-Graphen.',
        port: ':8895',
        host: 'sascha-kruss-1',
        badge: 'LIVE'
      },
      {
        id: 'abnahme',
        title: 'Abnahme',
        areaId: 'start',
        areaLabel: 'Start',
        status: 'alt',
        url: '/main/#abnahme',
        subtitle: 'Entwürfe prüfen & freigeben',
        description: 'Warteschlange fertiger Agenten-Ergebnisse: Auto-Webseiten mit Vorher/Nachher-Schieber, Cadence-Flyer und Architektur-Änderungen.',
        port: ':8895',
        host: 'sascha-kruss-1',
        badge: '4 OFFEN'
      },
      {
        id: 'oneplace',
        title: 'One Place',
        areaId: 'start',
        areaLabel: 'Start',
        status: 'eigen',
        url: '/oneplace/',
        subtitle: 'SK-Vault-Dashboard (Port 8790)',
        description: 'Das zentrale SK-Vault-Dashboard: Schnellzugriff auf alle Server, Domains, Kunden-Projekte und Vault-Metriken.',
        port: ':8790',
        host: 'sascha-kruss-1'
      }
    ]
  },
  {
    id: 'arbeiten',
    title: 'Arbeiten',
    icon: '✎',
    hint: 'Code, Aufgaben, Notizen, Wissen & Ziele',
    pages: [
      {
        id: 'arbeitsplatz',
        title: 'Arbeitsplatz (VS Code)',
        areaId: 'arbeiten',
        areaLabel: 'Arbeiten',
        status: 'eigen',
        url: '/neu/werkbank/',
        subtitle: 'Werkbank: VS Code · Terminal · Obsidian · Archify IDE',
        description: 'Integrierte Werkbank mit code-server (Port 8445), persistentem tmux-Terminal, Obsidian-Vault und dem neuen grünen Archify Canvas Studio.',
        port: ':8445',
        host: 'sascha-kruss-1',
        badge: 'WERKBANK'
      },
      {
        id: 'board',
        title: 'Aufgaben-Board',
        areaId: 'arbeiten',
        areaLabel: 'Arbeiten',
        status: 'eigen',
        url: '/ablaeufe/board',
        subtitle: 'Kanban-Board (Offen · In Arbeit · Prüfung · Erledigt)',
        description: 'Deine Ziele und Agenten-Tickets als interaktives Kanban-Board. Karten per Klick zwischen den 5 Spalten verschieben.',
        port: ':8895',
        host: 'sascha-kruss-1',
        badge: '14 OFFEN'
      },
      {
        id: 'tagebuch',
        title: 'Notizen',
        areaId: 'arbeiten',
        areaLabel: 'Arbeiten',
        status: 'alt',
        url: '/main/#tagebuch',
        subtitle: 'Tägliches Logbuch im Vault (10-wissen/persoenlich/)',
        description: 'Schnelle Gedanken, Befunde und Entscheidungen mit automatischem Zeitstempel – synchronisiert zwischen Homeserver, Laptop und VPS.',
        host: 'homeserver-omarchy'
      },
      {
        id: 'wissen',
        title: 'Wissen',
        areaId: 'arbeiten',
        areaLabel: 'Arbeiten',
        status: 'neu',
        url: '/main/#wissen',
        subtitle: 'Second.brain · Hybrid Retrieval RRF & 32-Kapitel Rollout',
        description: 'Vollständiges Second.brain Cockpit: Vault-Gesundheit (92/100), BM25 + Qdrant + Graph RRF-Labor und die 32 Architektur-Kapitel.',
        port: ':8798',
        host: 'homeserver-omarchy',
        badge: 'SECOND.BRAIN'
      },
      {
        id: 'notebook',
        title: 'Open Notebook',
        areaId: 'arbeiten',
        areaLabel: 'Arbeiten',
        status: 'eigen',
        url: 'https://notebook.sascha-kruss.de/',
        subtitle: 'KI-Forschungs-Notizbuch (Port 8502)',
        description: 'Quellenbasiertes Notizbuch auf dem VPS in Verbindung mit Crawl4AI und Audio-Zusammenfassungen.',
        port: ':8502',
        host: 'sascha-kruss-1'
      },
      {
        id: 'ziele',
        title: 'Ziele',
        areaId: 'arbeiten',
        areaLabel: 'Arbeiten',
        status: 'alt',
        url: '/main/#ziele',
        subtitle: 'Quartals- & Wochenziele (Vault-Sync)',
        description: 'Ziele setzen, abhaken und Fortschritt verfolgen – direkt gekoppelt an Paperclip und die Claude-Aufgabenliste.',
        host: 'sascha-kruss-1'
      }
    ]
  },
  {
    id: 'agenten',
    title: 'Agenten',
    icon: '◉',
    hint: '11 Geräte, 17 Prozesse & Agenten-Steuerung',
    pages: [
      {
        id: 'agenten',
        title: 'KI-Agenten',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'neu',
        url: '/neu/agenten/',
        subtitle: 'Live-Netzwerk (11 Geräte · 8 Online · 17 Prozesse)',
        description: 'Interaktiver 2.5D Smaragd-Sphären-Graph aller Rechner und KI-Agenten im Tailscale-Netz mit Sci-Fi HUD-Lupe und Prozess-Telemetrie.',
        port: ':9810',
        host: 'homeserver-omarchy',
        badge: '17 AKTIV'
      },
      {
        id: 'claude',
        title: 'Claude',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'alt',
        url: '/main/#claude',
        subtitle: 'Claude Code Aufträge & Sitzungen',
        description: 'Arbeitsanweisungen für Claude Code (claude-main & claude-frei) auf VPS, Homeserver und Annkon. Direkt im Vault gespeichert.',
        host: 'sascha-kruss-1',
        badge: 'OPUS 4.7'
      },
      {
        id: 'hermes',
        title: 'Hermes',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'alt',
        url: '/main/#hermes',
        subtitle: 'Hermes Agent · Skill Deck (:8000) · NexusMem (:8765)',
        description: 'Autonomer Hintergrund-Agent auf dem Homeserver mit Zugriff auf 42 Skills und das Langzeitgedächtnis NexusMem.',
        port: ':8000',
        host: 'homeserver-omarchy'
      },
      {
        id: 'opencode',
        title: 'OpenCode',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'eigen',
        url: 'https://opencode.sascha-kruss.de/',
        subtitle: 'OpenCode Web-Agent (Port 4096)',
        description: 'Browserbasierter Coding-Agent auf dem VPS (opencode serve), angebunden an den zentralen Modell-Router.',
        port: ':4096',
        host: 'sascha-kruss-1'
      },
      {
        id: 'cadence',
        title: 'Cadence',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'alt',
        url: '/main/#cadence',
        subtitle: 'Atlas (Ideen) · Vera (Text) · Kite (Design) · Orin (Release)',
        description: 'Das 4-köpfige Content-Team für Annkon: erzeugt Fachbeiträge, Social-Slides und Flyer über llama-qwen3-14b auf annkon.',
        host: 'annkon-01',
        badge: '4 AGENTEN'
      },
      {
        id: 'rowboat',
        title: 'Rowboat',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'alt',
        url: '/main/#rowboat',
        subtitle: 'Multi-Agenten Studio (Homeserver)',
        description: 'Visueller Multi-Agenten-Baukasten auf dem Homeserver zum Testen von Tool-Ketten und Übergaben.',
        host: 'homeserver-omarchy'
      },
      {
        id: 'paperclip',
        title: 'Paperclip',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'eigen',
        url: 'https://paperclip.sascha-kruss.de/',
        subtitle: 'Agenten-Firma: Ziele, Aufgaben & Budgets (:3100)',
        description: 'Steuerzentrale der Agenten-Firma auf dem VPS (127.0.0.1:3100): verteilt Tickets und Token-Budgets an Claude, Codex und Hermes.',
        port: ':3100',
        host: 'sascha-kruss-1'
      },
      {
        id: 'teams',
        title: 'Teams',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'eigen',
        url: '/ablaeufe/teams',
        subtitle: 'Koordinierte Agenten-Schwärme',
        description: 'Vorkonfigurierte Agenten-Teams für Webseiten-Relaunch, Server-Wartung, Second.brain-Kuratierung und Annkon-Marketing.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'runde',
        title: 'Agenten-Runde',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'alt',
        url: '/main/#runde',
        subtitle: 'Gemeinsames LOGBUCH.md aller Agenten',
        description: 'Echtzeit-Protokoll über alle Projekte: wer gerade startet, fertig ist oder Rückfragen hat. Direktansprache per @name.',
        host: 'sascha-kruss-1',
        badge: 'LIVE-LOG'
      },
      {
        id: 'ablauf',
        title: 'Ablauf',
        areaId: 'agenten',
        areaLabel: 'Agenten',
        status: 'alt',
        url: '/main/#ablauf',
        subtitle: 'Vom Einfall zur Umsetzung (5-Phasen-Pipeline)',
        description: 'Idee erfassen → Agenten sortieren & planen → 1-Klick-Freigabe → automatischer Bau & Ablage in /ausgabe/.',
        host: 'sascha-kruss-1'
      }
    ]
  },
  {
    id: 'studio',
    title: 'Studio',
    icon: '▶',
    hint: 'Medien, Design, Canvas Studio & Webseiten',
    pages: [
      {
        id: 'motionstudio',
        title: 'Motion',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'eigen',
        url: '/studio/studio.html',
        subtitle: 'Motion Studio & Video-Skills',
        description: 'Video- und Motion-Aufträge per Spruch und Drag & Drop starten. Ergebnisse landen automatisch in Ablage › Ausgabe › video.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'voice',
        title: 'Voice Studio',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'eigen',
        url: 'https://voice.sascha-kruss.de/',
        subtitle: 'Sprachsynthese & Voice-Cloning (:3900)',
        description: 'VoiceStudio Container auf dem VPS (Port 3900) + ElevenLabs-Anbindung für deutsche Sprecherstimmen.',
        port: ':3900',
        host: 'sascha-kruss-1'
      },
      {
        id: 'schnitt',
        title: 'Schnitt',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'eigen',
        url: 'https://backlot.sascha-kruss.de/',
        subtitle: 'OpenMontage Backlot (:4750) & Auto-Cut',
        description: 'Automatisierter Videoschnitt, Untertitel-Burn-in und Reel-Formatierung im Ordner /root/OpenMontage.',
        port: ':4750',
        host: 'sascha-kruss-1'
      },
      {
        id: 'bilder',
        title: 'Bilder',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'alt',
        url: '/main/#bilder',
        subtitle: 'Gemini Bild-API · ElevenLabs · Google Flow',
        description: 'Bilder erzeugen mit Stil-Auswahl (Foto, Werbung, Technisch, Vektor), Seitenverhältnis und direkter Ablage nach /ausgabe/bilder/.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'musik',
        title: 'Musik',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'alt',
        url: '/main/#musik',
        subtitle: 'Hintergrundmusik & Sound-Design',
        description: 'GEMA-freie Instrumental-Tracks und Sound-Effekte für Produktvideos und Social-Media-Reels.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'design',
        title: 'Design (Canvas Studio)',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'neu',
        url: 'https://design.sascha-kruss.de/',
        subtitle: 'Archify Canvas Studio (Grün) & OpenDesign (:7456)',
        description: 'Unser interaktives Archify Canvas Studio in Smaragdgrün (Drag & Drop Knoten, Live-AST-Code, Replica-Inspector) + OpenDesign.',
        port: ':7456',
        host: 'sascha-kruss-1',
        badge: 'GRÜN NEU'
      },
      {
        id: 'social',
        title: 'Social Content',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'eigen',
        url: '/main/#social',
        subtitle: 'Cadence Content-Board für Annkon',
        description: 'Redaktionsplan, Flyer-Serien und LinkedIn/Instagram-Karussells mit automatischem Export nach /ausgabe/flyer/cadence.',
        host: 'annkon-01'
      },
      {
        id: 'thumbnails',
        title: 'Thumbnails',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'eigen',
        url: '/studio/thumbnails.html',
        subtitle: 'Thumbnail-Generator mit Kontrast-Check',
        description: 'Serien-Thumbnails im SK- und Annkon-Raster mit Typografie-Vorschau.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'galerie',
        title: 'Webseiten-Galerie',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'neu',
        url: '/galerie/',
        subtitle: 'Alle 5 umgefärbten grünen Archify/Canvas-Seiten + Kunden-Entwürfe',
        description: 'Direkte Live-Vorschau der 5 auf Smaragdgrün umgebauten Archify & Canvas Studio Vorlagen sowie aller Kunden-Webseiten unter /galerie/.',
        host: 'sascha-kruss-1',
        badge: '5 GRÜNE SEITEN'
      },
      {
        id: 'seo',
        title: 'SEO / GEO',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'alt',
        url: '/main/#seo',
        subtitle: 'SEO- & KI-Sichtbarkeits-Check (GEO)',
        description: 'Prüft jede URL auf Technik, Inhalt, Struktur und KI-Sichtbarkeit (Generative Engine Optimization) inkl. Maßnahmenplan.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'vorlagen',
        title: 'Vorlagen',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'neu',
        url: 'https://vorlagen.sascha-kruss.de/',
        subtitle: 'SK Coding & Design Komponenten + DESIGN.md (Smaragd)',
        description: 'Wiederverwendbare UI-Komponenten, Shader-Hintergründe, Vorher/Nachher-Slider und das grüne Tectonic-Precision Design-System.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'applabor',
        title: 'App-Labor',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'eigen',
        url: '/applabor/',
        subtitle: 'Interaktive Web-Apps & Rechner-Tools',
        description: 'Entwicklungsumgebung für interaktive Kunden-Rechner, Konfiguratoren und Micro-Apps.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'spiele',
        title: 'Spiele',
        areaId: 'studio',
        areaLabel: 'Studio',
        status: 'eigen',
        url: '/spiele/',
        subtitle: 'Canvas- & WebGL-Mini-Games',
        description: 'Gamification-Module und interaktive Physik-Experimente.',
        host: 'sascha-kruss-1'
      }
    ]
  },
  {
    id: 'ablage',
    title: 'Ablage',
    icon: '▤',
    hint: 'Ausgabe, Wissensgraphen, Dateien & Suche',
    pages: [
      {
        id: 'ausgabe',
        title: 'Ausgabe',
        areaId: 'ablage',
        areaLabel: 'Ablage',
        status: 'alt',
        url: '/ausgabe/',
        subtitle: 'Alles Hergestellte in 7 Ordner-Kategorien',
        description: 'Zentraler Ausgabeort aller Werkzeuge unter /ausgabe/<kategorie>/: Flyer, Webseiten, Bilder, Video, Audio, Dokumente & SEO-Berichte.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'galerie-ablage',
        title: 'Galerie',
        areaId: 'ablage',
        areaLabel: 'Ablage',
        status: 'eigen',
        url: '/galerie/',
        subtitle: 'Visuelle Medien- & Entwurfs-Übersicht',
        description: 'Schnellansicht aller freigegebenen Webseiten-Entwürfe und Kampagnen-Grafiken.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'graphen',
        title: 'Graphen',
        areaId: 'ablage',
        areaLabel: 'Ablage',
        status: 'neu',
        url: '/graphen/',
        subtitle: '10 Projekt-Wissensgraphen · 2.5D Sphären & Archify-Ansicht',
        description: 'Je Projekt ein interaktiver Wissensgraph (Central, Second.brain, NexusMem, Skills, SK Coding, Software-Kompass u.a.) mit Graph-Abfrage & Archify-Topologie.',
        host: 'sascha-kruss-1',
        badge: '10 GRAPHEN'
      },
      {
        id: 'filebrowser',
        title: 'Filebrowser',
        areaId: 'ablage',
        areaLabel: 'Ablage',
        status: 'eigen',
        url: 'https://files.sascha-kruss.de/',
        subtitle: 'Filebrowser Quantum (Port 8082)',
        description: 'Direkter Datei-Browser auf dem VPS für schnelleren Download und Inspektion von Artefakten.',
        port: ':8082',
        host: 'sascha-kruss-1'
      },
      {
        id: 'karakeep',
        title: 'Karakeep',
        areaId: 'ablage',
        areaLabel: 'Ablage',
        status: 'eigen',
        url: 'https://karakeep.sascha-kruss.de/',
        subtitle: 'Lesezeichen & Snippets mit KI-Tagging',
        description: 'Gespeicherte Web-Artikel, GitHub-Repos und Design-Referenzen mit automatischer KI-Verschlagwortung.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'suche',
        title: 'Suche',
        areaId: 'ablage',
        areaLabel: 'Ablage',
        status: 'eigen',
        url: '/suche/',
        subtitle: 'SearXNG (:8888) & Perplexica KI-Suche (:3004)',
        description: 'Metasuchmaschine SearXNG kombiniert mit Perplexica (Quellen-Antworten über llama-annkon) und Vault-Volltextsuche.',
        port: ':8888',
        host: 'sascha-kruss-1'
      }
    ]
  },
  {
    id: 'system',
    title: 'System',
    icon: '⚙',
    hint: 'Admin, Schlüssel, KI-Nutzung, Server & Modelle',
    pages: [
      {
        id: 'admin',
        title: 'Admin-Bereich',
        areaId: 'system',
        areaLabel: 'System',
        status: 'alt',
        url: '/main/#admin',
        subtitle: 'Alle Dienste, Container & Wartungs-Aktionen',
        description: 'Zentrales Admin-Panel: Dienst-Zustand prüfen, Container neu starten und Einstellungen jedes Werkzeugs direkt öffnen.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'schluessel',
        title: 'Schlüssel',
        areaId: 'system',
        areaLabel: 'System',
        status: 'alt',
        url: '/main/#schluessel',
        subtitle: 'Zentrale API-Key-Verteilung (VPS · Homeserver · Paperclip)',
        description: 'Schlüssel einmal eintragen – automatische Verteilung an secrets.env, Homeserver und Paperclip. Anzeige nur als Fingerabdruck.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'nutzung',
        title: 'KI-Nutzung',
        areaId: 'system',
        areaLabel: 'System',
        status: 'eigen',
        url: '/ablaeufe/nutzung',
        subtitle: 'Token-Verbrauch & Kosten nach Modell/Werkzeug',
        description: 'Live-Auswertung, welches Werkzeug welches Sprachmodell nutzt (Claude, Gemini, llama-qwen3-14b, FreeLLMAPI) und wie viele Token geflossen sind.',
        host: 'sascha-kruss-1',
        badge: '71% KONTINGENT'
      },
      {
        id: 'dienste',
        title: 'Server Dashboard',
        areaId: 'system',
        areaLabel: 'System',
        status: 'eigen',
        url: '/index.html',
        subtitle: 'sascha-kruss-1 · homeserver-omarchy · annkon-01 · crm-vps',
        description: 'Hardware-, Speicher-, GPU- und Dienst-Telemetrie aller vier Knoten im Tailscale-Mesh.',
        host: 'sascha-kruss-1',
        badge: '4 SERVER'
      },
      {
        id: 'me',
        title: 'System-Cockpit',
        areaId: 'system',
        areaLabel: 'System',
        status: 'eigen',
        url: '/me/',
        subtitle: 'Kundenseiten- & Domain-Monitor (me.sascha-kruss.de)',
        description: 'Überwachung aller Kunden-Domains, SSL-Zertifikate und Antwortzeiten im Stations-Farbschema.',
        host: 'sascha-kruss-1'
      },
      {
        id: 'lokal',
        title: 'Modelle',
        areaId: 'system',
        areaLabel: 'System',
        status: 'alt',
        url: '/main/#lokal',
        subtitle: 'llama-qwen3-14b (:11435) · Gemini AI Studio · Modell-Router · FreeLLM (:3456)',
        description: 'Steuerung des lokalen Sprachmodells auf annkon (20 GB VRAM), Google Gemini API, opencode.jsonc Router und FreeLLMAPI.',
        port: ':11435',
        host: 'annkon-01'
      },
      {
        id: 'werkzeuge',
        title: 'Werkzeuge',
        areaId: 'system',
        areaLabel: 'System',
        status: 'alt',
        url: '/main/#werkzeuge',
        subtitle: 'Alle 47 Werkzeuge, Ports & Direktlinks',
        description: 'Kompletter Katalog aller installierten Dienste (Open WebUI, Crawl4AI, Gitea, CloudPanel, SearXNG, Perplexica, Vaultwarden u.a.).',
        host: 'sascha-kruss-1',
        badge: '47 TOOLS'
      }
    ]
  }
];

export const ALL_STATION_SUBPAGES: StationSubpage[] = STATION_AREAS.flatMap((a) => a.pages);

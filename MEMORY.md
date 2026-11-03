# MEMORY: Central.station & Second.brain Leitstand

## Systemidentität & Kontext
- **Projekt**: Central.station (Zentraler Leitstand für Zweithirn, KI-Agenten, Studio & Ablage)
- **Hauptserver**: `sascha-kruss-1` (IP `100.89.43.82`, Ubuntu 24.04 LTS)
- **Domain**: `central.sascha-kruss.de` (Ablage: `/home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/`)
- **Lokale Arbeitskopie**: `C:\Users\Kruss\antigravity\Obsidian-MCP-Hybrid-Retrieval-Cockpit`
- **Lokaler Dev-Server**: Vite auf Port 3001 (LAN: `http://192.168.178.51:3001/`, Tailscale: `http://100.69.54.19:3001/`)

## Designsystem & Farb-Tokens
- **Primärfarben**:
  - Tectonic Canvas Hintergrund: `#080d0f`, `#0b1417`, `#0e1b1e`
  - Obsidian Dark: `#07100e`
  - Emerald / Smaragd Akzent: `#34d399`
  - Mint / Cyan Akzent: `#22d3ee`
  - Rahmen & Trennlinien: `#16302b`, `#1a2e29`
  - Text: `#ecfdf5` (Primär), `#99bab2` (Sekundär), `#689187` (Gedämpft/Telemetrie)
- **Keine Orange-/Brauntöne**: Alle Vorlagen von Archify/Canvas Studio (`#15130c` / `#E54D2E`) wurden vollständig auf Smaragdgrün `#34d399` umgestellt.

## Architektur & Komponenten
1. **6 Hauptbereiche & 45 Unterseiten**:
   - `01 Zentrale`: Cockpit, KI-Agenten & Graphen, Werkbank, Abnahme, Kanban, Runder Tisch
   - `02 Zweithirn`: Obsidian Vault, Hybrid-Suche FTS5+vec0, MOC-Karten, Quellen, Notiz-Editor, Waisen-Notizen, Backup
   - `03 Studio`: Archify Vorlagen, Canvas Studio, Auto-Webseiten, Audio-Labor, Bild & Banner, Prompt-Katalog, Vorschau
   - `04 Ablage`: Eingang, Ausgang, Dokumente, Vorlagen, Medien, Archiv, Papierkorb
   - `05 Dienste`: Claude Opus, Gemini 2.5, Whisper, TTS ElevenLabs, Qdrant Vektor-DB, Ollama Local, Status
   - `06 System`: Host sascha-kruss-1, Docker Container, Cronjobs, Logs, API-Keys secrets.env, Backups, Sicherheit
2. **Ordnernavigation (`CentralStationSidebarTree.tsx`)**:
   - Ausklappbare Ordnerstruktur mit Akkordeon-Logik (nur aktiver Ordner offen, togglebar mit `[+] / [-]`)
   - Integrierte Echtzeit-Suche über alle 45 Unterseiten
3. **Marquee Ticker (`src/index.css` & `src/App.tsx`)**:
   - `.marquee-container` & `.marquee-track` für endloses, ruckelfreies Scrollen
   - Pausiert automatisch beim Hovern mit der Maus
   - Alle Metriken enthalten explizite Quellen (z.B. *Quelle: Central API /ablaeufe/nutzung & secrets.env*)
4. **Mobile Optimierung**:
   - Off-Canvas Drawer mit Hamburger-Button (`☰`) auf Mobilgeräten
   - 44px Ribbon auf Mobilgeräten ausgeblendet (`hidden md:flex`)
   - 100% responsive Viewport-Nutzung
5. **AIOS Command Center entfernt**:
   - Aus Tabs, Ribbon und Rendering gelöscht; reiner Central.station Leitstand.

## Datenquellen-Aufschlüsselung (Telemetry Reference)
- `71% Token-Kontingent`: Aggregiert durch Central Station API `/ablaeufe/nutzung` über API-Keys in `secrets.env`. Wochenbudget 500k Tokens (Gemini 2.5: 210k, Claude Opus: 145k · 145k frei).
- `Bi-directional Sync`: WebSocket Telemetrie Daemon auf Port 8765 (`/ws/telemetry`).
- `Hybrid Retrieval`: SQLite FTS5 (BM25) + sqlite-vec v0.1.9 (256d Model2Vec potion-base-8M).
- `Host Telemetrie`: `sascha-kruss-1` CPU/RAM via `/proc/meminfo` und systemd Process Supervisor.

## Standalone Vorlagen (`public/vorlagen-gruen/`)
- `1-landing-page.html`: Leitstand Dashboard
- `2-login.html`: Passkey Login
- `3-knowledge-graph.html`: 2.5D Sphären Graph mit Lupe
- `4-werkbank-studio.html`: Archify Workbench
- `5-abnahme-dashboard.html`: Vorher/Nachher Vergleichsschieber

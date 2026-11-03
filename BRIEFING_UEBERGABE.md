# Übergabe-Briefing: Neue Central.station Webansicht (Smaragdgrün & Mint)

**Datum**: 2026-10-26  
**Zielsystem**: Central.station (`central.sascha-kruss.de`)  
**Paket**: `central-station-neue-ansicht-gruen.zip`  
**Ablageort auf Server**: `/home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/webseiten/` und `/ausgabe/dokumente/`  

---

## 1. Zusammenfassung des Auftrags & Durchgeführte Arbeiten

1. **Umfärbung der Vorlagen (Null-Orange-Doktrin)**:
   - Alle 5 hochgeladenen Archify- und Canvas-Studio-Vorlagen wurden von den alten Braun-/Orange-Farbtönen (`#15130c`, `#201c13`, `#E54D2E`, `#EC6142`) auf das offizielle Farbschema von **Central.station** umgestellt:
     - Hintergrund Tiefschwarz/Dunkelsmaragd: `#080d0f`, `#0b1417`, `#0e1b1e`
     - Akzentfarben: Smaragdgrün `#34d399` und Mint/Cyan `#22d3ee`
     - Alle 5 Vorlagen liegen einsatzbereit unter `public/vorlagen-gruen/`:
       - `1-landing-page.html` (Zentraler Leitstand, 6 Bereiche)
       - `2-login.html` (Sichere Authentifizierung & Passkey)
       - `3-knowledge-graph.html` (Interaktiver 2.5D Sphären-Graph mit Sci-Fi HUD Lupe)
       - `4-werkbank-studio.html` (Archify & VS Code Studio Workbench)
       - `5-abnahme-dashboard.html` (Vorher/Nachher-Inspektor mit interaktivem Slider)

2. **Struktur der 45 Unterseiten & 6 Hauptbereiche**:
   - Die komplette Struktur der produktiven Central.station wurde 1:1 lokal in React/TypeScript nachgebaut (`src/data/centralStationData.ts` & `src/components/CentralStationSubpageRenderer.tsx`):
     - **01 Zentrale** (Cockpit, KI-Agenten & Graphen, Werkbank, Abnahme, Kanban, Runder Tisch)
     - **02 Zweithirn** (Obsidian Vault, Hybrid-Suche FTS5+vec0, MOC-Karten, Quellen, Notiz-Editor, Waisen-Notizen, Backup)
     - **03 Studio** (Archify Vorlagen, Canvas Studio, Auto-Webseiten, Audio-Labor, Bild & Banner, Prompt-Katalog, Vorschau)
     - **04 Ablage** (Eingang, Ausgang, Dokumente, Vorlagen, Medien, Archiv, Papierkorb)
     - **05 Dienste** (Claude Opus, Gemini 2.5, Whisper, TTS ElevenLabs, Qdrant Vektor-DB, Ollama Local, Status)
     - **06 System** (Host sascha-kruss-1, Docker Container, Cronjobs, Logs, API-Keys secrets.env, Backups, Sicherheit)
   - Alle 45 Seiten sind interaktiv über den ausklappbaren Ordnerbaum `CentralStationSidebarTree.tsx` erreichbar.

3. **Marquee-Ticker im Sub-Header mit vollständiger Quellenangabe**:
   - Manuelles Horizontales Scrollen wurde durch einen flüssigen, endlosen CSS-Marquee-Ticker (`.marquee-container` & `.marquee-track`, automatische Pause bei Mauszeiger-Hover) ersetzt.
   - **Jede Metrik trägt nun ihre genaue Quelle im Ticker und in den KPI-Karten**:
     - **71% Token-Kontingent**: *Quelle: Central API `/ablaeufe/nutzung` & `secrets.env` (Wochenbudget 500k Tokens: Gemini 2.5 verbraucht 210k, Claude Opus verbraucht 145k · 145k Tokens noch frei)*.
     - **Bi-directional Sync Active (23ms p50)**: *Quelle: WebSocket Daemon `/ws/telemetry` auf Port 8765*.
     - **Engine: SQLite FTS5 + sqlite-vec v0.1.9**: *Quelle: Lokale Vault Indexer Datenbank (49.746 Chunks indiziert)*.
     - **Embedding Model2Vec potion-base-8M 256d**: *Quelle: Lokaler CPU-Inferenz-Cache (8ms Latenz, 30 MB RAM)*.
     - **MCP Token Cap 1.840 / 4.000**: *Quelle: `~/.claude.json` Stdio Cap & Obsidian MCP Plugin*.
     - **Host sascha-kruss-1**: *Quelle: Host-Telemetrie via `/proc/meminfo` (62% RAM belegt, 24.8 GB frei)*.
     - **Agenten-Prozesse**: *Quelle: Central Process Supervisor `systemd`*.

4. **Entfernung des AIOS Command Centers**:
   - Die alte/fremde AIOS-Command-Center-Übersicht (`AiosCommandCenterOverview`) wurde vollständig aus dem Workspace, den Tabs, der Ribbon-Leiste und der Rendering-Hierarchie entfernt.
   - Die Oberfläche ist ein reiner, sauberer `Central.station Leitstand`.

5. **Volle Smartphone- und Tablet-Optimierung**:
   - Die starre 300px Sidebar wurde durch einen reaktionsschnellen Off-Canvas-Drawer mit Hamburger-Menü (`☰`) und dunklem Backdrop-Blur ersetzt.
   - Die 44px Icon-Ribbon-Leiste blendet sich auf Mobilgeräten automatisch aus (`hidden md:flex`).
   - Der Hauptbereich (`<main>`) passt sich mobil auf 100% Breite an.

---

## 2. Archiv-Inhalt (`central-station-neue-ansicht-gruen.zip`)

```text
central-station-neue-ansicht-gruen/
├── dist/                              # Produktionsfertiges, minifiziertes Bundle
│   ├── index.html                     # Einstiegsseite mit Smaragd-Theming
│   └── assets/                        # CSS und JS mit Tree-Shaking
├── public/
│   └── vorlagen-gruen/                # Die 5 umgefärbten Standalone-HTML-Vorlagen
│       ├── 1-landing-page.html
│       ├── 2-login.html
│       ├── 3-knowledge-graph.html
│       ├── 4-werkbank-studio.html
│       └── 5-abnahme-dashboard.html
├── src/                               # Vollständiger TypeScript/React Quellcode
│   ├── components/                    # 45-Seiten Renderer, Baum, Graph, Modale
│   ├── data/                          # 45-Seiten Datenmodell & Telemetrie
│   ├── App.tsx                        # Haupt-Workbench mit Marquee & Responsive Drawer
│   └── index.css                      # Farbtokens, Keyframes & Marquee
├── BRIEFING_UEBERGABE.md              # Dieses Dokument
└── MEMORY.md                          # Architekturgedächtnis für nachfolgende Sessions
```

---

## 3. Installation & Inbetriebnahme

### Option A: Als statische Webseite ausliefern (Nginx / Apache)
1. Archiv auf dem Server entpacken:
   ```bash
   unzip /home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/webseiten/central-station-neue-ansicht-gruen.zip -d /tmp/station-gruen/
   ```
2. Inhalt von `dist/` und `public/vorlagen-gruen/` in das Zielverzeichnis von Central.station kopieren.

### Option B: Als Node/Vite Entwicklungsumgebung lokal oder im Container
```bash
npm install
npm run dev -- --host
```
Die Entwicklungsumgebung startet standardmäßig auf Port `3001` (oder `3000`).

---

## 4. Bereitstellung in Central Station Ausgang

- **Webseiten-Ausgabe**: `https://central.sascha-kruss.de/ausgabe/webseiten/central-station-neue-ansicht-gruen.zip`
- **Briefing-Ausgabe**: `https://central.sascha-kruss.de/ausgabe/dokumente/BRIEFING_UEBERGABE.md`
- **Memory-Ausgabe**: `https://central.sascha-kruss.de/ausgabe/dokumente/MEMORY.md`
- Protokolliert in: `/home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/uebergaben.jsonl`

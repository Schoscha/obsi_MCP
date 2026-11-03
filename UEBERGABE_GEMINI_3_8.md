# Übergabe-Briefing an Gemini 3.8

**Datum:** 2026-11-02  
**Projekt:** Central.station Neue Ansicht & Second.brain Hybrid Retrieval Cockpit  
**Arbeitsverzeichnis (Windows):** `C:\Users\Kruss\antigravity\Obsidian-MCP-Hybrid-Retrieval-Cockpit`  
**Ziel-Server (VPS):** `sascha-kruss-1` (Tailscale: `100.71.9.93` / `100.89.43.82`, User: `root` bzw. `sascha-central`)  
**Web-Ausgabe URL:** `https://central.sascha-kruss.de/ausgabe/`  
**Archiv:** `/home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/webseiten/central-station-neue-ansicht-gruen.zip`  

---

## 1. Was bisher getan wurde

1. **Umfärbung der 5 Vorlagen (Smaragdgrün-Doktrin)**:
   - Alle hochgeladenen Archify- und Canvas-Studio-Vorlagen wurden von Alt-Farben (`#15130c`, `#201c13`, `#E54D2E`) vollständig auf Central.station Smaragdgrün (`#34d399`), Cyan (`#22d3ee`) und Deep Obsidian (`#080d0f`, `#0b1417`, `#0e1b1e`) umgestellt.
   - Liegen unter `public/vorlagen-gruen/`:
     - `1-landing-page.html` (Zentraler Leitstand, 6 Bereiche)
     - `2-login.html` (Passkey & SSO Auth)
     - `3-knowledge-graph.html` (2.5D Sphären-Graph mit Sci-Fi HUD Lupe)
     - `4-werkbank-studio.html` (Archify & VS Code Studio Workbench)
     - `5-abnahme-dashboard.html` (Vorher/Nachher-Inspektor)

2. **Struktur der 45 Unterseiten & 6 Bereiche**:
   - Vollständiger 1:1-Nachbau der Seitenstruktur von `https://central.sascha-kruss.de/main/` in React/TypeScript:
     - `01 Zentrale` (Cockpit, KI-Agenten, Graphen, Werkbank, Abnahme, Kanban, Runder Tisch)
     - `02 Zweithirn` (Vault, Hybrid-Suche FTS5+vec0, MOC, Quellen, Editor, Waisen, Backup)
     - `03 Studio` (Vorlagen, Canvas Studio, Auto-Webseiten, Audio-Labor, Banner, Prompts, Vorschau)
     - `04 Ablage` (Eingang, Ausgang, Dokumente, Vorlagen, Medien, Archiv, Papierkorb)
     - `05 Dienste` (Claude Opus, Gemini 2.5, Whisper, TTS, Qdrant, Ollama, Status)
     - `06 System` (Host, Docker, Cronjobs, Logs, API-Keys secrets.env, Backups, Sicherheit)
   - Komponenten: `src/data/centralStationData.ts` und `src/components/CentralStationSubpageRenderer.tsx`.
   - Ordnerbaum: `src/components/CentralStationSidebarTree.tsx` (Akkordeon-Navigation, Live-Suche).

3. **Sub-Header Marquee Ticker mit Datenquellen**:
   - Manuelles horizontales Scrollen ersetzt durch CSS-Marquee-Ticker (`.marquee-container`, Pause bei Hover).
   - Jede Zahl trägt transparenten Quellennachweis:
     - `71% Token-Kontingent`: Quelle Central API `/ablaeufe/nutzung` & `secrets.env` (500k Wochenbudget: Gemini 2.5 210k | Claude Opus 145k · 145k frei).
     - `Bi-directional Sync`: Quelle WebSocket Daemon `/ws/telemetry` :8765 (23ms p50).
     - `Hybrid Retrieval`: Quelle SQLite FTS5 Porter + sqlite-vec v0.1.9 (49.746 Chunks).
     - `Embedding`: Quelle Model2Vec potion-base-8M 256d CPU-Inferenz (8ms, 30 MB RAM).
     - `Host Telemetrie`: Quelle `/proc/meminfo` (62% RAM belegt, 24.8 GB frei).

4. **AIOS Command Center restlos entfernt**:
   - `AiosCommandCenterOverview` aus Tabs, Ribbon und Rendering entfernt. Cockpit ist ein reiner Central.station Leitstand.

5. **Mobile- & Touch-Optimierung**:
   - Off-Canvas Drawer mit Hamburger `☰` (Touch-optimiert, `active:scale-95`).
   - Hauptansicht-Auswahl im Drawer für Smartphones (< 768px).
   - 44px Ribbon ausgeblendet auf Mobile; 100% Breite für Hauptbereich.
   - Touch-freundliche KPI-Karten, umbruchsichere Swipe-Menüs, angepasste Eingabefelder.
   - 2.5D Sphären-Canvas Höhe auf Mobilgeräten flexibel (420px).

---

## 2. Server- & Bereitstellungs-Pfade

- **VPS `sascha-kruss-1`**:
  - `central-station-neue-ansicht-gruen.zip`: `/home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/webseiten/`
  - `BRIEFING_UEBERGABE.md`: `/home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/dokumente/`
  - `MEMORY.md`: `/home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/dokumente/`
  - `UEBERGABE_GEMINI_3_8.md`: `/home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/dokumente/`
  - Übergabeprotokoll: `/home/sascha-central/htdocs/central.sascha-kruss.de/ausgabe/uebergaben.jsonl`

---

## 3. Lokale Umgebung (Windows)

- **PowerShell-Besonderheit**:
  - `npm.cmd` statt `npm` aufrufen (PowerShell Script Execution Policy blockiert `.ps1`).
- **Dev-Server starten**:
  - `npm.cmd run dev -- --host`
  - Ports: Standard `3000` (Fallback `3001`)
  - Erreichbar unter:
    - Lokal: `http://localhost:3000/`
    - LAN: `http://192.168.178.51:3000/`
    - Tailscale: `http://100.69.54.19:3000/`
- **Build erstellen**:
  - `npm.cmd run build` (Vite / Rolldown erzeugt `dist/`)
- **Zip packen**:
  - `tar -a -cf central-station-neue-ansicht-gruen.zip dist public src index.html package.json tsconfig.json vite.config.ts BRIEFING_UEBERGABE.md MEMORY.md UEBERGABE_GEMINI_3_8.md`

---

## 4. Offene Aufgaben & Nächste Schritte

1. **Feedback von Sascha**:
   - Sascha prüft die Ansicht mobil auf seinem Smartphone (`http://100.69.54.19:3000/` über Tailscale).
   - Eventuelle Detailanpassungen an Schriftgrößen, Abständen oder Touch-Targets vornehmen.
2. **Echte API-Kopplung (optional)**:
   - Aktuell werden Daten in `src/data/centralStationData.ts` und State in `CentralStationSubpageRenderer.tsx` simuliert.
   - Bei Bedarf Endpunkte von `central-station` (:8895) per REST/WebSocket live anbinden.
3. **Produktiv-Rollout**:
   - Wenn Sascha Freigabe erteilt: Dateien aus `dist/` und `public/vorlagen-gruen/` ins Zielverzeichnis von Central.station auf `sascha-kruss-1` übernehmen. Vorher Backup anlegen.

---

## 5. Verbindliche Regeln für Gemini 3.8

- **Null-Lösch-Doktrin**: Nichts auf `sascha-kruss-1` löschen oder überschreiben ohne Saschas Ok.
- **Passwörter & Keys**: Nie im Klartext ausgeben oder speichern.
- **NexusMem**: Langzeitgedächtnis unter `http://100.114.8.45:8765/sse`.
- **Pfadangaben**: Immer vollständige Pfade mit Serverangabe nennen.

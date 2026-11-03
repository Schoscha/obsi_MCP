# Übergabe 2026-11-03 (Claude Code → nächste Umgebung)

## Ziel in einem Satz
Central Station (`central.sascha-kruss.de` + `central.station.sascha-kruss.de`) behält das aktuelle Leitstand-Design unverändert; der Bereich Motion/Studio wird so repariert, dass alle alten Funktionen wieder da sind.

## Regeln von Sascha
- Design ist fix: `DESIGN.md` (VPS: `/opt/projekte/central-station/DESIGN.md`, Repo: `DESIGN-LEITSTAND.md`). Nichts neu erfinden, nicht umfärben.
- Nicht alles neu bauen. Navigation bleibt klein, alle alten Funktionen bleiben erhalten.
- Unterseiten müssen nicht in einem Fenster laufen: jeder Tab bekommt "In neuem Tab ↗".
- Nicht bei Kleinigkeiten nachfragen. Nichts löschen: alte Dateien nur ins Archiv legen.
- Antworten kurz, deutsch, erste Zeile = nächste Aktion.

## Referenzstand
Git `bbc3fff` in `/opt/projekte/central-station/` (Datei `index.html`) = letzter guter Stand vor der Zusammenlegung von Motion und Studio. Live-Stand: `99504b7`.

## Befund
- Neuer Studio-Tab ruft `/api/motion/render` (`station-api/pipeline_studio.py`, ab Z. 894). Der baut immer nur eine 9:16-Status-Karte; Engine/Skill-Auswahl wird ignoriert; alle "Weiter"-Knöpfe führen zu Cadence.
- Der alte freie Motion-Worker (`motion-jobs/motion_jobs.py`, Port 8897, `claude -p` auf Homeserver, Ergebnis nach `ausgabe/video`) ist im neuen Fließband nicht angeschlossen.
- Alte Tabs ComfyUI (`http://100.114.8.45:8188`) und Cadence Pipeline (`https://content.sascha-kruss.de`) sind nur noch Karten/Knöpfe.
- Kein Link aus der alten `index.html` fehlt (nur diese Datei verglichen, nur Motion im Detail).
- Beide Domains haben getrennte Webroots mit identischer `studio/index.html`:
  - `/home/sascha-central/htdocs/central.sascha-kruss.de/`
  - `/home/sascha-kruss-central-station/htdocs/central.station.sascha-kruss.de/`
  - `/ausgabe/` ist gemeinsam; Backend (Station-API, Port 8897) läuft nur einmal.
- Quelle zuerst ändern in `/opt/projekte/central-station/studio/`, dann in beide Webroots kopieren.

## Nächste Schritte (Reihenfolge)
1. Backup beider `studio/index.html` (`.bak-20261103`).
2. Motion-Bereich auf Stand `bbc3fff`: Tabs Motion Studio / Skill Deck / ComfyUI / Cadence Pipeline.
3. Neues Fließband als 5. Tab "Fließband" dazu.
4. Freien Motion-Auftrag (Port 8897) wieder anschließen; Status-Karte nur als eine Option.
5. Test auf beiden Domains.
6. Zwei neue Tools einbinden (Details von Sascha): (a) kleines Stimm-Tool als Ersatz für das entfernte Voice Studio (vorher VoiceStudio :3900 + ElevenLabs), (b) zweites Tool, noch offen.
7. Weglege-Liste (Plan Abschnitt C) nach Saschas Ok ins Archiv verschieben.
8. Tagebuch-Bericht (VPS `/test-sascha/`) und NexusMem-Eintrag anlegen.

## Dateien
- Plan mit Seiten-/Tab-Tabelle und Aufgabenliste: VPS `/opt/projekte/central-station/docs/PLAN-SEITEN-UND-AUFGABEN.md`, Repo `PLAN-SEITEN-UND-AUFGABEN.md`
- GitHub-Zweig: `sicherung/design-2026-11-03` in `Schoscha/obsi_MCP`
- Der lokale Vite-Nachbau (`src/`, `dist/`) ist NICHT die Live-Seite.
- Live-Seiten sind bisher unverändert, nichts verschoben oder gelöscht.

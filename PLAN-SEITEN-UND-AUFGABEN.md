# Plan: Was war wo eingebunden + Aufgabenliste

Stand: 2026-11-03 · Referenzstand (letzter guter Stand vor der Zusammenlegung): Git `bbc3fff` in `/opt/projekte/central-station/` (Datei `index.html`)
Design ist fix: siehe `DESIGN.md` (hier `DESIGN-LEITSTAND.md`). Nichts am Design ändern.

## A. Seitenplan nach altem Stand (bbc3fff) — "Heiliger Gral" für die Einbindungen
| Bereich | Tabs (Rahmen) | Einbindung / Ziel | Karten / Schnellzugriff |
|---|---|---|---|
| **Start** (`#start`) | — | Cockpit mit 3 Rechnern (VPS, Homeserver, Annkon), Agenten, Tagebuch | Links: `http://100.114.8.45:8787/`, `content.sascha-kruss.de`, `opencode.sascha-kruss.de` |
| **Agenten** (`#agenten`) | Dashboard :9810 · Hermes :8787 · Skill Deck :8000 · NexusMem :8765 · OpenCode | `/agenten/`, `opencode.sascha-kruss.de` | — |
| **Aufgaben** (`#aufgaben`) | Kanban-Board · Schlüssel-Ziele (16) · Offene Tasks (99) | `/ablaeufe/board` | — |
| **Notizen** (`#notizen`) | Tagebuch-Stream · Neue Notiz erfassen · Second Brain Vault | Daten: `/daten/vault-netz.json` | Schnell-Tags (u. a. "Motion") |
| **Motion** (`#motion`, heute "Studio") | **Motion Studio** `/studio/studio.html` · **Skill Deck** `/studio/skills.html` · **ComfyUI** `http://100.114.8.45:8188` · **Cadence Pipeline** `https://content.sascha-kruss.de` | je Tab ein Rahmen + "In neuem Tab" | ComfyUI (Annkon :8188) · Cadence Studio · Ausgabe Video (118 Clips) |
| **Webseiten** (`#webseiten`) | Auto-Webseiten · Galerie `/galerie/` · Vorlagen-Katalog · Showcase live | `/ablaeufe/?ablauf=auto-webseiten`, `vorlagen.sascha-kruss.de` | sascha-kruss.de · Vorlagen-Bibliothek · flurfoerderzeug.info |
| **Ausgabe** (`#ausgabe`) | Alle (705) · Webseiten · Videos · Dokumente · Bilder · Flyer · Audio · Sonstiges | `/ausgabe/<kategorie>/` | — |
| **Graphen** (`#graphen`) | 10 Wissensgraphen · 2.5D Sphären & Archify · Datentabelle · Graph abfragen | `/graphen/central/graph.html`, je Projekt `/graphen/<id>/graph.html`, `BRIEFING.md`, `GRAPH_REPORT.md` | — |
| **Werkzeuge** (`#werkzeuge`) | Terminal (ttyd :7681) · Herdr (:7682) · Filebrowser Quantum · VS Code Server · Karakeep | `/terminal/`, `code.sascha-kruss.de`, `files.sascha-kruss.de`, `karakeep.sascha-kruss.de` | — |
| **System** (`#system`) | Server-Dashboard (alle) · VPS · Homeserver (100.114.8.45) · Annkon · 79 Dienste-Ampel | `/server-dashboard.html`, `files.sascha-kruss.de/files/srv/test-sascha/` | VPS-/Homeserver-/Annkon-Dienste |

### Was seit der Zusammenlegung (ade505d … 99504b7) anders ist
- **Motion → Studio:** Nur dieser Bereich wurde umgebaut (Navi unverändert, 10 Einträge). Neu: Fließband Bild → Video → Motion → Cadence (`/api/google-flow/*`, `/api/motion/render`, `/api/cadence/schedule`).
- **Verloren gegangen als Tab:** ComfyUI, Cadence Pipeline (Rahmen mit `content.sascha-kruss.de`). Nur noch als Karte/Knopf.
- **Fehler:** `/api/motion/render` baut immer nur die 9:16-Status-Karte. Die Skill-Auswahl (Remotion/Hyperframes/Skill) wird nicht ausgewertet. Der freie Auftrag (`motion-jobs`, Port 8897, `claude -p` auf dem Homeserver → Ausgabe/video) ist im neuen Fließband nicht angeschlossen.
- **Links:** Ein Vergleich aller Links alt/neu ergab: kein Link aus der alten `index.html` fehlt. Verglichen wurde nur diese Datei und nur der Motion-Bereich im Detail.

## B. Aufgabenliste
**Heute zuerst (Design + Ordnung)**
- [x] `DESIGN.md` aus der Live-Seite erstellt (lokal `DESIGN-LEITSTAND.md`)
- [x] Seitenplan alt/neu erstellt (dieses Dokument)
- [ ] `DESIGN.md` auf den VPS legen (`/opt/projekte/central-station/DESIGN.md`) und als verbindlich markieren
- [ ] Altes orange `DESIGN.md` im Repo archivieren (nur nach Saschas Ok): `archiv/2026-11-03/`
- [ ] Alte Dateien/Sessions ins Archiv legen, nicht löschen (Liste unten, nur nach Saschas Ok)
- [ ] Backup beider `studio/index.html` (`.bak-20261103`) vor jeder Änderung
- [ ] Tagebuch-Bericht + NexusMem-Eintrag anlegen

**Studio/Motion wiederherstellen (Design bleibt)**
- [ ] Motion-Bereich auf Stand `bbc3fff` bringen: 4 Tabs Motion Studio / Skill Deck / ComfyUI / Cadence Pipeline
- [ ] Neues Fließband (Bild → Video → Motion → Cadence) als 5. Tab "Fließband" dazu, nichts löschen
- [ ] Jeder Tab: "In neuem Tab ↗" + "↻ Neu laden"
- [ ] Freier Motion-Auftrag (Spruch/Skills/Dateien → Port 8897) wieder anschließen; Status-Karte nur eine Option
- [ ] Änderung in beide Webroots: `central.sascha-kruss.de` und `central.station.sascha-kruss.de` (Quelle zuerst `/opt/projekte/central-station/studio/`)
- [ ] Test beider Domains

**Neue Tools einbinden (Sascha liefert Details)**
- [ ] **Tool 1: kleines Stimm-Tool** (Ersatz für das entfernte Voice Studio, vorher: VoiceStudio-Container :3900 + ElevenLabs). Fragen: Name/URL/Port? Wo läuft es? Soll es unter Studio oder Werkzeuge?
- [ ] **Tool 2:** noch offen — Sascha nennt es
- [ ] Beide als Tab + Karte im bestehenden Design, mit "In neuem Tab ↗"

**Andere Bereiche prüfen**
- [ ] Sascha nennt, was außerhalb von Motion fehlt; dann Vergleich gegen `bbc3fff`

## C. Kandidaten fürs Weglegen (Archiv, nicht löschen — erst nach Ok)
| Datei / Ordner | Ort | Grund |
|---|---|---|
| `DESIGN.md` (orange, "Tectonic Precision") | Repo-Wurzel | widerspricht dem Leitstand-Design |
| `UEBERGABE_GEMINI_3_8.md`, `SESSION_INFO.md`, `BRIEFING_UEBERGABE.md` | Repo-Wurzel | Übergaben der alten Gemini-Session |
| `central-station-neue-ansicht-gruen.zip`, `public/vorlagen-gruen/` | Repo | alter Entwurf (Smaragd-Vorlagen, anderer Aufbau) |
| `src/` (React-Nachbau), `dist/` | Repo | Nachbau, nicht die Live-Seite |
| `index-vorher-2026-09-30-1338.html`, `sk-central-station-artifact-28-09-2026.html(.bak…)` | VPS `/opt/projekte/central-station/` | alte Stände |
| `/main/main-central-station.html`, `/main/motion-test.html` (8 MB) | VPS Webroot `main/` | Testkopien |
| `/studio/pipeline.html`, `whatsapp-status-vorlagen-blanko*.json` | VPS `studio/` | Zwischenstände (erst prüfen, ob Fließband sie nutzt) |

Wichtig: Der Referenzstand `bbc3fff` (Git) und die Live-Seite bleiben unangetastet.

# DESIGN.md — Central Station Leitstand ("Der Heilige Gral")

Stand: 2026-11-03 · Quelle: Live-Seite `/opt/projekte/central-station/index.html` (Commit `99504b7`, CSS Zeilen 1–330)
Gilt für: `central.sascha-kruss.de` und `central.station.sascha-kruss.de`

> **VERBINDLICH.** Dieses Design ist freigegeben und wird NICHT neu erfunden, umgefärbt oder "modernisiert".
> Neue Seiten, Tabs, Karten und Tools übernehmen exakt diese Bausteine. Änderung nur auf ausdrücklichen Wunsch von Sascha.
> Das alte orange "Tectonic Precision" (`DESIGN.md` im Repo, `#15130c` / `#E54D2E`) ist ungültig.

## 1. Grundregeln
1. **100 % eckig:** `border-radius: 0 !important` auf allem (`* { border-radius: 0 !important }`).
2. **Keine Standard-KI-Buttons, keine Pillen.** Knöpfe sind `.tag` mit Leuchtecken.
3. **Kein Kasten im Kasten.** Eine Karte = eine Ebene, innen nur Inhalt.
4. **Nähte sind das Markenzeichen:** gestrichelte Naht 6 px innen an jeder Karte, Leuchtecken an Knöpfen.
5. Tastaturfokus: `outline: 2px solid var(--mint); outline-offset: 2px`.

## 2. Farben (Tokens)
| Token | Wert | Verwendung |
|---|---|---|
| `--bg` | `#041214` | Seitenhintergrund |
| `--bg-glow` | `#0b3133` | Verlauf oben rechts (`radial-gradient(ellipse 60% 50% at 70% 0%)`) |
| `--side` | `#061718` | Navigation |
| `--line` / `--line-2` | `#16403c` / `#1f6a62` | Trennlinien / stärkere Rahmen |
| `--ink` / `--ink-2` / `--ink-3` | `#e3f4ee` / `#a9c7c0` / `#6f8f88` | Text / Text gedämpft / Telemetrie |
| `--mint` / `--mint-hi` / `--mint-btn` | `#5eead4` / `#a0ffe0` / `#2ee6d2` | Akzent / Leuchtecke / Aktion |
| `--green` | `#10b981` | OK-Status |
| `--gold` / `--gold-hi` | `#e9d77a` / `#fff3a0` | **Aktiv** (Navi, Tabs) |
| `--warn` / `--bad` | `#f2b94b` / `#f07373` | Warnung / Fehler |

Verboten: Orange, Braun, Violett, Standard-Blau. Gold nur für "aktiv".

## 3. Schrift
- Alles: **IBM Plex Mono** (400/500/600/700), Fallback `ui-monospace, Consolas, monospace`.
- Uhr/Ziffern-Akzente: **Orbitron** 700/900 (nur Clock).
- Fließtext 14px/1.5. Knöpfe 12px/700, `letter-spacing: .07em`, GROSSBUCHSTABEN.
- Navi 13px/600, `.08em`, Großbuchstaben. Seitentitel `h1`: 700, `clamp(24px, 2.5vw, 36px)`, `.1em`, Großbuchstaben, `#d9fbf4`.
- Trenn-Etikett `.section-tag`: 11px/700, `.18em`, Großbuchstaben, Mint, mit Linie nach rechts.

## 4. Navigation (links, 240 px, klein halten)
- Gerüst: `grid-template-columns: 240px 1fr`, sticky, Höhe 100vh, `border-right: 1px solid var(--line)`.
- Eintrag: Höhe 42 px, Abstand 8 px, Icon 20 px (Mint), Rahmen `rgba(94,234,212,.16)`, Glasverlauf von dunkel nach Petrol.
- Leuchtecken: oben links + unten rechts 14×10 px, 2 px Mint-hi. Hover: 28×19 px mit `drop-shadow(0 0 5px mint)`, `translateX(2px)`.
- **Aktiv = Gold:** Rahmen 1.5 px Gold, Verlauf Dunkelgold, Ecken 26×18 px mit Gold-Glow.
- 10 Einträge: Start, Agenten, Aufgaben, Notizen, Studio, Webseiten, Ausgabe, Graphen, Werkzeuge, System.

## 5. Knöpfe `.tag`
- Höhe 34 px, Padding 0 16 px, Rahmen `#1f3f3a`, Fläche `#071a1a`, Text weiß.
- Ecken: `::before` oben links, `::after` unten rechts, 14×10 px, 2 px `#b6ffee`. Hover: 24×16 px + Glow, Fläche `#0b2526`, Rahmen Mint. Active: `translateY(2px)`.
- `.tag.sm` (in Karten): Höhe 28 px, 11px, Ecken 8×6 → Hover 14×10.
- `.tag[aria-pressed="true"]` (aktiver Tab): Gold-Rahmen, Dunkelgold-Verlauf, Ecken 20×14 Gold-Glow.
- `.tag.danger` (Stopp/Not-Aus): Rot `#ef4444`, Text `#fca5a5`.
- Status-Pille `.pill`: Höhe 34 px, Rahmen `--line-2`; `data-state="ok"` grün mit Häkchen-Kästchen.

## 6. Karten `.pillow` (Kissen-Kachel) — die Naht
- Fläche: `radial-gradient(ellipse 75% 65% at 50% 35%, #1a4441 0%, #12312f 55%, #0b2222 100%)`, Rahmen 1 px `#23786c`.
- Innen-Schatten `inset 0 0 38px rgba(0,0,0,.42)` + Lichtkante `inset 0 1px 0 rgba(150,255,235,.08)`; Körnung per SVG-Rauschen (`::before`, `soft-light`, 45 %).
- **Naht:** `::after { inset: 6px; border: 1px dashed rgba(86,214,194,.75) }`; Hover: Naht `#5eead4`.
- Gilt auch für `.card .stat .kachel .box .diary-card .g-project-card .rechner-card .p-card`. Inhalt `z-index: 2`.
- Drücken: `scale(.974)` + dunklere Fläche. `.pillow.flat` = nicht klickbar (Rahmen für Inhalte/Iframes).
- Kartenkopf `.p-head`: 14px/700, `.12em`, Großbuchstaben; rechts `.badge` (10px, Rahmen `--line-2`): `.vps` Mint, `.home` Gold, `.annkon` grau.
- Raster `.rechner-grid`: 3 Spalten, Abstand 14 px; mobil 1 Spalte.
- Telemetrie-Balken `.tele-bar`: 5 px hoch, Füllung Mint/Grün/Amber mit Glow.

## 7. Seitenkopf und Band
- `.topline` (11px, `.16em`, `--ink-3`, Linie unten) → `.head` mit `h1` + `.sub` + Cursor-Strich (blinkt) → `.band` (Linie oben/unten `#1e795c`, Breadcrumb links, Siebensegment-Uhr rechts).

## 8. Unterseiten, Tabs, Rahmen
- Tabs sind `.tag` mit `role="tab"` und `aria-pressed`. Aktiv = Gold.
- Fremdseiten kommen in `.frame` (`#061416`, Standardhöhe 540 px, großer Bereich `calc(100vh - 280px)`) innerhalb `.pillow.flat.canvas`.
- **Jeder Tab/Rahmen hat "In neuem Tab ↗"** und "↻ Neu laden". Unterseiten müssen nicht in einem Fenster laufen.

## 9. Responsive
- Brechpunkte: 1050 px (Navi-Beschriftung), 768 px (Smartphone: Drawer, 1 Spalte), 420 px (kompakt).

## 10. Nicht tun
Runde Ecken, Pillen, Schatten-Karten ohne Naht, Orange/Braun/Violett, Kasten im Kasten, neue Schriftfamilien, Emoji-Icons in der Navi (SVG-Linienicons, 1.6 px Strich), eigene Farbwerte außerhalb der Tokens.

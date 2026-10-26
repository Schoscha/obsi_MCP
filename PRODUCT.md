# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developer und Knowledge-Worker (insbesondere Sascha), die große lokale Obsidian-Markdown-Vaults (~16.894 Notizen, ~49.700 Chunks) mit Claude Code, Model Context Protocol (MCP) und lokalem Hybrid-Retrieval (`sqlite-vec` + `FTS5` BM25 + `Model2Vec`) betreiben.

## Product Purpose

Interaktives Architektur-, Telemetrie- und Implementierungs-Cockpit für die 32-Kapitel-Pipeline aus Blake Crosleys 2026 Obsidian-MCP-Leitfaden. Es ermöglicht das Abhaken und Exportieren aller 32 Implementierungsschritte als Markdown, das Live-Simulieren der Reciprocal Rank Fusion (RRF $k=60$), das Inspizieren und Bearbeiten von Vault-Notizen, die 2D-Graph-Visualisierung sowie eine gesprochene deutsche Audio-Erklärung.

## Positioning

100% lokale Zero-API-Cost Retrieval-Architektur: Kombination aus lexikalischer SQLite-FTS5-Suche (BM25) und 256d statischen `Model2Vec`-Vektoren (`sqlite-vec`) in einer einzigen `.sqlite`-Datei mit ~23 ms p50-Latenz und hartem 4.000-Token-Kontextbudget für Claude Code Hooks (`UserPromptSubmit`).

## Operating Context

Wird im Browser als Steuerzentrale und Referenz-Workbench neben Obsidian und dem Terminal (Claude Code / MCP STDIO-Server) genutzt. Unterstützt zwei visuelle Oberflächen-Modi: `Weiss` (Pure Crystal Ice Glass) und `Bunt` (Holographic Dark Glass).

## Capabilities and Constraints

- Persistente 32-Kapitel-Checkliste (`localStorage`) mit Phasen-Filter und `.md`-Datei-Export (`Obsidian-MCP-Hybrid-Tasks-2026.md`).
- Interaktiver RRF-Hybrid-Search-Simulator (`bm25Weight`, `vecWeight`, $k$-Parameter).
- Integrierter Markdown-Notiz-Reader & -Editor (`localStorage`-persistiert) sowie Tagesnotiz-Generator.
- Interaktive 2D-Wissensgraph-Ansicht und gesprochene deutsche Web-Speech-Audio-Erklärung (8 Kapitel).
- Constraint: Kein Backend-Lock-in; alle Daten sind Markdown-kompatibel und lokal im Browser persistiert.

## Brand Commitments

- Dual-Theme Liquid-Glass-Identität (`Weiss` Kristallglas & `Bunt` Holografisches Nachtglas) mit präziser Telemetrie-Ästhetik.
- Deutsche UI-Sprache mit exakter Fachterminologie (`FTS5`, `BM25`, `sqlite-vec`, `vec0`, `RRF`, `MCP`, `MOC`, `.indexignore`).

## Evidence on Hand

- 32 ausgearbeitete Implementierungskapitel in `src/data/tasksData.ts`.
- Beispiel-Vault-Notizen in `src/data/notesData.ts` und 8 Audio-Kapitel in `src/data/audioExplanationData.ts`.
- Keine Live-SQLite-Binärdatenbank im Browser; Retrieval-Metriken (`16.894` Dateien, `49,7k` Chunks, `23ms` p50-Latenz) repräsentieren die Ziel-Referenzarchitektur.

## Product Principles

1. **Retrieval-Präzision vor Dekoration**: Telemetrie, RRF-Rangfolgen und Pipeline-Status müssen auf den ersten Blick ablesbar sein.
2. **Kein Potemkin-UI**: Jeder Filter, Button und Simulator-Parameter muss eine echte, nachvollziehbare Zustandsänderung auslösen.
3. **Dual-Theme-Lesbarkeit**: Sowohl `Weiss`- als auch `Bunt`-Modus müssen strikte Kontrast- und Hierarchiestandards erfüllen, unabhängig vom OS-Farbschema.
4. **Tastatur- & Power-User-Effizienz**: Schneller Zugriff auf Suche, Checkliste und Modals per Tastatur (`Esc`, `Cmd+K`).

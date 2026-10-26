export interface TaskItem {
  id: string;
  chapterNumber: number;
  filename: string;
  title: string;
  phase: 'Phase 1: Fundament & Vault' | 'Phase 2: Indexierung & DB' | 'Phase 3: Hybride Retrieval Engine' | 'Phase 4: MCP Server & Protokoll' | 'Phase 5: Agent-Integrationen' | 'Phase 6: Intake, Caching & Graph' | 'Phase 7: Tuning, Ops & Wartung';
  priority: 'Kritisch' | 'Hoch' | 'Mittel';
  summary: string;
  deliverables: string[];
  codeSnippets?: {
    language: string;
    description: string;
    code: string;
  }[];
  notesCountEstimate?: string;
  completed?: boolean;
}

export const CHAPTER_TASKS: TaskItem[] = [
  {
    id: 'ch-01',
    chapterNumber: 1,
    filename: '01 wichtigste-erkenntnisse.md',
    title: 'Context Engineering & Leitprinzipien',
    phase: 'Phase 1: Fundament & Vault',
    priority: 'Kritisch',
    summary: 'Grundsatz: Notizen sind Rohstoff, Retrieval-Infrastruktur ist das Produkt. 100% Local-First ohne API-Kosten und ohne Datenabfluss.',
    deliverables: [
      'Leitprinzip "Context Engineering vor Notizanhäufung" im Projektteam etablieren',
      'Architekturziel definieren: Sub-30ms Latenz, SQLite-Single-File-DB, null externe Cloud-Abhängigkeiten',
      'Dualer Retrieval-Ansatz festlegen: BM25 (Exaktheit) + Vektor (Semantik) vereint durch Reciprocal Rank Fusion (RRF)'
    ],
    codeSnippets: [
      {
        language: 'bash',
        description: 'Retriever Test-Pipeline',
        code: '$ retriever search --hybrid "oauth token rotation"\n# 16.894 Files, 49.746 Chunks in 23ms, 0 API calls'
      }
    ]
  },
  {
    id: 'ch-02',
    chapterNumber: 2,
    filename: '02 so-verwenden-sie-diesen-leitfaden.md',
    title: 'Rollen-Routing & Leitfaden-Struktur',
    phase: 'Phase 1: Fundament & Vault',
    priority: 'Mittel',
    summary: 'Einstiegspfade je nach Vorwissen und Zielgruppe (Einsteiger, bestehende Vault-Besitzer, Systemingenieure, Enterprise).',
    deliverables: [
      'Eigenen Ziel-Pfad auswählen (z.B. Retrieval-System bauen vs. Claude Code anbinden)',
      'Konventionen prüfen: [Contract] (Konfigurationen), [Narrative] (Architektur), [Recipe] (Schritt-für-Schritt)'
    ]
  },
  {
    id: 'ch-03',
    chapterNumber: 3,
    filename: '03 warum-obsidian-für-ai-infrastruktur.md',
    title: 'Technologieentscheidung: Obsidian für KI',
    phase: 'Phase 1: Fundament & Vault',
    priority: 'Hoch',
    summary: 'Plaintext-Markdown, Local-First, bidirektionaler Wiki-Link-Graph und ein Ökosystem mit 2.500+ Plugins ohne Vendor-Lockin.',
    deliverables: [
      'Dateisystem als "Source of Truth" bestätigen (Index ist stets flüchtig & neu generierbar)',
      'Datenschutz-Garantie sicherstellen: Medizin-, Finanz- und API-Daten verlassen den Rechner nie',
      'Trennung definieren: Was Obsidian liefert (Editor & Graph) vs. was die externe Pipeline liefert (FTS5 + Vektoren + MCP)'
    ]
  },
  {
    id: 'ch-04',
    chapterNumber: 4,
    filename: '04 obsidian-mcp-einrichten.md',
    title: 'Schnellstart: Obsidian MCP Server Setup',
    phase: 'Phase 4: MCP Server & Protokoll',
    priority: 'Kritisch',
    summary: 'Verbindung des Vaults über Model Context Protocol (MCP) in 5 Minuten mit Claude Code, Codex CLI und Cursor.',
    deliverables: [
      'Installation des verifizierten npm-Pakets `obsidian-mcp@2` (Achtung vor Namenskollision mit `obsidian-mcp-server`)',
      'Konfiguration in `~/.claude.json` (bzw. Projekt-`.mcp.json`) mit absolutem Vault-Pfad',
      'Testabfrage durchführen: "Search my Obsidian vault for notes about..."',
      'Lese-Schreib-Grenzen prüfen: MCP liest (schreibgeschützt), Intake schreibt via Hooks/CLI'
    ],
    codeSnippets: [
      {
        language: 'bash',
        description: 'Claude Code MCP Setup',
        code: 'npm install -g obsidian-mcp\nclaude mcp add obsidian -s user -- npx -y obsidian-mcp@2 serve --vault notes=/absolute/path/to/vault'
      }
    ]
  },
  {
    id: 'ch-05',
    chapterNumber: 5,
    filename: '05 obsidian-cli-für-ai-workflows.md',
    title: 'Obsidian CLI (v1.12+) für AI-Automatisierung',
    phase: 'Phase 5: Agent-Integrationen',
    priority: 'Hoch',
    summary: 'Native Command Line Interface ab Obsidian 1.12 als GUI-Fernbedienung für Scripting, Vorlagen und Eigenschaften.',
    deliverables: [
      'CLI in Obsidian aktivieren (Einstellungen > Allgemein > Command line interface)',
      'CLI-Befehle für Intake-Automatisierung einrichten (`obsidian daily`, `obsidian file append`, `obsidian property set`)',
      'Klare Arbeitsteilung etablieren: CLI für Intake/Vorlagen/Metadaten, MCP für semantisches Hybrides Retrieval'
    ],
    codeSnippets: [
      {
        language: 'bash',
        description: 'Täglicher Briefing Hook via CLI',
        code: 'DATE=$(date +%Y-%m-%d)\nobsidian daily\nobsidian file append "Daily Notes/${DATE}.md" "## AI Summary\\n${SUMMARY}"'
      }
    ]
  },
  {
    id: 'ch-06',
    chapterNumber: 6,
    filename: '06 obsidian-agent-plugins.md',
    title: 'Eingebettete Agent-Plugins (Claudian & Agent Client)',
    phase: 'Phase 5: Agent-Integrationen',
    priority: 'Mittel',
    summary: 'Sidebar-Assistenten direkt in Obsidian: Claudian (Claude Code) und Agent Client (Claude, Codex, Gemini CLI über ACP).',
    deliverables: [
      'Vergleich durchführen: Externes Terminal-MCP (Multi-Repo & Full Retrieval) vs. Sidebar-Plugin (Editor-Kontext)',
      'Claudian / Agent Client für Schreib- und Revisions-Workflows evaluieren',
      'Berechtigungsmodi konfigurieren: YOLO vs. Safe vs. Plan-Modus mit Vault-Sicherheitsblockliste'
    ]
  },
  {
    id: 'ch-07',
    chapterNumber: 7,
    filename: '07 entscheidungsrahmen-obsidian-vs.-alternativen.md',
    title: 'Entscheidungsbaum & Skalierungsstufen',
    phase: 'Phase 1: Fundament & Vault',
    priority: 'Hoch',
    summary: 'Wann genügt eine einfache Ordnerstruktur, wann BM25 allein, und ab wann ist die volle hybride Retrieval-Pipeline zwingend?',
    deliverables: [
      'Vault-Größe analysieren: <50 Notizen (Grep), 50-500 (BM25 FTS5), 500-5.000 (Vektor + RRF), 5.000+ (Full Pipeline)',
      'Abgrenzung verifizieren: Tabellendaten in Datenbanken auslagern, Single-Project-Context in CLAUDE.md belassen',
      'Langzeitwert sichern: Domänenübergreifende Wissensakkumulation über Jahre hinweg planen'
    ]
  },
  {
    id: 'ch-08',
    chapterNumber: 8,
    filename: '08 mentales-modell-drei-ebenen.md',
    title: 'Das 3-Ebenen-Architekturmodell',
    phase: 'Phase 1: Fundament & Vault',
    priority: 'Kritisch',
    summary: 'Entkoppelte Schichten: 1. Intake Layer (Kuratierung), 2. Retrieval Layer (FTS5, Vec, RRF), 3. Integration Layer (MCP, Hooks, Skills).',
    deliverables: [
      'Schichtgrenzen im Code strikt trennen: Retriever weiß nichts über Routing, MCP weiß nichts über Notizursprung',
      'Fehlermodi je Ebene absichern (Intake = Rauschen/Dubletten, Retrieval = Ranking-Drift, Integration = Context Overflow)',
      'Unabhängige Wartbarkeit sicherstellen: Vektormodell tauschbar, ohne Notizstruktur zu brechen'
    ]
  },
  {
    id: 'ch-09',
    chapterNumber: 9,
    filename: '09 vault-architektur-für-ai-consumption.md',
    title: 'Vault-Architektur & .indexignore Konventionen',
    phase: 'Phase 1: Fundament & Vault',
    priority: 'Kritisch',
    summary: 'Präfix-Ordnerstruktur (00-inbox bis 08-attachments), YAML-Frontmatter-Schema und Chunking an H2-Grenzen (##).',
    deliverables: [
      'Nummerierte Ordner anlegen: `00-inbox`, `01-projects`, `02-areas`, `03-resources`, `05-signals` (12 Subdomänen), `07-templates`',
      '.indexignore anlegen: Templates, Attachments, .obsidian, sensible Ordner (Finanzen, Gesundheit) ausschließen',
      'Notizschema mit YAML Frontmatter definieren: `title`, `type`, `domain`, `tags`, `status`',
      'H2-Überschriften-Konvention für sauberes Chunken durchsetzen'
    ],
    codeSnippets: [
      {
        language: 'yaml',
        description: 'Standard Frontmatter Schema',
        code: '---\ntitle: "OAuth Token Rotation Patterns"\ntype: note\ndomain: security\ntags: [authentication, oauth, token-management]\nstatus: active\n---'
      }
    ]
  },
  {
    id: 'ch-10',
    chapterNumber: 10,
    filename: '10 plugin-ökosystem-für-ai-workflows.md',
    title: 'Plugin-Ökosystem & Bases-Migration',
    phase: 'Phase 7: Tuning, Ops & Wartung',
    priority: 'Mittel',
    summary: 'Empfohlene Plugins: Bases (Kern-Ersatz für Dataview), Templater, Linter, Git, Smart Connections v4.5. Störende Plugins ausschließen.',
    deliverables: [
      'Bases (ab Obsidian 1.9+) als modernen Standard für Tabellen- und Datenbankansichten nutzen',
      'Linter-Regeln für sequenzielle H1-H2-Hierarchien und saubere Leerzeilen konfigurieren',
      'Excalidraw, reine JSON-Kanban-Boards und leere Kalendernotizen aus dem Index ausschließen',
      'Smart Connections v4.5 für Editor-interne Vorschläge evaluieren'
    ]
  },
  {
    id: 'ch-11',
    chapterNumber: 11,
    filename: '11 embedding-modelle-auswahl-und-konfiguration.md',
    title: 'Embedding-Modell: Model2Vec potion-base-8M',
    phase: 'Phase 2: Indexierung & DB',
    priority: 'Kritisch',
    summary: 'minishlab/potion-base-8M: 256 Dimensionen, 30 MB, 500x schneller als Transformer, reine CPU/NumPy-Inference ohne PyTorch.',
    deliverables: [
      'Model2Vec in isoliertem venv installieren (`~/.claude/venvs/memory/`)',
      'Lazy-Loading und Batch-Verarbeitung (Batch-Größe 64 Chunks) implementieren',
      'Model-Hash-Tracking einbauen (Modellname + Vokabulargröße) für automatische Neuindexierung bei Modellwechsel',
      'Alternativen kennen: potion-base-32M (höhere Qualität), potion-multilingual-128M (101 Sprachen)'
    ],
    codeSnippets: [
      {
        language: 'python',
        description: 'Model2Vec Embedder Setup',
        code: 'from model2vec import StaticModel\nmodel = StaticModel.from_pretrained("minishlab/potion-base-8M")\nvecs = model.encode(["OAuth token rotation in FastAPI"])'
      }
    ]
  },
  {
    id: 'ch-12',
    chapterNumber: 12,
    filename: '12 volltextsuche-mit-fts5.md',
    title: 'Volltextsuche mit SQLite FTS5 (BM25)',
    phase: 'Phase 2: Indexierung & DB',
    priority: 'Kritisch',
    summary: 'FTS5 Virtual Table mit Spaltengewichtung: chunk_text (1.0), section H2 (0.5), heading_context (0.3). Perfekt für Bezeichner & Flags.',
    deliverables: [
      'FTS5-Tabelle mit `content=chunks` und `content_rowid=id` einrichten (kein doppelter Speicher)',
      'Spaltengewichtetes BM25-Ranking implementieren: `bm25(chunks_fts, 1.0, 0.5, 0.3)`',
      'FTS5-Synchronisation programmieren (`rebuild` bei Initiallauf, Einzelzeilen-Sync bei inkrementellem Lauf)',
      'Trigram-Tokenizer für CJK-Tresore als Option vorsehen'
    ],
    codeSnippets: [
      {
        language: 'sql',
        description: 'FTS5 Schema & BM25 Query',
        code: 'CREATE VIRTUAL TABLE chunks_fts USING fts5(\n    chunk_text, section, heading_context,\n    content=chunks, content_rowid=id\n);\n-- Query:\nSELECT c.id, c.file_path, c.chunk_text, bm25(chunks_fts, 1.0, 0.5, 0.3) AS score\nFROM chunks_fts JOIN chunks c ON chunks_fts.rowid = c.id\nWHERE chunks_fts MATCH ? ORDER BY score LIMIT 30;'
      }
    ]
  },
  {
    id: 'ch-13',
    chapterNumber: 13,
    filename: '13 vector-search-mit-sqlite-vec.md',
    title: 'Vektorsuche mit sqlite-vec (vec0)',
    phase: 'Phase 2: Indexierung & DB',
    priority: 'Kritisch',
    summary: 'sqlite-vec v0.1.7+: vec0 Virtual Table für 256-dim Vektoren, nativer DELETE-Support, KNN-Distanzbeschränkungen.',
    deliverables: [
      'sqlite-vec Extension laden (`enable_load_extension(True)`, `load_extension("vec0")`)',
      'Binäre Vektorserialisierung mit Python `struct.pack(f"{len(vec)}f", *vec)` implementieren',
      'KNN-Kosinusabfrage über `embedding MATCH ? AND k = ?` implementieren',
      'Graceful Degradation einbauen: Automatischer Fallback auf reines BM25, falls Extension fehlt'
    ],
    codeSnippets: [
      {
        language: 'sql',
        description: 'sqlite-vec Schema & KNN Query',
        code: 'CREATE VIRTUAL TABLE chunk_vecs USING vec0(\n    id INTEGER PRIMARY KEY,\n    embedding float[256]\n);\n-- KNN Query:\nSELECT cv.id, cv.distance, c.file_path, c.chunk_text\nFROM chunk_vecs cv JOIN chunks c ON cv.id = c.id\nWHERE embedding MATCH ? AND k = 30 ORDER BY distance;'
      }
    ]
  },
  {
    id: 'ch-14',
    chapterNumber: 14,
    filename: '14 reciprocal-rank-fusion-rrf.md',
    title: 'Reciprocal Rank Fusion (RRF k=60)',
    phase: 'Phase 3: Hybride Retrieval Engine',
    priority: 'Kritisch',
    summary: 'Parameterfreie Fusion: score(d) = Σ weight_i / (k + rank_i). Vereint Keyword- und Vektorergebnisse ohne Score-Kalibrierung.',
    deliverables: [
      'RRF-Formel mit Glättungskonstante k=60 implementieren',
      'Ergebnisse aus BM25 (Top 30) und Vektor (Top 30) aggregieren',
      'Tie-Breaking-Regeln definieren (Dual-Source-Treffer bevorzugen vor Single-Source)',
      'Interaktiven Fusion-Rechner zur Überprüfung extremer Rangunterschiede einbinden'
    ],
    codeSnippets: [
      {
        language: 'python',
        description: 'RRF Fusion Algorithmus',
        code: 'RRF_K = 60\nscore[cid] += weight / (RRF_K + rank)\n# Chunks in beiden Listen steigen stark nach oben!'
      }
    ]
  },
  {
    id: 'ch-15',
    chapterNumber: 15,
    filename: '15 die-vollständige-retrieval-pipeline.md',
    title: 'Die komplette End-to-End Retrieval Pipeline',
    phase: 'Phase 3: Hybride Retrieval Engine',
    priority: 'Kritisch',
    summary: 'BM25 (12ms) + Vector KNN (8ms) + RRF Fusion (3ms) + Token-Budget-Kürzung (<1ms) = ~23ms Gesamtlatenz bei 49.746 Chunks.',
    deliverables: [
      'Klasse `HybridRetriever` mit `search(query, limit=10, max_tokens=4000)` zusammenführen',
      'Gierige Token-Budget-Kürzung (4 Zeichen pro Token als Näherung) einbauen',
      'Vollständiges relationales Schema verknüpfen: chunks, chunks_fts, chunk_vecs, model_meta',
      'Graceful Degradation Pfad testen (Full -> BM25 only -> Error if DB missing)'
    ]
  },
  {
    id: 'ch-16',
    chapterNumber: 16,
    filename: '16 content-hashing-und-änderungserkennung.md',
    title: 'Änderungserkennung via mtime_ns',
    phase: 'Phase 2: Indexierung & DB',
    priority: 'Hoch',
    summary: 'Dateisystem-mtime_ns Vergleich (<100ms für 16.000 Dateien) vs. Voll-Content-Hashing (2-3s). Pragmatische Wahl für tägliche AI-Nutzung.',
    deliverables: [
      'Dateiscan mit `mtime_ns` implementieren: Erkennung von neuen, geänderten und gelöschten Dateien',
      'Löschlogik programmieren: Verknüpfte Chunks aus `chunks`, `chunk_vecs` und `chunks_fts` entfernen',
      'False-Positive-Toleranz akzeptieren (einige unkritische Extra-Embeddings für 30x schnellere Erkennung)'
    ]
  },
  {
    id: 'ch-17',
    chapterNumber: 17,
    filename: '17 inkrementelles-vs.-vollständiges-reindexing.md',
    title: 'Inkrementelles vs. Vollständiges Reindexing',
    phase: 'Phase 2: Indexierung & DB',
    priority: 'Hoch',
    summary: 'Inkrementell (<10s im Alltag) vs. Vollständig (~4 Min für 16.894 Dateien). Idempotenz und Wiederherstellung nach Abstürzen.',
    deliverables: [
      'CLI-Flag `--incremental` als täglichen Standard definieren',
      'CLI-Flag `--full` für Modellwechsel, Schemamigrationen und DB-Reparaturen implementieren',
      'Transaktionssicherheit und Idempotenz gewährleisten (alte Chunks löschen vor Neueinfügen)',
      'DB als abgeleitetes Artefakt behandeln (kein Backup der SQLite-Datei nötig, Quelltext liegt im Vault)'
    ]
  },
  {
    id: 'ch-18',
    chapterNumber: 18,
    filename: '18 credential-filtering-und-datengrenzen.md',
    title: 'Credential-Filtering & Datenschutzgrenzen',
    phase: 'Phase 2: Indexierung & DB',
    priority: 'Kritisch',
    summary: '25 Regex-Muster für API-Keys (sk-, sk-ant-, ghp_), JWTs, Private Keys vor dem Embedding durch [REDACTED:pattern] ersetzen.',
    deliverables: [
      'Regex-Filter für OpenAI, Anthropic, GitHub, AWS, JWT, SSH-Keys vor der Speicherung anwenden',
      'Semantischen Kontext erhalten: Ersetzen mit `[REDACTED:pattern_name]` statt Textlöschung',
      'Defense-in-Depth: Zusätzliche Filterung am Ausgang des MCP-Servers vor der Agentenausgabe',
      'Sensibilitätsebenen definieren (Öffentlich, Intern, Sensibel, Eingeschränkt)'
    ],
    codeSnippets: [
      {
        language: 'python',
        description: 'Credential Scrubbing',
        code: 'for pattern in CREDENTIAL_PATTERNS:\n    text = pattern.regex.sub(f"[REDACTED:{pattern.name}]", text)'
      }
    ]
  },
  {
    id: 'ch-19',
    chapterNumber: 19,
    filename: '19 mcp-serverarchitektur.md',
    title: 'MCP-Serverarchitektur (STDIO vs. HTTP)',
    phase: 'Phase 4: MCP Server & Protokoll',
    priority: 'Kritisch',
    summary: 'STDIO für persönliche Vaults, 4 Kern-Tools: obsidian_search, obsidian_read_note, obsidian_list_notes, obsidian_get_context.',
    deliverables: [
      'STDIO-JSON-RPC Transport für minimale Latenz und Prozesskopplung einsetzen',
      '4 Kern-Tools implementieren: search, read_note, list_notes, get_context',
      'Strikte Berechtigungsgrenzen: Read-only, Vault-Jail (Schutz vor ../../etc/passwd), Token-Limits',
      'Strukturierte Fehlermeldungen mit Lösungsvorschlägen zurückgeben'
    ]
  },
  {
    id: 'ch-20',
    chapterNumber: 20,
    filename: '20 claude-code-integration.md',
    title: 'Claude Code Integration (Hooks & Bridge)',
    phase: 'Phase 5: Agent-Integrationen',
    priority: 'Kritisch',
    summary: 'UserPromptSubmit-Hook für Kontextinjektion, PostToolUse-Hook für Erkenntniserfassung, obsidian_bridge.py Python-API.',
    deliverables: [
      'Server via `claude mcp add` in `~/.claude.json` registrieren',
      'UserPromptSubmit-Hook mit `obsidian-context.sh` via stdin JSON einbinden (1.500-2.000 Token-Budget)',
      'PostToolUse-Hook mit `capture-insight.sh` für große Tool-Ausgaben konfigurieren',
      'Python Bridge-Modul `obsidian_bridge.py` als Singleton für schnelle Abfragen bereitstellen',
      'Slash-Skill `/capture` zur manuellen Erkenntnisübernahme nach `00-inbox/` erstellen'
    ]
  },
  {
    id: 'ch-21',
    chapterNumber: 21,
    filename: '21 codex-cli-integration.md',
    title: 'Codex CLI Integration & AGENTS.md',
    phase: 'Phase 5: Agent-Integrationen',
    priority: 'Hoch',
    summary: 'Anbindung via ~/.codex/config.toml und Projekt-Anweisungen in AGENTS.md zur primären Vault-Konsultation.',
    deliverables: [
      'MCP-Server in `~/.codex/config.toml` eintragen mit Environment-Variablen',
      'AGENTS.md Richtlinien verfassen: Vor Code-Änderungen stets Obsidian-Vault abfragen',
      'Unterschiede zu Claude Code beachten: Sandbox-Modi & Freigaberichtlinien'
    ]
  },
  {
    id: 'ch-22',
    chapterNumber: 22,
    filename: '22 cursor-und-andere-tools.md',
    title: 'Cursor, Windsurf, Zed & CLI-Fallback',
    phase: 'Phase 5: Agent-Integrationen',
    priority: 'Mittel',
    summary: 'Konfiguration für Cursor (.cursor/mcp.json, .cursorrules), Windsurf, Continue.dev, Zed und universelles CLI-Fallback.',
    deliverables: [
      '.cursor/mcp.json und .cursorrules für automatische Vault-Suche konfigurieren',
      'Universal CLI-Wrapper `retriever_cli.py` für Tools ohne native MCP-Unterstützung bereitstellen'
    ]
  },
  {
    id: 'ch-23',
    chapterNumber: 23,
    filename: '23 prompt-caching-aus-strukturierten-notizen.md',
    title: 'Prompt-Caching aus strukturierten Notizen',
    phase: 'Phase 6: Intake, Caching & Graph',
    priority: 'Hoch',
    summary: 'Wiederverwendbare Kontextblöcke (Auth-Patterns, API-Conventions, Architecture) mit TTL vorab generieren und Token um 50% senken.',
    deliverables: [
      'Cache-Block-Definitionen mit TTLs (12h bis 168h) anlegen',
      'Cache-Invalidierung bei Vault-Dateimodifikation verknüpfen',
      'Tokenbudget-Strategie: 8.000 Gesamt = 1.500 System + 3.000 Cache + 2.000 Dynamisch + 1.500 Dialog'
    ]
  },
  {
    id: 'ch-24',
    chapterNumber: 24,
    filename: '24 komprimierte-zusammenfassungen-ausführlicher-ausgaben-erfassen.md',
    title: 'Komprimierte Ausgabenerfassung (PostToolUse)',
    phase: 'Phase 6: Intake, Caching & Graph',
    priority: 'Hoch',
    summary: 'Geprüftes Wissen für künftige Sitzungen: 5.000 Token Bash-Testausgaben auf 2-Zeiler zusammenfassen und im Vault sichern.',
    deliverables: [
      'PostToolUse-Hook für Bash-Tool-Ausgaben >2000 Zeichen einrichten',
      'Heuristiken implementieren: Testläufe (Bestanden/Fehlgeschlagen zählen), Stack-Traces (1. und letzter Frame)',
      'Komprimierte Notiz in `05-signals/` speichern für sitzungsübergreifenden Abruf'
    ]
  },
  {
    id: 'ch-25',
    chapterNumber: 25,
    filename: '25 signalaufnahme-und-triage-pipeline.md',
    title: 'Signalaufnahme & 4D-Triage-Pipeline',
    phase: 'Phase 6: Intake, Caching & Graph',
    priority: 'Kritisch',
    summary: 'Kuratierung vor Ingestion: Web Clipper, RSS, iOS Share Sheet, 4 Bewertungsdimensionen (Relevanz, Umsetzbarkeit, Tiefe, Autorität).',
    deliverables: [
      'Scoring-Formel implementieren: composite = (rel*0.35) + (act*0.25) + (dep*0.25) + (auth*0.15)',
      'Routing-Schwellenwerte festlegen: >=0.55 (Auto-Routing), 0.40-0.55 (Manuelle Review), <0.40 (Verwerfen)',
      '12 Domain-Ordner in `05-signals/` einrichten (ai-tooling, security, systems, programming, etc.)',
      'Obsidian Web Clipper (v1.6+) und iOS Share Extension für nahtlose Erfassung konfigurieren'
    ]
  },
  {
    id: 'ch-26',
    chapterNumber: 26,
    filename: '26 knowledge-graph-muster.md',
    title: 'Knowledge Graph Muster & Maps of Content (MOCs)',
    phase: 'Phase 6: Intake, Caching & Graph',
    priority: 'Hoch',
    summary: 'Wiki-Links als absichtliche semantische Brücken, MOCs als Indexnotizen, Graph-Traversierung zur Kontexterweiterung.',
    deliverables: [
      'Maps of Content (MOCs) für Hauptdomänen erstellen (z.B. Authentication & Security MOC)',
      'Kontexterweiterung durch Link-Traversierung (Tiefe 1) vorbereiten',
      'Anti-Patterns vermeiden: Verwaiste Cluster, Tag-Wildwuchs (>500 Tags auf 20-50 konsolidieren), leere Link-Notizen'
    ]
  },
  {
    id: 'ch-27',
    chapterNumber: 27,
    filename: '27 developer-workflow-rezepte.md',
    title: 'Developer Workflow Rezepte',
    phase: 'Phase 6: Intake, Caching & Graph',
    priority: 'Mittel',
    summary: 'Tägliche Muster: Morgenkontext laden, Inline-Recherche während des Codens (/capture), PR-Review-Vorbereitung mit Vault-Wissen.',
    deliverables: [
      'Morgenroutine einrichten: "Search my vault for notes about [current project] updated in the last week"',
      'Micro-Captures beim Coden etablieren (schnelle Notizen zu Framework-Eigenheiten)',
      'Code-Review-Vorbereitung: Abruf historischer Architekturentscheidungen vor dem PR'
    ]
  },
  {
    id: 'ch-28',
    chapterNumber: 28,
    filename: '28 performance-tuning.md',
    title: 'Performance-Tuning (WAL, mmap, FTS5 optimize)',
    phase: 'Phase 7: Tuning, Ops & Wartung',
    priority: 'Hoch',
    summary: 'PRAGMA journal_mode=WAL (paralleles Lesen/Schreiben), mmap_size 256MB, FTS5 optimize B-Tree Merging.',
    deliverables: [
      'SQLite WAL-Modus aktivieren für verzögerungsfreie parallele Lesezugriffe während Indexierungs-Schreibvorgängen',
      'Memory-mapped I/O konfigurieren (`PRAGMA mmap_size=268435456`)',
      'FTS5 `optimize` nach vollständigen Indexläufen ausführen zur B-Tree-Kompaktierung',
      'Batch-Größe (64 vs. 128) je nach Hardware-RAM abstimmen'
    ],
    codeSnippets: [
      {
        language: 'sql',
        description: 'High-Performance Pragmas',
        code: 'PRAGMA journal_mode=WAL;\nPRAGMA mmap_size=268435456;\nPRAGMA busy_timeout=5000;\nINSERT INTO chunks_fts(chunks_fts) VALUES("optimize");'
      }
    ]
  },
  {
    id: 'ch-29',
    chapterNumber: 29,
    filename: '29 fehlerbehebung.md',
    title: 'Fehlerbehebung & Notfall-Leitfaden',
    phase: 'Phase 7: Tuning, Ops & Wartung',
    priority: 'Hoch',
    summary: 'Lösungen für Index-Drift, Modell-Hash-Mismatch, FTS5-Fragmentierung, MCP-Timeouts, SQLITE_BUSY und sqlite-vec Ladefehler.',
    deliverables: [
      'Warmup-Abfrage beim MCP-Serverstart implementieren (verhindert MCP Client Timeout durch Lazy Model Load)',
      'SQLITE_BUSY durch `busy_timeout=5000` und Single-Writer-Architektur lösen',
      'Integritätsprüfung und Rebuild-Workflow dokumentieren: `PRAGMA integrity_check` -> `--full` Reindex'
    ]
  },
  {
    id: 'ch-30',
    chapterNumber: 30,
    filename: '30 migrationsleitfaden.md',
    title: 'Migrationsleitfaden (Apple Notes, Notion, Google Docs)',
    phase: 'Phase 7: Tuning, Ops & Wartung',
    priority: 'Mittel',
    summary: 'Schritt-für-Schritt Migration aus proprietären Silos in Markdown mit YAML Frontmatter und sauberer Ordnerzuordnung.',
    deliverables: [
      'Apple Notes Migration via Pandoc/HTML-Export nach `00-inbox/` strukturieren',
      'Notion Export (Markdown & CSV) bereinigen: Tabellen in YAML umwandeln, relative Bilder sichern',
      'Goldene Regel beachten: Nur Inhalte migrieren, niemals alte Vektoren (stets frischer Reindex mit neuem Modell)'
    ]
  },
  {
    id: 'ch-31',
    chapterNumber: 31,
    filename: '31 änderungsprotokoll.md',
    title: 'Audit & Versionshistorie (2026)',
    phase: 'Phase 7: Tuning, Ops & Wartung',
    priority: 'Mittel',
    summary: 'Aktueller Versionsstand 2026: Obsidian 1.13.7 (Stable+Beta), MCP Spezifikation 2026-07-28 (Zustandsloser Kern), sqlite-vec v0.1.9, Model2Vec v0.8.2.',
    deliverables: [
      'Versionsstände im Stack abgleichen: Obsidian 1.13.7, sqlite-vec v0.1.9, mcpvault v0.15.0',
      'MCP-Spezifikation 2026-07-28 beachten (zustandsloser Kern, MCP Apps, Tasks API)',
      'Audit-Prüfung: Keine veralteten Namenskollisionen im Setup verwenden'
    ]
  },
  {
    id: 'ch-32',
    chapterNumber: 32,
    filename: '32 referenzen.md',
    title: 'Referenzen, Papers & Quellverweise',
    phase: 'Phase 7: Tuning, Ops & Wartung',
    priority: 'Mittel',
    summary: 'Wissenschaftliche und technische Quellen: Cormack et al. (RRF SIGIR 2009), Model2Vec arXiv 2025, MCP Spec, sqlite-vec.',
    deliverables: [
      'RRF Paper (Cormack et al. 2009, k=60) als mathematisches Fundament archivieren',
      'Model2Vec Paper (van Dongen et al. 2025) für statische Embeddings referenzieren',
      'Dokumentationslinks zu MCP und sqlite-vec bereitstellen'
    ]
  }
];

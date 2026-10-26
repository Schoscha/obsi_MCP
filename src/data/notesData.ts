export interface VaultNote {
  id: string;
  filename: string;
  title: string;
  folder: string;
  updated: string;
  tags: string[];
  content: string;
}

export const SAMPLE_VAULT_NOTES: Record<string, VaultNote> = {
  '15 die-vollständige-retrieval-pipeline.md': {
    id: 'note-15',
    filename: '15 die-vollständige-retrieval-pipeline.md',
    title: 'Die vollständige Retrieval Pipeline (Kapitel 15)',
    folder: '01-projects',
    updated: 'Heute, 17:42',
    tags: ['hybrid', 'pipeline', 'rrf', 'mcp'],
    content: `---
title: "Die vollständige Hybrid-Retrieval-Pipeline"
chapter: 15
status: active
domain: systems
type: architecture
updated: 2026-09-22
---

# 15 Die vollständige Retrieval Pipeline

Die hybride Retrieval-Pipeline führt die Stärken von **Volltextsuche (SQLite FTS5)** und **semantischer Vektorsuche (sqlite-vec)** über **Reciprocal Rank Fusion (RRF)** zusammen.

## 1. Architektur-Fluss
\`\`\`
User Query / Agent Hook
       │
       ├────────────────────────┬────────────────────────┐
       ▼                        ▼                        ▼
[BM25 Query]             [Vector Embedding]       [Direct Match]
SQLite FTS5 Match        Model2Vec (256d)         Exact File/Tag
Top-60 Kandidaten        Top-60 KNN Cosine        Direct Hits
       │                        │                        │
       └────────────────────────┼────────────────────────┘
                                ▼
                   [Reciprocal Rank Fusion]
                   Score = Σ w_i / (60 + rank_i)
                                ▼
                     [Token-Budget Truncation]
                     Max 4.000 Tokens Kontext
                                ▼
                     MCP Result an LLM (Claude)
\`\`\`

## 2. Latenz-Budget (Gemessen auf M2 / Linux CPU)
- FTS5 BM25 Abfrage: **3–7 ms**
- Model2Vec Embedding-Generierung: **8–14 ms**
- sqlite-vec KNN Kosinus-Suche: **2–4 ms**
- RRF Fusion & Re-Ranking: **< 1 ms**
- **Gesamte End-to-End-Latenz (p50): 23 ms**

## 3. Graceful Degradation
Sollte die Vektordatenbank gesperrt sein oder das Modell noch aufwärmen, fällt die Pipeline unterbrechungsfrei auf reine FTS5-Volltextsuche zurück.`,
  },
  '04 obsidian-mcp-einrichten.md': {
    id: 'note-04',
    filename: '04 obsidian-mcp-einrichten.md',
    title: 'Obsidian MCP Server Schnellstart (Kapitel 04)',
    folder: '03-resources',
    updated: 'Heute, 15:20',
    tags: ['mcp', 'setup', 'claude-code', 'stdio'],
    content: `---
title: "Obsidian MCP Server Einrichtung"
chapter: 04
domain: ai-tooling
status: active
---

# 04 Obsidian MCP Server Einrichtung

## Wichtige Klarstellung: NPM Namenskollision
Es existieren zwei unterschiedliche Pakete auf NPM:
1. \`obsidian-mcp\` (StevenStavrakis) -> **DAS RICHTIGE PAKET**. Greift direkt auf Markdown-Dateien im Dateisystem zu. Benötigt kein laufendes Obsidian und kein Drittanbieter-Plugin.
2. \`obsidian-mcp-server\` (cyanheads) -> Verwendet das Obsidian Local REST API Plugin. Erfordert, dass Obsidian geöffnet ist und ein API-Key konfiguriert wurde.

## Registrierung in Claude Code (~/.claude.json)
\`\`\`bash
# MCP-Server global hinzufügen
claude mcp add obsidian-vault -- npx -y obsidian-mcp /pfad/zu/deinem/vault
\`\`\`

*Achtung:* Nicht in \`~/.claude/settings.json\` eintragen, da Claude Code MCP-Konfigurationen dort stillschweigend ignoriert!`,
  },
  '11 embedding-modelle-auswahl.md': {
    id: 'note-11',
    filename: '11 embedding-modelle-auswahl.md',
    title: 'Embedding-Modelle Auswahl: Model2Vec (Kapitel 11)',
    folder: '03-resources',
    updated: 'Heute, 11:08',
    tags: ['model2vec', 'embeddings', 'local-first'],
    content: `---
title: "Model2Vec für Ultra-Fast CPU Embeddings"
chapter: 11
domain: ai-engineering
status: active
---

# 11 Embedding-Modelle Auswahl: Warum Model2Vec?

Herkömmliche Transformer-Embeddings (z.B. \`text-embedding-3-small\` oder \`all-MiniLM-L6-v2\`) haben massive Nachteile im lokalen Agenten-Workflow:
- Cloud-APIs kosten Geld, sind netzwerkabhängig und verletzen Vault-Privatsphäre.
- Lokale PyTorch/SentenceTransformers wiegen Hunderte Megabytes und verbrauchen signifikant RAM/GPU.

## Der Durchbruch: Model2Vec (\`potion-base-8M\`)
- **Modellgröße:** Nur 30 MB!
- **Dimensionen:** 256 Dimensionen (perfekt für sqlite-vec)
- **Laufzeit:** Reines NumPy / CPU. Kein PyTorch erforderlich!
- **Geschwindigkeit:** 500x schneller als BERT-Inferenz auf derselben CPU.
- **Indexierungszeit:** 16.000 Notizen in unter 4 Minuten vollständig vektorisiert.`,
  },
  '14 reciprocal-rank-fusion-rrf.md': {
    id: 'note-14',
    filename: '14 reciprocal-rank-fusion-rrf.md',
    title: 'Reciprocal Rank Fusion RRF (Kapitel 14)',
    folder: '03-resources',
    updated: 'Gestern, 21:37',
    tags: ['math', 'rrf', 'algorithms'],
    content: `---
title: "Mathematik hinter Reciprocal Rank Fusion"
chapter: 14
domain: algorithms
status: active
---

# 14 Reciprocal Rank Fusion (RRF)

RRF löst das Kernproblem hybrider Suchen: **Wie kombiniert man unvergleichbare Punktwerte?**

## Formel
$$\\text{RRF\\_Score}(d) = \\sum_{m \\in M} \\frac{w_m}{k + r_m(d)}$$

Wobei:
- $M$: Menge der Suchsysteme (FTS5 BM25, sqlite-vec Cosine KNN)
- $r_m(d)$: Rang des Dokuments $d$ im System $m$ (1-basiert)
- $k$: Glättungskonstante (Standard: 60)
- $w_m$: Gewicht des Systems (Standard: 1.0)

## Warum $k=60$?
$k=60$ stammt aus der Originalarbeit von Cormack, Clarke & Büttcher (SIGIR 2009). Es verhindert, dass Ausreißer auf Platz 1 eines einzelnen Systems das Gesamtranking dominieren, und belohnt Chunks, die in **beiden** Systemen unter den Top 20 landen.`,
  },
  '20 claude-code-integration.md': {
    id: 'note-20',
    filename: '20 claude-code-integration.md',
    title: 'Claude Code Integration & Hooks (Kapitel 20)',
    folder: '01-projects',
    updated: 'Gestern, 19:14',
    tags: ['claude-code', 'hooks', 'cli'],
    content: `---
title: "Claude Code Integration mit UserPromptSubmit Hooks"
chapter: 20
domain: ai-tooling
status: active
---

# 20 Claude Code Hooks für automatische Kontextinjektion

## Das Geheimnis: \`UserPromptSubmit\`
In Claude Code können Hooks in \`~/.claude/hooks.json\` definiert werden.
- **Nur der Hook \`UserPromptSubmit\`** darf Kontext beisteuern: Sein \`stdout\` wird dem Benutzerprompt transparent hinzugefügt.
- Die Injektion sollte auf **1.500 Tokens** gedeckelt sein, um den Prompt Cache nicht unnötig zu invalidieren.

\`\`\`json
{
  "UserPromptSubmit": [
    {
      "command": "python3 /usr/local/bin/obsidian_context_hook.py"
    }
  ]
}
\`\`\``,
  },
  '09 vault-architektur-ai.md': {
    id: 'note-09',
    filename: '09 vault-architektur-ai.md',
    title: 'Vault-Architektur & .indexignore (Kapitel 09)',
    folder: '02-areas',
    updated: 'Gestern, 16:50',
    tags: ['vault', 'structure', 'indexignore'],
    content: `---
title: "Vault-Architektur für AI Consumption"
chapter: 09
domain: systems
status: active
---

# 09 Vault-Architektur für AI Consumption

## Ordnerhierarchie
- \`00-inbox/\`: Temporäre Ablage neuer Ideen
- \`01-projects/\`: Aktive Vorhaben mit Status
- \`02-areas/\`: Fortlaufende Verantwortungsbereiche
- \`03-resources/\`: Strukturierte Wissenssammlungen
- \`04-archive/\`: Abgeschlossene Projekte
- \`05-signals/\`: 12 Domänenordner für kuratierte Signale
- \`06-daily/\`: Tägliche Journaleinträge
- \`07-templates/\`: Vorlagen (ausgeschlossen!)
- \`08-attachments/\`: Bilder und Binärdateien

## .indexignore Konvention
Wie \`.gitignore\` verhindert \`.indexignore\` das Indizieren sensibler Daten (Gesundheit, Passwörter, private Verträge).`,
  },
};

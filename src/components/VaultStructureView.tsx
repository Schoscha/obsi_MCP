import { useState } from 'react';
import { FolderTree, FileText, Database, ShieldAlert, FileCode, Check, Copy } from 'lucide-react';

export const VaultStructureView = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const indexIgnoreContent = `# Obsidian internal
.obsidian/

# Templates contain placeholders, not content
07-templates/

# Binary attachments
08-attachments/

# Personal health/medical notes
02-areas/health/

# Financial records
02-areas/finance/personal/

# Career documents (resumes, salary data)
02-areas/career/private/`;

  const yamlSchema = `---
title: "OAuth Token Rotation Patterns"
type: note           # note | signal | project | moc | daily
domain: security     # primary domain for routing
tags:
  - authentication
  - oauth
  - token-management
created: 2026-01-15
updated: 2026-02-28
source: ""           # URL if captured from external source
status: active       # active | archived | draft
---

## Token Rotation Strategy
The rotation interval depends on the threat model...

## Implementation with refresh_token
The OAuth 2.0 refresh token flow requires...

## Error Handling: Expired Tokens
When a token expires mid-request...`;

  const dbSchema = `-- 1. Chunk Content & Metadata
CREATE TABLE chunks (
    id INTEGER PRIMARY KEY,
    file_path TEXT NOT NULL,
    section TEXT NOT NULL,
    chunk_text TEXT NOT NULL,
    heading_context TEXT DEFAULT '',
    mtime_ns INTEGER NOT NULL,
    embedded_at REAL NOT NULL
);

CREATE INDEX idx_chunks_file ON chunks(file_path);
CREATE INDEX idx_chunks_mtime ON chunks(mtime_ns);

-- 2. FTS5 Virtual Table for BM25 Search (Content-Synced)
CREATE VIRTUAL TABLE chunks_fts USING fts5(
    chunk_text,
    section,
    heading_context,
    content=chunks,
    content_rowid=id
);

-- 3. sqlite-vec Virtual Table for Vector KNN (256-dim)
CREATE VIRTUAL TABLE chunk_vecs USING vec0(
    id INTEGER PRIMARY KEY,
    embedding float[256]
);

-- 4. Model Metadata for Compatibility Tracking
CREATE TABLE model_meta (
    key TEXT PRIMARY KEY,
    value TEXT
);`;

  return (
    <div className="space-y-5 font-mono text-xs text-slate-200">
      {/* Folder Structure Card */}
      <div className="hud-card p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <FolderTree className="w-4 h-4" />
            Empfohlene Vault-Ordnerstruktur (Kapitel 09 & 25)
          </div>
          <span className="text-slate-400 text-[11px]">16.894 Dateien Standard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/40 p-3.5 rounded-lg border border-slate-800 space-y-1.5 leading-relaxed">
            <div className="text-orange-300 font-bold mb-1">vault/</div>
            <div className="text-slate-300 pl-3">├── <span className="text-cyan-400">00-inbox/</span> <span className="text-slate-500"># Neue Erfassungen vor Triage</span></div>
            <div className="text-slate-300 pl-3">├── <span className="text-cyan-400">01-projects/</span> <span className="text-slate-500"># Aktive Projektnotizen</span></div>
            <div className="text-slate-300 pl-3">├── <span className="text-cyan-400">02-areas/</span> <span className="text-slate-500"># Dauerhafte Verantwortungsbereiche</span></div>
            <div className="text-slate-300 pl-3">├── <span className="text-cyan-400">03-resources/</span> <span className="text-slate-500"># Nach Themen sortiert</span></div>
            <div className="text-slate-400 pl-7">├── programming/ · security/ · ai-engineering/</div>
            <div className="text-slate-300 pl-3">├── <span className="text-cyan-400">04-archive/</span> <span className="text-slate-500"># Abgeschlossene Projekte</span></div>
            <div className="text-slate-300 pl-3">├── <span className="text-orange-400">05-signals/</span> <span className="text-slate-500"># 12 kuratierte Domänen-Ordner</span></div>
            <div className="text-slate-400 pl-7">├── ai-tooling/ · systems/ · web/ · data/ · security/ ...</div>
            <div className="text-slate-300 pl-3">├── <span className="text-cyan-400">06-daily/</span> <span className="text-slate-500"># Tägliche Briefings & Notizen</span></div>
            <div className="text-slate-300 pl-3">├── <span className="text-rose-400">07-templates/</span> <span className="text-rose-400/80">[VOM INDEX AUSGESCHLOSSEN]</span></div>
            <div className="text-slate-300 pl-3">├── <span className="text-rose-400">08-attachments/</span> <span className="text-rose-400/80">[VOM INDEX AUSGESCHLOSSEN]</span></div>
            <div className="text-slate-300 pl-3">└── <span className="text-emerald-400 font-bold">.indexignore</span> <span className="text-slate-500"># Pfad-Ausschlussregeln</span></div>
          </div>

          {/* Indexignore block */}
          <div className="bg-black/40 p-3.5 rounded-lg border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-rose-300 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  .indexignore (Datenschutzgrenzen)
                </span>
                <button
                  onClick={() => handleCopy(indexIgnoreContent, 'ignore')}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  {copiedSection === 'ignore' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="text-[11px] text-slate-300 font-mono-code overflow-x-auto p-2 bg-[#0d0918] rounded border border-slate-800/80 leading-relaxed">
                <code>{indexIgnoreContent}</code>
              </pre>
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Verhindert, dass persönliche Gesundheits-, Finanz- oder Template-Dateien gechunkt oder in Vektoren konvertiert werden.
            </div>
          </div>
        </div>
      </div>

      {/* YAML Frontmatter Contract & Chunking Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* YAML Schema */}
        <div className="hud-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-purple-500/20 pb-2">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Notiz-Schema & H2-Chunking-Konvention
            </span>
            <button
              onClick={() => handleCopy(yamlSchema, 'yaml')}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              {copiedSection === 'yaml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="text-[11px] text-slate-300 font-mono-code overflow-x-auto p-3 bg-[#0d0918] rounded border border-slate-800/80 leading-relaxed max-h-72 overflow-y-auto">
            <code>{yamlSchema}</code>
          </pre>
          <div className="text-[10px] text-slate-400 pt-1">
            <strong>Chunking-Faustregel:</strong> Teilt an H2-Überschriften (##). Jeder Abschnitt behandelt 1 Konzept (30–2000 Zeichen).
          </div>
        </div>

        {/* SQLite & sqlite-vec Database Schema */}
        <div className="hud-card p-4 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-purple-300 font-bold border-b border-purple-500/20 pb-2">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              SQLite 83-MB Datenbankschema (Kapitel 15)
            </span>
            <button
              onClick={() => handleCopy(dbSchema, 'db')}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              {copiedSection === 'db' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="text-[11px] text-slate-300 font-mono-code overflow-x-auto p-3 bg-[#0d0918] rounded border border-slate-800/80 leading-relaxed max-h-72 overflow-y-auto">
            <code>{dbSchema}</code>
          </pre>
          <div className="text-[10px] text-slate-400 pt-1">
            Reine Single-File SQLite-DB (<code className="text-cyan-300">vectors.db</code>). WAL-Modus für verzögerungsfreies Lesen während inkrementellem Indexieren.
          </div>
        </div>
      </div>
    </div>
  );
};

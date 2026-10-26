import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Compass,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Terminal,
} from 'lucide-react';

export const AnalysisConceptView = () => {
  return (
    <div className="space-y-6 text-slate-200 font-mono">
      {/* Hero Overview */}
      <div className="hud-card p-6 rounded-xl border border-orange-500/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-500/20 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-orange-400 font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              Strategische Systemanalyse 2026
            </div>
            <h3 className="text-xl font-bold font-display text-white mt-1">
              Sinn, Sinnhaftigkeit & Umsetzbarkeit des Obsidian MCP + Hybrid Retrieval Systems
            </h3>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Kombinierte Version: 100% Umsetzbar</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          Die vorliegende 16.194 Wörter starke Referenz von Blake Crosley beschreibt keinen theoretischen Entwurf, sondern ein in der Praxis erprobtes Hochleistungssystem für die Ära moderner KI-Coding-Agenten (Claude Code, Codex CLI, Cursor). Hier ist die detaillierte Analyse der Sinnhaftigkeit, der Machbarkeit und des exakten Bauplans.
        </p>
      </div>

      {/* Grid: Sinn & Sinnhaftigkeit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Sinn & Warum das Konzept genial ist */}
        <div className="hud-card p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm border-b border-cyan-500/20 pb-2">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            1. DER SINN: "Context Engineering statt Notizenanhäufung"
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Ein Obsidian-Vault mit 16.000 Notizen ohne Retrieval ist eine "Write-Only"-Datenbank: Man schreibt hinein, findet aber im Moment der Implementierung nichts wieder.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2 bg-black/30 p-2 rounded border border-slate-800">
              <span className="text-orange-400 font-bold">›</span>
              <span><strong>Notizen sind nur Rohstoff:</strong> Das eigentliche Produkt ist die <em>Retrieval-Infrastruktur</em>, die dem LLM punktgenau (Sub-25ms Latenz) den passenden Kontext zuspielt.</span>
            </li>
            <li className="flex items-start gap-2 bg-black/30 p-2 rounded border border-slate-800">
              <span className="text-cyan-400 font-bold">›</span>
              <span><strong>Hybride Synergie:</strong> BM25 findet exakte Flags (`--incremental`) und Funktionsnamen (`_rrf_fuse`), während die Vektorsuche synonyme Konzepte aufspürt ("wie behandle ich Session-Abläufe").</span>
            </li>
            <li className="flex items-start gap-2 bg-black/30 p-2 rounded border border-slate-800">
              <span className="text-purple-400 font-bold">›</span>
              <span><strong>100% Local-First & Zero-Cost:</strong> Model2Vec läuft lokal auf CPU in NumPy, SQLite speichert alles in einer einzigen 83-MB-Datei. Keine OpenAI-API-Gebühren, kein Datenschutzrisiko.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Machbarkeitsprüfung */}
        <div className="hud-card p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-orange-300 font-bold text-sm border-b border-orange-500/20 pb-2">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            2. DIE MACHBARKEIT: "Ist das so umzusetzen?"
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            <strong className="text-emerald-400">Ja, die kombinierte Version ist vollständig und robust realisierbar.</strong> Alle Komponenten greifen sauber ineinander:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2 bg-black/30 p-2 rounded border border-slate-800">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>SQLite + FTS5:</strong> Standardmäßig in jeder Python-/Betriebssystem-Umgebung enthalten. Bietet ultraschnelles BM25-Ranking mit Spaltengewichten.</span>
            </li>
            <li className="flex items-start gap-2 bg-black/30 p-2 rounded border border-slate-800">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Model2Vec (potion-base-8M):</strong> Reines NumPy-Modell (30 MB). Keine CUDA- oder PyTorch-Treiber erforderlich, 500-mal schneller als BERT.</span>
            </li>
            <li className="flex items-start gap-2 bg-black/30 p-2 rounded border border-slate-800">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>MCP-Protokoll:</strong> Direkte JSON-RPC Anbindung über STDIO für Claude Code, Codex CLI und Cursor.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Critical Pitfalls and Mitigations */}
      <div className="hud-card p-5 rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-sm border-b border-rose-500/20 pb-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Kritische Fallstricke aus dem Audit 2026 & Wie wir sie lösen
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-black/40 p-3 rounded-lg border border-rose-900/40">
            <div className="text-rose-400 font-bold mb-1">1. NPM Namenskollision</div>
            <p className="text-slate-400 leading-relaxed font-sans">
              `obsidian-mcp` (StevenStavrakis, dateibasiert, richtig!) vs. `obsidian-mcp-server` (cyanheads REST-API, benötigt Plugin & Key). Unser Setup verwendet strikt das korrekte Paket `obsidian-mcp@2`.
            </p>
          </div>

          <div className="bg-black/40 p-3 rounded-lg border border-amber-900/40">
            <div className="text-amber-400 font-bold mb-1">2. Claude Code Konfiguration</div>
            <p className="text-slate-400 leading-relaxed font-sans">
              Server müssen in `~/.claude.json` oder der Projekt-`.mcp.json` via `claude mcp add` registriert werden – `~/.claude/settings.json` ignoriert MCP-Server stillschweigend!
            </p>
          </div>

          <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/40">
            <div className="text-cyan-400 font-bold mb-1">3. Hook-Ereignisse</div>
            <p className="text-slate-400 leading-relaxed font-sans">
              Kontextinjektion funktioniert NUR über `UserPromptSubmit` (dessen stdout erreicht das Modell). `PreToolUse` oder `PostToolUse` können kein Modell-Kontext verkleinern, aber komprimierte Logs sichern.
            </p>
          </div>

          <div className="bg-black/40 p-3 rounded-lg border border-purple-900/40">
            <div className="text-purple-400 font-bold mb-1">4. Lazy Load Timeout</div>
            <p className="text-slate-400 leading-relaxed font-sans">
              Der erste Modell-Download/Start dauert 2-4 Sekunden. Ein Warmup-Query beim Serverstart (`retriever.search("warmup", limit=1)`) verhindert Client-Timeouts.
            </p>
          </div>
        </div>
      </div>

      {/* Design Concept: Strict adherence to vorlage.jpg */}
      <div className="hud-card-orange p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-orange-500/30 pb-2">
          <div className="flex items-center gap-2 text-orange-300 font-bold text-sm">
            <Compass className="w-4 h-4 text-orange-400" />
            Design-Konzept: Strikte Umsetzung der Vorlage (vorlage.jpg)
          </div>
          <span className="text-[10px] uppercase font-mono text-orange-400 bg-orange-950/60 border border-orange-500/40 px-2 py-0.5 rounded">
            Pixel-Präzise Übertragung
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Die vom Benutzer hochgeladene Vorlage (<code className="text-orange-300">vorlage.jpg</code>) definiert ein dunkles, hochmodernes Cyberpunk-/Synthwave-Dashboard mit warmem Sonnenuntergang, leuchtenden Audio-/Frequenzwellen und runden HUD-Messuhren. Unser Konzept übernimmt jedes dieser Elemente für den Obsidian-Tresor:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#18112c] p-3 rounded-lg border border-purple-500/30">
            <div className="text-orange-400 font-bold mb-1">Sonnenuntergangs-Bergfront & Equalizer</div>
            <p className="text-slate-400 font-sans">
              Breites Banner mit warmem Sonnenhalo, Scherenschnitt-Tannen und einer dynamisch animierten cyanfarbenen Frequenzwelle, die die Aktivitäten der BM25- und Vektor-Pipelines visualisiert.
            </p>
          </div>

          <div className="bg-[#18112c] p-3 rounded-lg border border-purple-500/30">
            <div className="text-cyan-400 font-bold mb-1">Kreisförmige HUD-Uhren & Tachometer</div>
            <p className="text-slate-400 font-sans">
              Replikation der runden Messinstrumente (<code className="text-white">176 - 28</code>, <code className="text-white">28 ✓</code>, <code className="text-white">35%</code>, <code className="text-white">60%</code>, <code className="text-white">275</code>) für Vault-Metriken, Chunks (49.746), DB-Größe (83 MB) und Latenzen (23ms).
            </p>
          </div>

          <div className="bg-[#18112c] p-3 rounded-lg border border-purple-500/30">
            <div className="text-purple-400 font-bold mb-1">Dunkle Glassmorphismus-HUD-Karten</div>
            <p className="text-slate-400 font-sans">
              Tiefdunkler Obsidian-Hintergrund (#0b0914) mit dezenten leuchtenden Rändern, Monospace-Ziffern und einem futuristischen Steuerungs-Dock am Bildschirmboden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

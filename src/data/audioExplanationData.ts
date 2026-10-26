export interface AudioChapter {
  id: string;
  title: string;
  subtitle: string;
  durationEst: string;
  text: string;
}

export const AUDIO_EXPLANATION_CHAPTERS: AudioChapter[] = [
  {
    id: 'intro',
    title: '1. Das Kernproblem herkömmlicher KI-Notizen',
    subtitle: 'Warum reine Stichwortsuche und reine Vektorsuche bisher scheitern',
    durationEst: '1:10',
    text: `Willkommen zur Audio-Erklärung des Obsidian Hybrid Retrieval Systems 2026.

Wenn du ein KI-Modell wie Claude oder GPT nach Inhalten in deinen Notizen fragst, gab es bisher zwei Extreme, die beide fehlschlagen:

Erstens: Die reine Stichwortsuche mit Grep oder Standard-Suchleisten. Suchst du nach der Absicherung von Benutzersitzungen, deine Notiz heißt aber OAuth Refresh Token Rotation, findest du genau null Treffer, obwohl der Inhalt exakt passt.

Zweitens: Die reine semantische Vektorsuche. Sie versteht zwar Konzepte, scheitert aber kläglich an exakten Bezeichnern. Suchst du nach einer bestimmten Funktion wie authMiddleware_v2 oder einem Fehlercode, findet die Vektorsuche oft beliebige allgemeine Programmiernotizen, aber nicht die exakte Codezeile.

Dazu kommt der Cloud-Zwang: Herkömmliche Vektor-Datenbanken schicken deine privaten Notizen ins Internet, kosten Geld und sind mit 200 bis 500 Millisekunden quälend langsam.`,
  },
  {
    id: 'solution',
    title: '2. Die Lösung: Die hybride 2026er Pipeline',
    subtitle: '100% lokal, 23 Millisekunden p50 Latenz und null Cloud-Kosten',
    durationEst: '1:20',
    text: `Die hier implementierte Architektur löst dieses Dilemma durch eine hybride Dual-Pipeline, die vollständig auf deinem lokalen Rechner läuft.

Sobald du eine Frage stellst, passiert folgendes in unter 25 Millisekunden:

Schritt eins: SQLite FTS5 führt eine blitzschnelle BM25-Volltextsuche nach exakten Wörtern, Begriffen und IDs durch. Das dauert nur 3 bis 5 Millisekunden.

Schritt zwei: Zeitgleich berechnet Model2Vec ein 256-dimensionales Embedding deiner Frage und sqlite-vec führt eine Kosinus-Ähnlichkeitssuche durch. Das dauert 8 bis 14 Millisekunden.

Beide Teilsysteme liefern jeweils ihre Top 60 Treffer ab. Und genau hier kommt das mathematische Herzstück ins Spiel: Die Reciprocal Rank Fusion.`,
  },
  {
    id: 'model2vec',
    title: '3. Model2Vec: Das 30-Megabyte-Wunder',
    subtitle: 'Kein PyTorch, kein GPU-Zwang – 500x schnellere Vektoren auf reiner CPU',
    durationEst: '1:05',
    text: `Der absolute technologische Durchbruch in diesem Konzept ist Model2Vec mit dem Modell potion-base-8M.

Frühere Vektor-Modelle brauchten gigantische Bibliotheken wie PyTorch mit hunderten Megabytes an Abhängigkeiten und viel Arbeitsspeicher.

Model2Vec wiegt gerade einmal 30 Megabyte. Es läuft mit purem NumPy direkt auf deiner normalen Computer-CPU. Es ist 500-mal schneller als herkömmliche BERT-Modelle.

Ein Vault mit 16.000 Notizen wird damit in unter 4 Minuten komplett indiziert. Es gibt keine API-Kosten, keine Datenweitergabe und keine Netzwerkabhängigkeit.`,
  },
  {
    id: 'rrf',
    title: '4. Reciprocal Rank Fusion (RRF mit k = 60)',
    subtitle: 'Wie zwei völlig unvergleichbare Scores perfekt vereint werden',
    durationEst: '1:15',
    text: `Das größte mathematische Problem bei hybriden Suchen war bisher: Wie vergleicht man einen BM25-Score von beispielsweise 14,2 mit einer Kosinus-Ähnlichkeit von 0,87? Normierungen schlagen hier oft fehl.

Die Reciprocal Rank Fusion löst das genial über Ränge statt über absolute Punktwerte.

Die Formel lautet: Eins geteilt durch sechzig plus den BM25-Rang, plus eins geteilt durch sechzig plus den Vektor-Rang.

Die Konstante k gleich 60 sorgt dafür, dass ein einzelner Ausreißer das Ranking nicht verzerrt. Landet eine Notiz aber in beiden Ranglisten weit oben, katapultiert die RRF-Formel sie unangefochten auf Platz eins. Das liefert eine Treffsicherheit, die reine Vektorsuchen meilenweit übertrifft.`,
  },
  {
    id: 'mcp-claude',
    title: '5. Obsidian MCP & Claude Code Integration',
    subtitle: 'Headless Dateisystem-Zugriff und Token-Budgetierung',
    durationEst: '1:10',
    text: `Der letzte Baustein ist die Anbindung an deinen KI-Agenten über das Model Context Protocol.

Der Server obsidian-mcp läuft im lokalen STDIO-Modus ohne offene Web-Ports. Er greift direkt auf die Markdown-Dateien zu – Obsidian muss dafür nicht einmal gestartet sein.

Über den Hook UserPromptSubmit in Claude Code werden die relevanten Abschnitte automatisch dem Prompt vorangestellt.

Dabei wird ein striktes Token-Budget von maximal 1.500 bis 4.000 Tokens eingehalten. So bleibt der Prompt Cache von Claude intakt, Kosten werden minimiert und das Modell leidet nicht unter Kontext-Überladung.

Über die .indexignore-Datei schützt du gleichzeitig private Notizen, Finanzen oder Passwörter vor der Indizierung.`,
  },
  {
    id: 'cockpit',
    title: '6. Deine Steuerzentrale im Cockpit',
    subtitle: 'Weiss/Bunt Design, 32 Kapitel Taskliste und Live-Simulator',
    durationEst: '0:50',
    text: `Dieses Cockpit bündelt die gesamte Architektur in einer eleganten 3D-Glasoberfläche:

Du kannst jederzeit zwischen dem reinweissen Kristall-Eisglas und dem holografischen Bunt-Modus wechseln.

Im RRF-Simulator kannst du live testen, wie sich die Trefferliste verändert, wenn du an den Gewichten für Volltext und Vektoren drehst.

Und in der 32-Kapitel-Taskliste findest du jeden einzelnen Implementierungsschritt zum Abhaken, inklusive Code-Vorlagen und 1-Klick-Export für deinen eigenen Obsidian-Vault.`,
  },
];

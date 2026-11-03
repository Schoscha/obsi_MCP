import { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Headphones,
  ListMusic,
  Gauge,
} from 'lucide-react';
import { AUDIO_EXPLANATION_CHAPTERS } from '../data/audioExplanationData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeMode: 'weiss' | 'bunt';
}

export const GlassAudioPlayerModal = ({ isOpen, onClose, themeMode }: Props) => {
  const isWeiss = themeMode === 'weiss';
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<any>(null);

  const currentChapter =
    AUDIO_EXPLANATION_CHAPTERS[currentChapterIdx] || AUDIO_EXPLANATION_CHAPTERS[0];

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const germanVoices = voices.filter(
          (v) => v.lang.startsWith('de') || v.lang.startsWith('DE')
        );
        const preferred =
          germanVoices.find((v) => v.name.includes('Google') || v.name.includes('Natural')) ||
          germanVoices[0] ||
          voices[0];
        if (preferred) setSelectedVoice(preferred);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearInterval(progressTimerRef.current);
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        clearInterval(progressTimerRef.current);
        setIsPlaying(false);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const parseDurationSeconds = (durStr: string) => {
    const parts = durStr.split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    return 95;
  };

  const totalChapterSec = parseDurationSeconds(currentChapter.durationEst);
  const elapsedSec = Math.round((progressPercent / 100) * totalChapterSec);
  const elapsedFormatted = `${Math.floor(elapsedSec / 60)}:${String(elapsedSec % 60).padStart(2, '0')}`;

  const playChapter = (index: number, startRate = rate, muted = isMuted) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    clearInterval(progressTimerRef.current);

    const chapter = AUDIO_EXPLANATION_CHAPTERS[index];
    if (!chapter) return;

    const utterance = new SpeechSynthesisUtterance(chapter.text);
    utterance.lang = 'de-DE';
    utterance.rate = startRate;
    utterance.volume = muted ? 0 : 1;
    if (selectedVoice) utterance.voice = selectedVoice;

    let charCount = 0;
    const totalChars = chapter.text.length;

    utterance.onboundary = (e) => {
      if (e.charIndex !== undefined) {
        charCount = e.charIndex;
        setProgressPercent(Math.min(Math.round((charCount / totalChars) * 100), 100));
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgressPercent(100);
      clearInterval(progressTimerRef.current);

      if (index < AUDIO_EXPLANATION_CHAPTERS.length - 1) {
        setTimeout(() => {
          setCurrentChapterIdx(index + 1);
          playChapter(index + 1, startRate, muted);
        }, 800);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      clearInterval(progressTimerRef.current);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setCurrentChapterIdx(index);
    setProgressPercent(0);

    const intervalMs = Math.max(Math.floor((chapter.text.length * 50) / (100 * startRate)), 200);
    let p = 0;
    progressTimerRef.current = setInterval(() => {
      p += 1;
      if (p <= 98) setProgressPercent((prev) => Math.max(prev, p));
    }, intervalMs);
  };

  const togglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      clearInterval(progressTimerRef.current);
      setIsPlaying(false);
    } else {
      playChapter(currentChapterIdx, rate, isMuted);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (isPlaying) {
      playChapter(currentChapterIdx, rate, nextMuted);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < AUDIO_EXPLANATION_CHAPTERS.length - 1) {
      const nextIdx = currentChapterIdx + 1;
      setCurrentChapterIdx(nextIdx);
      if (isPlaying) playChapter(nextIdx, rate, isMuted);
      else setProgressPercent(0);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      const prevIdx = currentChapterIdx - 1;
      setCurrentChapterIdx(prevIdx);
      if (isPlaying) playChapter(prevIdx, rate, isMuted);
      else setProgressPercent(0);
    }
  };

  const handleRateChange = () => {
    const rates = [1.0, 1.25, 1.5, 0.9];
    const curIdx = rates.indexOf(rate);
    const nextRate = rates[(curIdx + 1) % rates.length];
    setRate(nextRate);
    if (isPlaying) {
      playChapter(currentChapterIdx, nextRate, isMuted);
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearInterval(progressTimerRef.current);
    setIsPlaying(false);
    onClose();
  };

  const bars = [
    12, 28, 45, 60, 35, 70, 85, 95, 55, 75, 90, 65, 40, 80, 100, 70, 50, 85, 60, 45, 75, 30, 50,
    20,
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 animate-in fade-in duration-150"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl max-h-[92vh] rounded flex flex-col overflow-hidden border shadow-2xl transition-colors duration-150 ${
          isWeiss
            ? 'bg-[#f0f7f5] border-[#bdd6cf] text-[#06201b]'
            : 'bg-[#0b1715] border-[#16302b] text-[#ecfdf5]'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isWeiss ? 'bg-[#e4f0ec] border-[#bdd6cf]' : 'bg-[#07100e] border-[#16302b]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center bg-[#34d399] text-[#041311]">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/30">
                  AUDIO TELEMETRY // DEUTSCH
                </span>
                <span className="text-[11px] font-mono text-[#689187]">
                  KAPITEL {currentChapterIdx + 1} / {AUDIO_EXPLANATION_CHAPTERS.length}
                </span>
              </div>
              <h2
                id="audio-modal-title"
                className="text-base sm:text-lg font-bold font-display uppercase tracking-tight mt-0.5"
              >
                Obsidian Hybrid Retrieval & MCP System Briefing
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Ton einschalten' : 'Stummschalten'}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isWeiss
                  ? 'bg-[#f0f7f5] text-[#06201b] border-[#bdd6cf]'
                  : 'bg-[#0e1d1a] text-[#b2d8ce] border-[#16302b] hover:text-[#ecfdf5]'
              }`}
              title={isMuted ? 'Ton einschalten' : 'Stummschalten'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-[#34d399]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#22d3ee]" />
              )}
            </button>

            <button
              onClick={handleRateChange}
              className={`px-2.5 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
                isWeiss
                  ? 'bg-[#f0f7f5] text-[#06201b] border-[#bdd6cf]'
                  : 'bg-[#0e1d1a] text-[#22d3ee] border-[#16302b]'
              }`}
              title="Geschwindigkeit anpassen"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{rate}x</span>
            </button>

            <button
              onClick={handleClose}
              aria-label="Audio-Player schließen"
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isWeiss
                  ? 'border-[#bdd6cf] hover:bg-[#d7e8e2] text-[#06201b]'
                  : 'border-[#16302b] hover:bg-[#132824] text-[#b2d8ce]'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Waveform & Player Deck */}
        <div
          className={`p-5 border-b flex flex-col items-center justify-center relative overflow-hidden ${
            isWeiss ? 'bg-[#e4f0ec]/50 border-[#bdd6cf]' : 'bg-[#07100e] border-[#16302b]'
          }`}
        >
          {/* Animated Waveform Visualizer */}
          <div className="h-14 w-full max-w-lg flex items-center justify-center gap-1.5 px-4 mb-3">
            {bars.map((barH, i) => {
              const activeHeight = isPlaying ? Math.max(15, barH * (0.4 + (i % 5) * 0.15)) : 14;
              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-sm transition-all duration-150 ${
                    isPlaying
                      ? i % 3 === 0
                        ? 'bg-[#22d3ee]'
                        : 'bg-[#34d399]'
                      : isWeiss
                      ? 'bg-[#bdd6cf]'
                      : 'bg-[#16302b]'
                  }`}
                  style={{
                    height: `${activeHeight}%`,
                    animation: isPlaying ? `pulse 1.${(i % 4) + 2}s infinite ease-in-out` : 'none',
                  }}
                />
              );
            })}
          </div>

          {/* Current Chapter Title & Subtitle */}
          <div className="text-center max-w-xl mb-4 px-2">
            <h3 className="text-base sm:text-lg font-bold font-display">
              {currentChapter.title}
            </h3>
            <p className={`text-xs mt-1 ${isWeiss ? 'text-[#3b6e63]' : 'text-[#689187]'}`}>
              {currentChapter.subtitle}
            </p>
          </div>

          {/* Progress Bar with scrubber */}
          <div className="w-full max-w-md flex items-center gap-3 mb-4 text-xs font-mono text-[#689187]">
            <span>{elapsedFormatted}</span>

            <div
              className={`flex-1 h-1.5 rounded overflow-hidden relative ${
                isWeiss ? 'bg-[#bdd6cf]' : 'bg-[#16302b]'
              }`}
            >
              <div
                className="h-full transition-all duration-200 bg-[#34d399]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span>{currentChapter.durationEst}</span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevChapter}
              disabled={currentChapterIdx === 0}
              aria-label="Vorheriges Kapitel"
              className={`p-2 rounded border transition-colors cursor-pointer ${
                currentChapterIdx === 0
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : isWeiss
                  ? 'border-[#bdd6cf] hover:bg-[#e4f0ec] text-[#06201b]'
                  : 'border-[#16302b] hover:bg-[#0e1d1a] text-[#ecfdf5]'
              }`}
              title="Vorheriges Kapitel"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Abspielen'}
              className="w-12 h-12 rounded flex items-center justify-center transition-colors cursor-pointer bg-[#34d399] hover:bg-[#10b981] text-[#041311]"
              title={isPlaying ? 'Pause' : 'Abspielen'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextChapter}
              disabled={currentChapterIdx === AUDIO_EXPLANATION_CHAPTERS.length - 1}
              aria-label="Nächstes Kapitel"
              className={`p-2 rounded border transition-colors cursor-pointer ${
                currentChapterIdx === AUDIO_EXPLANATION_CHAPTERS.length - 1
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : isWeiss
                  ? 'border-[#bdd6cf] hover:bg-[#e4f0ec] text-[#06201b]'
                  : 'border-[#16302b] hover:bg-[#0e1d1a] text-[#ecfdf5]'
              }`}
              title="Nächstes Kapitel"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Split: Chapter Playlist (Left) & Spoken Transcript (Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div
            className={`w-full md:w-80 border-b md:border-b-0 md:border-r p-4 overflow-y-auto space-y-1.5 ${
              isWeiss ? 'bg-[#e4f0ec]/40 border-[#bdd6cf]' : 'bg-[#0e1d1a] border-[#16302b]'
            }`}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#689187] font-bold px-2 mb-2 flex items-center justify-between">
              <span>KAPITELÜBERSICHT</span>
              <ListMusic className="w-3.5 h-3.5" />
            </div>

            {AUDIO_EXPLANATION_CHAPTERS.map((chap, idx) => {
              const isSelected = idx === currentChapterIdx;
              return (
                <div
                  key={chap.id}
                  onClick={() => {
                    setCurrentChapterIdx(idx);
                    playChapter(idx, rate, isMuted);
                  }}
                  className={`p-2.5 rounded cursor-pointer text-xs transition-colors flex items-center justify-between gap-2 border ${
                    isSelected
                      ? 'bg-[#34d399]/15 border-[#34d399] font-bold'
                      : isWeiss
                      ? 'border-transparent hover:bg-[#e4f0ec] text-[#3b6e63]'
                      : 'border-transparent hover:bg-[#07100e] text-[#b2d8ce]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] shrink-0 ${
                        isSelected
                          ? 'bg-[#34d399] text-[#041311]'
                          : isWeiss
                          ? 'bg-[#f0f7f5] text-[#3b6e63] border border-[#bdd6cf]'
                          : 'bg-[#07100e] text-[#689187] border border-[#16302b]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="truncate font-mono text-[11px]">
                      {chap.title.replace(/^\d+\.\s*/, '')}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#689187] shrink-0">
                    {chap.durationEst}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Spoken Text Transcript Drawer */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#689187]">
              <span className="uppercase tracking-[0.12em] text-[10px] font-bold">
                GESPROCHENER TEXT (TRANSKRIPT)
              </span>
              <span className="text-[11px]">
                {selectedVoice ? selectedVoice.name : 'System-Stimme (de-DE)'}
              </span>
            </div>

            <div
              className={`p-4 rounded border text-xs sm:text-sm leading-relaxed whitespace-pre-line font-mono ${
                isWeiss
                  ? 'bg-[#e4f0ec]/50 border-[#bdd6cf] text-[#06201b]'
                  : 'bg-[#07100e] border-[#16302b] text-[#ecfdf5]'
              }`}
            >
              {currentChapter.text}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#689187] font-mono">
              <span>Web Speech API · Lokale Sprachausgabe</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    AUDIO_EXPLANATION_CHAPTERS.map((c) => `# ${c.title}\n\n${c.text}`).join(
                      '\n\n---\n\n'
                    )
                  );
                }}
                className="text-[#34d399] hover:underline cursor-pointer"
              >
                Volltext kopieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Download,
  Sparkles,
  Check,
  FileText,
  Video,
  Film,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: {
    id: string;
    title: string;
    startTime: number;
    endTime: number;
    durationSeconds: number;
    viralityScore: number;
    subtitleStyle?: string;
    summary?: string;
    renderedVerticalUrl?: string;
    renderedVideoUrl?: string;
    subtitleSrtUrl?: string;
    videoProject?: {
      sourceUrl?: string;
    };
  };
}

export default function VideoPlayerModal({ isOpen, onClose, clip }: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitleStyle, setSubtitleStyle] = useState<'karaoke_pop' | 'mr_beast' | 'minimal_clean' | 'neon_cyber'>(
    (clip.subtitleStyle as any) || 'karaoke_pop'
  );

  // Render & Download state
  const [isRendering, setIsRendering] = useState(false);
  const [renderedData, setRenderedData] = useState<{
    verticalMp4?: string;
    standardMp4?: string;
    subtitlesSrt?: string;
  } | null>(
    clip.renderedVerticalUrl
      ? {
          verticalMp4: clip.renderedVerticalUrl,
          standardMp4: clip.renderedVideoUrl,
          subtitlesSrt: clip.subtitleSrtUrl,
        }
      : null
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Synchronized subtitle tokens
  const sampleWords = [
    { text: '99%', start: 0.0, end: 0.8 },
    { text: 'OF', start: 0.8, end: 1.1 },
    { text: 'DEVELOPERS', start: 1.1, end: 1.8 },
    { text: 'ARE', start: 1.8, end: 2.1 },
    { text: 'BUILDING', start: 2.1, end: 2.7 },
    { text: 'AI', start: 2.7, end: 3.0 },
    { text: 'AGENTS', start: 3.0, end: 3.7 },
    { text: 'COMPLETELY', start: 3.7, end: 4.4 },
    { text: 'BACKWARDS.', start: 4.4, end: 5.2 },
    { text: 'CONTEXT', start: 5.3, end: 5.9 },
    { text: 'DEGRADATION', start: 5.9, end: 6.8 },
    { text: 'IS', start: 6.8, end: 7.0 },
    { text: 'THE', start: 7.0, end: 7.2 },
    { text: 'REAL', start: 7.2, end: 7.6 },
    { text: 'KILLER.', start: 7.6, end: 8.4 },
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= clip.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, clip.durationSeconds]);

  if (!isOpen) return null;

  const handleRenderClip = async () => {
    setIsRendering(true);
    try {
      const res = await fetch(`/api/clips/${clip.id}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'vertical' }),
      });

      const data = await res.json();
      if (data.success && data.downloads) {
        setRenderedData(data.downloads);
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error('Error rendering clip:', err);
    } finally {
      setIsRendering(false);
    }
  };

  const getSubtitleClass = (style: string) => {
    switch (style) {
      case 'mr_beast':
        return 'font-black tracking-wider uppercase text-yellow-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] text-xl';
      case 'minimal_clean':
        return 'font-medium tracking-normal text-white bg-black/60 px-3 py-1 rounded-md text-sm backdrop-blur-sm';
      case 'neon_cyber':
        return 'font-bold uppercase tracking-widest text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] text-lg';
      case 'karaoke_pop':
      default:
        return 'font-extrabold uppercase text-white drop-shadow-md text-lg';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-slate-300 hover:text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 9:16 Vertical Reel Player Preview */}
        <div className="md:w-1/2 bg-black flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative w-[270px] h-[480px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 flex flex-col justify-between">
            {/* Background Simulated or Real Video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900 to-indigo-950 flex items-center justify-center overflow-hidden">
              {renderedData?.verticalMp4 ? (
                <video
                  ref={videoRef}
                  src={renderedData.verticalMp4}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                  alt="Frame"
                  className="w-full h-full object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
            </div>

            {/* Top Header Bar */}
            <div className="relative z-10 p-3 flex items-center justify-between text-white/90 text-xs">
              <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-md text-[10px] font-mono">
                9:16 {clip.durationSeconds}s
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-500 font-bold text-[10px]">
                {clip.viralityScore} Virality
              </span>
            </div>

            {/* Subtitle Animated Overlay */}
            <div className="relative z-10 px-4 text-center my-auto">
              <div className={getSubtitleClass(subtitleStyle)}>
                {sampleWords.map((word, idx) => {
                  const isActive = currentTime >= word.start && currentTime <= word.end;
                  return (
                    <span
                      key={idx}
                      className={`inline-block mx-1 transition-transform duration-100 ${
                        isActive ? 'scale-125 text-yellow-400 font-extrabold underline' : 'opacity-90'
                      }`}
                    >
                      {word.text}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls Bar inside phone frame */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 to-transparent">
              <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(currentTime / clip.durationSeconds) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-white text-xs">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <span className="font-mono text-[11px] text-white/80">
                  {currentTime.toFixed(1)}s / {clip.durationSeconds}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Configuration & Download Action Panel */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">
                FFmpeg Clip & Subtitle Studio
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">{clip.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{clip.summary}</p>
            </div>

            {/* Subtitle Styling Presets */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Animated Subtitle Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'karaoke_pop', label: 'Karaoke Pop', desc: 'Active word bounce & color fill' },
                  { id: 'mr_beast', label: 'Mr. Beast Bold', desc: 'High impact yellow & heavy stroke' },
                  { id: 'minimal_clean', label: 'Minimal Clean', desc: 'Understated translucent background' },
                  { id: 'neon_cyber', label: 'Neon Cyber', desc: 'Glowing electric cyan text' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSubtitleStyle(s.id as any)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      subtitleStyle === s.id
                        ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200">{s.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs mb-5 space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Start Time:</span>
                <span className="font-mono text-slate-200 font-bold">{clip.startTime}s</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>End Time:</span>
                <span className="font-mono text-slate-200 font-bold">{clip.endTime}s</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Duration:</span>
                <span className="font-mono text-indigo-400 font-bold">{clip.durationSeconds}s</span>
              </div>
            </div>
          </div>

          {/* Action / Download Area */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            {renderedData ? (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Real Video Rendered with FFmpeg & Subtitles Ready!</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={renderedData.verticalMp4}
                    download={`${clip.title.slice(0, 20)}_9x16.mp4`}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Download 9:16 MP4</span>
                  </a>

                  <a
                    href={renderedData.subtitlesSrt}
                    download={`${clip.title.slice(0, 20)}.srt`}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Download .SRT</span>
                  </a>
                </div>
              </div>
            ) : (
              <button
                onClick={handleRenderClip}
                disabled={isRendering}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isRendering ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Rendering with FFmpeg...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-4 h-4" />
                    <span>Render Video Clip with FFmpeg</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Close Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

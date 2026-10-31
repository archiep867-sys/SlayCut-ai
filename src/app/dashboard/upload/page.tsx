'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Video,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Play,
  FileText,
  Scissors,
  ArrowRight,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function UploadExtractPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'sample'>('sample');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('podcast');
  const [selectedSample, setSelectedSample] = useState<'podcast' | 'keynote'>('podcast');

  // Processing simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [extractedProject, setExtractedProject] = useState<any | null>(null);

  const steps = [
    { label: 'Demuxing Audio & Generating Acoustic Waveforms', duration: 1200 },
    { label: 'Neural Speech-to-Text & Speaker Diarization', duration: 1500 },
    { label: 'Evaluating 5-Factor Virality & Retention Curvature', duration: 1600 },
    { label: 'Synthesizing Platform Captions & Karaoke Subtitles', duration: 1200 },
  ];

  const handleStartExtraction = async () => {
    setIsProcessing(true);
    setProcessStep(0);

    // Simulate animated step progression
    for (let i = 0; i < steps.length; i++) {
      setProcessStep(i);
      await new Promise((r) => setTimeout(r, steps[i].duration));
    }

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle || (selectedSample === 'podcast' ? 'Frontier AI Agents Masterclass' : 'From 0 to $10M ARR Keynote'),
          videoType,
          sampleType: selectedSample,
          sourceUrl: videoUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExtractedProject(data.project);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[11px] font-bold border border-indigo-500/30">
            Extraction Studio
          </span>
          <span className="text-xs text-slate-400">Explainable Virality Engine</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Upload Long Video or Podcast
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Our content intelligence pipeline parses transcripts, identifies high-retention moments, calculates multi-factor virality scores, and produces platform-ready reels.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('sample')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'sample'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚡️ Instant Demo Samples
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'upload'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Upload Local File
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'url'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Import URL
        </button>
      </div>

      {/* Form / Selection Container */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6">
        {/* Sample Selector */}
        {activeTab === 'sample' && (
          <div className="space-y-4">
            <label className="text-xs font-semibold text-slate-300 block">
              Choose Pre-Configured High-Value Recording
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedSample('podcast')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSample === 'podcast'
                    ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                    Podcast Interview (42m)
                  </span>
                  {selectedSample === 'podcast' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  The Trillion Dollar AI Agent Architecture
                </h4>
                <p className="text-xs text-slate-400">
                  Deep technical conversation covering context degradation, 7-turn recursive loops, and epistemic checkpoints.
                </p>
              </div>

              <div
                onClick={() => setSelectedSample('keynote')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSample === 'keynote'
                    ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                    Keynote Lecture (52m)
                  </span>
                  {selectedSample === 'keynote' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  From 0 to $10M ARR: B2B SaaS Playbook
                </h4>
                <p className="text-xs text-slate-400">
                  Contrarian pricing, why saving people time is a weak pitch, and how to sell catastrophe insurance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Drag & Drop */}
        {activeTab === 'upload' && (
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-8 text-center transition-colors bg-slate-950/40">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white mb-1">
              Drag & drop long-form video or podcast audio
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Supports MP4, MOV, WebM, MP3, WAV up to 2GB.
            </p>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors">
              Browse Local Files
            </button>
          </div>
        )}

        {/* URL Import */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">
              YouTube Video or Podcast Stream URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Title & Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Project / Episode Title (Optional)
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="e.g. Episode 42: Scaling AI Agent Trajectories"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Content Category
            </label>
            <select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="podcast">Podcast Interview (2+ Speakers)</option>
              <option value="keynote">Keynote / Solo Lecture</option>
              <option value="youtube">YouTube Long Video</option>
              <option value="webinar">Technical Webinar</option>
            </select>
          </div>
        </div>

        {/* Progress Stepper (Visible during extraction) */}
        {isProcessing && (
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-300 flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                <span>Content Intelligence Pipeline Running...</span>
              </span>
              <span className="font-mono text-slate-400">
                Step {processStep + 1} of {steps.length}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((processStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-300 font-mono">
              ▶ {steps[processStep]?.label}
            </p>
          </div>
        )}

        {/* Result Callout (When complete) */}
        {extractedProject && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-300">
                  Extraction Complete: {extractedProject.clips?.length || 3} Viral Clips Extracted!
                </h4>
                <p className="text-[11px] text-slate-400">
                  Scored, formatted with subtitles, and packaged for TikTok, Reels & LinkedIn.
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/dashboard/clips')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <span>Inspect Clips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Start Button */}
        {!extractedProject && (
          <button
            onClick={handleStartExtraction}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Processing Intelligence Pipeline...</span>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>Run Intelligent Clip Extraction</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

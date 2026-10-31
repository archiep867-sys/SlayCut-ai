'use client';

import React, { useState, useRef } from 'react';
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
  FileVideo,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function UploadExtractPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upload' | 'sample' | 'url'>('upload');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoType, setVideoType] = useState('podcast');
  const [selectedSample, setSelectedSample] = useState<'podcast' | 'keynote'>('podcast');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [extractedProject, setExtractedProject] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = [
    { label: 'Demuxing Audio & Generating Speech Stream via FFmpeg', duration: 1200 },
    { label: 'Neural Speech-to-Text with Word Timestamps', duration: 1500 },
    { label: '5-Factor Virality & Retention Curvature Analysis', duration: 1600 },
    { label: 'Synthesizing Platform Captions & Generating Subtitles (.SRT)', duration: 1200 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
      setErrorMessage(null);
    }
  };

  const handleStartExtraction = async () => {
    setIsProcessing(true);
    setProcessStep(0);
    setErrorMessage(null);

    try {
      let res: Response;

      if (activeTab === 'upload') {
        if (!selectedFile) {
          setErrorMessage('Please select a video or audio file first.');
          setIsProcessing(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', videoTitle || selectedFile.name);
        formData.append('videoType', videoType);

        setStatusMessage('Uploading and extracting audio stream via FFmpeg...');
        res = await fetch('/api/videos', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Sample or URL
        setStatusMessage('Processing media and running AI extraction pipeline...');
        res = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: videoTitle || (selectedSample === 'podcast' ? 'Frontier AI Agents Masterclass' : 'From 0 to $10M ARR Keynote'),
            videoType,
            sampleType: selectedSample,
            sourceUrl: videoUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }),
        });
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setExtractedProject(data.project);
        confetti({
          particleCount: 110,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMessage(data.error || 'Failed to process video project.');
      }
    } catch (err: any) {
      console.error('Extraction error:', err);
      setErrorMessage(err?.message || 'Error occurred during processing.');
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
            FFmpeg & Whisper Extraction Studio
          </span>
          <span className="text-xs text-slate-400">Real Video Upload & Audio Demuxing</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Upload Long Video or Podcast
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload your raw video. FFmpeg demuxes high-clarity 16kHz speech, extracts timestamped transcripts, identifies retention peaks, and generates ready-to-download reels.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'upload'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📁 Upload Video File
        </button>
        <button
          onClick={() => setActiveTab('sample')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'sample'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚡️ Sample Presets
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

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form / Selection Container */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6">
        {/* Real File Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,audio/mp3,audio/wav,audio/mpeg"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-8 text-center transition-colors bg-slate-950/40 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center mb-3">
                {selectedFile ? <FileVideo className="w-6 h-6 text-emerald-400" /> : <Upload className="w-6 h-6" />}
              </div>

              {selectedFile ? (
                <div>
                  <p className="text-sm font-bold text-emerald-300 mb-0.5">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for FFmpeg Processing
                  </p>
                  <p className="text-[11px] text-indigo-400 mt-2 font-medium">
                    Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-white mb-1">
                    Drag & drop video or audio file here, or browse
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    Supports MP4, MOV, WebM, MP3, WAV up to 200MB.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors pointer-events-none"
                  >
                    Select Video File
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

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
                  Technical breakdown of context degradation, 7-turn recursive loops, and epistemic state snapshots.
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

        {/* URL Import */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">
              YouTube Video or Podcast Stream URL
            </label>
            <div className="relative">
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
        )}

        {/* Title & Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="e.g. Scaling AI Agent Trajectories in Production"
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
                <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                <span>FFmpeg & AI Pipeline Running...</span>
              </span>
              <span className="font-mono text-slate-400">Processing Stream</span>
            </div>

            <p className="text-xs text-slate-300 font-mono">
              ▶ {statusMessage || 'Processing video file with FFmpeg and speech model...'}
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
                  Processing Complete: {extractedProject.clips?.length || 3} Viral Clips Ready!
                </h4>
                <p className="text-[11px] text-slate-400">
                  Engine: {extractedProject.transcriptionEngine} • Subtitles & 9:16 ready.
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
              <span>Demuxing & Transcribing Media...</span>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                <span>Run FFmpeg Demux & AI Extraction</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

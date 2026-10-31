'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Scissors,
  TrendingUp,
  BarChart3,
  Calendar,
  Play,
  ArrowRight,
  BrainCircuit,
  Eye,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { formatNumber, getViralityColor, formatDuration } from '@/lib/utils';
import ExplainabilityModal from '@/components/ExplainabilityModal';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import EditDiffLearnerModal from '@/components/EditDiffLearnerModal';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [clips, setClips] = useState<any[]>([]);
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedExplainClip, setSelectedExplainClip] = useState<any | null>(null);
  const [selectedPlayClip, setSelectedPlayClip] = useState<any | null>(null);
  const [learnerNotification, setLearnerNotification] = useState<{ rule: string; summary?: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [clipsRes, analyticsRes, brandRes] = await Promise.all([
          fetch('/api/clips'),
          fetch('/api/analytics'),
          fetch('/api/brand-dna'),
        ]);

        const clipsData = await clipsRes.json();
        const analyticsData = await analyticsRes.json();
        const brandData = await brandRes.json();

        setClips(clipsData.clips || []);
        setStats(analyticsData);
        setBrand(brandData.brand);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFeedback = async (clipId: string, feedback: 'high' | 'low') => {
    try {
      const res = await fetch(`/api/clips/${clipId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      });
      const data = await res.json();
      if (data.success) {
        setClips((prev) =>
          prev.map((c) => (c.id === clipId ? { ...c, performanceFeedback: feedback } : c))
        );
        setLearnerNotification({
          rule: feedback === 'high' ? 'Calibrated weights: Increased priority on high Hook Impact & Value Density' : 'Calibrated weights: Decreased factor threshold',
          summary: `Algorithm learned from your "${feedback}" feedback.`,
        });
      }
    } catch (err) {
      console.error('Feedback failed:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Callout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Adaptive Content Engine
              </span>
              <span className="text-xs text-slate-400">Database connected & persistent</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Welcome back, Archie. 3 high-impact clips ready for distribution.
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Virality model v4.2 calibrated with {stats?.learningWeights?.feedbackCount || 14} creator learning cycles. Multi-platform presets generated for TikTok, Reels, Shorts, and LinkedIn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/upload"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              <span>Extract From Long Video</span>
            </Link>
            <Link
              href="/dashboard/brand-dna"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-all flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>Voice Memory</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Audience Reach</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Eye className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats ? formatNumber(stats.totalViews) : '1.85M'}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +28.4% vs last period
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Viral Clips Extracted</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Scissors className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">{clips.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">From 2 long-form recordings</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Avg. 3s Hook Retention</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats?.avgRetentionRate || 76.4}%
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Top 5% creator benchmark
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Scheduled Drops</span>
            <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats?.scheduledCount || 5}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cross-posted to 5 platforms</p>
        </div>
      </div>

      {/* Main Grid: Extracted Clips + Brand Voice Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: High-Virality Clips */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                High-Impact Viral Clips
              </h3>
              <p className="text-xs text-slate-400">
                Sorted by AI virality score with full explainable breakdowns.
              </p>
            </div>
            <Link
              href="/dashboard/clips"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View all clips</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {clips.map((clip) => {
              const metrics = JSON.parse(clip.viralityMetrics || '{}');
              const reasons: string[] = JSON.parse(clip.explainableReasons || '[]');
              const color = getViralityColor(clip.viralityScore);

              return (
                <div
                  key={clip.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Score Badge */}
                    <div
                      onClick={() =>
                        setSelectedExplainClip({
                          title: clip.title,
                          viralityScore: clip.viralityScore,
                          viralityMetrics: metrics,
                          explainableReasons: reasons,
                        })
                      }
                      className={`cursor-pointer w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border ${color.bg} ${color.text} ${color.border} hover:scale-105 transition-transform`}
                      title="Click to view explainable score breakdown"
                    >
                      <span className="text-sm font-extrabold font-mono">{clip.viralityScore}</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider">Score</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(clip.durationSeconds)}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-indigo-400">
                          {clip.subtitleStyle?.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                        {clip.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{clip.summary}</p>
                    </div>
                  </div>

                  {/* Actions & Feedback */}
                  <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                    {/* Feedback loop thumbs */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => handleFeedback(clip.id, 'high')}
                        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
                          clip.performanceFeedback === 'high'
                            ? 'text-emerald-400'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="Mark as High Performer (Calibrates AI weights up)"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(clip.id, 'low')}
                        className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
                          clip.performanceFeedback === 'low'
                            ? 'text-rose-400'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="Mark as Low Performer (Calibrates AI weights down)"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Explain Button */}
                    <button
                      onClick={() =>
                        setSelectedExplainClip({
                          title: clip.title,
                          viralityScore: clip.viralityScore,
                          viralityMetrics: metrics,
                          explainableReasons: reasons,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Why Selected?
                    </button>

                    {/* Preview 9:16 Video Player */}
                    <button
                      onClick={() => setSelectedPlayClip(clip)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Reel Preview</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Brand Voice Memory & Learning Status */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Brand Voice Memory
            </h3>
            <p className="text-xs text-slate-400">
              Continuously learns your personal nuances from creator edits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">
                  Voice Archetype
                </span>
                <p className="text-sm font-bold text-white">
                  {brand?.voiceArchetype || 'The Visionary Provocateur'}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active Memory
              </span>
            </div>

            {/* Learned Rules Preview */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Recently Learned Rules ({brand?.learnedRules?.length || 4})
              </span>
              <div className="space-y-2">
                {(brand?.learnedRules || [
                  'Start with counter-intuitive data or paradox within 2.5s',
                  'Format LinkedIn captions with single-line punchy bullet points',
                  'Prune corporate pleasantries and intros',
                ]).slice(0, 3).map((rule: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard/brand-dna"
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Manage Brand DNA & Tone Sliders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick A/B Test Teaser */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">
                AI A/B Testing Lab
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                Running
              </span>
            </div>
            <p className="text-xs font-semibold text-white">
              Hook Test: Assertion vs Question
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Variant A driving 8.4% predicted CTR vs 4.1% for Variant B.
            </p>
            <Link
              href="/dashboard/ab-testing"
              className="mt-3 inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              <span>Inspect Experiment Results</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedExplainClip && (
        <ExplainabilityModal
          isOpen={Boolean(selectedExplainClip)}
          onClose={() => setSelectedExplainClip(null)}
          clipTitle={selectedExplainClip.title}
          viralityScore={selectedExplainClip.viralityScore}
          viralityMetrics={selectedExplainClip.viralityMetrics}
          explainableReasons={selectedExplainClip.explainableReasons}
        />
      )}

      {selectedPlayClip && (
        <VideoPlayerModal
          isOpen={Boolean(selectedPlayClip)}
          onClose={() => setSelectedPlayClip(null)}
          clip={selectedPlayClip}
        />
      )}

      {learnerNotification && (
        <EditDiffLearnerModal
          isOpen={Boolean(learnerNotification)}
          onClose={() => setLearnerNotification(null)}
          learnedRule={learnerNotification.rule}
          diffSummary={learnerNotification.summary}
        />
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Plus,
  Compass,
  ArrowRight,
  Target,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function CompetitorIntelligencePage() {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New competitor form
  const [handle, setHandle] = useState('');
  const [channelName, setChannelName] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Creative direction ideas
  const [creativePrompts, setCreativePrompts] = useState([
    {
      title: 'The Epistemic State Machine vs Vector Search',
      angle: 'Expose why RAG vector similarity is insufficient for multi-turn autonomous reasoning, providing reproducible code benchmarks.',
      targetHook: '"Vector databases won\'t save your AI agent from hallucinating. Here is why."',
      difficulty: 'High Authority',
    },
    {
      title: 'Why $20/Month AI Wrappers Die at Scale',
      angle: 'Dissect the unit economics of foundation API price compression and how to construct deep workflow moats.',
      targetHook: '"If OpenAI can replicate your product in a weekend changelog, you don\'t have a startup."',
      difficulty: 'High Viral Velocity',
    },
    {
      title: 'The 3 Metrics Elite Engineering Teams Track in 2026',
      angle: 'Replace superficial DORA metrics with latency cascade variance and autonomous token efficiency.',
      targetHook: '"Stop tracking lines of code or commit counts. Track this one latency metric instead."',
      difficulty: 'Executive Resonance',
    },
  ]);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const res = await fetch('/api/competitors');
      const data = await res.json();
      setCompetitors(data.competitors || []);
    } catch (err) {
      console.error('Failed to load competitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorHandle: handle,
          channelName: channelName || handle,
          platform,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCompetitors([data.competitor, ...competitors]);
        setShowAddModal(false);
        setHandle('');
        setChannelName('');
      }
    } catch (err) {
      console.error('Error adding competitor:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[11px] font-bold border border-cyan-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Market Intelligence & Creative Studio
            </span>
            <span className="text-xs text-slate-400">Competitive Counter-Plays</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Competitor Intelligence & Creative Direction
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze viral hook patterns and content velocity across top rival channels. Generate differentiated counter-angles that capture audience mindshare.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Competitor</span>
        </button>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitors.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">
                  {c.platform} • {c.followersCount} Followers
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">{c.channelName}</h3>
                <span className="text-xs text-slate-400">{c.competitorHandle}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Avg. Velocity</span>
                <span className="font-mono font-bold text-sm text-emerald-400">
                  {c.benchmarkMetrics?.viralityVelocity || '8.8x'}
                </span>
              </div>
            </div>

            {/* Top Viral Hooks */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Top Analyzed Viral Hooks
              </span>
              <div className="space-y-1.5">
                {c.topViralHooks?.map((hook: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 italic"
                  >
                    "{hook}"
                  </div>
                ))}
              </div>
            </div>

            {/* AI Counter-Strategy */}
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>AI Automated Counter-Strategy</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{c.counterStrategy}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Creative Direction Studio */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Creative Direction & Next Episode Blueprints</span>
            </h3>
            <p className="text-xs text-slate-400">
              Formulated to exploit content voids left by competitor surface-level coverage.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
            AI Directed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creativePrompts.map((cp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                  {cp.difficulty}
                </span>
                <h4 className="text-xs font-bold text-white mt-1 mb-1.5">{cp.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{cp.angle}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-purple-300 italic">
                <span className="font-semibold text-slate-400 not-italic block text-[10px] mb-0.5">
                  Recommended Hook:
                </span>
                {cp.targetHook}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Track New Competitor</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddCompetitor} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Competitor Handle / URL
                </label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. @levelsio or @sama"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Channel / Creator Name
                </label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="e.g. Pieter Levels"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="youtube">YouTube</option>
                  <option value="x">X (Twitter)</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing Hooks...' : 'Track & Generate Counter-Play'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

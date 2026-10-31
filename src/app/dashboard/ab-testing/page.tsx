'use client';

import React, { useEffect, useState } from 'react';
import {
  GitCompare,
  Sparkles,
  Trophy,
  TrendingUp,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Users,
  Target,
  Activity,
  Check,
} from 'lucide-react';

export default function ABTestingPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Experiment Form
  const [newTitle, setNewTitle] = useState('');
  const [newTestType, setNewTestType] = useState('hook');
  const [variantA, setVariantA] = useState('');
  const [variantB, setVariantB] = useState('');
  const [variantC, setVariantC] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Real Metrics Modal
  const [loggingExperimentId, setLoggingExperimentId] = useState<string | null>(null);
  const [realImpressionsInput, setRealImpressionsInput] = useState('');
  const [realClicksInput, setRealClicksInput] = useState('');

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const res = await fetch('/api/ab-testing');
      const data = await res.json();
      setExperiments(data.experiments || []);
    } catch (err) {
      console.error('Failed to load experiments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !variantA || !variantB) return;

    setIsSimulating(true);
    const variants = [
      { id: 'var_a', label: 'Variant A (Assertion)', content: variantA },
      { id: 'var_b', label: 'Variant B (Alternative)', content: variantB },
    ];
    if (variantC.trim()) {
      variants.push({ id: 'var_c', label: 'Variant C (Empirical)', content: variantC });
    }

    try {
      const res = await fetch('/api/ab-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          testType: newTestType,
          variants,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExperiments([data.experiment, ...experiments]);
        setShowCreateModal(false);
        setNewTitle('');
        setVariantA('');
        setVariantB('');
        setVariantC('');
      }
    } catch (err) {
      console.error('Error creating experiment:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleLogRealMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingExperimentId) return;

    const imp = parseInt(realImpressionsInput, 10);
    const clk = parseInt(realClicksInput, 10);

    try {
      const res = await fetch(`/api/ab-testing/${loggingExperimentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          realImpressions: imp,
          realClicks: clk,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExperiments((prev) =>
          prev.map((exp) => (exp.id === loggingExperimentId ? { ...exp, ...data.experiment } : exp))
        );
        setLoggingExperimentId(null);
        setRealImpressionsInput('');
        setRealClicksInput('');
      }
    } catch (err) {
      console.error('Error logging real metrics:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
              Audience Modeling & Validation Lab
            </span>
            <span className="text-xs text-slate-400">Predicted Simulation vs Real Data</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            AI A/B Testing & Hook Optimization Lab
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pit alternative hooks, caption angles, and thumbnail premises against synthetic audience cohorts. Distinguish AI predictions from verified real-world social drops.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New A/B Experiment</span>
        </button>
      </div>

      {/* Experiments List */}
      <div className="space-y-6">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 shadow-xl space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] uppercase font-bold">
                    {exp.testType} Test
                  </span>

                  {/* Clear Demo/Simulation Distinction Badge */}
                  {exp.isSimulated !== false ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                      [DEMO: AI PREDICTED SIMULATION]
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      [VERIFIED REAL DATA]
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                    {exp.status.toUpperCase()}
                  </span>
                  {exp.clip?.title && (
                    <span className="text-xs text-slate-500">• Clip: {exp.clip.title}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{exp.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLoggingExperimentId(exp.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log Real Metrics</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>
                    {exp.realImpressions > 0
                      ? `${exp.realImpressions.toLocaleString()} Real Views`
                      : 'Simulated 125K Sample'}
                  </span>
                </div>
              </div>
            </div>

            {/* Real verified stats banner if logged */}
            {exp.realImpressions > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified In-Market Performance:</span>
                  <span className="font-mono text-white">
                    {exp.realClicks.toLocaleString()} Clicks / {exp.realImpressions.toLocaleString()} Views ({exp.realCtr}% CTR)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  Live Platform Telemetry
                </span>
              </div>
            )}

            {/* Variants Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exp.variants?.map((v: any) => (
                <div
                  key={v.id}
                  className={`p-4 rounded-xl border relative transition-all ${
                    v.isWinner
                      ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  {v.isWinner && (
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Trophy className="w-3 h-3" /> Winner
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">{v.label}</span>
                    <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Model Sim
                    </span>
                  </div>

                  <p className="text-xs text-white leading-relaxed mb-4 min-h-[48px] font-medium">
                    "{v.content}"
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Predicted CTR:</span>
                      <span className={`font-mono font-bold text-sm ${v.isWinner ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {v.predictedCtr}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Confidence Level:</span>
                      <span className="font-mono text-slate-300">{v.confidence}</span>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Simulated Clicks:</span>
                      <span className="font-mono text-slate-300">{v.simulatedClicks?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                    <span className="text-slate-300 font-medium">Audience Insight:</span> {v.audienceReaction}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights Summary Bar */}
            {exp.insightsSummary && (
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-300">Statistical Analysis: </span>
                  <span>{exp.insightsSummary}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Log Real In-Market Metrics Modal */}
      {loggingExperimentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Log Verified Real Performance</span>
              </h3>
              <button
                onClick={() => setLoggingExperimentId(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleLogRealMetrics} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Actual Total Impressions / Views
                </label>
                <input
                  type="number"
                  required
                  value={realImpressionsInput}
                  onChange={(e) => setRealImpressionsInput(e.target.value)}
                  placeholder="e.g. 54200"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Actual Clicks / Engagements
                </label>
                <input
                  type="number"
                  required
                  value={realClicksInput}
                  onChange={(e) => setRealClicksInput(e.target.value)}
                  placeholder="e.g. 4620"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLoggingExperimentId(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Save Real Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Experiment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-emerald-400" />
                <span>Create New A/B Experiment</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateExperiment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Experiment Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Opening Hook for Episode 42"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Testing Variable
                </label>
                <select
                  value={newTestType}
                  onChange={(e) => setNewTestType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="hook">Opening Hook (0-3s Speech/Headline)</option>
                  <option value="caption">Platform Caption Framing</option>
                  <option value="thumbnail">Thumbnail Copy & Visual Concept</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Variant A (Control / Assertion)
                </label>
                <textarea
                  required
                  rows={2}
                  value={variantA}
                  onChange={(e) => setVariantA(e.target.value)}
                  placeholder="e.g. 99% of developers are building AI agents completely backwards."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Variant B (Challenger / Curiosity)
                </label>
                <textarea
                  required
                  rows={2}
                  value={variantB}
                  onChange={(e) => setVariantB(e.target.value)}
                  placeholder="e.g. Have you ever wondered why standard LLM agents fail at turn 7?"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Variant C (Optional - Data Anchor)
                </label>
                <textarea
                  rows={2}
                  value={variantC}
                  onChange={(e) => setVariantC(e.target.value)}
                  placeholder="e.g. We tested 50,000 multi-agent trajectories. Here is the fatal flaw."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isSimulating ? 'Simulating Audience...' : 'Run Audience Simulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { X, Sparkles, CheckCircle2, TrendingUp, Zap, HelpCircle } from 'lucide-react';
import { getViralityColor } from '@/lib/utils';

interface ViralityMetrics {
  hookImpact: number;
  energyPacing: number;
  valueDensity: number;
  retentionPrediction: number;
  brandAlignment: number;
}

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  clipTitle: string;
  viralityScore: number;
  viralityMetrics: ViralityMetrics;
  explainableReasons: string[];
}

export default function ExplainabilityModal({
  isOpen,
  onClose,
  clipTitle,
  viralityScore,
  viralityMetrics,
  explainableReasons,
}: ExplainabilityModalProps) {
  if (!isOpen) return null;

  const colorStyles = getViralityColor(viralityScore);

  const metricsList = [
    { label: 'Hook Impact (0-3s)', value: viralityMetrics.hookImpact, desc: 'Curiosity gap, contrast, cognitive dissonance in opening seconds' },
    { label: 'Energy & Pacing Velocity', value: viralityMetrics.energyPacing, desc: 'Cadence (140-185 WPM) and elimination of dead conversational pauses' },
    { label: 'Value & Insight Density', value: viralityMetrics.valueDensity, desc: 'Quantifiable metrics, actionable engineering frameworks, takeaways' },
    { label: 'Predicted Audience Retention', value: viralityMetrics.retentionPrediction, desc: 'Simulated multi-platform drop-off curve completion rate' },
    { label: 'Brand DNA Alignment', value: viralityMetrics.brandAlignment, desc: 'Matches target tone, keyword pillars, and learned creator heuristics' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Explainable Selection Score
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colorStyles.bg} ${colorStyles.text} ${colorStyles.border} border`}>
                Score: {viralityScore}/100
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight line-clamp-1">{clipTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Factor Metric Breakdown */}
        <div className="py-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Factor-by-Factor Evaluation
          </h3>

          <div className="space-y-2.5">
            {metricsList.map((m) => (
              <div key={m.label} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">{m.label}</span>
                  <span className="font-mono font-bold text-indigo-400">{m.value}/100</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${m.value}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Selection Rationale */}
        <div className="pt-2 pb-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Algorithm Transparent Rationale</span>
          </h3>
          <div className="space-y-2">
            {explainableReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}

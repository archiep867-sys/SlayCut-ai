'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  BrainCircuit,
  Eye,
  Share2,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { formatNumber } from '@/lib/utils';

export default function PerformanceAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const platformData = data?.platformBreakdown
    ? [
        { name: 'TikTok', views: data.platformBreakdown.tiktok?.views || 820000 },
        { name: 'Instagram', views: data.platformBreakdown.instagram?.views || 540000 },
        { name: 'Shorts', views: data.platformBreakdown.youtube?.views || 320000 },
        { name: 'LinkedIn', views: data.platformBreakdown.linkedin?.views || 110000 },
        { name: 'X', views: data.platformBreakdown.x?.views || 55200 },
      ]
    : [];

  const retentionCurve = data?.retentionCurve || [
    { second: 0, retentionRate: 100 },
    { second: 3, retentionRate: 88 },
    { second: 12, retentionRate: 81 },
    { second: 26, retentionRate: 76 },
    { second: 48, retentionRate: 68 },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[11px] font-bold border border-indigo-500/30 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            Closed-Loop Intelligence
          </span>
          <span className="text-xs text-slate-400">Real-Time Calibration</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Performance Analytics & Feedback Loop
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Second-by-second drop-off curve modeling, cross-channel reach, and the dynamic algorithm weights that adapt to your audience feedback.
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">Aggregate Views</span>
          <div className="text-2xl font-extrabold text-white">
            {data ? formatNumber(data.totalViews) : '1.85M'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +28.4% this month
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">Average Hook Retention (3s)</span>
          <div className="text-2xl font-extrabold text-white">
            {data?.avgRetentionRate || 76.4}%
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">
            +6.2% above industry median
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">Total Engagements</span>
          <div className="text-2xl font-extrabold text-white">
            {data ? formatNumber(data.totalEngagement) : '249K'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Comments, saves & shares</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 block mb-1">Feedback Training Cycles</span>
          <div className="text-2xl font-extrabold text-white">
            {data?.learningWeights?.feedbackCount || 14}
          </div>
          <p className="text-[11px] text-purple-400 mt-1 font-mono">
            Model weights auto-calibrated
          </p>
        </div>
      </div>

      {/* Retention Drop-off Curve (Second-by-Second Chart) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Audience Retention Curvature (Second-by-Second)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Notice the inflection points at 3s (hook lock-in) and 26s (tactical solution reveal).
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
            68% Full Completion
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={retentionCurve} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="second"
                stroke="#64748b"
                tickFormatter={(val) => `${val}s`}
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[50, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(val: any) => [`${val}% Retention`, 'Retention Rate']}
                labelFormatter={(label: any) => `Second: ${label}s`}
              />
              <Line
                type="monotone"
                dataKey="retentionRate"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#ec4899' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Platform Distribution & Dynamic Adaptive Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>Cross-Platform Views Distribution</span>
          </h3>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [val.toLocaleString(), 'Views']}
                />
                <Bar dataKey="views" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Adaptive Algorithm Weights Calibrator */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>Adaptive Scoring Weights Model</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
              Calibrated Live
            </span>
          </div>

          <p className="text-xs text-slate-400">
            These dynamic multipliers scale clip selection scores based on your explicit "High/Low" feedback votes in the Clips Studio.
          </p>

          <div className="space-y-3">
            {[
              {
                label: 'Hook Impact Weight',
                value: data?.learningWeights?.hookImpact || 1.35,
                desc: 'Scaled +0.05 when high performer selected',
              },
              {
                label: 'Value Density Weight',
                value: data?.learningWeights?.valueDensity || 1.3,
                desc: 'Prioritizes quantifiable metrics & frameworks',
              },
              {
                label: 'Brand Alignment Weight',
                value: data?.learningWeights?.brandAlignment || 1.25,
                desc: 'Enforces brand archetype adherence',
              },
              {
                label: 'Energy & Pacing Weight',
                value: data?.learningWeights?.pacingEnergy || 1.15,
                desc: 'Filters out slow cadence and dead pauses',
              },
              {
                label: 'Predicted Retention Weight',
                value: data?.learningWeights?.retention || 1.2,
                desc: 'Drop-off simulation curve multiplier',
              },
            ].map((w) => (
              <div
                key={w.label}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">{w.label}</span>
                  <span className="text-[10px] text-slate-500">{w.desc}</span>
                </div>
                <span className="text-sm font-mono font-extrabold text-indigo-400">
                  {w.value.toFixed(2)}x
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  Share2,
  Trash2,
  ArrowRight,
  Target,
  Layers,
} from 'lucide-react';

export default function ContentCalendarPage() {
  const [items, setItems] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlatformFilter, setActivePlatformFilter] = useState<string>('all');

  // Campaign Generator Modal
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignGoal, setCampaignGoal] = useState('');
  const [campaignNiche, setCampaignNiche] = useState('');
  const [campaignAudience, setCampaignAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchCalendarAndCampaigns();
  }, []);

  const fetchCalendarAndCampaigns = async () => {
    try {
      const [calRes, campRes] = await Promise.all([
        fetch('/api/calendar'),
        fetch('/api/campaigns'),
      ]);
      const calData = await calRes.json();
      const campData = await campRes.json();

      setItems(calData.items || []);
      setCampaigns(campData.campaigns || []);
    } catch (err) {
      console.error('Failed to load calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'scheduled' : 'published';
    try {
      const res = await fetch(`/api/calendar/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setItems(items.map((i) => (i.id === id ? { ...i, status: nextStatus } : i)));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleGenerateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: campaignGoal,
          niche: campaignNiche,
          targetAudience: campaignAudience,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCampaigns([data.campaign, ...campaigns]);
        setShowCampaignModal(false);
        setCampaignGoal('');
      }
    } catch (err) {
      console.error('Failed to generate campaign:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredItems =
    activePlatformFilter === 'all'
      ? items
      : items.filter((i) => i.platform === activePlatformFilter);

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return { label: 'TikTok', bg: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
      case 'instagram':
        return { label: 'Reel', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'youtube':
        return { label: 'Shorts', bg: 'bg-red-500/10 text-red-400 border-red-500/20' };
      case 'linkedin':
        return { label: 'LinkedIn', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'x':
        return { label: 'X Thread', bg: 'bg-slate-500/10 text-slate-300 border-slate-500/20' };
      default:
        return { label: platform, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[11px] font-bold border border-pink-500/30 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-pink-400" />
              Strategic Publishing Grid
            </span>
            <span className="text-xs text-slate-400">Multi-Channel Cadence</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Content Calendar & 30-Day Campaign Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Synchronize viral video drops across TikTok, Instagram, YouTube Shorts, LinkedIn & X at algorithmic peak engagement times.
          </p>
        </div>

        <button
          onClick={() => setShowCampaignModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-pink-500/25 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate 30-Day Campaign Strategy</span>
        </button>
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'tiktok', 'instagram', 'youtube', 'linkedin', 'x'].map((p) => (
          <button
            key={p}
            onClick={() => setActivePlatformFilter(p)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              activePlatformFilter === p
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {p === 'all' ? 'All Channels' : p}
          </button>
        ))}
      </div>

      {/* Scheduled Items Grid */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const badge = getPlatformBadge(item.platform);
          const dateStr = new Date(item.scheduledFor).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Channel badge */}
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border flex-shrink-0 ${badge.bg}`}
                >
                  {badge.label}
                </span>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {dateStr}
                    </span>
                    {item.campaignTheme && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Theme: {item.campaignTheme}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-1 italic">"{item.hookUsed}"</p>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  onClick={() => handleToggleStatus(item.id, item.status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    item.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="capitalize">{item.status}</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Remove scheduled drop"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Strategy Section */}
      {campaigns.length > 0 && (
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="w-4 h-4 text-pink-400" />
              <span>Active 30-Day Campaign Strategy</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Status: {campaigns[0].status.toUpperCase()}
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <div className="pb-3 border-b border-slate-800">
              <h4 className="text-base font-bold text-white">{campaigns[0].title}</h4>
              <p className="text-xs text-slate-300 mt-1">Goal: {campaigns[0].goal}</p>
            </div>

            {/* 4 Weekly Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {campaigns[0].thematicPillars?.map((pillar: any) => (
                <div
                  key={pillar.week}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-indigo-400 text-xs font-mono font-bold">
                    <span>Week {pillar.week}</span>
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">{pillar.theme}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {pillar.focus}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-purple-300 font-medium">
                    Target: {pillar.targetOutput}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campaign Generator Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>AI Campaign Strategy Planner</span>
              </h3>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleGenerateCampaign} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Primary Campaign Objective
                </label>
                <input
                  type="text"
                  required
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  placeholder="e.g. Acquire 2,000 qualified technical waitlist signups"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Niche
                </label>
                <input
                  type="text"
                  value={campaignNiche}
                  onChange={(e) => setCampaignNiche(e.target.value)}
                  placeholder="e.g. AI Engineering & Autonomous Tooling"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Persona
                </label>
                <input
                  type="text"
                  value={campaignAudience}
                  onChange={(e) => setCampaignAudience(e.target.value)}
                  placeholder="e.g. Senior Backend Engineers, CTOs, Tech Founders"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 bg-gradient-to-r from-pink-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/20 disabled:opacity-50"
                >
                  {isGenerating ? 'Synthesizing Roadmap...' : 'Generate 30-Day Strategy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

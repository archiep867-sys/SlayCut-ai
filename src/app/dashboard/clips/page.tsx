'use client';

import React, { useEffect, useState } from 'react';
import {
  Scissors,
  Sparkles,
  Clock,
  Play,
  Copy,
  Check,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Edit3,
  Save,
  Share2,
  HelpCircle,
  Hash,
} from 'lucide-react';
import { formatDuration, getViralityColor } from '@/lib/utils';
import ExplainabilityModal from '@/components/ExplainabilityModal';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import EditDiffLearnerModal from '@/components/EditDiffLearnerModal';

export default function ClipsStudioPage() {
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [minScoreFilter, setMinScoreFilter] = useState(0);

  // Selected clip for tabs
  const [activePlatforms, setActivePlatforms] = useState<{ [clipId: string]: string }>({});
  const [editingCaptions, setEditingCaptions] = useState<{ [key: string]: string }>({});
  const [originalCaptions, setOriginalCaptions] = useState<{ [key: string]: string }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals
  const [selectedExplainClip, setSelectedExplainClip] = useState<any | null>(null);
  const [selectedPlayClip, setSelectedPlayClip] = useState<any | null>(null);
  const [learnerNotification, setLearnerNotification] = useState<{ rule: string; summary?: string } | null>(null);

  useEffect(() => {
    fetchClips();
  }, [minScoreFilter]);

  const fetchClips = async () => {
    try {
      const res = await fetch(`/api/clips?minScore=${minScoreFilter}`);
      const data = await res.json();
      setClips(data.clips || []);

      // Default active platforms to tiktok
      const defaults: any = {};
      (data.clips || []).forEach((c: any) => {
        defaults[c.id] = 'tiktok';
      });
      setActivePlatforms(defaults);
    } catch (err) {
      console.error('Error fetching clips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformChange = (clipId: string, platform: string) => {
    setActivePlatforms((prev) => ({ ...prev, [clipId]: platform }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveCaptionEdit = async (clipId: string, platform: string) => {
    const editKey = `${clipId}_${platform}`;
    const newText = editingCaptions[editKey];
    const origText = originalCaptions[editKey];

    if (!newText || newText === origText) return;

    try {
      const clip = clips.find((c) => c.id === clipId);
      const presets = JSON.parse(clip.captionPresets || '{}');
      presets[platform] = newText;

      const res = await fetch(`/api/clips/${clipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          captionPresets: presets,
          editedField: `caption_${platform}`,
          originalText: origText,
          newText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setClips((prev) =>
          prev.map((c) => (c.id === clipId ? { ...c, captionPresets: JSON.stringify(presets) } : c))
        );

        if (data.learningNotification) {
          setLearnerNotification({
            rule: data.learningNotification.rule,
            summary: data.learningNotification.summary,
          });
        }
      }
    } catch (err) {
      console.error('Error saving caption:', err);
    }
  };

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
          rule: feedback === 'high' ? 'Calibrated weights: Increased factor priority for Hook & Value Density' : 'Calibrated weights: Re-balanced selection threshold',
          summary: `Model updated based on "${feedback}" creator feedback.`,
        });
      }
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-[11px] font-bold border border-indigo-500/30">
              Clips Studio
            </span>
            <span className="text-xs text-slate-400">{clips.length} Extracted Moments</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Extracted Viral Clips & Multi-Platform Packaging
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Preview vertical reels, customize hooks and captions for TikTok, Instagram, Shorts & LinkedIn, and let our voice memory learn from your edits.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <span className="text-xs text-slate-400 pl-2">Filter Score:</span>
          {[0, 85, 92].map((s) => (
            <button
              key={s}
              onClick={() => setMinScoreFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                minScoreFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s === 0 ? 'All' : `${s}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Clips List */}
      <div className="space-y-6">
        {clips.map((clip) => {
          const metrics = JSON.parse(clip.viralityMetrics || '{}');
          const reasons: string[] = JSON.parse(clip.explainableReasons || '[]');
          const captionPresets = JSON.parse(clip.captionPresets || '{}');
          const hashtags: string[] = JSON.parse(clip.recommendedHashtags || '[]');
          const hooks: string[] = JSON.parse(clip.hookVariations || '[]');
          const color = getViralityColor(clip.viralityScore);
          const activePlatform = activePlatforms[clip.id] || 'tiktok';

          const editKey = `${clip.id}_${activePlatform}`;
          const currentCaptionText =
            editingCaptions[editKey] !== undefined
              ? editingCaptions[editKey]
              : captionPresets[activePlatform] || '';

          return (
            <div
              key={clip.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden shadow-xl hover:border-slate-700/80 transition-all"
            >
              {/* Clip Top Bar */}
              <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950/40">
                <div className="flex items-start gap-4 flex-1">
                  {/* Virality Radial Score Pill */}
                  <div
                    onClick={() =>
                      setSelectedExplainClip({
                        title: clip.title,
                        viralityScore: clip.viralityScore,
                        viralityMetrics: metrics,
                        explainableReasons: reasons,
                      })
                    }
                    className={`cursor-pointer w-14 h-14 rounded-2xl flex flex-col items-center justify-center border ${color.bg} ${color.text} ${color.border} hover:scale-105 transition-transform flex-shrink-0`}
                    title="Click for factor-by-factor explainability"
                  >
                    <span className="text-base font-extrabold font-mono">{clip.viralityScore}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider">Virality</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s ({formatDuration(clip.durationSeconds)})
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">
                        {clip.subtitleStyle?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-500">• {clip.videoProject?.title}</span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {clip.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{clip.summary}</p>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {/* High/Low Feedback */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => handleFeedback(clip.id, 'high')}
                      className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                        clip.performanceFeedback === 'high'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Reinforces algorithm weights for this style"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(clip.id, 'low')}
                      className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                        clip.performanceFeedback === 'low'
                          ? 'text-rose-400 bg-rose-500/10'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Suppresses algorithm weights for this style"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Why Selected Modal */}
                  <button
                    onClick={() =>
                      setSelectedExplainClip({
                        title: clip.title,
                        viralityScore: clip.viralityScore,
                        viralityMetrics: metrics,
                        explainableReasons: reasons,
                      })
                    }
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Explain Score</span>
                  </button>

                  {/* 9:16 Video Player Preview */}
                  <button
                    onClick={() => setSelectedPlayClip(clip)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>9:16 Reel Player</span>
                  </button>
                </div>
              </div>

              {/* Multi-Platform Repurposing & Editor */}
              <div className="p-5 space-y-4">
                {/* Platform Selector Tabs */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {[
                      { id: 'tiktok', label: 'TikTok' },
                      { id: 'instagram', label: 'Instagram Reels' },
                      { id: 'youtube', label: 'YouTube Shorts' },
                      { id: 'linkedin', label: 'LinkedIn' },
                      { id: 'x', label: 'X (Twitter)' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePlatformChange(clip.id, p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activePlatform === p.id
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {currentCaptionText.length} chars
                    </span>
                    <button
                      onClick={() => handleCopy(currentCaptionText, editKey)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {copiedKey === editKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Caption Inline Editor with Voice Learning on Save */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Platform Caption & Hook</span>
                    </label>
                    <span className="text-[10px] text-purple-400 font-mono">
                      ✨ Edits adapt Brand Voice Memory
                    </span>
                  </div>

                  <textarea
                    rows={4}
                    value={currentCaptionText}
                    onFocus={() => {
                      if (!originalCaptions[editKey]) {
                        setOriginalCaptions((prev) => ({
                          ...prev,
                          [editKey]: currentCaptionText,
                        }));
                      }
                    }}
                    onChange={(e) =>
                      setEditingCaptions((prev) => ({
                        ...prev,
                        [editKey]: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                  />

                  {editingCaptions[editKey] &&
                    editingCaptions[editKey] !== originalCaptions[editKey] && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-indigo-400">
                          Unsaved edit detected. Saving will train your Brand DNA.
                        </span>
                        <button
                          onClick={() => handleSaveCaptionEdit(clip.id, activePlatform)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save & Adapt Voice</span>
                        </button>
                      </div>
                    )}
                </div>

                {/* Hashtags */}
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Hashtags:
                  </span>
                  {hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-indigo-300 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
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

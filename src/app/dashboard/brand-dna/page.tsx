'use client';

import React, { useEffect, useState } from 'react';
import {
  Dna,
  Sparkles,
  Sliders,
  CheckCircle2,
  Plus,
  X,
  Save,
  BrainCircuit,
  History,
  ShieldAlert,
  Tag,
} from 'lucide-react';

export default function BrandDnaPage() {
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable fields
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [niche, setNiche] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [voiceArchetype, setVoiceArchetype] = useState('The Visionary Provocateur');

  const [toneProfile, setToneProfile] = useState({
    formality: 40,
    humor: 60,
    enthusiasm: 80,
    provocation: 75,
    technicalDepth: 70,
  });

  const [bannedPhrases, setBannedPhrases] = useState<string[]>([]);
  const [newBannedPhrase, setNewBannedPhrase] = useState('');

  const [preferredKeywords, setPreferredKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  const [learnedRules, setLearnedRules] = useState<string[]>([]);
  const [newLearnedRule, setNewLearnedRule] = useState('');
  const [editHistory, setEditHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchBrandDna();
  }, []);

  const fetchBrandDna = async () => {
    try {
      const res = await fetch('/api/brand-dna');
      const data = await res.json();
      if (data.brand) {
        setBrand(data.brand);
        setBrandName(data.brand.brandName || '');
        setTagline(data.brand.tagline || '');
        setNiche(data.brand.niche || '');
        setTargetAudience(data.brand.targetAudience || '');
        setVoiceArchetype(data.brand.voiceArchetype || 'The Visionary Provocateur');
        setToneProfile(data.brand.toneProfile || toneProfile);
        setBannedPhrases(data.brand.bannedPhrases || []);
        setPreferredKeywords(data.brand.preferredKeywords || []);
        setLearnedRules(data.brand.learnedRules || []);
        setEditHistory(data.brand.editHistory || []);
      }
    } catch (err) {
      console.error('Failed to load Brand DNA:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/brand-dna', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          tagline,
          niche,
          targetAudience,
          voiceArchetype,
          toneProfile,
          bannedPhrases,
          preferredKeywords,
          learnedRules,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save brand DNA:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBanned = () => {
    if (newBannedPhrase.trim() && !bannedPhrases.includes(newBannedPhrase.trim())) {
      setBannedPhrases([...bannedPhrases, newBannedPhrase.trim()]);
      setNewBannedPhrase('');
    }
  };

  const handleRemoveBanned = (item: string) => {
    setBannedPhrases(bannedPhrases.filter((b) => b !== item));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !preferredKeywords.includes(newKeyword.trim())) {
      setPreferredKeywords([...preferredKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (item: string) => {
    setPreferredKeywords(preferredKeywords.filter((k) => k !== item));
  };

  const handleAddLearnedRule = () => {
    if (newLearnedRule.trim() && !learnedRules.includes(newLearnedRule.trim())) {
      setLearnedRules([newLearnedRule.trim(), ...learnedRules]);
      setNewLearnedRule('');
    }
  };

  const handleRemoveRule = (rule: string) => {
    setLearnedRules(learnedRules.filter((r) => r !== rule));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold border border-purple-500/30 flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5 text-purple-400" />
              Persistent Voice Memory
            </span>
            <span className="text-xs text-slate-400">Learns Continuously</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Brand DNA & Adaptive Voice Memory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure your tone sliders, prohibited jargon, and target audience. CLIPFORGE automatically updates learned guidelines whenever you edit AI captions.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? (
            <span>Saving Memory...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Brand DNA</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Brand DNA & Adaptive Voice rules persisted successfully!</span>
        </div>
      )}

      {/* Grid: Left Settings, Right Learned Memory Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Brand Details & Tone Sliders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span>Core Identity & Audience</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Brand / Channel Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Content Niche
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Target Audience Specification
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Senior Software Engineers, Technical Founders, AI Researchers"
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Voice Archetype
              </label>
              <select
                value={voiceArchetype}
                onChange={(e) => setVoiceArchetype(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="The Visionary Provocateur">The Visionary Provocateur (Contrarian, High Status, Epiphanies)</option>
                <option value="The Practical Systems Builder">The Practical Systems Builder (Actionable, No Fluff, High Yield)</option>
                <option value="The Deep Epistemic Thinker">The Deep Epistemic Thinker (First-principles, Analytical)</option>
                <option value="The High-Energy Disruptor">The High-Energy Disruptor (Urgency, Fast Paced, Unapologetic)</option>
              </select>
            </div>
          </div>

          {/* Interactive Tone Sliders */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Voice Tone Calibration Sliders</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">0 (Low) to 100 (Max)</span>
            </div>

            {[
              { key: 'formality', label: 'Formality', leftLabel: 'Casual & Colloquial', rightLabel: 'Academic / Executive' },
              { key: 'humor', label: 'Humor & Sarcasm', leftLabel: 'Purely Serious', rightLabel: 'Dry Wit & Irony' },
              { key: 'enthusiasm', label: 'Enthusiasm & Energy', leftLabel: 'Understated Calm', rightLabel: 'Electrifying Passion' },
              { key: 'provocation', label: 'Provocation & Contrast', leftLabel: 'Diplomatic / Safe', rightLabel: 'Polarizing & Contrarian' },
              { key: 'technicalDepth', label: 'Technical Depth', leftLabel: 'ELI5 Beginner', rightLabel: 'Deep Systems Architecture' },
            ].map((slider) => (
              <div key={slider.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{slider.label}</span>
                  <span className="font-mono font-bold text-indigo-400">
                    {(toneProfile as any)[slider.key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(toneProfile as any)[slider.key]}
                  onChange={(e) =>
                    setToneProfile({
                      ...toneProfile,
                      [slider.key]: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>{slider.leftLabel}</span>
                  <span>{slider.rightLabel}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Guardrails: Banned Phrases & Preferred Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banned */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Banned Cliches & Words</span>
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBannedPhrase}
                  onChange={(e) => setNewBannedPhrase(e.target.value)}
                  placeholder="e.g. Game changer"
                  className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
                <button
                  onClick={handleAddBanned}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bannedPhrases.map((phrase) => (
                  <span
                    key={phrase}
                    className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-1"
                  >
                    <span>{phrase}</span>
                    <button
                      onClick={() => handleRemoveBanned(phrase)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Keywords */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Preferred Vocabulary</span>
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="e.g. High leverage"
                  className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddKeyword}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {preferredKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-1"
                  >
                    <span>{kw}</span>
                    <button
                      onClick={() => handleRemoveKeyword(kw)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Adaptive Learned Rules Memory */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span>Learned Rules Memory</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                Auto-Updating
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Every time you edit a hook or rewrite a caption in the Clips Studio, CLIPFORGE extracts your personal preference pattern and saves it here.
            </p>

            {/* Add Custom Rule */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newLearnedRule}
                onChange={(e) => setNewLearnedRule(e.target.value)}
                placeholder="e.g. Keep LinkedIn hooks under 80 characters"
                className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddLearnedRule}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                Add Rule
              </button>
            </div>

            {/* List of Rules */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {learnedRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start justify-between gap-2 group hover:border-slate-700"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveRule(rule)}
                    className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Edit History Ledger */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Recent Edit Diff Log</span>
            </h4>
            <div className="space-y-2 max-h-[220px] overflow-y-auto text-xs text-slate-400">
              {editHistory.length > 0 ? (
                editHistory.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
                    <div className="flex items-center justify-between text-indigo-400 font-mono mb-0.5">
                      <span>{item.field}</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300">{item.diff || item.learnedRule}</p>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  No manual edits logged yet. Edits made in Clips Studio will appear here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

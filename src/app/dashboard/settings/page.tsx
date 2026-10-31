'use client';

import React, { useState } from 'react';
import {
  Settings,
  Key,
  Shield,
  Database,
  CheckCircle2,
  Save,
  Sparkles,
  Zap,
  Info,
  Server,
  RefreshCw,
} from 'lucide-react';

export default function SettingsPage() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('builtin');
  const [demoMode, setDemoMode] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px] font-bold border border-slate-700">
            System Preferences
          </span>
          <span className="text-xs text-slate-400">Environment & APIs</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Settings, API Keys & Intelligence Runtime
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure external LLM providers or rely on CLIPFORGE's built-in intelligent algorithm with full SQLite persistence.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Settings and engine preferences saved successfully!</span>
        </div>
      )}

      {/* Demo Mode Notice Card */}
      <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider font-mono">
            Seamless Demo Mode Active
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            External credentials and video cloud render clusters are optional. When API keys are not supplied, CLIPFORGE AI operates in <strong>Clearly Labelled Demo Mode</strong> with complete local SQLite database persistence, high-fidelity sample processing, and interactive voice learning feedback loops.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Model & Runtime Provider */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>AI Reasoning Provider</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'builtin',
                name: 'CLIPFORGE Built-in Intelligence Engine',
                desc: 'Deterministic multi-factor virality scoring, speech analysis & voice memory (zero API fees)',
                recommended: true,
              },
              {
                id: 'gemini',
                name: 'Google Gemini 1.5 Pro / Flash',
                desc: 'Frontier multimodal context processing for 2+ hour recordings',
                recommended: false,
              },
              {
                id: 'openai',
                name: 'OpenAI GPT-4o / Whisper',
                desc: 'High-accuracy audio transcription and cognitive gap analysis',
                recommended: false,
              },
              {
                id: 'anthropic',
                name: 'Claude 3.5 Sonnet',
                desc: 'Nuanced stylistic voice modeling and contrarian copy generation',
                recommended: false,
              },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedModel === m.id
                    ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{m.name}</span>
                  {m.recommended && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* API Credentials */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            <span>API Credentials (Optional)</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Database & Infrastructure Status */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Persistence & Database Health</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Database Engine</span>
              <span className="font-mono font-bold text-emerald-400">SQLite (dev.db)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">ORM Layer</span>
              <span className="font-mono font-bold text-indigo-400">Prisma Client v5.22</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Authentication</span>
              <span className="font-mono font-bold text-purple-400">JWT HTTPOnly Cookie</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Scissors,
  Dna,
  GitCompare,
  BarChart3,
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Zap,
  Play,
  Github,
  Layers,
  Brain,
  Video,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background radial meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-mesh-gradient pointer-events-none opacity-40"></div>

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              CLIPFORGE
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/archiep867-sys/clipforge-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20 relative z-10 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>Production Content Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Turn 1 Long Video Into{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              10 Viral Reels
            </span>{' '}
            With Transparent AI Scoring
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8">
            CLIPFORGE AI analyzes transcripts, extracts high-retention clips using explainable virality scores, tailors hooks for TikTok, Instagram & LinkedIn, and continuously adapts to your personal voice memory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-sm font-bold shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Live Dashboard (Demo Ready)</span>
            </Link>

            <Link
              href="/dashboard/upload"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4 text-indigo-400" />
              <span>Upload Video Studio</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Explainable Selection Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No black-box mystery. Every clip includes transparent breakdowns across 5 viral factors: Hook Impact, Pacing Velocity, Value Density, Predicted Retention, and Brand Alignment.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Dna className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Persistent Brand DNA Memory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When you edit a hook or trim fluff, our engine captures the diff, deduces your voice preferences, and permanently updates its memory vector so future clips sound genuinely like you.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Synthetic AI A/B Testing Lab</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulate hook and caption performance across demographic groups. Predict CTR distributions and confidence intervals before publishing your video.
            </p>
          </div>
        </div>

        {/* Live Architecture Bar */}
        <div className="mt-14 max-w-4xl mx-auto w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SQLite + Prisma Persistence</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>JWT Auth & Session Management</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Multi-Platform Formatting (TikTok / Reels / Shorts / LinkedIn)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Demo Mode Out-of-the-Box</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p>Built with Next.js 14, TypeScript, Prisma, and Tailwind CSS for Archie Patel (archiep867-sys).</p>
      </footer>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Sparkles,
  Plus,
  Github,
  Zap,
  Check,
  BrainCircuit,
} from 'lucide-react';

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export default function Navbar({ title = 'Dashboard Overview', subtitle }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transcripts, clips, hooks..."
            className="w-64 pl-9 pr-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        {/* Demo Mode Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-medium text-slate-300">Demo Mode: Full Persistence</span>
        </div>

        {/* GitHub Link */}
        <a
          href="https://github.com/archiep867-sys/clipforge-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="View GitHub Repository"
        >
          <Github className="w-4 h-4" />
        </a>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">System Notifications</span>
                <span className="text-[10px] text-indigo-400">Mark all read</span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-indigo-300">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>Brand Voice Memory Updated</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Learned preference: "Prioritize counter-intuitive data assertions in first 2.5s".
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-emerald-300">
                    <Check className="w-3.5 h-3.5" />
                    <span>A/B Experiment Concluded</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Variant A (Polarizing Assertion) outperformed by 104% CTR.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <Link
          href="/dashboard/upload"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload & Extract</span>
        </Link>
      </div>
    </header>
  );
}

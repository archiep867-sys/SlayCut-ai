'use client';

import React from 'react';
import { Sparkles, BrainCircuit, Check, ArrowRight } from 'lucide-react';

interface EditDiffLearnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnedRule: string;
  diffSummary?: string;
}

export default function EditDiffLearnerModal({
  isOpen,
  onClose,
  learnedRule,
  diffSummary,
}: EditDiffLearnerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-4 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-indigo-400">
          <BrainCircuit className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Brand Voice Memory Learned</span>
            </span>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs font-semibold text-white mt-1">
            "{learnedRule}"
          </p>

          {diffSummary && (
            <p className="text-[11px] text-slate-400 mt-1 bg-slate-950/60 p-1.5 rounded border border-slate-800">
              <span className="text-indigo-300 font-medium">Detected style adaptation:</span> {diffSummary}
            </p>
          )}

          <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Check className="w-3 h-3" /> Persisted to Brand DNA
            </span>
            <button
              onClick={onClose}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

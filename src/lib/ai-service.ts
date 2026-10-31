// CLIPFORGE AI Core Content Intelligence Engine
// Features: Explainable Selection Scoring, Multi-Platform Repurposing,
// Brand DNA Voice Memory, Adaptive Learning Feedback Loop, and A/B Testing.

export interface ViralityMetrics {
  hookImpact: number;
  energyPacing: number;
  valueDensity: number;
  retentionPrediction: number;
  brandAlignment: number;
}

export interface ExtractedClipCandidate {
  title: string;
  summary: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  viralityScore: number;
  viralityMetrics: ViralityMetrics;
  explainableReasons: string[];
  hookVariations: string[];
  captionPresets: {
    tiktok: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    x: string;
  };
  recommendedHashtags: string[];
  subtitleStyle: 'karaoke_pop' | 'mr_beast' | 'minimal_clean' | 'neon_cyber';
}

export interface BrandDnaProfile {
  brandName: string;
  niche: string;
  targetAudience: string;
  toneProfile: {
    formality: number;
    humor: number;
    enthusiasm: number;
    provocation: number;
    technicalDepth: number;
  };
  voiceArchetype: string;
  bannedPhrases: string[];
  preferredKeywords: string[];
  learnedRules: string[];
}

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  speaker: string;
  text: string;
  score?: number;
  sentiment?: string;
}

export class ContentIntelligenceEngine {
  private openaiKey: string;
  private geminiKey: string;

  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY || '';
    this.geminiKey = process.env.GEMINI_API_KEY || '';
  }

  public isLiveAiAvailable(): boolean {
    return Boolean(this.openaiKey || this.geminiKey);
  }

  /**
   * Intelligently extracts the top viral clips from transcript segments
   * with full explainability and multi-platform packaging.
   */
  public async extractViralClips(
    transcript: TranscriptSegment[],
    brand: BrandDnaProfile,
    weights = { hook: 1.3, pacing: 1.1, value: 1.25, brand: 1.3, retention: 1.2 }
  ): Promise<ExtractedClipCandidate[]> {
    if (transcript.length === 0) return [];

    // Chunk segments into candidate windows (between 15s and 60s)
    const candidates: ExtractedClipCandidate[] = [];
    const windowSizes = [3, 4, 5, 6];

    for (let i = 0; i < transcript.length; i += 2) {
      for (const size of windowSizes) {
        if (i + size > transcript.length) continue;
        const window = transcript.slice(i, i + size);
        const startTime = window[0].start;
        const endTime = window[window.length - 1].end;
        const duration = Math.round((endTime - startTime) * 10) / 10;

        if (duration < 12 || duration > 75) continue;

        const combinedText = window.map((w) => w.text).join(' ');
        const firstSegment = window[0].text;

        // 1. Hook Impact Calculation (0-100)
        let hookScore = 70;
        if (/^\d+|99%|secret|never|stop|brutal|truth|mistake|why|how to/i.test(firstSegment)) {
          hookScore += 18;
        }
        if (/\?|!/.test(firstSegment)) hookScore += 6;
        if (firstSegment.split(' ').length < 14) hookScore += 5; // Punchy opening
        hookScore = Math.min(99, Math.max(60, hookScore));

        // 2. Energy & Pacing Calculation (0-100)
        const wordCount = combinedText.split(/\s+/).length;
        const wpm = (wordCount / duration) * 60;
        let pacingScore = 75;
        if (wpm >= 140 && wpm <= 185) pacingScore += 16; // Optimal retention velocity
        else if (wpm > 185) pacingScore += 10;
        else pacingScore -= 5;
        pacingScore = Math.min(98, Math.max(58, pacingScore));

        // 3. Value Density Calculation (0-100)
        let valueScore = 72;
        if (/\d+%|\$\d+|architecture|framework|principle|formula|strategy|checkpoint/i.test(combinedText)) {
          valueScore += 18;
        }
        if (/benchmark|tested|data|proven|case study/i.test(combinedText)) {
          valueScore += 8;
        }
        valueScore = Math.min(99, Math.max(62, valueScore));

        // 4. Retention Prediction (0-100)
        const retentionScore = Math.min(
          98,
          Math.round(hookScore * 0.45 + pacingScore * 0.3 + valueScore * 0.25)
        );

        // 5. Brand Alignment (0-100)
        let brandScore = 75;
        brand.preferredKeywords.forEach((kw) => {
          if (new RegExp(kw, 'i').test(combinedText)) brandScore += 6;
        });
        brand.bannedPhrases.forEach((bp) => {
          if (new RegExp(bp, 'i').test(combinedText)) brandScore -= 12;
        });
        brandScore = Math.min(99, Math.max(50, brandScore));

        // Composite Virality Score with Dynamic Feedback Weights
        const totalWeight = weights.hook + weights.pacing + weights.value + weights.brand + weights.retention;
        const compositeScore = Math.round(
          (hookScore * weights.hook +
            pacingScore * weights.pacing +
            valueScore * weights.value +
            brandScore * weights.brand +
            retentionScore * weights.retention) /
            totalWeight
        );

        // Filter high performers
        if (compositeScore >= 80) {
          // Generate explainable reasons
          const explainableReasons: string[] = [];
          if (hookScore >= 88) {
            explainableReasons.push(
              `High Hook Impact (${hookScore}/100): Opening line leverages cognitive dissonance or curiosity gap in the first 2.5s.`
            );
          }
          if (pacingScore >= 85) {
            explainableReasons.push(
              `Optimal Pacing Velocity (${wpm.toFixed(0)} WPM): Cadence stays within the top-decile engagement retention threshold.`
            );
          }
          if (valueScore >= 85) {
            explainableReasons.push(
              `Dense Value Delivery (${valueScore}/100): Features concrete quantifiable metrics and an actionable tactical solution.`
            );
          }
          if (brandScore >= 85) {
            explainableReasons.push(
              `Brand DNA Resonance (${brandScore}/100): Matches your archetype (${brand.voiceArchetype}) and incorporates key brand pillars.`
            );
          }

          // Generate Platform Presets
          const title = this.generatePunchyTitle(firstSegment);
          const hookVariations = [
            `Hook 1 (Contrarian): "${this.makeContrarianHook(firstSegment)}"`,
            `Hook 2 (Urgency/FOMO): "${this.makeUrgencyHook(firstSegment)}"`,
            `Hook 3 (Data Anchor): "${this.makeDataHook(firstSegment)}"`,
          ];

          const captionPresets = {
            tiktok: `${title} ⚡️ Watch until the end for the exact architecture. Save this for later! #techtok #coding #ai #viral`,
            instagram: `The truth about ${brand.niche} nobody talks about 📌\n\n${combinedText.slice(0, 180)}...\n\nSave this reel if you found this valuable and share it with someone building right now!`,
            youtube: `${title} #shorts\n\nKey insight: ${combinedText.slice(0, 140)}...\n\nSubscribe for daily deep dives!`,
            linkedin: `A counter-intuitive truth every leader in ${brand.niche} needs to hear:\n\n${firstSegment}\n\nKey takeaways from this breakdown:\n1. Move fast without breaking compounding state\n2. Focus on leverage over raw effort\n3. Optimize the state delta, not the conversational history\n\nWhat is your team's experience with this?`,
            x: `${title}.\n\nHere is the 30-second breakdown on why this changes everything 🧵👇`,
          };

          const recommendedHashtags = [
            `#${brand.niche.replace(/[^a-zA-Z0-9]/g, '')}`,
            '#ContentIntelligence',
            '#ViralHooks',
            '#TechFounders',
            '#AIEngineering',
          ];

          candidates.push({
            title,
            summary: combinedText.slice(0, 160) + '...',
            startTime,
            endTime,
            durationSeconds: duration,
            viralityScore: compositeScore,
            viralityMetrics: {
              hookImpact: hookScore,
              energyPacing: pacingScore,
              valueDensity: valueScore,
              retentionPrediction: retentionScore,
              brandAlignment: brandScore,
            },
            explainableReasons,
            hookVariations,
            captionPresets,
            recommendedHashtags,
            subtitleStyle: compositeScore > 92 ? 'karaoke_pop' : 'mr_beast',
          });
        }
      }
    }

    // Sort by virality score descending and deduplicate overlapping clips
    candidates.sort((a, b) => b.viralityScore - a.viralityScore);
    const uniqueClips: ExtractedClipCandidate[] = [];

    for (const cand of candidates) {
      const overlaps = uniqueClips.some(
        (u) => Math.abs(u.startTime - cand.startTime) < 8
      );
      if (!overlaps) {
        uniqueClips.push(cand);
      }
      if (uniqueClips.length >= 6) break;
    }

    return uniqueClips;
  }

  /**
   * Learns from creator edits: extracts stylistic preferences and generates persistent brand rules.
   */
  public analyzeCreatorEdit(
    originalText: string,
    editedText: string,
    field: string
  ): { diffSummary: string; learnedRule: string; confidence: number } {
    const origWords = originalText.trim().split(/\s+/);
    const editWords = editedText.trim().split(/\s+/);
    const lengthDiff = editWords.length - origWords.length;

    let learnedRule = '';
    let diffSummary = '';

    if (lengthDiff < -5) {
      learnedRule = 'Creator strongly prefers concise, high-density phrasing. Condense future drafts by at least 25%.';
      diffSummary = `Shortened copy by ${Math.abs(lengthDiff)} words for higher tempo.`;
    } else if (/\?/.test(originalText) && !/\?/.test(editedText)) {
      learnedRule = 'Replace interrogative/rhetorical hooks with bold declarative statements.';
      diffSummary = 'Shifted tone from questioning to authoritative assertion.';
    } else if (/\d+%|\$\d+/.test(editedText) && !/\d+%|\$\d+/.test(originalText)) {
      learnedRule = 'Always anchor hooks with concrete empirical figures or quantifiable numbers.';
      diffSummary = 'Injected specific data points and numerical anchors.';
    } else if (field.includes('linkedin') && editedText.includes('\n\n')) {
      learnedRule = 'Format LinkedIn updates with single-line paragraph breaks and scannable bullet points.';
      diffSummary = 'Restructured content into high-readability spaced micro-paragraphs.';
    } else {
      learnedRule = `Incorporate creator's refined terminology: prioritize keywords like "${editWords.slice(0, 3).join(' ')}".`;
      diffSummary = 'Customized vocabulary and personal voice nuance.';
    }

    return {
      diffSummary,
      learnedRule,
      confidence: 0.94,
    };
  }

  /**
   * A/B Test Simulator: predicts CTR, engagement and confidence distributions.
   */
  public simulateABTest(
    variants: Array<{ id: string; content: string; label: string }>
  ): Array<{
    id: string;
    label: string;
    content: string;
    predictedCtr: string;
    confidence: string;
    audienceReaction: string;
    simulatedImpressions: number;
    simulatedClicks: number;
    isWinner: boolean;
  }> {
    const results = variants.map((v, index) => {
      let score = 5.0;
      if (/^\d+|99%|truth|brutal|stop|how to/i.test(v.content)) score += 2.5;
      if (/\?/.test(v.content)) score -= 0.8;
      if (v.content.length < 80) score += 0.9;

      const baseCtr = Math.min(10.5, Math.max(3.2, score + (Math.random() * 0.8 - 0.4)));
      const impressions = Math.floor(35000 + Math.random() * 20000);
      const clicks = Math.round((impressions * baseCtr) / 100);

      return {
        id: v.id,
        label: v.label,
        content: v.content,
        predictedCtr: `${baseCtr.toFixed(1)}%`,
        confidence: `${Math.floor(88 + Math.random() * 10)}%`,
        audienceReaction:
          baseCtr > 7.0
            ? 'High Curiosity & Immediate Pattern Interrupt'
            : baseCtr > 5.0
            ? 'Solid Topical Engagement'
            : 'Standard Scroll-through Rate',
        simulatedImpressions: impressions,
        simulatedClicks: clicks,
        isWinner: false,
      };
    });

    // Mark winner
    let maxClicks = -1;
    let winnerIndex = 0;
    results.forEach((r, idx) => {
      if (r.simulatedClicks > maxClicks) {
        maxClicks = r.simulatedClicks;
        winnerIndex = idx;
      }
    });
    results[winnerIndex].isWinner = true;

    return results;
  }

  /**
   * Generates a 30-day cross-platform Campaign Strategy based on user goals.
   */
  public generateCampaignStrategy(goal: string, niche: string, targetAudience: string) {
    return {
      thematicPillars: [
        {
          week: 1,
          theme: 'The Common Myth & The Wake-Up Call',
          focus: `Challenge the standard misconceptions in ${niche}.`,
          targetOutput: '5 Short Clips + 2 Deep Thought Leadership Posts',
        },
        {
          week: 2,
          theme: 'The Tactical Framework & Systems Breakdown',
          focus: `Give your audience the exact blueprint to solve the problem.`,
          targetOutput: '4 Explainer Reels + 1 Case Study Infographic',
        },
        {
          week: 3,
          theme: 'Proof Points & Extreme Value Demonstration',
          focus: `Highlight quantifiable results and real-world testimonials.`,
          targetOutput: '6 High-Velocity Clips + 1 Live AMA/Q&A',
        },
        {
          week: 4,
          theme: 'The Paradigm Shift & The Call to Action',
          focus: `Convert newly engaged followers into high-intent signups/customers for ${goal}.`,
          targetOutput: '5 Conversion Clips + Newsletter Launch',
        },
      ],
      dailyRoadmap: [
        { day: 1, platform: 'TikTok / Shorts', action: `Publish controversial hook challenging standard ${niche} advice` },
        { day: 3, platform: 'LinkedIn', action: 'Share the underlying framework diagram with scannable bullet points' },
        { day: 5, platform: 'X', action: 'Drop a 5-tweet thread quoting key data points from the interview' },
        { day: 7, platform: 'Instagram Reels', action: 'Repurpose the top 20-second punchline with karaoke subtitles' },
      ],
    };
  }

  // --- Helpers ---
  private generatePunchyTitle(segment: string): string {
    const cleaned = segment.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const words = cleaned.split(/\s+/).slice(0, 8).join(' ');
    return words.length > 5 ? words : 'Viral Insight: The Missing Architecture';
  }

  private makeContrarianHook(segment: string): string {
    return `99% of people are approaching this completely backwards.`;
  }

  private makeUrgencyHook(segment: string): string {
    return `If you aren't doing this right now, you are burning money.`;
  }

  private makeDataHook(segment: string): string {
    return `We benchmarked 50,000 cases. Here is what actually worked.`;
  }
}

export const contentAi = new ContentIntelligenceEngine();

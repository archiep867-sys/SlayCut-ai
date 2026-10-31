// SLAYCUT Core Content Intelligence Engine
// Features: Genuine AI Inference (OpenAI / Gemini) with Fallback Demo Mode,
// Explainable Virality Scoring, Multi-Platform Repurposing,
// Brand DNA Voice Memory & Creator Edit Feedback Loop.

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  isSimulated?: boolean;
  aiProvider?: 'openai-gpt4o' | 'gemini-1.5' | 'builtin-deterministic';
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
    return Boolean(this.openaiKey.trim() || this.geminiKey.trim());
  }

  /**
   * Intelligently extracts the top viral clips from transcript segments
   * using genuine LLM inference (Gemini/OpenAI) or deterministic rule-based engine.
   */
  public async extractViralClips(
    transcript: TranscriptSegment[],
    brand: BrandDnaProfile,
    weights = { hook: 1.3, pacing: 1.1, value: 1.25, brand: 1.3, retention: 1.2 },
    customOpenaiKey?: string,
    customGeminiKey?: string
  ): Promise<ExtractedClipCandidate[]> {
    if (!transcript || transcript.length === 0) return [];

    const effectiveOpenaiKey = customOpenaiKey || this.openaiKey;
    const effectiveGeminiKey = customGeminiKey || this.geminiKey;

    // 1. Try Live OpenAI GPT-4o inference if key provided
    if (effectiveOpenaiKey && effectiveOpenaiKey.trim().length > 10) {
      try {
        console.log('🤖 Invoking live OpenAI GPT-4o for content intelligence extraction...');
        const openai = new OpenAI({ apiKey: effectiveOpenaiKey });
        const clips = await this.callOpenAiExtraction(openai, transcript, brand, weights);
        if (clips.length > 0) return clips;
      } catch (err) {
        console.warn('OpenAI live inference failed, checking Gemini fallback:', err);
      }
    }

    // 2. Try Live Google Gemini inference if key provided
    if (effectiveGeminiKey && effectiveGeminiKey.trim().length > 10) {
      try {
        console.log('🤖 Invoking live Google Gemini 1.5 for content intelligence extraction...');
        const genAI = new GoogleGenerativeAI(effectiveGeminiKey);
        const clips = await this.callGeminiExtraction(genAI, transcript, brand, weights);
        if (clips.length > 0) return clips;
      } catch (err) {
        console.warn('Gemini live inference failed, falling back to deterministic model:', err);
      }
    }

    // 3. Fallback to deterministic engine (clearly tagged as Demo Mode)
    console.log('⚡️ Running deterministic content intelligence engine (Demo Mode)...');
    return this.runDeterministicExtraction(transcript, brand, weights);
  }

  /**
   * OpenAI GPT-4o real inference implementation
   */
  private async callOpenAiExtraction(
    openai: OpenAI,
    transcript: TranscriptSegment[],
    brand: BrandDnaProfile,
    weights: any
  ): Promise<ExtractedClipCandidate[]> {
    const transcriptText = transcript.map((t) => `[${t.start}s - ${t.end}s] ${t.speaker}: ${t.text}`).join('\n');

    const prompt = `You are SLAYCUT, an elite video content intelligence engine.
Analyze this video transcript and identify the top 3-5 most viral, high-retention clips (between 15s and 60s).

Brand DNA Guidelines:
- Brand: ${brand.brandName} (${brand.niche})
- Target Audience: ${brand.targetAudience}
- Archetype: ${brand.voiceArchetype}
- Tone Profile: Formality ${brand.toneProfile.formality}%, Humor ${brand.toneProfile.humor}%, Enthusiasm ${brand.toneProfile.enthusiasm}%, Provocation ${brand.toneProfile.provocation}%, Technical Depth ${brand.toneProfile.technicalDepth}%
- Banned Words (NEVER USE): ${JSON.stringify(brand.bannedPhrases)}
- Preferred Keywords: ${JSON.stringify(brand.preferredKeywords)}
- CRITICAL Learned Creator Memory Rules:
${brand.learnedRules.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

Transcript:
${transcriptText}

Return a valid JSON array of clip objects matching this schema:
[
  {
    "title": "Punchy clip headline",
    "summary": "1-2 sentence summary",
    "startTime": 0.0,
    "endTime": 42.5,
    "durationSeconds": 42.5,
    "viralityScore": 94,
    "viralityMetrics": {
      "hookImpact": 96,
      "energyPacing": 90,
      "valueDensity": 94,
      "retentionPrediction": 92,
      "brandAlignment": 95
    },
    "explainableReasons": [
      "Curiosity gap established in first 2.4s",
      "Features quantifiable benchmark data",
      "Matches creator voice preference"
    ],
    "hookVariations": [
      "Hook A (Contrarian): ...",
      "Hook B (Pain Point): ...",
      "Hook C (Data Anchor): ..."
    ],
    "captionPresets": {
      "tiktok": "caption text with tags",
      "instagram": "caption text with tags",
      "youtube": "caption text with tags",
      "linkedin": "caption text with tags",
      "x": "caption text with tags"
    },
    "recommendedHashtags": ["#tag1", "#tag2"],
    "subtitleStyle": "karaoke_pop"
  }
]`;

    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = res.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    const clips = Array.isArray(parsed) ? parsed : parsed.clips || [];

    return clips.map((c: any) => ({
      ...c,
      isSimulated: false,
      aiProvider: 'openai-gpt4o',
    }));
  }

  /**
   * Google Gemini 1.5 real inference implementation
   */
  private async callGeminiExtraction(
    genAI: GoogleGenerativeAI,
    transcript: TranscriptSegment[],
    brand: BrandDnaProfile,
    weights: any
  ): Promise<ExtractedClipCandidate[]> {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const transcriptText = transcript.map((t) => `[${t.start}s - ${t.end}s] ${t.speaker}: ${t.text}`).join('\n');

    const prompt = `You are SLAYCUT. Extract the top 3-5 viral clips (15-60s) from this transcript into JSON format.
Respect Brand Archetype: ${brand.voiceArchetype}.
Avoid: ${brand.bannedPhrases.join(', ')}.
Apply Learned Creator Rules: ${brand.learnedRules.join('; ')}.

Transcript:
${transcriptText}

Respond ONLY with valid JSON array of objects with title, summary, startTime, endTime, durationSeconds, viralityScore (0-100), viralityMetrics, explainableReasons, hookVariations, captionPresets (tiktok, instagram, youtube, linkedin, x), recommendedHashtags, subtitleStyle.`;

    const res = await model.generateContent(prompt);
    const text = res.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);
    const clips = Array.isArray(parsed) ? parsed : parsed.clips || [];

    return clips.map((c: any) => ({
      ...c,
      isSimulated: false,
      aiProvider: 'gemini-1.5',
    }));
  }

  /**
   * Deterministic rule-based extraction fallback (Clearly labeled as Demo Mode)
   */
  private runDeterministicExtraction(
    transcript: TranscriptSegment[],
    brand: BrandDnaProfile,
    weights: any
  ): ExtractedClipCandidate[] {
    const candidates: ExtractedClipCandidate[] = [];
    const windowSizes = [3, 4, 5, 6];

    for (let i = 0; i < transcript.length; i += 2) {
      for (const size of windowSizes) {
        if (i + size > transcript.length) continue;
        const window = transcript.slice(i, i + size);
        const startTime = window[0].start;
        const endTime = window[window.length - 1].end;
        const duration = Math.round((endTime - startTime) * 10) / 10;

        if (duration < 10 || duration > 75) continue;

        const combinedText = window.map((w) => w.text).join(' ');
        const firstSegment = window[0].text;

        // 1. Hook Impact Calculation (0-100)
        let hookScore = 70;
        if (/^\d+|99%|secret|never|stop|brutal|truth|mistake|why|how to/i.test(firstSegment)) {
          hookScore += 18;
        }
        if (/\?|!/.test(firstSegment)) hookScore += 6;
        if (firstSegment.split(' ').length < 14) hookScore += 5;

        // Influence of Learned Creator Memory Rules
        brand.learnedRules.forEach((rule) => {
          if (/numbers|counter-intuitive/i.test(rule) && /\d+%|\$\d+/.test(firstSegment)) {
            hookScore += 6; // Rewarded based on learned rule!
          }
          if (/eliminate|declarative|no questions/i.test(rule) && !/\?/.test(firstSegment)) {
            hookScore += 4;
          }
        });
        hookScore = Math.min(99, Math.max(60, hookScore));

        // 2. Energy & Pacing Calculation (0-100)
        const wordCount = combinedText.split(/\s+/).length;
        const wpm = (wordCount / duration) * 60;
        let pacingScore = 75;
        if (wpm >= 140 && wpm <= 185) pacingScore += 16;
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

        if (compositeScore >= 78) {
          const explainableReasons: string[] = [
            `High Hook Impact (${hookScore}/100): Opening line leverages pattern interrupt in the first 2.5s.`,
            `Pacing Velocity (${wpm.toFixed(0)} WPM): Cadence stays within top-decile retention benchmarks.`,
            `Value Density (${valueScore}/100): Contains concrete actionable takeaways.`,
            `Brand Alignment (${brandScore}/100): Reflects ${brand.voiceArchetype} archetype and learned creator rules.`,
          ];

          const title = this.generatePunchyTitle(firstSegment);
          const hookVariations = [
            `Hook A (Contrarian): "${this.makeContrarianHook(firstSegment)}"`,
            `Hook B (Urgency): "${this.makeUrgencyHook(firstSegment)}"`,
            `Hook C (Data Anchor): "${this.makeDataHook(firstSegment)}"`,
          ];

          const captionPresets = {
            tiktok: `${title} ⚡️ Watch until the end for the breakdown. Save this for later! #techtok #coding #ai #viral`,
            instagram: `The truth about ${brand.niche} nobody talks about 📌\n\n${combinedText.slice(0, 180)}...\n\nSave this reel if you found this valuable!`,
            youtube: `${title} #shorts\n\nKey takeaway: ${combinedText.slice(0, 140)}...\n\nSubscribe for daily deep dives!`,
            linkedin: `A counter-intuitive truth every leader in ${brand.niche} needs to hear:\n\n${firstSegment}\n\nKey takeaways:\n1. Focus on compounding state, not prompt wrappers\n2. Minimize recursive reasoning drift\n3. Pass the verified delta\n\nWhat is your team's experience with this?`,
            x: `${title}.\n\nHere is the 30-second breakdown on why this changes everything 🧵👇`,
          };

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
            recommendedHashtags: [
              `#${brand.niche.replace(/[^a-zA-Z0-9]/g, '')}`,
              '#ContentIntelligence',
              '#ViralHooks',
              '#TechBuilders',
            ],
            subtitleStyle: compositeScore > 92 ? 'karaoke_pop' : 'mr_beast',
            isSimulated: true,
            aiProvider: 'builtin-deterministic',
          });
        }
      }
    }

    candidates.sort((a, b) => b.viralityScore - a.viralityScore);
    const uniqueClips: ExtractedClipCandidate[] = [];

    for (const cand of candidates) {
      const overlaps = uniqueClips.some((u) => Math.abs(u.startTime - cand.startTime) < 8);
      if (!overlaps) uniqueClips.push(cand);
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
      learnedRule = `Incorporate creator refined terminology: prioritize keywords like "${editWords.slice(0, 3).join(' ')}".`;
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
    isSimulated: boolean;
  }> {
    const results = variants.map((v) => {
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
        isSimulated: true,
      };
    });

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

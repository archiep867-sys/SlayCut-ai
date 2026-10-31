const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SLAYCUT AI database...');

  // Clean existing records if any
  await prisma.learningPreference.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.competitorIntel.deleteMany();
  await prisma.campaignStrategy.deleteMany();
  await prisma.contentCalendarItem.deleteMany();
  await prisma.aBExperiment.deleteMany();
  await prisma.extractedClip.deleteMany();
  await prisma.videoProject.deleteMany();
  await prisma.brandDNA.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('slaycut2026!', 10);

  // 1. Create Demo User
  const user = await prisma.user.create({
    data: {
      email: 'archie@slaycut.ai',
      name: 'Archie Patel',
      passwordHash,
      role: 'creator',
      isDemo: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
  });

  console.log(`Created user: ${user.email} (${user.id})`);

  // 2. Create Brand DNA
  const brandDNA = await prisma.brandDNA.create({
    data: {
      userId: user.id,
      brandName: 'HyperScale AI Lab',
      tagline: 'Deconstructing frontier AI, agentic systems, and high-velocity engineering',
      niche: 'AI Engineering & High-Growth Tech',
      targetAudience: 'Senior Engineers, AI Researchers, Tech Founders & Product Leaders (Ages 22-45)',
      toneProfile: JSON.stringify({
        formality: 35,
        humor: 55,
        enthusiasm: 85,
        provocation: 78,
        technicalDepth: 82,
      }),
      voiceArchetype: 'The Visionary Provocateur',
      bannedPhrases: JSON.stringify([
        'Game changer',
        'In today\'s video',
        'Smash the like button',
        'Without further ado',
        'Synergistic paradigm',
      ]),
      preferredKeywords: JSON.stringify([
        'Agentic workflows',
        'First-principles',
        'Compounding latency',
        'Zero-to-one',
        'Autonomous orchestration',
        'High leverage',
      ]),
      learnedRules: JSON.stringify([
        'Creator prefers starting hooks with concrete numbers or counter-intuitive paradoxes over generic questions.',
        'Keep LinkedIn captions formatted with 1-line punchy bullet points and no hashtags in the first paragraph.',
        'Always include source timestamp in YouTube Shorts description.',
        'Eliminate self-promotional intros; cut directly to the epiphany statement in the first 1.8 seconds.',
      ]),
      editHistory: JSON.stringify([
        {
          timestamp: '2026-10-24T14:20:00Z',
          field: 'hook_tiktok',
          diff: 'Removed: "Are you ready for AI agents?" -> Added: "99% of developers are building AI agents completely backwards. Here is why."',
          learnedTrait: 'Prefers provocative polarizing assertions over interrogative openers',
        },
        {
          timestamp: '2026-10-28T09:15:00Z',
          field: 'caption_linkedin',
          diff: 'Trimmed corporate preamble by 40%, converted body into 4 numbered tactical architecture principles',
          learnedTrait: 'Demands dense, immediately applicable engineering frameworks',
        },
      ]),
    },
  });

  // 3. Create Learning Preferences
  await prisma.learningPreference.create({
    data: {
      userId: user.id,
      hookImpactWeight: 1.35,
      pacingEnergyWeight: 1.15,
      valueDensityWeight: 1.30,
      brandAlignmentWeight: 1.25,
      retentionWeight: 1.20,
      feedbackCount: 14,
      learnedPatterns: JSON.stringify([
        'Higher weighting given to rapid inflection changes between 0.5s - 2.5s',
        'Clips containing quantifiable benchmarks score +12% higher virality probability',
        'Conversational pauses longer than 1.4s trigger automatic split markers',
      ]),
    },
  });

  // 4. Create Video Projects
  const transcript1 = [
    { id: 1, start: 0.0, end: 4.8, speaker: 'Archie Patel', text: '99% of people building AI agents today are focusing on the completely wrong bottleneck.', score: 98, sentiment: 'provocative' },
    { id: 2, start: 4.9, end: 9.8, speaker: 'Archie Patel', text: 'They obsess over prompt templates and context window sizes, while ignoring memory state convergence.', score: 92, sentiment: 'analytical' },
    { id: 3, start: 10.0, end: 17.5, speaker: 'Dr. Elena Vance', text: 'Exactly. When we benchmarked 50,000 multi-agent trajectories at the frontier lab, hallucination was not the killer. Context degradation was.', score: 96, sentiment: 'authoritative' },
    { id: 4, start: 17.8, end: 25.2, speaker: 'Dr. Elena Vance', text: 'If an agent has to take more than 7 consecutive autonomous reasoning turns, standard LLMs drift into logical loops 64% of the time.', score: 95, sentiment: 'revelatory' },
    { id: 5, start: 25.5, end: 32.0, speaker: 'Archie Patel', text: 'So what is the architecture that actually fixes this in production systems?', score: 88, sentiment: 'curious' },
    { id: 6, start: 32.2, end: 42.4, speaker: 'Dr. Elena Vance', text: 'Two words: Dynamic Epistemic Checkpoints. You take snapshots of the agent state graph after every tool invocation, prune contradictory observations, and feed only the consolidated delta back.', score: 99, sentiment: 'masterclass' },
    { id: 7, start: 42.6, end: 49.0, speaker: 'Archie Patel', text: 'That drops error rates by almost 80% without spending an extra dollar on inference compute.', score: 94, sentiment: 'high_value' },
  ];

  const project1 = await prisma.videoProject.create({
    data: {
      userId: user.id,
      title: 'The Trillion Dollar AI Agent Architecture — Frontier Deep Dive with Dr. Elena Vance',
      description: 'Exclusive 42-minute interview deconstructing state graph memory, multi-agent coordination bottlenecks, and production deployments.',
      sourceUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoType: 'podcast',
      durationSeconds: 2520,
      status: 'completed',
      transcriptText: transcript1.map(t => `${t.speaker}: ${t.text}`).join('\n'),
      transcriptJson: JSON.stringify(transcript1),
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      metadataJson: JSON.stringify({
        resolution: '3840x2160 (4K UHD)',
        fps: 60,
        audioChannels: 'Stereo 48kHz 24-bit',
        fileSizeBytes: 2450000000,
        speakersDetected: 2,
      }),
    },
  });

  const project2 = await prisma.videoProject.create({
    data: {
      userId: user.id,
      title: 'From 0 to $10M ARR: The Non-Obvious Playbook for Technical Founders',
      description: 'Keynote breakdown of zero-customer acquisition cost channels, viral product loops, and developer retention flywheels.',
      sourceUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      videoType: 'keynote',
      durationSeconds: 3120,
      status: 'completed',
      transcriptText: 'Archie Patel: The single biggest trap founders fall into is confusing early tech enthusiasm with durable willingness to pay...',
      transcriptJson: JSON.stringify([
        { id: 1, start: 0.0, end: 5.2, speaker: 'Archie Patel', text: 'The single biggest trap founders fall into is confusing early tech enthusiasm with durable willingness to pay.', score: 95, sentiment: 'provocative' },
        { id: 2, start: 5.5, end: 12.0, speaker: 'Archie Patel', text: 'If your software saves someone 10 hours a week, they will thank you. If it eliminates a $20,000 monthly compliance fine, they will pay you immediately.', score: 97, sentiment: 'golden_insight' },
      ]),
      thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      metadataJson: JSON.stringify({
        resolution: '1920x1080 (FHD)',
        fps: 30,
        audioChannels: 'Stereo',
      }),
    },
  });

  // 5. Create Extracted Clips with High Explainability & Multi-Platform Assets
  const clip1 = await prisma.extractedClip.create({
    data: {
      videoProjectId: project1.id,
      userId: user.id,
      title: 'The Real Reason 99% of AI Agents Fail After 7 Turns',
      summary: 'Elena Vance and Archie break down why context degradation, not hallucination, causes 64% of agent loops and introduce Dynamic Epistemic Checkpoints.',
      startTime: 0.0,
      endTime: 48.5,
      durationSeconds: 48.5,
      viralityScore: 97,
      viralityMetrics: JSON.stringify({
        hookImpact: 98,
        energyPacing: 92,
        valueDensity: 97,
        retentionPrediction: 95,
        brandAlignment: 99,
      }),
      explainableReasons: JSON.stringify([
        'Curiosity & Status Gap: The opening statement ("99% of people are building AI agents completely backwards") immediately forces senior practitioners to question their assumptions.',
        'High Authority Data Backing: Dr. Vance cites a rigorous 50,000-trajectory benchmark from a frontier lab within the first 14 seconds.',
        'Concrete Tactical Solution: Ends with an actionable technical mechanism ("Dynamic Epistemic Checkpoints") that delivers immediate utility without fluff.',
        'Pacing Velocity: Word density averages 168 wpm with zero dead pauses >0.8s, matching top-decile retention benchmarks.',
      ]),
      hookVariations: JSON.stringify([
        'Hook A (Curiosity Gap): "99% of developers are building AI agents completely backwards. Here is why."',
        'Hook B (Pain Point): "If your AI agent keeps hallucinating in production, you are solving the wrong problem."',
        'Hook C (Data Shock): "We tested 50,000 AI agent runs. 64% crashed because of this one architectural flaw."',
      ]),
      captionPresets: JSON.stringify({
        tiktok: 'Why your AI agent fails after 7 prompts 🤖💀 Stop tweaking prompts and start fixing your state graph memory. Full breakdown in bio! #ai #softwareengineering #coding #tech #aitools',
        instagram: 'The brutal truth about AI agent architecture in 2026 ⚡️\n\nMost teams blame the LLM when their multi-agent workflows derail. But the real culprit isn\'t intelligence—it\'s context degradation.\n\nHere is how Dynamic Epistemic Checkpoints reduce trajectory drift by 80% without increasing inference costs.\n\nSave this reel for your next architecture review 📌',
        youtube: 'Why 99% of AI Agents Fail in Production (The 7-Turn Loop Problem) #shorts\n\nIn this clip, Dr. Elena Vance explains how context degradation ruins autonomous multi-agent trajectories and how epistemic checkpoints solve it.',
        linkedin: 'Why 99% of engineering teams are building AI agents on the wrong mental model:\n\nWhen Dr. Elena Vance analyzed 50,000 multi-agent trajectories at a frontier lab, one finding was undeniable:\n\nHallucination isn\'t what destroys production agents. Context degradation is.\n\nAfter 7 autonomous reasoning turns, standard LLMs enter recursive logic loops 64% of the time.\n\nThe engineering solution: Dynamic Epistemic Checkpoints.\n\n1. Snapshot the agent state graph after every tool call\n2. Prune conflicting historical observations\n3. Pass only the verified state delta\n\nResult: 80% error reduction at zero additional compute cost.\n\nAre you handling state memory inside the prompt or at the graph layer?',
        x: 'We analyzed 50,000 AI agent runs.\n\n64% failed after turn #7.\n\nNot because the model was dumb.\nBecause context degraded.\n\nHere is the architecture frontier labs use to fix it in 3 steps 🧵👇',
      }),
      recommendedHashtags: JSON.stringify(['#AIEngineering', '#MachineLearning', '#SoftwareArchitecture', '#Agents', '#TechLeadership', '#NextGenAI']),
      subtitleStyle: 'karaoke_pop',
      status: 'approved',
      performanceFeedback: 'high',
      creatorEditsJson: JSON.stringify({
        editedFields: ['hook_tiktok', 'caption_linkedin'],
        timestamp: '2026-10-29T11:00:00Z',
      }),
    },
  });

  const clip2 = await prisma.extractedClip.create({
    data: {
      videoProjectId: project1.id,
      userId: user.id,
      title: 'How Dynamic Epistemic Checkpoints Cut AI Costs by 80%',
      summary: 'Step-by-step breakdown of how state snapshotting stops memory drift and saves enterprise teams thousands in recurring token usage.',
      startTime: 32.0,
      endTime: 49.0,
      durationSeconds: 17.0,
      viralityScore: 93,
      viralityMetrics: JSON.stringify({
        hookImpact: 94,
        energyPacing: 90,
        valueDensity: 96,
        retentionPrediction: 91,
        brandAlignment: 94,
      }),
      explainableReasons: JSON.stringify([
        'Rapid Epiphany Delivery: Delivers the core insight within the first 6 seconds.',
        'High Shareability Index: Highly applicable to startup engineers looking to optimize API costs.',
        'Strong Retention Curve: Punchy 17-second loop optimized for 140%+ average completion rate on Shorts and Reels.',
      ]),
      hookVariations: JSON.stringify([
        'Hook A: "How to cut your LLM API bill by 80% using a single architecture pattern."',
        'Hook B: "Stop passing the entire chat history into your agents. Do this instead."',
      ]),
      captionPresets: JSON.stringify({
        tiktok: 'Cut your AI API bill by 80% with this simple architecture tweak 💸⚡️ #techtok #coding #aiagents #startup',
        instagram: 'Every founder building with LLMs needs to see this token optimization framework 🚀 Drop a comment if you want the sample code repository.',
        youtube: 'How to Cut AI Token Costs by 80% (Dynamic Checkpoints) #shorts',
        linkedin: 'A simple design pattern that slashed our autonomous agent token footprint by 80%.\n\nStop appending conversation logs. Snapshot the state delta.',
        x: 'Stop wasting thousands on recurring LLM context bloat.\n\nHere is the epistemic checkpoint pattern explained in 17 seconds ⚡️',
      }),
      recommendedHashtags: JSON.stringify(['#CostOptimization', '#AITools', '#PromptEngineering', '#TechHacks']),
      subtitleStyle: 'mr_beast',
      status: 'scheduled',
      performanceFeedback: null,
    },
  });

  const clip3 = await prisma.extractedClip.create({
    data: {
      videoProjectId: project2.id,
      userId: user.id,
      title: 'The Brutal Difference Between Enthusiasts and Paying Customers',
      summary: 'Why saving people time is a weak business model compared to eliminating urgent regulatory or financial risk.',
      startTime: 0.0,
      endTime: 38.0,
      durationSeconds: 38.0,
      viralityScore: 95,
      viralityMetrics: JSON.stringify({
        hookImpact: 96,
        energyPacing: 93,
        valueDensity: 95,
        retentionPrediction: 94,
        brandAlignment: 97,
      }),
      explainableReasons: JSON.stringify([
        'Direct Emotional Resonance: Targets the #1 fear of early-stage SaaS founders (building software nobody pays for).',
        'Contrarian Framework: Disproves the popular trope "just build something that saves 5 hours a week".',
        'Clear Contrast Comparison: "Nice to have" vs "Urgent insurance policy" makes the takeaway unforgettable.',
      ]),
      hookVariations: JSON.stringify([
        'Hook A: "If your software only saves people time, you don\'t have a real business."',
        'Hook B: "Why 90% of B2B SaaS startups die at $20k MRR."',
      ]),
      captionPresets: JSON.stringify({
        tiktok: 'Why saving people time won\'t get you to $10M ARR 💡 #entrepreneurship #startup #businessadvice #saas',
        instagram: 'The difference between software people praise on Twitter vs software CFOs write $50,000 checks for 📈\n\nSave this for your next pricing discussion.',
        youtube: 'Why "Time Saving" SaaS Products Fail to Scale #shorts',
        linkedin: 'The harshest lesson I learned scaling B2B software:\n\nIf you save someone 10 hours a week, they say thank you.\nIf you prevent a $50,000 quarterly audit failure, they hand you their credit card on the first call.\n\nSell aspirin, not vitamins. Sell insurance against catastrophe, not mild productivity.',
        x: 'Vitamins get cancelled during downturns.\nAspirin gets renewed.\n\nHere is how to position your SaaS so churn drops to near zero 🧵',
      }),
      recommendedHashtags: JSON.stringify(['#SaaSGrowth', '#FounderJourney', '#B2B', '#StartupStrategy', '#VentureCapital']),
      subtitleStyle: 'neon_cyber',
      status: 'extracted',
      performanceFeedback: 'high',
    },
  });

  // 6. Create A/B Experiments
  await prisma.aBExperiment.create({
    data: {
      userId: user.id,
      videoProjectId: project1.id,
      clipId: clip1.id,
      title: 'Hook Optimization: The 7-Turn Agent Failure',
      testType: 'hook',
      variantsJson: JSON.stringify([
        {
          id: 'var_a',
          label: 'Variant A (Polarizing Assertion)',
          content: '99% of developers are building AI agents completely backwards. Here is why.',
          predictedCtr: '8.4%',
          confidence: '96%',
          audienceReaction: 'High Curiosity & Professional Urgency',
          simulatedImpressions: 48200,
          simulatedClicks: 4048,
          isWinner: true,
        },
        {
          id: 'var_b',
          label: 'Variant B (Direct Question)',
          content: 'Have you ever wondered why your AI agents break after a few turns?',
          predictedCtr: '4.1%',
          confidence: '82%',
          audienceReaction: 'Moderate interest, easily scrolled past',
          simulatedImpressions: 45000,
          simulatedClicks: 1845,
          isWinner: false,
        },
        {
          id: 'var_c',
          label: 'Variant C (Empirical Data Anchor)',
          content: 'We benchmarked 50,000 autonomous AI agents. 64% crashed right at turn #7.',
          predictedCtr: '7.9%',
          confidence: '94%',
          audienceReaction: 'Very high credibility among engineers',
          simulatedImpressions: 47100,
          simulatedClicks: 3720,
          isWinner: false,
        },
      ]),
      winnerVariantId: 'var_a',
      status: 'concluded',
      insightsSummary: 'Variant A drove 104% higher initial click-through than Variant B. Strong negative assertion creates an immediate cognitive dissonance that compels the viewer to verify if they are committing the cited error.',
    },
  });

  await prisma.aBExperiment.create({
    data: {
      userId: user.id,
      videoProjectId: project2.id,
      clipId: clip3.id,
      title: 'Caption Framing: Vitamin vs Painkiller B2B',
      testType: 'caption',
      variantsJson: JSON.stringify([
        {
          id: 'cap_1',
          label: 'Variant 1 (Contrarian Executive Framing)',
          content: 'Why saving people time is the single worst value proposition in modern enterprise software...',
          predictedCtr: '6.8%',
          confidence: '89%',
          audienceReaction: 'Sparks healthy debate in comments',
          simulatedImpressions: 32000,
          simulatedClicks: 2176,
          isWinner: true,
        },
        {
          id: 'cap_2',
          label: 'Variant 2 (How-To Educational)',
          content: '3 pricing strategies to transition your software from a productivity tool into mission-critical infra...',
          predictedCtr: '5.2%',
          confidence: '85%',
          audienceReaction: 'Good save rate, lower top-of-funnel reach',
          simulatedImpressions: 31000,
          simulatedClicks: 1612,
          isWinner: false,
        },
      ]),
      winnerVariantId: 'cap_1',
      status: 'running',
      insightsSummary: 'Contrarian statement currently outpacing standard how-to framing by 30% in engagement velocity.',
    },
  });

  // 7. Create Content Calendar Items
  const now = new Date();
  const dayOffset = (days, hours = 14) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hours, 0, 0, 0);
    return d;
  };

  await prisma.contentCalendarItem.create({
    data: {
      userId: user.id,
      clipId: clip1.id,
      title: 'TikTok Drop: Why AI Agents Fail at Turn 7',
      platform: 'tiktok',
      scheduledFor: dayOffset(1, 11),
      status: 'scheduled',
      hookUsed: '99% of developers are building AI agents completely backwards. Here is why.',
      captionUsed: 'Why your AI agent fails after 7 prompts 🤖💀 Stop tweaking prompts and start fixing your state graph memory. Full breakdown in bio!',
      hashtagsUsed: JSON.stringify(['#ai', '#softwareengineering', '#coding', '#aitools']),
      campaignTheme: 'AI Architecture Masterclass Q4',
    },
  });

  await prisma.contentCalendarItem.create({
    data: {
      userId: user.id,
      clipId: clip1.id,
      title: 'LinkedIn Deep Dive: The 7-Turn Loop Problem',
      platform: 'linkedin',
      scheduledFor: dayOffset(1, 15),
      status: 'scheduled',
      hookUsed: 'Why 99% of engineering teams are building AI agents on the wrong mental model:',
      captionUsed: 'When Dr. Elena Vance analyzed 50,000 multi-agent trajectories at a frontier lab, one finding was undeniable: Context degradation, not hallucination, is the root killer.',
      hashtagsUsed: JSON.stringify(['#AIEngineering', '#SoftwareArchitecture', '#TechLeadership']),
      campaignTheme: 'AI Architecture Masterclass Q4',
    },
  });

  await prisma.contentCalendarItem.create({
    data: {
      userId: user.id,
      clipId: clip2.id,
      title: 'Instagram Reel: How Epistemic Checkpoints Save 80% Token Bill',
      platform: 'instagram',
      scheduledFor: dayOffset(2, 18),
      status: 'scheduled',
      hookUsed: 'How to cut your LLM API bill by 80% using a single architecture pattern.',
      captionUsed: 'Every founder building with LLMs needs to see this token optimization framework 🚀 Drop a comment if you want the sample code repository.',
      hashtagsUsed: JSON.stringify(['#techtok', '#startuphacks', '#ai']),
      campaignTheme: 'Developer Leverage Series',
    },
  });

  await prisma.contentCalendarItem.create({
    data: {
      userId: user.id,
      clipId: clip3.id,
      title: 'YouTube Shorts: The Time-Saving Trap in B2B',
      platform: 'youtube',
      scheduledFor: dayOffset(3, 13),
      status: 'scheduled',
      hookUsed: 'If your software only saves people time, you don\'t have a real business.',
      captionUsed: 'Why "Time Saving" SaaS Products Fail to Scale #shorts',
      hashtagsUsed: JSON.stringify(['#SaaSGrowth', '#FounderJourney', '#shorts']),
      campaignTheme: 'Zero to $10M Playbook',
    },
  });

  await prisma.contentCalendarItem.create({
    data: {
      userId: user.id,
      clipId: clip1.id,
      title: 'X Thread: 50,000 AI Agent Benchmarks',
      platform: 'x',
      scheduledFor: dayOffset(4, 16),
      status: 'scheduled',
      hookUsed: 'We analyzed 50,000 AI agent runs. 64% failed after turn #7.',
      captionUsed: 'Full 7-tweet breakdown of epistemic graph snapshots for autonomous agents.',
      hashtagsUsed: JSON.stringify(['#buildinpublic', '#ai']),
      campaignTheme: 'AI Architecture Masterclass Q4',
    },
  });

  // 8. Create Campaign Strategy
  await prisma.campaignStrategy.create({
    data: {
      userId: user.id,
      title: 'Autonomous Content Intelligence: The Q4 Authority Sprint',
      goal: 'Position Brand as the Preeminent Authority on Production AI Systems & Drive 2,500 Qualified Developer Waitlist Signups',
      niche: 'AI Engineering & Developer Tooling',
      targetAudience: 'Senior Fullstack/ML Engineers, CTOs, Technical AI Founders',
      durationDays: 30,
      thematicPillars: JSON.stringify([
        {
          week: 1,
          theme: 'Deconstructing the Myth of Prompt Engineering',
          focus: 'Shift audience mindshare from fragile prompt wrappers to persistent state systems.',
          targetOutput: '5 High-Impact Reels + 2 In-Depth LinkedIn Essays',
        },
        {
          week: 2,
          theme: 'Enterprise Cost Traps in Modern Generative Systems',
          focus: 'Highlight token inflation, latency cascading, and memory bloat.',
          targetOutput: '4 Explainer Shorts + 1 Benchmark Data Infographic',
        },
        {
          week: 3,
          theme: 'Production Multi-Agent Case Studies',
          focus: 'Showcase real-world architectures that survived 1M+ live executions.',
          targetOutput: '6 High-Velocity Clips + 1 Community AMA',
        },
        {
          week: 4,
          theme: 'The Autonomous Future: 2027 Vision',
          focus: 'Forward-looking thought leadership cementing founder brand equity.',
          targetOutput: '5 Trend Clips + Conversion Push to Platform Signups',
        },
      ]),
      dailyRoadmap: JSON.stringify([
        { day: 1, platform: 'TikTok / Shorts', action: 'Drop "99% AI Agents Fail" video at 11:00 AM UTC' },
        { day: 2, platform: 'LinkedIn', action: 'Publish architecture blueprint with state snapshot diagram' },
        { day: 3, platform: 'X', action: 'Engage in replies with leading AI engineers quoting benchmark stats' },
        { day: 4, platform: 'Instagram Reels', action: 'Publish 17s "Cut API Bill" hook with carousel breakdown' },
      ]),
      status: 'active',
    },
  });

  // 9. Create Competitor Intelligence
  await prisma.competitorIntel.create({
    data: {
      userId: user.id,
      competitorHandle: '@alexhormozi',
      platform: 'youtube',
      channelName: 'Alex Hormozi',
      followersCount: '2.8M',
      topViralHooks: JSON.stringify([
        '"If you are making less than $100k a year, you don\'t have a money problem, you have a skill problem."',
        '"Here is how to get 1,000 customers in 30 days without spending money on ads."',
        '"The secret millionaires won\'t tell you about leverage."',
      ]),
      contentStyle: 'High-contrast studio lighting, rapid text animation, extreme emphasis on first-3-second bold claims, declarative authority.',
      counterStrategy: 'Hormozi focuses on broad financial generalities. Counter with deep technical specificity: swap business aphorisms for verifiable systems engineering metrics. Our audience values precision over hype.',
      benchmarkMetrics: JSON.stringify({
        avgViews: '480K',
        viralityVelocity: '8.8x',
        formatWinner: 'Talking Head + Bold White/Yellow Center Subtitles',
        avgDurationSec: 52,
      }),
    },
  });

  await prisma.competitorIntel.create({
    data: {
      userId: user.id,
      competitorHandle: '@thesamparr',
      platform: 'x',
      channelName: 'Sam Parr (My First Million)',
      followersCount: '410K',
      topViralHooks: JSON.stringify([
        '"This founder built a $50M business with zero employees. Here is the exact stack:"',
        '"I analyzed the top 100 fastest growing bootstrapped apps of 2025. Here are the 3 patterns:"',
      ]),
      contentStyle: 'Curated case-study storytelling, insider breakdown format, high curiosity cliffhangers.',
      counterStrategy: 'Integrate real architecture diagrams and code repos into case-study breakdowns to win over high-LTV technical builders who crave tangible implementation details.',
      benchmarkMetrics: JSON.stringify({
        avgViews: '210K',
        viralityVelocity: '6.4x',
        formatWinner: 'Curated 7-Part Thread with Visual Screenshots',
        avgDurationSec: 45,
      }),
    },
  });

  // 10. Create Analytics Snapshot with Second-by-Second Retention Curve
  const retentionCurve = [
    { second: 0, retentionRate: 100, label: 'Video Start' },
    { second: 1, retentionRate: 94, label: 'Hook Impact' },
    { second: 3, retentionRate: 88, label: '3s Critical Window' },
    { second: 6, retentionRate: 84, label: 'Problem Statement' },
    { second: 12, retentionRate: 81, label: 'Benchmark Cited' },
    { second: 18, retentionRate: 79, label: 'Guest Authority' },
    { second: 26, retentionRate: 76, label: 'Framework Unveiled' },
    { second: 34, retentionRate: 74, label: 'Solution Mechanism' },
    { second: 42, retentionRate: 71, label: 'Benefit Metric' },
    { second: 48, retentionRate: 68, label: 'Call to Action' },
  ];

  await prisma.analyticsSnapshot.create({
    data: {
      userId: user.id,
      period: '30d',
      totalViews: 1845200,
      totalEngagement: 249600,
      avgRetentionRate: 76.4,
      clipsGenerated: 48,
      platformBreakdown: JSON.stringify({
        tiktok: { views: 820000, shares: 32000, comments: 14200, saves: 58000, avgWatchTimeSec: 28.4 },
        instagram: { views: 540000, shares: 41000, comments: 9800, saves: 72000, avgWatchTimeSec: 32.1 },
        youtube: { views: 320000, shares: 12000, comments: 6400, saves: 18000, avgWatchTimeSec: 39.5 },
        linkedin: { views: 110000, shares: 8400, comments: 5200, saves: 21000, avgWatchTimeSec: 44.0 },
        x: { views: 55200, shares: 4800, comments: 2100, saves: 9400, avgWatchTimeSec: 22.0 },
      }),
      retentionCurveJson: JSON.stringify(retentionCurve),
      topPerformingHooks: JSON.stringify([
        '99% of developers are building AI agents completely backwards (CTR 8.4%)',
        'How to cut your LLM API bill by 80% with one pattern (CTR 7.8%)',
        'Why saving people time won\'t get you to $10M ARR (CTR 7.2%)',
      ]),
    },
  });

  console.log('✅ Seed completed successfully with realistic content intelligence data!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

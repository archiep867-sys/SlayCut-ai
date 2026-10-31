import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { contentAi, TranscriptSegment } from '@/lib/ai-service';
import { videoProcessor } from '@/lib/video-processor';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await prisma.videoProject.findMany({
      where: { userId: user.id },
      include: {
        clips: {
          orderBy: { viralityScore: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';
    let title = '';
    let description = '';
    let videoType = 'podcast';
    let sampleType = '';
    let sourceUrl = '';
    let savedVideoFilePath: string | null = null;
    let savedAudioFilePath: string | null = null;
    let videoDuration = 1800;
    let transcriptionEngine = 'demo_deterministic';
    let isSimulated = true;
    let transcripts: TranscriptSegment[] = [];
    let transcriptText = '';

    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads', 'videos');
    const audioDir = path.join(publicDir, 'uploads', 'audio');

    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

    // Handle Multipart Form Data (Real File Upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      title = (formData.get('title') as string) || '';
      description = (formData.get('description') as string) || '';
      videoType = (formData.get('videoType') as string) || 'podcast';

      if (!file) {
        return NextResponse.json({ error: 'No video or audio file provided' }, { status: 400 });
      }

      // Security check: validate MIME type
      const allowedTypes = [
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo',
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
      ];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|avi|mp3|wav)$/i)) {
        return NextResponse.json(
          { error: 'Invalid file format. Allowed formats: MP4, MOV, WebM, MP3, WAV.' },
          { status: 400 }
        );
      }

      // File size limit check (e.g. 200MB max)
      const maxSizeBytes = 200 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return NextResponse.json(
          { error: 'File size exceeds maximum 200MB limit.' },
          { status: 413 }
        );
      }

      const fileExt = path.extname(file.name) || '.mp4';
      const fileId = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      savedVideoFilePath = path.join(uploadsDir, `${fileId}${fileExt}`);
      savedAudioFilePath = path.join(audioDir, `${fileId}.mp3`);

      // Write uploaded file bytes to disk
      const bytes = await file.arrayBuffer();
      fs.writeFileSync(savedVideoFilePath, Buffer.from(bytes));
      sourceUrl = `/uploads/videos/${fileId}${fileExt}`;
      title = title || file.name.replace(/\.[^/.]+$/, '');

      console.log(`📁 File uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);

      // 1. Run ffprobe to get real technical video metrics
      const probeMetrics = await videoProcessor.probeVideo(savedVideoFilePath);
      videoDuration = probeMetrics.durationSeconds || 60;

      // 2. Run FFmpeg to extract high-clarity 16kHz audio
      try {
        await videoProcessor.extractAudio(savedVideoFilePath, savedAudioFilePath);
        console.log(`🎵 Extracted speech audio to: ${savedAudioFilePath}`);
      } catch (err) {
        console.warn('Audio extraction warning:', err);
      }

      // 3. Transcribe audio with OpenAI Whisper API / Gemini 1.5 with transparent fallback
      const transcriptionResult = await videoProcessor.transcribeAudio(
        savedAudioFilePath,
        process.env.OPENAI_API_KEY,
        process.env.GEMINI_API_KEY,
        videoDuration
      );

      transcripts = transcriptionResult.transcriptJson;
      transcriptText = transcriptionResult.transcriptText;
      transcriptionEngine = transcriptionResult.engine;
      isSimulated = transcriptionResult.isSimulated;
    } else {
      // JSON Payload (Sample Demo or Remote URL Import)
      const body = await req.json();
      title = body.title || '';
      description = body.description || '';
      videoType = body.videoType || 'podcast';
      sampleType = body.sampleType || '';
      sourceUrl = body.sourceUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

      if (sampleType === 'podcast' || (!sampleType && videoType === 'podcast')) {
        title = title || 'The High-Leverage Engineering Manifesto: 0 to 1M Users with AI Agents';
        videoDuration = 2140;
        transcripts = [
          { id: 1, start: 0.0, end: 4.5, speaker: user.name, text: '95% of people building AI applications right now are doing something fatally flawed.', score: 96, sentiment: 'provocative' },
          { id: 2, start: 4.6, end: 11.2, speaker: user.name, text: 'They are building thin wrappers around public model endpoints without any defensible data flywheel or custom state memory.', score: 94, sentiment: 'analytical' },
          { id: 3, start: 11.5, end: 19.8, speaker: 'Guest Partner', text: 'When OpenAI or Google releases an update, their entire product becomes an obsolete single feature overnight. We saw this happen to dozens of YC companies.', score: 98, sentiment: 'alarming' },
          { id: 4, start: 20.2, end: 28.5, speaker: user.name, text: 'The only defensible moat is deep proprietary workflow integration and domain-specific state graphs that no foundation model can replicate.', score: 97, sentiment: 'epiphany' },
          { id: 5, start: 29.0, end: 38.0, speaker: 'Guest Partner', text: 'If your users perform 100 micro-actions a day inside your bespoke state machine, switching costs become insurmountable.', score: 92, sentiment: 'tactical' },
        ];
      } else {
        title = title || 'From 0 to $10M ARR: The Non-Obvious Playbook';
        videoDuration = 3120;
        transcripts = [
          { id: 1, start: 0.0, end: 5.0, speaker: user.name, text: 'Stop pitching features to customers. Nobody cares about your software features.', score: 95, sentiment: 'provocative' },
          { id: 2, start: 5.2, end: 13.0, speaker: user.name, text: 'Customers only care about eliminating catastrophic risk or achieving their quarterly revenue threshold with zero friction.', score: 96, sentiment: 'sharp' },
          { id: 3, start: 13.5, end: 22.0, speaker: user.name, text: 'When we shifted our headline from "AI Video Automation" to "Generate 10 Viral Short Clips in 60 Seconds", conversion spiked by 340%.', score: 99, sentiment: 'benchmark' },
          { id: 4, start: 22.5, end: 31.0, speaker: user.name, text: 'Sell the guaranteed destination, not the plane engine mechanics.', score: 94, sentiment: 'punchline' },
        ];
      }
      transcriptText = transcripts.map((t) => `${t.speaker}: ${t.text}`).join('\n');
      transcriptionEngine = 'demo_deterministic';
      isSimulated = true;
    }

    // Load user's Brand DNA profile & learning preferences
    const brandDna = await prisma.brandDNA.findUnique({ where: { userId: user.id } });
    const learningPref = await prisma.learningPreference.findUnique({ where: { userId: user.id } });

    const brandProfile = {
      brandName: brandDna?.brandName || 'Creator AI',
      niche: brandDna?.niche || 'Technology',
      targetAudience: brandDna?.targetAudience || 'Builders & Founders',
      toneProfile: brandDna ? JSON.parse(brandDna.toneProfile) : { formality: 40, humor: 60, enthusiasm: 80, provocation: 75, technicalDepth: 70 },
      voiceArchetype: brandDna?.voiceArchetype || 'The Visionary Provocateur',
      bannedPhrases: brandDna ? JSON.parse(brandDna.bannedPhrases) : ['Game changer'],
      preferredKeywords: brandDna ? JSON.parse(brandDna.preferredKeywords) : ['High leverage', 'Systems'],
      learnedRules: brandDna ? JSON.parse(brandDna.learnedRules) : [],
    };

    const weights = {
      hook: learningPref?.hookImpactWeight || 1.3,
      pacing: learningPref?.pacingEnergyWeight || 1.1,
      value: learningPref?.valueDensityWeight || 1.25,
      brand: learningPref?.brandAlignmentWeight || 1.3,
      retention: learningPref?.retentionWeight || 1.2,
    };

    // 1. Create Video Project record in database
    const project = await prisma.videoProject.create({
      data: {
        userId: user.id,
        title,
        description: description || `Recording processed with ${transcriptionEngine}.`,
        sourceUrl,
        videoFilePath: savedVideoFilePath,
        audioFilePath: savedAudioFilePath,
        videoType,
        durationSeconds: videoDuration,
        status: 'completed',
        transcriptionEngine,
        isSimulated,
        transcriptText,
        transcriptJson: JSON.stringify(transcripts),
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        metadataJson: JSON.stringify({
          durationSeconds: videoDuration,
          transcriptionEngine,
          isSimulated,
          speakers: ['Host', 'Guest Specialist'],
          hasRealAudio: Boolean(savedAudioFilePath),
        }),
      },
    });

    // 2. Run Intelligent Virality Extraction (with Genuine AI or Deterministic Fallback)
    const candidateClips = await contentAi.extractViralClips(
      transcripts,
      brandProfile,
      weights,
      process.env.OPENAI_API_KEY,
      process.env.GEMINI_API_KEY
    );

    // 3. Persist Extracted Clips in database and pre-generate subtitles
    const createdClips = [];
    const clipsDir = path.join(publicDir, 'uploads', 'clips');
    const subtitlesDir = path.join(publicDir, 'uploads', 'subtitles');
    if (!fs.existsSync(clipsDir)) fs.mkdirSync(clipsDir, { recursive: true });
    if (!fs.existsSync(subtitlesDir)) fs.mkdirSync(subtitlesDir, { recursive: true });

    for (const cand of candidateClips) {
      const clip = await prisma.extractedClip.create({
        data: {
          videoProjectId: project.id,
          userId: user.id,
          title: cand.title,
          summary: cand.summary,
          startTime: cand.startTime,
          endTime: cand.endTime,
          durationSeconds: cand.durationSeconds,
          viralityScore: cand.viralityScore,
          viralityMetrics: JSON.stringify(cand.viralityMetrics),
          explainableReasons: JSON.stringify(cand.explainableReasons),
          hookVariations: JSON.stringify(cand.hookVariations),
          captionPresets: JSON.stringify(cand.captionPresets),
          recommendedHashtags: JSON.stringify(cand.recommendedHashtags),
          subtitleStyle: cand.subtitleStyle,
          isSimulated: cand.isSimulated || false,
          status: 'extracted',
        },
      });

      // Generate actual .srt and .vtt subtitle file for this clip
      const clipSegments = transcripts.filter(
        (t) => t.start >= cand.startTime - 1 && t.end <= cand.endTime + 1
      );
      const srtPath = path.join(subtitlesDir, `${clip.id}.srt`);
      videoProcessor.generateSubtitles(
        clipSegments.length > 0 ? clipSegments : [{ id: 1, start: 0, end: cand.durationSeconds, speaker: 'Host', text: cand.title }],
        srtPath
      );

      createdClips.push({
        ...clip,
        subtitleSrtUrl: `/uploads/subtitles/${clip.id}.srt`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Processed video with ${transcriptionEngine}. Extracted ${createdClips.length} viral clips.`,
      project: {
        ...project,
        clips: createdClips,
      },
    });
  } catch (error: any) {
    console.error('Error creating video project:', error);
    return NextResponse.json(
      { error: `Failed to process video project: ${error?.message || error}` },
      { status: 500 }
    );
  }
}

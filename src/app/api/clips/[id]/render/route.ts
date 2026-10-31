import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { videoProcessor } from '@/lib/video-processor';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clip = await prisma.extractedClip.findUnique({
      where: { id: params.id },
      include: { videoProject: true },
    });

    if (!clip || clip.userId !== user.id) {
      return NextResponse.json({ error: 'Clip not found' }, { status: 404 });
    }

    const { format = 'vertical' } = await req.json().catch(() => ({ format: 'vertical' }));

    // Prepare paths
    const publicDir = path.join(process.cwd(), 'public');
    const clipsDir = path.join(publicDir, 'uploads', 'clips');
    const subtitlesDir = path.join(publicDir, 'uploads', 'subtitles');

    if (!fs.existsSync(clipsDir)) fs.mkdirSync(clipsDir, { recursive: true });
    if (!fs.existsSync(subtitlesDir)) fs.mkdirSync(subtitlesDir, { recursive: true });

    // Output filenames
    const outputFilename = `${clip.id}_standard.mp4`;
    const verticalFilename = `${clip.id}_vertical_9x16.mp4`;
    const srtFilename = `${clip.id}.srt`;

    const outputPath = path.join(clipsDir, outputFilename);
    const verticalPath = path.join(clipsDir, verticalFilename);
    const srtPath = path.join(subtitlesDir, srtFilename);

    // Source video path resolution
    const sourceVideoPath =
      clip.videoProject.videoFilePath ||
      path.join(publicDir, 'uploads', 'videos', `${clip.videoProjectId}.mp4`);

    console.log(`🎬 Rendering clip ${clip.id} from ${clip.startTime}s to ${clip.endTime}s...`);

    // 1. Render standard horizontal clip
    await videoProcessor.renderVideoClip(
      sourceVideoPath,
      clip.startTime,
      clip.durationSeconds,
      outputPath,
      { vertical: false }
    );

    // 2. Render vertical 9:16 clip
    await videoProcessor.renderVideoClip(
      sourceVideoPath,
      clip.startTime,
      clip.durationSeconds,
      verticalPath,
      { vertical: true }
    );

    // 3. Generate .SRT subtitles for this clip segment
    let segments: any[] = [];
    if (clip.videoProject.transcriptJson) {
      try {
        const fullTranscript = JSON.parse(clip.videoProject.transcriptJson);
        segments = fullTranscript.filter(
          (s: any) => s.start >= clip.startTime - 1 && s.end <= clip.endTime + 1
        );
      } catch (e) {
        console.warn('Could not parse transcript JSON for SRT:', e);
      }
    }

    if (segments.length === 0) {
      segments = [
        {
          id: 1,
          start: 0,
          end: clip.durationSeconds,
          text: clip.title,
        },
      ];
    } else {
      // Normalize segment timestamps relative to clip start (0.0s)
      segments = segments.map((s, idx) => ({
        ...s,
        id: idx + 1,
        start: Math.max(0, s.start - clip.startTime),
        end: Math.min(clip.durationSeconds, s.end - clip.startTime),
      }));
    }

    videoProcessor.generateSubtitles(segments, srtPath);

    // 4. Update ExtractedClip record with live URLs
    const publicRenderUrl = `/uploads/clips/${outputFilename}`;
    const publicVerticalUrl = `/uploads/clips/${verticalFilename}`;
    const publicSrtUrl = `/uploads/subtitles/${srtFilename}`;

    const updated = await prisma.extractedClip.update({
      where: { id: clip.id },
      data: {
        renderedVideoUrl: publicRenderUrl,
        renderedVerticalUrl: publicVerticalUrl,
        subtitleSrtUrl: publicSrtUrl,
      },
    });

    const fileStats = fs.statSync(verticalPath);

    return NextResponse.json({
      success: true,
      message: 'Clip rendered successfully with FFmpeg!',
      clip: updated,
      downloads: {
        verticalMp4: publicVerticalUrl,
        standardMp4: publicRenderUrl,
        subtitlesSrt: publicSrtUrl,
        fileSizeBytes: fileStats.size,
      },
    });
  } catch (error: any) {
    console.error('Error rendering clip:', error);
    return NextResponse.json(
      { error: `Failed to render clip: ${error?.message || error}` },
      { status: 500 }
    );
  }
}

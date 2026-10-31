import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');
    const minScore = searchParams.get('minScore');

    const whereClause: any = { userId: user.id };
    if (videoId) whereClause.videoProjectId = videoId;
    if (minScore) whereClause.viralityScore = { gte: parseInt(minScore, 10) };

    const clips = await prisma.extractedClip.findMany({
      where: whereClause,
      include: {
        videoProject: {
          select: { title: true, videoType: true, thumbnailUrl: true, sourceUrl: true },
        },
      },
      orderBy: { viralityScore: 'desc' },
    });

    return NextResponse.json({ clips });
  } catch (error) {
    console.error('Error fetching clips:', error);
    return NextResponse.json({ error: 'Failed to fetch clips' }, { status: 500 });
  }
}

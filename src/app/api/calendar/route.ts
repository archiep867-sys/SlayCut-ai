import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.contentCalendarItem.findMany({
      where: { userId: user.id },
      include: {
        clip: {
          select: { title: true, viralityScore: true, durationSeconds: true },
        },
      },
      orderBy: { scheduledFor: 'asc' },
    });

    const parsed = items.map((item) => ({
      ...item,
      hashtags: JSON.parse(item.hashtagsUsed || '[]'),
    }));

    return NextResponse.json({ items: parsed });
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clipId, title, platform, scheduledFor, hookUsed, captionUsed, hashtagsUsed, campaignTheme } = await req.json();

    const item = await prisma.contentCalendarItem.create({
      data: {
        userId: user.id,
        clipId: clipId || null,
        title: title || 'Scheduled Drop',
        platform: platform || 'tiktok',
        scheduledFor: new Date(scheduledFor || Date.now() + 86400000),
        status: 'scheduled',
        hookUsed: hookUsed || '',
        captionUsed: captionUsed || '',
        hashtagsUsed: JSON.stringify(hashtagsUsed || ['#viral', '#tech']),
        campaignTheme: campaignTheme || 'General Growth',
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        ...item,
        hashtags: JSON.parse(item.hashtagsUsed),
      },
    });
  } catch (error) {
    console.error('Error scheduling post:', error);
    return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 });
  }
}

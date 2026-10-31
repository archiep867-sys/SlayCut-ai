import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { contentAi } from '@/lib/ai-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await prisma.campaignStrategy.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = campaigns.map((c) => ({
      ...c,
      thematicPillars: JSON.parse(c.thematicPillars || '[]'),
      dailyRoadmap: JSON.parse(c.dailyRoadmap || '[]'),
    }));

    return NextResponse.json({ campaigns: parsed });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { goal, niche, targetAudience, durationDays } = await req.json();

    const strategy = contentAi.generateCampaignStrategy(
      goal || 'Drive 1,000 Product Signups',
      niche || 'Tech & Engineering',
      targetAudience || 'Founders & Engineers'
    );

    const campaign = await prisma.campaignStrategy.create({
      data: {
        userId: user.id,
        title: `Campaign: ${goal || '30-Day Growth Acceleration'}`,
        goal: goal || 'Lead Acquisition & Brand Equity',
        niche: niche || 'Tech',
        targetAudience: targetAudience || 'Builders',
        durationDays: durationDays || 30,
        thematicPillars: JSON.stringify(strategy.thematicPillars),
        dailyRoadmap: JSON.stringify(strategy.dailyRoadmap),
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      campaign: {
        ...campaign,
        thematicPillars: strategy.thematicPillars,
        dailyRoadmap: strategy.dailyRoadmap,
      },
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Failed to generate campaign' }, { status: 500 });
  }
}

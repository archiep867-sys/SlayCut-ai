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

    const experiments = await prisma.aBExperiment.findMany({
      where: { userId: user.id },
      include: {
        clip: { select: { title: true, viralityScore: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = experiments.map((exp) => ({
      ...exp,
      variants: JSON.parse(exp.variantsJson || '[]'),
    }));

    return NextResponse.json({ experiments: parsed });
  } catch (error) {
    console.error('Error fetching experiments:', error);
    return NextResponse.json({ error: 'Failed to fetch experiments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, testType, clipId, variants } = await req.json();

    if (!title || !variants || variants.length < 2) {
      return NextResponse.json({ error: 'At least 2 variants required' }, { status: 400 });
    }

    // Run AI Audience Simulator
    const simulatedVariants = contentAi.simulateABTest(variants);
    const winner = simulatedVariants.find((v) => v.isWinner);

    const experiment = await prisma.aBExperiment.create({
      data: {
        userId: user.id,
        clipId: clipId || null,
        title,
        testType: testType || 'hook',
        variantsJson: JSON.stringify(simulatedVariants),
        winnerVariantId: winner?.id || simulatedVariants[0].id,
        status: 'running',
        insightsSummary: `AI Audience Modeling predicts "${winner?.label}" will yield ${winner?.predictedCtr} CTR (${winner?.audienceReaction}).`,
      },
    });

    return NextResponse.json({
      success: true,
      experiment: {
        ...experiment,
        variants: simulatedVariants,
      },
    });
  } catch (error) {
    console.error('Error creating experiment:', error);
    return NextResponse.json({ error: 'Failed to create experiment' }, { status: 500 });
  }
}

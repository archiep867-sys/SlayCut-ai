import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feedback } = await req.json(); // "high", "neutral", "low"

    const clip = await prisma.extractedClip.findUnique({
      where: { id: params.id },
    });

    if (!clip || clip.userId !== user.id) {
      return NextResponse.json({ error: 'Clip not found' }, { status: 404 });
    }

    // 1. Update clip feedback
    await prisma.extractedClip.update({
      where: { id: params.id },
      data: { performanceFeedback: feedback },
    });

    // 2. Adaptive Learning Feedback Loop: adjust scoring weights
    const metrics = JSON.parse(clip.viralityMetrics || '{}');
    const pref = await prisma.learningPreference.findUnique({
      where: { userId: user.id },
    });

    if (pref) {
      let delta = feedback === 'high' ? 0.05 : feedback === 'low' ? -0.04 : 0;

      // If clip scored high in hookImpact and user rated "high", reinforce hook weight
      const hookWeight = Math.min(1.8, Math.max(0.8, pref.hookImpactWeight + (metrics.hookImpact > 90 ? delta : -delta / 2)));
      const valueWeight = Math.min(1.8, Math.max(0.8, pref.valueDensityWeight + (metrics.valueDensity > 90 ? delta : -delta / 2)));
      const brandWeight = Math.min(1.8, Math.max(0.8, pref.brandAlignmentWeight + (metrics.brandAlignment > 90 ? delta : -delta / 2)));

      const currentPatterns: string[] = JSON.parse(pref.learnedPatterns || '[]');
      const newPattern = feedback === 'high'
        ? `User validated high performance on "${clip.title.slice(0, 30)}..." -> Increased weight for Hook & Value Density.`
        : `User flagged lower performance on "${clip.title.slice(0, 30)}..." -> Calibrated threshold down.`;

      currentPatterns.unshift(newPattern);

      await prisma.learningPreference.update({
        where: { userId: user.id },
        data: {
          hookImpactWeight: Math.round(hookWeight * 100) / 100,
          valueDensityWeight: Math.round(valueWeight * 100) / 100,
          brandAlignmentWeight: Math.round(brandWeight * 100) / 100,
          feedbackCount: pref.feedbackCount + 1,
          learnedPatterns: JSON.stringify(currentPatterns.slice(0, 20)),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Feedback recorded. Adaptive intelligence model re-calibrated.`,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
  }
}

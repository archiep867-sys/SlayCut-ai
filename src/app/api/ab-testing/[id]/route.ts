import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { realImpressions, realClicks, verifiedWinnerId } = body;

    const realCtr =
      realImpressions > 0 ? (realClicks / realImpressions) * 100 : 0;

    const updated = await prisma.aBExperiment.update({
      where: { id: params.id },
      data: {
        isSimulated: false, // Now has real verified data!
        realImpressions: realImpressions || 0,
        realClicks: realClicks || 0,
        realCtr: Math.round(realCtr * 10) / 10,
        verifiedWinnerId: verifiedWinnerId || null,
        status: 'concluded',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Real in-market performance metrics recorded!',
      experiment: updated,
    });
  } catch (error) {
    console.error('Error updating A/B experiment:', error);
    return NextResponse.json({ error: 'Failed to update experiment' }, { status: 500 });
  }
}

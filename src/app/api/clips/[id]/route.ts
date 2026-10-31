import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { contentAi } from '@/lib/ai-service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clip = await prisma.extractedClip.findUnique({
      where: { id: params.id },
      include: {
        videoProject: true,
      },
    });

    if (!clip || clip.userId !== user.id) {
      return NextResponse.json({ error: 'Clip not found' }, { status: 404 });
    }

    return NextResponse.json({ clip });
  } catch (error) {
    console.error('Error fetching clip:', error);
    return NextResponse.json({ error: 'Failed to fetch clip' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, captionPresets, subtitleStyle, status, editedField, originalText, newText } = body;

    const existingClip = await prisma.extractedClip.findUnique({
      where: { id: params.id },
    });

    if (!existingClip || existingClip.userId !== user.id) {
      return NextResponse.json({ error: 'Clip not found' }, { status: 404 });
    }

    // 1. If user edited copy, run the Brand DNA Learning Feedback Loop
    let newlyLearnedRule: string | null = null;
    let diffSummary: string | null = null;

    if (originalText && newText && originalText !== newText) {
      const learningResult = contentAi.analyzeCreatorEdit(originalText, newText, editedField || 'caption');
      newlyLearnedRule = learningResult.learnedRule;
      diffSummary = learningResult.diffSummary;

      // Persist to user's Brand DNA
      const brand = await prisma.brandDNA.findUnique({
        where: { userId: user.id },
      });

      if (brand) {
        const currentRules: string[] = JSON.parse(brand.learnedRules || '[]');
        const currentHistory: any[] = JSON.parse(brand.editHistory || '[]');

        if (!currentRules.includes(newlyLearnedRule)) {
          currentRules.unshift(newlyLearnedRule);
        }

        currentHistory.unshift({
          timestamp: new Date().toISOString(),
          field: editedField || 'caption',
          clipId: params.id,
          diff: diffSummary,
          learnedRule: newlyLearnedRule,
        });

        await prisma.brandDNA.update({
          where: { userId: user.id },
          data: {
            learnedRules: JSON.stringify(currentRules.slice(0, 25)),
            editHistory: JSON.stringify(currentHistory.slice(0, 50)),
          },
        });
      }
    }

    // 2. Update Clip Record
    const updatedClip = await prisma.extractedClip.update({
      where: { id: params.id },
      data: {
        title: title !== undefined ? title : existingClip.title,
        captionPresets: captionPresets !== undefined ? JSON.stringify(captionPresets) : existingClip.captionPresets,
        subtitleStyle: subtitleStyle !== undefined ? subtitleStyle : existingClip.subtitleStyle,
        status: status !== undefined ? status : existingClip.status,
      },
    });

    return NextResponse.json({
      success: true,
      clip: updatedClip,
      learningNotification: newlyLearnedRule
        ? {
            rule: newlyLearnedRule,
            summary: diffSummary,
            message: 'Brand Voice Memory updated from your edit!',
          }
        : null,
    });
  } catch (error) {
    console.error('Error updating clip:', error);
    return NextResponse.json({ error: 'Failed to update clip' }, { status: 500 });
  }
}

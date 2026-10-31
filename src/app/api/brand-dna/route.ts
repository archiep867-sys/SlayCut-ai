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

    let brand = await prisma.brandDNA.findUnique({
      where: { userId: user.id },
    });

    if (!brand) {
      brand = await prisma.brandDNA.create({
        data: {
          userId: user.id,
          brandName: `${user.name}'s Channel`,
          niche: 'Technology & Startups',
          targetAudience: 'Founders, Creators, and Tech Builders',
          toneProfile: JSON.stringify({ formality: 40, humor: 60, enthusiasm: 80, provocation: 75, technicalDepth: 70 }),
          voiceArchetype: 'The Visionary Provocateur',
          bannedPhrases: JSON.stringify(['Game changer', 'In this video']),
          preferredKeywords: JSON.stringify(['High leverage', 'Autonomous', 'Systems']),
          learnedRules: JSON.stringify(['Start with numbers or counter-intuitive paradoxes']),
          editHistory: JSON.stringify([]),
        },
      });
    }

    return NextResponse.json({
      brand: {
        ...brand,
        toneProfile: JSON.parse(brand.toneProfile),
        bannedPhrases: JSON.parse(brand.bannedPhrases),
        preferredKeywords: JSON.parse(brand.preferredKeywords),
        learnedRules: JSON.parse(brand.learnedRules),
        editHistory: JSON.parse(brand.editHistory),
      },
    });
  } catch (error) {
    console.error('Error fetching brand DNA:', error);
    return NextResponse.json({ error: 'Failed to fetch Brand DNA' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { brandName, tagline, niche, targetAudience, toneProfile, voiceArchetype, bannedPhrases, preferredKeywords, learnedRules } = body;

    const brand = await prisma.brandDNA.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        brandName: brandName || 'My Brand',
        tagline: tagline || '',
        niche: niche || 'Tech',
        targetAudience: targetAudience || 'Builders',
        toneProfile: JSON.stringify(toneProfile || { formality: 40, humor: 60, enthusiasm: 80, provocation: 75, technicalDepth: 70 }),
        voiceArchetype: voiceArchetype || 'The Visionary Provocateur',
        bannedPhrases: JSON.stringify(bannedPhrases || []),
        preferredKeywords: JSON.stringify(preferredKeywords || []),
        learnedRules: JSON.stringify(learnedRules || []),
        editHistory: JSON.stringify([]),
      },
      update: {
        brandName,
        tagline,
        niche,
        targetAudience,
        toneProfile: toneProfile ? JSON.stringify(toneProfile) : undefined,
        voiceArchetype,
        bannedPhrases: bannedPhrases ? JSON.stringify(bannedPhrases) : undefined,
        preferredKeywords: preferredKeywords ? JSON.stringify(preferredKeywords) : undefined,
        learnedRules: learnedRules ? JSON.stringify(learnedRules) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      brand: {
        ...brand,
        toneProfile: JSON.parse(brand.toneProfile),
        bannedPhrases: JSON.parse(brand.bannedPhrases),
        preferredKeywords: JSON.parse(brand.preferredKeywords),
        learnedRules: JSON.parse(brand.learnedRules),
        editHistory: JSON.parse(brand.editHistory),
      },
    });
  } catch (error) {
    console.error('Error updating brand DNA:', error);
    return NextResponse.json({ error: 'Failed to update Brand DNA' }, { status: 500 });
  }
}

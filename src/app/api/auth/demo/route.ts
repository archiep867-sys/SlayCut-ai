import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, getAuthCookieName } from '@/lib/auth';

export async function POST() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'archie@slaycut.ai' },
      include: { brandDNA: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Demo user not found. Please run seed.' }, { status: 404 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated in Demo Mode',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isDemo: true,
      },
    });

    response.cookies.set(getAuthCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

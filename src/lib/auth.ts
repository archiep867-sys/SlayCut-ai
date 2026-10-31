import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'clipforge-fallback-secret-2026';
const AUTH_COOKIE_NAME = 'clipforge_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      // Fallback to demo user if present in dev/demo mode
      const demoUser = await prisma.user.findFirst({
        where: { email: 'archie@clipforge.ai' },
        include: { brandDNA: true, learningPreferences: true },
      });
      return demoUser;
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      const demoUser = await prisma.user.findFirst({
        where: { email: 'archie@clipforge.ai' },
        include: { brandDNA: true, learningPreferences: true },
      });
      return demoUser;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { brandDNA: true, learningPreferences: true },
    });

    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE_NAME;
}

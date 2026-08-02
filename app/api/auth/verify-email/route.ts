import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyEmailToken } from '@/lib/tokens';

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const { email, valid } = verifyEmailToken(token);

    if (!valid || !email) {
      return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.redirect(new URL('/dashboard/student?verified=already', req.url));
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });

    return NextResponse.redirect(new URL('/dashboard/student?verified=true', req.url));
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendTemporaryPasswordEmail } from '@/lib/email';
import { z } from 'zod';
import { logAuditAction } from '@/lib/audit';

const createUserSchema = z.object({
  email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@sonatech\.ac\.in$/, "Must be a valid sonatech.ac.in email"),
  name: z.string().min(2),
  role: z.enum(['ADMIN', 'AMBASSADOR', 'STUDENT']),
  department: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { email, name, role, department } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Generate cryptographic temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        password: hashedPassword,
        forcePasswordChange: true,
        emailVerified: false,
        department: department || "IT"
      }
    });

    // If role is STUDENT, provision student profile
    if (role === 'STUDENT') {
      await prisma.student.create({
        data: {
          userId: user.id,
          batch: "Unknown",
          section: "Unknown",
          semester: 1
        }
      });
    }

    // Send email with temp password
    sendTemporaryPasswordEmail(email, tempPassword).catch(console.error);

    await logAuditAction({
      userId: (session.user as any).id,
      action: "CREATE",
      entity: "User",
      target: user.id,
      newValue: { email: user.email, role: user.role },
      details: "Provisioned new account",
      req
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

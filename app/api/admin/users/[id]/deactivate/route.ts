import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logAuditAction } from '@/lib/audit';

const deactivateSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = params.id;
    const body = await req.json();
    const result = deactivateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status: result.data.status }
    });

    await logAuditAction({
      userId: (session.user as any).id,
      action: "UPDATE_STATUS",
      entity: "User",
      target: userId,
      previousValue: { status: targetUser.status },
      newValue: { status: result.data.status },
      details: "Updated user status",
      req
    });

    return NextResponse.json({ success: true, status: result.data.status });
  } catch (error) {
    console.error('Deactivate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

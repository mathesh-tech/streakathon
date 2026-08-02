import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { AuditService } from '@/server/services/audit.service';

const toggleSchema = z.object({
  canDeductCredits: z.boolean()
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.role || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userId = params.id;
    const body = await req.json();
    const result = toggleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.role !== 'AMBASSADOR') {
      return NextResponse.json({ error: 'Only Ambassadors can have this right toggled' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { canDeductCredits: result.data.canDeductCredits }
    });

    await AuditService.log({
      userId: (session.user as any).id,
      action: "UPDATE_PRIVILEGE",
      entity: "User",
      target: userId,
      previousValue: { canDeductCredits: targetUser.canDeductCredits },
      newValue: { canDeductCredits: result.data.canDeductCredits },
      details: "Toggled canDeductCredits",
      req
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Toggle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

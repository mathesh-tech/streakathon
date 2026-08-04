import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuditService } from "@/server/services/audit.service";

// POST /api/admin/credits - Add or deduct student credits
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { identifier, points, reason, actionType } = await req.json();

    if (!identifier || !points || isNaN(points)) {
      return NextResponse.json({ error: "Student identifier (email or register number) and valid points are required." }, { status: 400 });
    }

    const normIdent = identifier.trim().toLowerCase();

    // Find student by email or register number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normIdent },
          { registerNumber: { equals: identifier.trim(), mode: "insensitive" } },
        ],
      },
      include: { studentProfile: true },
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json({ error: `Student with identifier "${identifier}" not found.` }, { status: 404 });
    }

    const pointVal = Math.abs(parseInt(points));
    const isDeduct = actionType === "DEDUCT";
    const delta = isDeduct ? -pointVal : pointVal;

    const newCredits = Math.max(0, user.studentProfile.currentCredits + delta);

    // Update in transaction and create credit transaction log
    await prisma.$transaction(async (tx) => {
      await tx.student.update({
        where: { studentId: user.studentProfile!.studentId },
        data: {
          currentCredits: newCredits,
          lifetimeCredits: !isDeduct ? user.studentProfile!.lifetimeCredits + pointVal : user.studentProfile!.lifetimeCredits,
        },
      });

      await tx.creditTransaction.create({
        data: {
          studentId: user.studentProfile!.studentId,
          points: pointVal,
          type: isDeduct ? "DECREASE" : "INCREASE",
          reason: reason || `Admin manual credit ${isDeduct ? "deduction" : "award"}`,
          performedById: (session.user as any).id,
        },
      });
    });

    await AuditService.log({
      userId: (session.user as any).id,
      action: "MODIFY_CREDITS",
      entity: "Student",
      target: user.id,
      newValue: { credits: newCredits, delta, reason },
      details: `Admin ${isDeduct ? "deducted" : "added"} ${pointVal} credits for ${user.name} (${user.email}). New balance: ${newCredits}`,
      req,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: `Successfully ${isDeduct ? "deducted" : "added"} ${pointVal} credits for ${user.name}. New Total: ${newCredits} Credits`,
      student: {
        name: user.name,
        email: user.email,
        currentCredits: newCredits,
      },
    });
  } catch (error: any) {
    console.error("Modify Credits Error:", error);
    return NextResponse.json({ error: "Failed to modify student credits." }, { status: 500 });
  }
}

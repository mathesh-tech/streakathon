import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Basic auth check for cron jobs if using Vercel Cron
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Find all OPEN or FULL teams and lock them
    const teamsToLock = await prisma.team.findMany({
      where: {
        status: {
          in: ["OPEN", "FULL"]
        }
      }
    });

    const teamIds = teamsToLock.map(t => t.id);

    await prisma.$transaction([
      // Lock teams
      prisma.team.updateMany({
        where: { id: { in: teamIds } },
        data: { status: "LOCKED" }
      }),
      // Expire pending invitations for these teams
      prisma.teamInvitation.updateMany({
        where: { teamId: { in: teamIds }, status: "PENDING" },
        data: { status: "EXPIRED" }
      })
    ]);

    return NextResponse.json({ success: true, lockedCount: teamIds.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

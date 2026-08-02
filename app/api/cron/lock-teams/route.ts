import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TeamRepository } from "@/server/repositories/team.repository";

export async function GET(req: Request) {
  try {
    // Basic auth check for cron jobs if using Vercel Cron
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const lockedCount = await prisma.$transaction(async (tx) => {
      // Find all OPEN or FULL teams and lock them
      const teamsToLock = await tx.team.findMany({
        where: {
          status: {
            in: ["OPEN", "FULL"]
          }
        }
      });

      const teamIds = teamsToLock.map(t => t.id);

      if (teamIds.length > 0) {
        // Lock teams
        await tx.team.updateMany({
          where: { id: { in: teamIds } },
          data: { status: "LOCKED" }
        });
        
        // Expire pending invitations for these teams
        await tx.teamInvitation.updateMany({
          where: { teamId: { in: teamIds }, status: "PENDING" },
          data: { status: "EXPIRED" }
        });
      }
      
      return teamIds.length;
    });

    return NextResponse.json({ success: true, lockedCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

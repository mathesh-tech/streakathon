import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { TeamService } from "@/server/services/team.service";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== "PARTICIPANT") {
      return NextResponse.json({ error: "Unauthorized. Only registered participants can create teams." }, { status: 403 });
    }

    let studentProfile = await prisma.student.findUnique({
      where: { userId: (session.user as any).id }
    });

    if (!studentProfile) {
      studentProfile = await prisma.student.create({
        data: {
          userId: (session.user as any).id,
          batch: "2024-2028",
          section: "A",
          semester: 6,
        }
      });
    }

    const { teamName, hackathonId: providedHackathonId } = await req.json();

    if (!teamName) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 });
    }

    let hackathonId = providedHackathonId;
    if (!hackathonId) {
      const activeHackathon = await prisma.hackathon.findFirst({
        where: { status: "LIVE" },
        orderBy: { createdAt: "desc" }
      });

      if (!activeHackathon) {
        return NextResponse.json({ error: "No active hackathon found to create a team for." }, { status: 400 });
      }
      hackathonId = activeHackathon.id;
    }

    const team = await TeamService.createTeam(teamName, studentProfile.studentId, hackathonId);

    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    console.error("Create team error:", error);
    return NextResponse.json({ error: error.message || "Failed to create team" }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createTeam } from "@/lib/services/team-service";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== "PARTICIPANT") {
      return NextResponse.json({ error: "Unauthorized. Only registered participants can create teams." }, { status: 403 });
    }

    const studentProfile = await prisma.student.findUnique({
      where: { userId: (session.user as any).id }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
    }

    const { teamName, hackathonId } = await req.json();

    if (!teamName || !hackathonId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const team = await createTeam(teamName, studentProfile.studentId, hackathonId);

    return NextResponse.json({ success: true, team });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

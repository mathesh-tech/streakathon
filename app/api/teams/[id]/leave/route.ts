import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { leaveTeam } from "@/lib/services/team-service";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== "PARTICIPANT") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const studentProfile = await prisma.student.findUnique({
      where: { userId: session.user.id }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
    }

    await leaveTeam(params.id, studentProfile.studentId);

    return NextResponse.json({ success: true, message: "Successfully left the team." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

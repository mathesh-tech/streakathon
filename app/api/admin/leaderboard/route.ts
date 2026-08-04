import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/leaderboard - Return full student leaderboard with rankings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const students = await prisma.user.findMany({
      where: { role: "PARTICIPANT" },
      select: {
        id: true,
        name: true,
        email: true,
        registerNumber: true,
        department: true,
        year: true,
        studentProfile: {
          select: {
            section: true,
            currentCredits: true,
            lifetimeCredits: true,
            currentStreak: true,
            totalParticipations: true,
            totalWins: true,
          },
        },
      },
      orderBy: {
        studentProfile: {
          currentCredits: "desc",
        },
      },
    });

    const rankedStudents = students.map((s, index) => ({
      rank: index + 1,
      id: s.id,
      name: s.name,
      email: s.email,
      registerNumber: s.registerNumber || "N/A",
      department: s.department || "IT",
      year: s.year || 3,
      section: s.studentProfile?.section || "A",
      credits: s.studentProfile?.currentCredits || 0,
      lifetimeCredits: s.studentProfile?.lifetimeCredits || 0,
      streak: s.studentProfile?.currentStreak || 0,
      participations: s.studentProfile?.totalParticipations || 0,
      wins: s.studentProfile?.totalWins || 0,
    }));

    return NextResponse.json({ success: true, count: rankedStudents.length, leaderboard: rankedStudents });
  } catch (error: any) {
    console.error("Fetch Leaderboard Error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}

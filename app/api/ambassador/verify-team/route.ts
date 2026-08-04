import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/ambassador/verify-team - List teams with verification & attendance status
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["AMBASSADOR", "ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized. Ambassador or Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    const whereClause: any = {};
    if (query) {
      whereClause.OR = [
        { teamName: { contains: query, mode: "insensitive" } },
        { teamCode: { contains: query, mode: "insensitive" } },
      ];
    }

    // Get active hackathon
    const activeHackathon = await prisma.hackathon.findFirst({
      where: { status: "LIVE" },
    }) || await prisma.hackathon.findFirst({ orderBy: { createdAt: "desc" } });

    if (!activeHackathon) {
      return NextResponse.json({ success: true, teams: [] });
    }

    const teams = await prisma.team.findMany({
      where: {
        ...whereClause,
        hackathonId: activeHackathon.id,
      },
      include: {
        members: {
          include: {
            student: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, registerNumber: true, department: true },
                },
              },
            },
          },
        },
        hackathon: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Check attendance status for each team
    const memberUserIds = teams.flatMap((t) => t.members.map((m) => m.student.user.id));
    const attendanceRecords = await prisma.attendanceRecord.findMany({
      where: {
        hackathonId: activeHackathon.id,
        userId: { in: memberUserIds },
        status: "PRESENT",
      },
    });

    const verifiedUserIds = new Set(attendanceRecords.map((a) => a.userId));

    const teamsWithStatus = teams.map((t) => {
      const isVerified = t.members.length > 0 && t.members.every((m) => verifiedUserIds.has(m.student.user.id));
      const partiallyVerified = t.members.some((m) => verifiedUserIds.has(m.student.user.id));
      
      return {
        id: t.id,
        teamName: t.teamName,
        teamCode: t.teamCode,
        hackathonTitle: t.hackathon?.title || "Streakathon 2K26",
        hackathonId: t.hackathonId,
        isVerified,
        partiallyVerified,
        members: t.members.map((m) => ({
          studentId: m.studentId,
          userId: m.student.user.id,
          name: m.student.user.name,
          email: m.student.user.email,
          registerNumber: m.student.user.registerNumber,
          department: m.student.user.department,
          role: m.role,
          isAttended: verifiedUserIds.has(m.student.user.id),
        })),
      };
    });

    return NextResponse.json({ success: true, count: teamsWithStatus.length, teams: teamsWithStatus });
  } catch (error: any) {
    console.error("Fetch Teams Verification Error:", error);
    return NextResponse.json({ error: "Failed to fetch teams verification status" }, { status: 500 });
  }
}

// POST /api/ambassador/verify-team - Verify team arrival & award 1 credit to all members
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["AMBASSADOR", "ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized. Ambassador or Admin access required." }, { status: 403 });
    }

    const ambassadorUserId = (session.user as any).id;
    const { teamId, qrToken, leaderEmail } = await req.json();

    let targetTeam: any = null;

    if (teamId) {
      targetTeam = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: {
            include: {
              student: {
                include: { user: true },
              },
            },
          },
          hackathon: true,
        },
      });
    } else if (leaderEmail || qrToken) {
      const searchIdent = (leaderEmail || qrToken).trim().toLowerCase();
      // Search user by email or register number or token
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: searchIdent },
            { registerNumber: { equals: searchIdent, mode: "insensitive" } },
          ],
        },
        include: { studentProfile: true },
      });

      if (user && user.studentProfile) {
        const teamMember = await prisma.teamMember.findFirst({
          where: { studentId: user.studentProfile.studentId },
          include: {
            team: {
              include: {
                members: {
                  include: {
                    student: {
                      include: { user: true },
                    },
                  },
                },
                hackathon: true,
              },
            },
          },
        });
        if (teamMember) targetTeam = teamMember.team;
      }
    }

    if (!targetTeam) {
      return NextResponse.json({ error: "Team or Student record not found." }, { status: 404 });
    }

    const hackathonId = targetTeam.hackathonId;

    // Execute verification and credit awarding in a single atomic transaction
    const updatedCount = await prisma.$transaction(async (tx) => {
      let count = 0;

      for (const member of targetTeam.members) {
        const studentObj = member.student;
        const userId = studentObj.user.id;

        // Check if attendance already marked
        const existingAttendance = await tx.attendanceRecord.findFirst({
          where: {
            hackathonId,
            userId,
            status: "PRESENT",
          },
        });

        if (!existingAttendance) {
          // 1. Record Attendance
          await tx.attendanceRecord.create({
            data: {
              userId,
              hackathonId,
              status: "PRESENT",
              markedById: ambassadorUserId,
            },
          });

          // 2. Award 1 Innovation Credit Point
          await tx.student.update({
            where: { studentId: studentObj.studentId },
            data: {
              currentCredits: { increment: 1 },
              lifetimeCredits: { increment: 1 },
            },
          });

          // 3. Log Credit Transaction
          await tx.creditTransaction.create({
            data: {
              studentId: studentObj.studentId,
              hackathonId,
              points: 1,
              type: "INCREASE",
              reason: "Live Team Arrival Verification & Attendance (+1 Credit)",
              performedById: ambassadorUserId,
            },
          });

          count++;
        }
      }

      return count;
    });

    return NextResponse.json({
      success: true,
      message: updatedCount > 0 
        ? `Successfully verified team "${targetTeam.teamName}"! ${updatedCount} team member(s) received +1 Innovation Credit Point!`
        : `Team "${targetTeam.teamName}" is ALREADY VERIFIED. All members have claimed attendance and credits.`,
      teamName: targetTeam.teamName,
      membersCount: targetTeam.members.length,
      newlyVerifiedCount: updatedCount,
      isAlreadyVerified: updatedCount === 0,
    });
  } catch (error: any) {
    console.error("Verify Team Error:", error);
    return NextResponse.json({ error: "Failed to verify team attendance and award credits." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        teamMembers: {
          include: {
            team: {
              include: {
                members: {
                  include: {
                    student: {
                      include: {
                        user: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!student || !student.teamMembers || student.teamMembers.length === 0) {
      return NextResponse.json({ team: null });
    }

    const activeTeam = student.teamMembers[0].team;

    return NextResponse.json({ success: true, team: activeTeam });
  } catch (error: any) {
    console.error("Fetch active team error:", error);
    return NextResponse.json({ error: "Failed to fetch active team" }, { status: 500 });
  }
}

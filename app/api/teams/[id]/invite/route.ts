import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { identifier, email } = await req.json();
    const targetQuery = (identifier || email || "").trim();

    if (!targetQuery) {
      return NextResponse.json({ error: "Target student Register Number or Email is required" }, { status: 400 });
    }

    // Find target user by register number or email
    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: targetQuery.toLowerCase() },
          { registerNumber: targetQuery }
        ]
      },
      include: { studentProfile: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: `Student '${targetQuery}' not found. Ensure they have registered first.` }, { status: 404 });
    }

    let studentProfile = targetUser.studentProfile;
    if (!studentProfile) {
      studentProfile = await prisma.student.create({
        data: {
          userId: targetUser.id,
          batch: "2024-2028",
          section: "A",
          semester: 6
        }
      });
    }

    // Check existing team membership
    const existingMembership = await prisma.teamMember.findFirst({
      where: { studentId: studentProfile.studentId }
    });

    if (existingMembership) {
      return NextResponse.json({ error: `${targetUser.name} is already part of a team.` }, { status: 400 });
    }

    // Add to team
    await prisma.teamMember.create({
      data: {
        teamId: params.id,
        studentId: studentProfile.studentId,
        role: "MEMBER"
      }
    });

    return NextResponse.json({
      success: true,
      message: `${targetUser.name} added to the team!`,
      student: { name: targetUser.name, registerNumber: targetUser.registerNumber }
    });
  } catch (error: any) {
    console.error("Invite teammate error:", error);
    return NextResponse.json({ error: error.message || "Failed to add teammate" }, { status: 500 });
  }
}

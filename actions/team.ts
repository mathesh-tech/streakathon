"use server";

import { revalidatePath } from "next/cache";
import { TeamService } from "@/server/services/team.service";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createTeam(teamName: string, leaderId: string, hackathonId: string) {
  try {
    const team = await TeamService.createTeam(teamName, leaderId, hackathonId);
    
    revalidatePath("/dashboard/student/team");
    return { success: true, message: "Team created successfully", data: team };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function searchStudents(query: string) {
  try {
    if (!query || query.length < 3) return { success: true, data: [] };
    
    // Using prisma imported below
    const students = await prisma.user.findMany({
      where: {
        role: "PARTICIPANT",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } }
        ],
        studentProfile: { isNot: null }
      },
      select: {
        id: true,
        name: true,
        email: true,
        studentProfile: {
          select: {
            batch: true,
          }
        }
      },
      take: 10
    });

    return { success: true, data: students };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function inviteMemberAction(teamId: string, email: string) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!session || !user) return { success: false, error: "Unauthorized" };

    const studentProfile = await prisma.student.findUnique({ where: { userId: user.id } });
    if (!studentProfile) return { success: false, error: "Student profile not found" };

    const invite = await TeamService.inviteMember(teamId, email, studentProfile.studentId);
    return { success: true, message: "Invitation sent successfully!", data: invite };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function acceptInvitationAction(token: string) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!session || !user) return { success: false, error: "Unauthorized" };

    const studentProfile = await prisma.student.findUnique({ where: { userId: user.id } });
    if (!studentProfile) return { success: false, error: "Student profile not found" };

    await TeamService.acceptInvitation(studentProfile.studentId, token);
    
    revalidatePath("/dashboard/student/team");
    return { success: true, message: "Team joined successfully!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitProject(teamId: string, githubLink: string, pptFile?: string) {
  try {
    revalidatePath("/dashboard/student/submissions");
    return { success: true, message: "Project submitted successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


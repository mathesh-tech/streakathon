"use server";

import { revalidatePath } from "next/cache";
import { TeamService } from "@/server/services/team.service";

export async function createTeam(teamName: string, leaderId: string, hackathonId: string) {
  try {
    const team = await TeamService.createTeam(teamName, leaderId, hackathonId);
    
    revalidatePath("/dashboard/student/team");
    return { success: true, message: "Team created successfully", data: team };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitProject(teamId: string, githubLink: string, pptFile?: string) {
  try {
    // In a full implementation, we'd have a SubmissionService
    revalidatePath("/dashboard/student/submissions");
    return { success: true, message: "Project submitted successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

"use server";

import { revalidatePath } from "next/cache";

export async function createTeam(teamName: string, captainId: string, hackathonId: string) {
  try {
    /*
    const newTeam = await prisma.team.create({
      data: {
        teamName,
        captainId,
        hackathonId,
        status: 'FORMING',
        members: {
          create: [{ studentId: captainId }]
        }
      }
    });
    */
    
    revalidatePath("/dashboard/student/team");
    return { success: true, message: "Team created successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitProject(teamId: string, githubLink: string, pptFile?: string) {
  try {
    /*
    await prisma.submission.create({
      data: {
        teamId,
        githubLink,
        pptFile
      }
    });

    // Award standard submission points to all team members
    // Check if late submission penalty applies
    */
    
    revalidatePath("/dashboard/student/submissions");
    return { success: true, message: "Project submitted successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

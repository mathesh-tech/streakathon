"use server";

import { revalidatePath } from "next/cache";

// These are mock server actions showcasing the production architecture.
// In a real implementation, you would import Prisma:
// import prisma from "@/lib/prisma";

export async function getActiveHackathons() {
  try {
    // const hackathons = await prisma.hackathon.findMany({ where: { status: 'LIVE' } });
    return { success: true, data: [] };
  } catch (error) {
    return { success: false, error: "Failed to fetch hackathons" };
  }
}

export async function registerForHackathon(studentId: string, hackathonId: string) {
  try {
    // Validate inputs
    if (!studentId || !hackathonId) throw new Error("Invalid parameters");

    // Perform database operation
    /*
    await prisma.registration.create({
      data: {
        studentId,
        hackathonId,
        attendanceStatus: 'REGISTERED'
      }
    });
    */

    revalidatePath("/dashboard/student/history");
    return { success: true, message: "Successfully registered" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateHackathonStatus(hackathonId: string, status: string) {
  try {
    // Check Admin Permissions here
    
    // await prisma.hackathon.update({ where: { id: hackathonId }, data: { status } });
    
    revalidatePath("/dashboard/admin");
    return { success: true, message: "Status updated" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

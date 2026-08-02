"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getStudentBasicInfo(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { studentId },
      include: { user: { select: { name: true } } }
    });
    if (!student) return { success: false, error: "Student not found" };
    return { success: true, name: student.user.name };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function awardCredits(studentId: string, amount: number, reason: string) {
  try {
    // Check Admin / Ambassador Permissions here

    /*
    await prisma.$transaction(async (tx) => {
      // 1. Create Transaction
      await tx.creditTransaction.create({
        data: { studentId, points: amount, reason }
      });

      // 2. Update Student Profile
      await tx.student.update({
        where: { studentId },
        data: {
          currentCredits: { increment: amount },
          lifetimeCredits: { increment: amount > 0 ? amount : 0 }
        }
      });
      
      // 3. Trigger Achievement checks...
    });
    */

    revalidatePath("/dashboard/student/profile");
    return { success: true, message: `Awarded ${amount} points to student` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateStreak(studentId: string, action: "INCREMENT" | "RESET") {
  try {
    /*
    if (action === "INCREMENT") {
      await prisma.student.update({
        where: { studentId },
        data: { currentStreak: { increment: 1 } }
      });
      // also check if currentStreak > bestStreak and update bestStreak
    } else {
      await prisma.student.update({
        where: { studentId },
        data: { currentStreak: 0 }
      });
    }
    */
    
    return { success: true, message: "Streak updated" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

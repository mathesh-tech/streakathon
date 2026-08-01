"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreditService } from "@/server/services/credit.service";
import { CreditTransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function awardCredits(
  studentId: string,
  hackathonId: string | null,
  reason: string,
  points: number
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return { success: false, error: "Unauthorized" };
    }

    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!dbUser) {
      return { success: false, error: "User not found" };
    }

    if (dbUser.role !== "ADMIN" && dbUser.role !== "AMBASSADOR") {
      return { success: false, error: "Forbidden: Insufficient permissions" };
    }

    if (dbUser.role === "AMBASSADOR" && !dbUser.canDeductCredits && points < 0) {
      return { success: false, error: "Forbidden: You do not have permission to deduct credits" };
    }

    const type: CreditTransactionType = points < 0 ? "DECREASE" : "INCREASE";

    await CreditService.processTransaction(
      studentId,
      hackathonId,
      reason,
      Math.abs(points),
      type,
      dbUser.id
    );

    revalidatePath("/dashboard/admin/leaderboard");
    revalidatePath("/dashboard/student/profile");
    revalidatePath("/leaderboard");

    return { success: true, message: "Credits updated successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

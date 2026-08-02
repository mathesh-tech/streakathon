"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreditService } from "@/server/services/credit.service";
import { revalidatePath } from "next/cache";

export async function evaluateParticipant(
  studentId: string,
  hackathonId: string,
  scores: {
    participation: number;
    presentation: number;
    technical: number;
    communication: number;
    innovation: number;
  },
  remarks?: string
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = session.user as any;

    if (user.role !== "ADMIN" && user.role !== "AMBASSADOR") {
      return { success: false, error: "Forbidden: Only Ambassadors and Admins can evaluate" };
    }

    // Validate scores
    const { participation, presentation, technical, communication, innovation } = scores;
    const totalScore = participation + presentation + technical + communication + innovation;

    if (totalScore < 0 || totalScore > 50) {
      return { success: false, error: "Invalid total score" };
    }

    const evaluation = await prisma.$transaction(async (tx) => {
      // Create evaluation record
      const record = await tx.participantEvaluation.create({
        data: {
          studentId,
          hackathonId,
          evaluatorId: user.id,
          participation,
          presentation,
          technical,
          communication,
          innovation,
          totalScore,
          remarks
        }
      });

      // Award Innovation Credits based on total score (1 point = 1 credit)
      if (totalScore > 0) {
        await tx.creditTransaction.create({
          data: {
            studentId,
            hackathonId,
            points: totalScore,
            type: "INCREASE",
            reason: `Ambassador Evaluation: ${totalScore}/50`,
            performedById: user.id,
          }
        });

        // Update student total credits
        await tx.student.update({
          where: { studentId },
          data: {
            currentCredits: { increment: totalScore },
            lifetimeCredits: { increment: totalScore },
          }
        });
      }

      return record;
    });

    revalidatePath("/dashboard/ambassador");
    revalidatePath(`/dashboard/student/profile`);

    return { success: true, message: "Evaluation saved successfully!", evaluation };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "This participant has already been evaluated for this hackathon." };
    }
    return { success: false, error: error.message };
  }
}

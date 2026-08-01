import { prisma } from "@/lib/prisma";
import { CreditTransactionType } from "@prisma/client";
import { AchievementService } from "./achievement.service";

export class CreditService {
  /**
   * DEFAULT CREDIT RULES
   */
  static CREDIT_RULES: Record<string, number> = {
    REGISTRATION: 5,
    ATTENDANCE: 10,
    SUBMISSION: 20,
    TOP_TEN: 30,
    THIRD_PRIZE: 50,
    SECOND_PRIZE: 75,
    FIRST_PRIZE: 100,
    SPECIAL_RECOGNITION: 40,
    MENTOR_APPRECIATION: 25,
    PENALTY: -10,
  };

  /**
   * Core function to award or deduct credits safely.
   */
  static async processTransaction(
    studentId: string,
    hackathonId: string | null,
    reason: string,
    points: number,
    type: CreditTransactionType = "INCREASE",
    performedById?: string
  ) {
    if (points === 0) return null;

    // Calculate actual point value based on transaction type
    const actualPoints = (type === "DECREASE" || type === "REMOVAL") 
      ? -Math.abs(points) 
      : Math.abs(points);

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Log Transaction
      const transaction = await tx.creditTransaction.create({
        data: {
          studentId,
          hackathonId,
          reason,
          points: actualPoints,
          type,
          performedById,
        },
      });

      // 2. Update Student Totals
      const updatedStudent = await tx.student.update({
        where: { studentId },
        data: {
          currentCredits: { increment: actualPoints },
          lifetimeCredits: actualPoints > 0 ? { increment: actualPoints } : undefined,
        },
      });

      return { transaction, student: updatedStudent };
    });

    // 3. Fire Post-Transaction Hooks (Achievements, etc.) asynchronously
    if (result && result.student) {
      AchievementService.evaluateCredits(result.student.studentId, result.student.currentCredits).catch(console.error);
    }

    return result;
  }

  /**
   * Helper to award predefined rules.
   */
  static async awardRule(
    studentId: string,
    hackathonId: string,
    ruleKey: keyof typeof CreditService.CREDIT_RULES,
    performedById?: string
  ) {
    const points = CreditService.CREDIT_RULES[ruleKey];
    if (!points) throw new Error("Invalid credit rule");

    const type: CreditTransactionType = points < 0 ? "DECREASE" : "INCREASE";
    const reason = ruleKey.replace(/_/g, " ");

    return this.processTransaction(studentId, hackathonId, reason, Math.abs(points), type, performedById);
  }
}

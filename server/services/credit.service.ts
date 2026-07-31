// import prisma from "@/lib/prisma";

export class CreditService {
  /**
   * CREDIT ENGINE
   * Participation: 10
   * Submission: 20
   * Top 10: 30
   * Third: 50
   * Second: 75
   * First: 100
   */
  static async awardPoints(studentId: string, hackathonId: string, reason: string, points: number) {
    /*
    await prisma.$transaction(async (tx) => {
      // Create Transaction Record
      await tx.creditTransaction.create({
        data: {
          studentId,
          hackathonId,
          reason,
          points
        }
      });

      // Update Student Total
      await tx.student.update({
        where: { studentId },
        data: {
          currentCredits: { increment: points },
          lifetimeCredits: { increment: points }
        }
      });
    });
    */
    console.log(`Awarded ${points} to ${studentId} for ${reason}`);
  }

  /**
   * STREAK ENGINE
   * Participate consecutively -> Increase
   * Miss one -> Reset
   */
  static async updateStreak(studentId: string, participated: boolean) {
    /*
    const student = await prisma.student.findUnique({ where: { studentId } });
    if (!student) return;

    if (participated) {
      const newStreak = student.currentStreak + 1;
      const newBestStreak = Math.max(newStreak, student.bestStreak);
      
      await prisma.student.update({
        where: { studentId },
        data: {
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          totalParticipations: { increment: 1 }
        }
      });
    } else {
      await prisma.student.update({
        where: { studentId },
        data: {
          currentStreak: 0
        }
      });
    }
    */
  }
}

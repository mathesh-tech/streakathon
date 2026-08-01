import { prisma } from "@/lib/prisma";
import { AchievementService } from "./achievement.service";

export class StreakService {
  /**
   * Updates the streak for a student when they attend a hackathon.
   */
  static async updateStreak(studentId: string, participated: boolean) {
    const student = await prisma.student.findUnique({ where: { studentId } });
    if (!student) return;

    if (participated) {
      const newStreak = student.currentStreak + 1;
      const newBestStreak = Math.max(newStreak, student.bestStreak);

      const updatedStudent = await prisma.student.update({
        where: { studentId },
        data: {
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          totalParticipations: { increment: 1 },
        },
      });

      // Check achievements for participations and streak
      AchievementService.evaluateParticipations(updatedStudent.studentId, updatedStudent.totalParticipations).catch(console.error);
      AchievementService.evaluateStreak(updatedStudent.studentId, updatedStudent.currentStreak).catch(console.error);

      return updatedStudent;
    } else {
      const updatedStudent = await prisma.student.update({
        where: { studentId },
        data: {
          currentStreak: 0,
        },
      });
      return updatedStudent;
    }
  }
}

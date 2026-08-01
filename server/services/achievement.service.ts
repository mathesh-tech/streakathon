import { prisma } from "@/lib/prisma";

export class AchievementService {
  /**
   * Evaluates if a student has unlocked credit-based achievements
   */
  static async evaluateCredits(studentId: string, currentCredits: number) {
    const thresholds = [
      { name: "100 Credits", required: 100 },
      { name: "250 Credits", required: 250 },
      { name: "500 Credits", required: 500 },
      { name: "Innovation Master", required: 1000 },
    ];

    for (const t of thresholds) {
      if (currentCredits >= t.required) {
        await this.awardBadge(studentId, t.name, `Earned ${t.required} Innovation Credits!`);
      }
    }
  }

  /**
   * Evaluates if a student has unlocked participation-based achievements
   */
  static async evaluateParticipations(studentId: string, totalParticipations: number) {
    const thresholds = [
      { name: "First Attendance", required: 1 },
      { name: "5 Participations", required: 5 },
      { name: "10 Participations", required: 10 },
      { name: "20 Participations", required: 20 },
    ];

    for (const t of thresholds) {
      if (totalParticipations >= t.required) {
        await this.awardBadge(studentId, t.name, `Participated in ${t.required} Hackathons!`);
      }
    }
  }

  /**
   * Evaluates if a student has unlocked streak-based achievements
   */
  static async evaluateStreak(studentId: string, currentStreak: number) {
    const thresholds = [
      { name: "3 Streak", required: 3 },
      { name: "Streak Master", required: 5 },
    ];

    for (const t of thresholds) {
      if (currentStreak >= t.required) {
        await this.awardBadge(studentId, t.name, `Achieved a streak of ${t.required}!`);
      }
    }
  }

  /**
   * Awards a badge if it hasn't been awarded yet.
   */
  static async awardBadge(studentId: string, badgeName: string, description: string) {
    // Upsert the badge definition first if it doesn't exist (for simplicity in default logic)
    let badge = await prisma.badge.findFirst({ where: { name: badgeName } });
    if (!badge) {
      badge = await prisma.badge.create({
        data: {
          name: badgeName,
          description,
        },
      });
    }

    // Check if the student already has it
    const existing = await prisma.studentBadge.findUnique({
      where: {
        studentId_badgeId: {
          studentId,
          badgeId: badge.id,
        },
      },
    });

    if (!existing) {
      await prisma.studentBadge.create({
        data: {
          studentId,
          badgeId: badge.id,
        },
      });
      // Optionally trigger NotificationService here
    }
  }
}

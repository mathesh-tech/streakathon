import { prisma } from "@/lib/prisma";

export class LeaderboardService {
  /**
   * Get the Overall Lifetime Leaderboard.
   * Derived from Student's currentCredits which is maintained transactionally.
   * Ranks are generated on the fly.
   */
  static async getOverallLeaderboard(limit = 100, page = 1) {
    const skip = (page - 1) * limit;

    const students = await prisma.student.findMany({
      orderBy: [
        { currentCredits: "desc" },
        { user: { name: "asc" } }, // Tie-breaker
      ],
      take: limit,
      skip,
      include: {
        user: {
          select: { name: true, department: true, avatar: true },
        },
        studentBadges: {
          include: { badge: true },
        },
      },
    });

    return students.map((student, index) => ({
      ...student,
      rank: skip + index + 1,
    }));
  }

  /**
   * Get Leaderboard for a specific Hackathon or Timeframe using real-time aggregation
   * of CreditTransaction records.
   */
  static async getTimeframeLeaderboard(startDate: Date, endDate: Date, limit = 100) {
    // 1. Aggregate points grouped by studentId
    const aggregated = await prisma.creditTransaction.groupBy({
      by: ["studentId"],
      _sum: {
        points: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        _sum: {
          points: "desc",
        },
      },
      take: limit,
    });

    // 2. Fetch student details for the aggregated results
    const studentIds = aggregated.map((a) => a.studentId);
    
    const studentsData = await prisma.student.findMany({
      where: { studentId: { in: studentIds } },
      include: {
        user: {
          select: { name: true, department: true, avatar: true },
        },
        studentBadges: {
          include: { badge: true },
        },
      },
    });

    // 3. Map the points and compute ranks
    const leaderboard = aggregated.map((agg, index) => {
      const student = studentsData.find((s) => s.studentId === agg.studentId);
      return {
        ...student,
        currentCredits: agg._sum.points || 0, // Override with timeframe specific points
        rank: index + 1,
      };
    });

    return leaderboard;
  }
}

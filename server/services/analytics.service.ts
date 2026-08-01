import { prisma as db } from "@/lib/prisma";
import { HackathonStatus, RegistrationState, AttendanceStatus, SubmissionStatus } from "@prisma/client";

export class AnalyticsService {
  /**
   * Retrieves high-level KPIs for the Admin Dashboard
   */
  static async getKPIs() {
    try {
      const [
        totalStudents,
        totalRegistered,
        attendanceStats,
        submissionStats,
        creditStats
      ] = await Promise.all([
        db.student.count(),
        db.registration.count({ where: { status: RegistrationState.REGISTERED } }),
        db.attendanceRecord.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        db.submission.count(),
        db.student.aggregate({
          _avg: { currentCredits: true }
        })
      ]);

      let presentCount = 0;
      let totalAttendanceRecords = 0;
      attendanceStats.forEach((stat: any) => {
        totalAttendanceRecords += stat._count.status;
        if (stat.status === AttendanceStatus.PRESENT) {
          presentCount += stat._count.status;
        }
      });
      const attendancePercentage = totalAttendanceRecords > 0 ? (presentCount / totalAttendanceRecords) * 100 : 0;

      // Note: submissionPercentage relies on number of teams
      const totalTeams = await db.team.count();
      const submissionPercentage = totalTeams > 0 ? (submissionStats / totalTeams) * 100 : 0;

      return {
        totalStudents,
        totalRegistered,
        attendancePercentage: Math.round(attendancePercentage),
        submissionPercentage: Math.round(submissionPercentage),
        averageCredits: Math.round(creditStats._avg.currentCredits || 0),
        totalTeams,
        projectsSubmitted: submissionStats
      };
    } catch (error) {
      console.error("[AnalyticsService] Failed to fetch KPIs:", error);
      throw new Error("Failed to fetch KPIs");
    }
  }

  /**
   * Generates time-series data for daily participation
   */
  static async getDailyParticipation(days: number = 7) {
    try {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - days);

      const logs = await db.loginLog.findMany({
        where: { loginAt: { gte: dateLimit } },
        select: { loginAt: true }
      });

      const dayMap: Record<string, number> = {};
      
      // Initialize days to 0
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dayMap[d.toISOString().split('T')[0]] = 0;
      }

      logs.forEach((log: any) => {
        const dayString = log.loginAt.toISOString().split('T')[0];
        if (dayMap[dayString] !== undefined) {
          dayMap[dayString]++;
        }
      });

      return Object.entries(dayMap).map(([date, count]) => ({ date, activeUsers: count }));
    } catch (error) {
      console.error("[AnalyticsService] Failed to fetch Daily Participation:", error);
      return [];
    }
  }

  /**
   * Retrieves credit distribution data
   */
  static async getCreditDistribution() {
    try {
      const students = await db.student.findMany({
        select: { currentCredits: true }
      });

      const ranges = {
        "0-100": 0,
        "101-500": 0,
        "501-1000": 0,
        "1000+": 0
      };

      students.forEach((s: any) => {
        if (s.currentCredits <= 100) ranges["0-100"]++;
        else if (s.currentCredits <= 500) ranges["101-500"]++;
        else if (s.currentCredits <= 1000) ranges["501-1000"]++;
        else ranges["1000+"]++;
      });

      return Object.entries(ranges).map(([name, count]) => ({ name, count }));
    } catch (error) {
      console.error("[AnalyticsService] Failed to fetch Credit Distribution:", error);
      return [];
    }
  }

  /**
   * Retrieves hackathon specific insights
   */
  static async getHackathonInsights(hackathonId?: string) {
    try {
      const whereClause = hackathonId ? { id: hackathonId } : { status: HackathonStatus.LIVE };
      
      const hackathon = await db.hackathon.findFirst({
        where: whereClause,
        include: {
          _count: {
            select: {
              registrations: true,
              teams: true,
              certificates: true
            }
          }
        }
      });

      if (!hackathon) return null;

      const submissions = await db.submission.count({
        where: { team: { hackathonId: hackathon.id } }
      });

      return {
        id: hackathon.id,
        title: hackathon.title,
        totalRegistrations: hackathon._count.registrations,
        totalTeams: hackathon._count.teams,
        totalSubmissions: submissions,
        certificatesIssued: hackathon._count.certificates,
        status: hackathon.status
      };
    } catch (error) {
      console.error("[AnalyticsService] Failed to fetch Hackathon Insights:", error);
      return null;
    }
  }

  /**
   * Retrieves Leaderboard stats
   */
  static async getLeaderboardAnalytics() {
    try {
      const topPerformers = await db.student.findMany({
        orderBy: { currentCredits: 'desc' },
        take: 5,
        include: { user: true }
      });

      const longestStreak = await db.student.findFirst({
        orderBy: { bestStreak: 'desc' },
        include: { user: true }
      });

      const mostWins = await db.student.findFirst({
        orderBy: { totalWins: 'desc' },
        include: { user: true }
      });

      return {
        topPerformers: topPerformers.map((s: any) => ({
          name: s.user.name,
          credits: s.currentCredits,
          streak: s.currentStreak
        })),
        longestStreak: longestStreak ? {
          name: longestStreak.user.name,
          streak: longestStreak.bestStreak
        } : null,
        mostWins: mostWins ? {
          name: mostWins.user.name,
          wins: mostWins.totalWins
        } : null
      };
    } catch (error) {
      console.error("[AnalyticsService] Failed to fetch Leaderboard Analytics:", error);
      return null;
    }
  }
}

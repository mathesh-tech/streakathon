import { prisma as db } from "@/lib/prisma";
import { HackathonStatus, RegistrationState, AttendanceStatus } from "@prisma/client";

export class AnalyticsService {
  /**
   * Retrieves high-level KPIs for the Admin & Ambassador Dashboard
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

      const totalTeams = await db.team.count();
      const submissionPercentage = totalTeams > 0 ? (submissionStats / totalTeams) * 100 : 0;

      return {
        totalStudents,
        totalRegistered,
        totalCapacity: 480, // Total capacity for 2nd & 3rd Year (IT & ADS)
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
   * Calculates Department Participation Breakdown (240 IT total + 240 ADS total across 2nd & 3rd year = 480 total pool)
   */
  static async getDepartmentBreakdown() {
    try {
      const users = await db.user.findMany({
        where: { role: "PARTICIPANT" },
        select: { department: true }
      });

      let itCount = 0;
      let adsCount = 0;

      users.forEach((u) => {
        const dept = u.department ? u.department.toUpperCase() : "";
        if (dept.includes("IT")) itCount++;
        else if (dept.includes("ADS") || dept.includes("AIDS")) adsCount++;
      });

      const itCapacity = 240;  // 120 2nd yr + 120 3rd yr
      const adsCapacity = 240; // 120 2nd yr + 120 3rd yr

      return [
        {
          name: "IT Department",
          count: itCount,
          target: itCapacity,
          percentage: Math.round((itCount / itCapacity) * 100),
          color: "#3b82f6" // Blue
        },
        {
          name: "ADS Department",
          count: adsCount,
          target: adsCapacity,
          percentage: Math.round((adsCount / adsCapacity) * 100),
          color: "#f59e0b" // Amber
        }
      ];
    } catch (error) {
      console.error("[AnalyticsService] Department breakdown error:", error);
      return [];
    }
  }

  /**
   * Calculates Class-wise Participation (Class A: 40, Class B: 40, Class C: 40 per department per year group)
   */
  static async getClassWiseBreakdown() {
    try {
      const students = await db.student.findMany({
        include: { user: true }
      });

      const classes: Record<string, number> = {
        "IT - Class A": 0,
        "IT - Class B": 0,
        "IT - Class C": 0,
        "ADS - Class A": 0,
        "ADS - Class B": 0,
        "ADS - Class C": 0,
      };

      students.forEach((s) => {
        const dept = s.user.department ? s.user.department.toUpperCase() : "IT";
        const sec = s.section ? s.section.toUpperCase() : "A";
        const key = dept.includes("ADS") || dept.includes("AIDS") ? `ADS - Class ${sec}` : `IT - Class ${sec}`;
        if (classes[key] !== undefined) {
          classes[key]++;
        }
      });

      const classCapacity = 80; // 40 for 2nd Year + 40 for 3rd Year = 80 per class section code across both years

      return Object.entries(classes).map(([className, count]) => ({
        name: className,
        count,
        target: classCapacity,
        percentage: Math.round((count / classCapacity) * 100),
      }));
    } catch (error) {
      console.error("[AnalyticsService] Class breakdown error:", error);
      return [];
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

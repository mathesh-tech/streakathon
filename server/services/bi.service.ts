import { prisma as db } from "@/lib/prisma";
import { HackathonStatus, RegistrationState } from "@prisma/client";

export class BusinessIntelligenceService {
  /**
   * Generates a participation forecast based on previous hackathons
   */
  static async generateParticipationForecast() {
    try {
      // Get completed hackathons to analyze trends
      const hackathons = await db.hackathon.findMany({
        where: { status: HackathonStatus.COMPLETED },
        orderBy: { createdAt: 'asc' },
        include: {
          _count: {
            select: { registrations: true, teams: true }
          }
        }
      });

      if (hackathons.length < 2) {
        return {
          forecast: 100, // Fallback base
          confidence: "Low",
          trend: "neutral",
          historicalData: hackathons.map((h: any) => ({ name: h.title, participants: h._count.registrations }))
        };
      }

      // Simple linear regression to forecast next hackathon participation
      const n = hackathons.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

      hackathons.forEach((h: any, i: number) => {
        const x = i + 1; // 1-based index
        const y = h._count.registrations;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
      });

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      const nextX = n + 1;
      const forecast = Math.round(slope * nextX + intercept);

      return {
        forecast: Math.max(forecast, 0), // Can't be negative
        confidence: n > 5 ? "High" : "Medium",
        trend: slope > 0 ? "positive" : slope < 0 ? "negative" : "neutral",
        growthRate: slope.toFixed(2),
        historicalData: hackathons.map((h: any) => ({ name: h.title, participants: h._count.registrations }))
      };
    } catch (error) {
      console.error("[BIService] Failed to generate forecast:", error);
      return null;
    }
  }

  /**
   * Get registration trend for currently open hackathons
   */
  static async getRegistrationTrends() {
    try {
      const activeHackathon = await db.hackathon.findFirst({
        where: { status: HackathonStatus.REGISTRATION_OPEN },
        include: {
          registrations: {
            where: { status: RegistrationState.REGISTERED },
            select: { registeredAt: true }
          }
        }
      });

      if (!activeHackathon) return null;

      // Group registrations by day
      const dayMap: Record<string, number> = {};
      activeHackathon.registrations.forEach((r: any) => {
        const dayString = r.registeredAt.toISOString().split('T')[0];
        dayMap[dayString] = (dayMap[dayString] || 0) + 1;
      });

      return {
        hackathonTitle: activeHackathon.title,
        trend: Object.entries(dayMap).map(([date, count]) => ({ date, registrations: count }))
      };
    } catch (error) {
      console.error("[BIService] Failed to get registration trends:", error);
      return null;
    }
  }
}

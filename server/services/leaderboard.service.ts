import { LeaderboardRepository } from '@/server/repositories/leaderboard.repository';

export class LeaderboardService {
  /**
   * Get the Overall Lifetime Leaderboard.
   */
  static async getOverallLeaderboard(limit = 100, page = 1) {
    const skip = (page - 1) * limit;
    const students = await LeaderboardRepository.getOverallStudents(limit, skip);

    return students.map((student, index) => ({
      ...student,
      rank: skip + index + 1,
    }));
  }

  /**
   * Get Leaderboard for a specific Timeframe using real-time aggregation
   */
  static async getTimeframeLeaderboard(startDate: Date, endDate: Date, limit = 100) {
    // 1. Aggregate points grouped by studentId
    const aggregated = await LeaderboardRepository.aggregateCreditsByTimeframe(startDate, endDate, limit);

    // 2. Fetch student details for the aggregated results
    const studentIds = aggregated.map((a) => a.studentId);
    const studentsData = await LeaderboardRepository.getStudentsByIds(studentIds);

    // 3. Map the points and filter out any orphaned aggregations
    const mapped = aggregated.map((agg) => {
      const student = studentsData.find((s) => s.studentId === agg.studentId);
      if (!student) return null;
      
      return {
        ...student,
        currentCredits: agg._sum.points ?? 0, 
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    // 4. Sort to handle tie-breakers (by name ascending)
    mapped.sort((a, b) => {
      if (b.currentCredits !== a.currentCredits) {
        return b.currentCredits - a.currentCredits;
      }
      const nameA = a.user?.name || '';
      const nameB = b.user?.name || '';
      return nameA.localeCompare(nameB);
    });

    // 5. Compute ranks
    return mapped.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }
}

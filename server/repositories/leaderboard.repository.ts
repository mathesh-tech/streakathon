import { prisma } from '@/lib/prisma';
import { TxClient } from '@/server/utils/tx';

export class LeaderboardRepository {
  static async getOverallStudents(limit: number = 100, skip: number = 0, tx: TxClient | typeof prisma = prisma) {
    return tx.student.findMany({
      orderBy: [
        { currentCredits: 'desc' },
        { user: { name: 'asc' } },
      ],
      take: limit,
      skip,
      include: {
        user: { select: { name: true, department: true, avatar: true } },
        studentBadges: { include: { badge: true } },
      },
    });
  }

  static async aggregateCreditsByTimeframe(startDate: Date, endDate: Date, limit: number = 100, tx: TxClient | typeof prisma = prisma) {
    return tx.creditTransaction.groupBy({
      by: ['studentId'],
      _sum: { points: true },
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      orderBy: { _sum: { points: 'desc' } },
      take: limit,
    });
  }

  static async getStudentsByIds(studentIds: string[], tx: TxClient | typeof prisma = prisma) {
    return tx.student.findMany({
      where: { studentId: { in: studentIds } },
      include: {
        user: { select: { name: true, department: true, avatar: true } },
        studentBadges: { include: { badge: true } },
      },
    });
  }
}

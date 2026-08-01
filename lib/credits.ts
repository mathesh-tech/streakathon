import { prisma } from '@/lib/prisma';
import { CreditTransactionType } from '@prisma/client';

export async function addCreditTransaction(params: {
  studentId: string;
  hackathonId?: string;
  reason: string;
  points: number;
  type: CreditTransactionType;
  performedById: string;
}) {
  const { studentId, hackathonId, reason, points, type, performedById } = params;

  // Use a transaction to ensure atomic updates if we were caching, 
  // but since leaderboard is derived on read, we just insert the record.
  const transaction = await prisma.creditTransaction.create({
    data: {
      studentId,
      hackathonId,
      reason,
      points, // Note: For DECREASE/REMOVAL this should be negative, ensure caller handles it
      type,
      performedById
    }
  });

  return transaction;
}

export async function getLeaderboard(semesterName?: string) {
  // Leaderboard is derived by SUM(points) from CreditTransaction
  
  // Basic implementation: fetch all students and sum their points.
  // For production with thousands of users, a Prisma groupBy is better.
  
  const studentScores = await prisma.creditTransaction.groupBy({
    by: ['studentId'],
    _sum: {
      points: true,
    },
    // Optional: filter by hackathon's semester if semesterName is provided
  });

  const students = await prisma.student.findMany({
    where: {
      studentId: { in: studentScores.map(s => s.studentId) }
    },
    include: { user: true }
  });

  const leaderboard = studentScores.map(score => {
    const student = students.find(s => s.studentId === score.studentId);
    return {
      studentId: score.studentId,
      name: student?.user?.name || "Unknown",
      department: student?.user?.department || "Unknown",
      year: student?.user?.year || "Unknown",
      avatar: student?.user?.avatar || null,
      score: score._sum.points || 0
    };
  });

  return leaderboard.sort((a, b) => b.score - a.score).map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
}

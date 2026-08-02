import { prisma } from '@/lib/prisma';
import { TxClient } from '@/server/utils/tx';
import { CreditTransactionType } from '@prisma/client';

export class CreditRepository {
  static async createTransaction(
    data: {
      studentId: string;
      hackathonId: string | null;
      reason: string;
      points: number;
      type: CreditTransactionType;
      performedById?: string;
    },
    tx: TxClient | typeof prisma = prisma
  ) {
    return tx.creditTransaction.create({ data });
  }

  static async updateStudentCredits(
    studentId: string,
    pointsToAdd: number,
    isPositive: boolean,
    tx: TxClient | typeof prisma = prisma
  ) {
    return tx.student.update({
      where: { studentId },
      data: {
        currentCredits: { increment: pointsToAdd },
        lifetimeCredits: isPositive ? { increment: pointsToAdd } : undefined,
      },
    });
  }
}

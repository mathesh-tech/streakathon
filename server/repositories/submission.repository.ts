import { prisma } from '@/lib/prisma';
import { TxClient } from '@/server/utils/tx';

export class SubmissionRepository {
  static async findById(id: string, tx: TxClient | typeof prisma = prisma) {
    return tx.submission.findUnique({
      where: { id },
      include: { team: true, evaluationScores: true }
    });
  }

  static async findByTeamId(teamId: string, tx: TxClient | typeof prisma = prisma) {
    return tx.submission.findFirst({
      where: { teamId },
      orderBy: { submittedAt: 'desc' }
    });
  }
}

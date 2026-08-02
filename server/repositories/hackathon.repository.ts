import { prisma } from '@/lib/prisma';
import { TxClient } from '@/server/utils/tx';

export class HackathonRepository {
  static async findById(id: string, tx: TxClient | typeof prisma = prisma) {
    return tx.hackathon.findUnique({
      where: { id }
    });
  }

  static async findActive(tx: TxClient | typeof prisma = prisma) {
    return tx.hackathon.findFirst({
      where: { status: { in: ['LIVE', 'REGISTRATION_OPEN'] } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getRegistrations(hackathonId: string, tx: TxClient | typeof prisma = prisma) {
    return tx.registration.findMany({
      where: { hackathonId },
      include: {
        student: {
          include: { user: true }
        }
      }
    });
  }
}

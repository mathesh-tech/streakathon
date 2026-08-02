import { prisma } from '@/lib/prisma';
import { TxClient } from '@/server/utils/tx';

export class UserRepository {
  static async findById(id: string, tx: TxClient | typeof prisma = prisma) {
    return tx.user.findUnique({
      where: { id },
      include: {
        studentProfile: true,
        adminProfile: true,
        ambassadorProfile: true,
      }
    });
  }

  static async findByEmail(email: string, tx: TxClient | typeof prisma = prisma) {
    return tx.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
      }
    });
  }

  static async updateStatus(id: string, status: string, tx: TxClient | typeof prisma = prisma) {
    return tx.user.update({
      where: { id },
      data: { status }
    });
  }
}

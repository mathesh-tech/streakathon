import { prisma } from '@/lib/prisma';
import { TxClient } from '@/server/utils/tx';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceRepository {
  static async findByUserAndHackathon(userId: string, hackathonId: string, tx: TxClient | typeof prisma = prisma) {
    return tx.attendanceRecord.findFirst({
      where: { userId, hackathonId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async markAttendance(
    data: { userId: string; hackathonId: string; status: AttendanceStatus; markedById: string },
    tx: TxClient | typeof prisma = prisma
  ) {
    return tx.attendanceRecord.create({ data });
  }
}

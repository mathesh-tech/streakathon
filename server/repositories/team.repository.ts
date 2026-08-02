import { prisma } from '@/lib/prisma';
import { TxClient } from '@/server/utils/tx';

export class TeamRepository {
  static async findById(id: string, tx: TxClient | typeof prisma = prisma) {
    return tx.team.findUnique({
      where: { id },
      include: {
        members: { include: { student: { include: { user: true } } } }
      }
    });
  }

  static async findByCode(teamCode: string, tx: TxClient | typeof prisma = prisma) {
    return tx.team.findUnique({ where: { teamCode } });
  }

  static async findByHackathonId(hackathonId: string, tx: TxClient | typeof prisma = prisma) {
    return tx.team.findMany({ where: { hackathonId } });
  }

  static async getStudentTeam(studentId: string, hackathonId: string, tx: TxClient | typeof prisma = prisma) {
    const member = await tx.teamMember.findFirst({
      where: {
        studentId,
        team: { hackathonId }
      },
      include: { team: true }
    });
    return member?.team || null;
  }
}

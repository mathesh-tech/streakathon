import { prisma } from '@/lib/prisma';
import { TxClient } from '@/server/utils/tx';

export class CertificateRepository {
  static async findById(certificateId: string, tx: TxClient | typeof prisma = prisma) {
    return tx.certificate.findUnique({
      where: { certificateId },
      include: { student: { include: { user: true } }, hackathon: true }
    });
  }

  static async findByVerificationToken(token: string, tx: TxClient | typeof prisma = prisma) {
    return tx.certificate.findUnique({
      where: { verificationToken: token },
      include: { student: { include: { user: true } }, hackathon: true }
    });
  }

  static async findByStudentId(studentId: string, tx: TxClient | typeof prisma = prisma) {
    return tx.certificate.findMany({
      where: { studentId },
      include: { hackathon: true },
      orderBy: { issueDate: 'desc' }
    });
  }
}

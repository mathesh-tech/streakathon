import { prisma } from '@/lib/prisma';
import { AttendanceStatus } from '@prisma/client';
import { CreditService } from './credit.service';
import { StreakService } from './streak.service';
import { NotFoundError, ConflictError } from '@/server/utils/errors';
import { HackathonRepository } from '@/server/repositories/hackathon.repository';
import { AttendanceRepository } from '@/server/repositories/attendance.repository';

export class AttendanceService {
  /**
   * Marks attendance for a single student.
   * Can only be performed by ADMIN or AMBASSADOR.
   */
  static async markAttendance(
    studentId: string,
    hackathonId: string,
    status: AttendanceStatus,
    markedById: string
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Validation
      const hackathon = await HackathonRepository.findById(hackathonId, tx);
      if (!hackathon) throw new NotFoundError('Hackathon not found');

      const registration = await tx.registration.findUnique({
        where: { hackathonId_studentId: { hackathonId, studentId } },
        include: { student: true },
      });
      if (!registration) throw new NotFoundError('Student not registered for this hackathon');

      const attendanceExists = await AttendanceRepository.findByUserAndHackathon(registration.student.userId, hackathonId, tx);
      if (attendanceExists) throw new ConflictError('Attendance already marked');

      // 2. Mark Attendance
      const record = await AttendanceRepository.markAttendance({
        userId: registration.student.userId,
        hackathonId,
        status,
        markedById,
      }, tx);

      // 3. Trigger Credit Engine if PRESENT
      if (status === 'PRESENT') {
        // Assume CreditService handles its own nested transaction/queries or can accept `tx` later
        await CreditService.awardRule(studentId, hackathonId, 'ATTENDANCE', markedById);
        await StreakService.updateStreak(studentId, true);
      } else if (status === 'ABSENT') {
        await StreakService.updateStreak(studentId, false);
      }

      return record;
    });
  }

  /**
   * Bulk marks attendance for multiple students.
   */
  static async markBulkAttendance(
    studentIds: string[],
    hackathonId: string,
    status: AttendanceStatus,
    markedById: string
  ) {
    const results = [];
    const errors = [];

    for (const studentId of studentIds) {
      try {
        const record = await this.markAttendance(studentId, hackathonId, status, markedById);
        results.push(record);
      } catch (error: any) {
        errors.push({ studentId, error: error.message });
      }
    }

    return { results, errors };
  }

  /**
   * Generates a new secure, short-lived QR ticket for a student.
   * Invalidates any previous unused tickets for the same hackathon.
   */
  static async generateQRTicket(studentId: string, hackathonId: string) {
    return prisma.$transaction(async (tx) => {
      // Invalidate existing unused tickets
      await tx.qRTicket.updateMany({
        where: { studentId, hackathonId, isUsed: false },
        data: { isUsed: true },
      });

      const { randomBytes } = await import('crypto');
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      return tx.qRTicket.create({
        data: {
          studentId,
          hackathonId,
          token,
          expiresAt,
        },
      });
    });
  }

  /**
   * Scans a QR token, validates it, and marks attendance.
   * Can only be performed by ADMIN or AMBASSADOR.
   */
  static async validateQRTicketAndMarkAttendance(token: string, markedById: string) {
    return prisma.$transaction(async (tx) => {
      const ticket = await tx.qRTicket.findUnique({
        where: { token },
      });

      if (!ticket) throw new NotFoundError('Invalid QR Code');
      if (ticket.isUsed) throw new ConflictError('QR Code has already been used');
      if (ticket.expiresAt < new Date()) throw new ConflictError('QR Code has expired. Please request a new one.');

      // Mark the ticket as used immediately to prevent double scanning
      await tx.qRTicket.update({
        where: { id: ticket.id },
        data: { isUsed: true },
      });

      // Delegate to the standard markAttendance method
      // It handles duplicate attendance checks and credit/streak updates
      return this.markAttendance(
        ticket.studentId,
        ticket.hackathonId,
        'PRESENT',
        markedById
      );
    });
  }
}

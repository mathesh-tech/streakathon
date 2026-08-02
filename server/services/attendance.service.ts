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
}

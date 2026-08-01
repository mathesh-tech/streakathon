import { prisma } from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";
import { CreditService } from "./credit.service";
import { StreakService } from "./streak.service";

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
    // 1. Validation
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });
    if (!hackathon) throw new Error("Hackathon not found");

    const registration = await prisma.registration.findUnique({
      where: { hackathonId_studentId: { hackathonId, studentId } },
      include: { student: true },
    });
    if (!registration) throw new Error("Student not registered for this hackathon");

    const existingAttendance = await prisma.attendanceRecord.findFirst({
      where: { userId: registration.student.userId, hackathonId }, // Wait, AttendanceRecord uses userId, but registration uses studentId. Let's fix this.
    });

    // We must fetch student to get userId because AttendanceRecord maps to User
    const student = await prisma.student.findUnique({ where: { studentId } });
    if (!student) throw new Error("Student not found");

    const attendanceExists = await prisma.attendanceRecord.findFirst({
      where: { userId: student.userId, hackathonId },
    });
    if (attendanceExists) throw new Error("Attendance already marked");

    // 2. Mark Attendance
    const record = await prisma.attendanceRecord.create({
      data: {
        userId: student.userId,
        hackathonId,
        status,
        markedById,
      },
    });

    // 3. Trigger Credit Engine if PRESENT
    if (status === "PRESENT") {
      await CreditService.awardRule(studentId, hackathonId, "ATTENDANCE", markedById);
      await StreakService.updateStreak(studentId, true);
    } else if (status === "ABSENT") {
      await StreakService.updateStreak(studentId, false);
    }

    return record;
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

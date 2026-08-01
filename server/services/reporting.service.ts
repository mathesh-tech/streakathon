import { prisma as db } from "@/lib/prisma";
import { HackathonStatus, RegistrationState, AttendanceStatus } from "@prisma/client";
import { format } from "date-fns";

export class ReportingService {
  /**
   * Generates a comprehensive Student Report for export
   */
  static async generateStudentReport() {
    try {
      const students = await db.student.findMany({
        include: {
          user: { select: { name: true, email: true, department: true, year: true, registerNumber: true } },
          registrations: true
        }
      });

      return students.map((s: any) => ({
        "Register Number": s.user.registerNumber || "N/A",
        "Name": s.user.name,
        "Email": s.user.email,
        "Department": s.user.department,
        "Year": s.user.year || "N/A",
        "Section": s.section,
        "Total Credits": s.currentCredits,
        "Current Streak": s.currentStreak,
        "Best Streak": s.bestStreak,
        "Total Participations": s.totalParticipations,
        "Total Wins": s.totalWins
      }));
    } catch (error) {
      console.error("[ReportingService] Failed to generate Student Report:", error);
      throw new Error("Report generation failed");
    }
  }

  /**
   * Generates a Hackathon Report
   */
  static async generateHackathonReport(hackathonId: string) {
    try {
      const hackathon = await db.hackathon.findUnique({
        where: { id: hackathonId },
        include: {
          registrations: {
            include: {
              student: {
                include: { user: { select: { name: true, registerNumber: true, department: true } } }
              }
            }
          }
        }
      });

      if (!hackathon) throw new Error("Hackathon not found");

      return hackathon.registrations.map((r: any) => ({
        "Hackathon": hackathon.title,
        "Student Name": r.student.user.name,
        "Register Number": r.student.user.registerNumber || "N/A",
        "Department": r.student.user.department,
        "Registration Status": r.status,
        "Attendance": r.attendanceStatus,
        "Submission": r.submissionStatus,
        "Registered At": format(new Date(r.registeredAt), "yyyy-MM-dd HH:mm")
      }));
    } catch (error) {
      console.error("[ReportingService] Failed to generate Hackathon Report:", error);
      throw new Error("Report generation failed");
    }
  }

  /**
   * Logs a report generation event
   */
  static async logReportGeneration(userId: string, reportType: string, filters?: any) {
    try {
      await db.reportHistory.create({
        data: {
          generatedById: userId,
          reportType,
          filtersUsed: filters ? JSON.stringify(filters) : null
        }
      });
    } catch (error) {
      console.error("[ReportingService] Failed to log report history:", error);
    }
  }
}

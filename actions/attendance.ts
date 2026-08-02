"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AttendanceService } from "@/server/services/attendance.service";
import { AttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function markAttendance(
  studentId: string,
  hackathonId: string,
  status: AttendanceStatus
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = session.user as any;

    if (user.role !== "ADMIN" && user.role !== "AMBASSADOR") {
      return { success: false, error: "Forbidden: Insufficient permissions" };
    }

    await AttendanceService.markAttendance(
      studentId,
      hackathonId,
      status,
      user.id
    );

    // Revalidate relevant paths
    revalidatePath("/dashboard/admin/teams");
    revalidatePath("/dashboard/ambassador/attendance");
    revalidatePath(`/dashboard/student/profile`);

    return { success: true, message: "Attendance marked successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markBulkAttendance(
  studentIds: string[],
  hackathonId: string,
  status: AttendanceStatus
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = session.user as any;

    if (user.role !== "ADMIN" && user.role !== "AMBASSADOR") {
      return { success: false, error: "Forbidden: Insufficient permissions" };
    }

    const { results, errors } = await AttendanceService.markBulkAttendance(
      studentIds,
      hackathonId,
      status,
      user.id
    );

    revalidatePath("/dashboard/admin/teams");
    revalidatePath("/dashboard/ambassador/attendance");

    if (errors.length > 0) {
      return { 
        success: true, 
        message: `Processed with ${errors.length} errors.`, 
        errors 
      };
    }

    return { success: true, message: "Bulk attendance marked successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function generateQRTicket(hackathonId: string) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!session || !user || user.role !== "PARTICIPANT") {
      return { success: false, error: "Unauthorized: Only participants can request QR tickets" };
    }

    const studentProfile = await prisma.student.findUnique({
      where: { userId: user.id }
    });

    if (!studentProfile) {
      return { success: false, error: "Student profile not found" };
    }

    const ticket = await AttendanceService.generateQRTicket(studentProfile.studentId, hackathonId);
    return { success: true, token: ticket.token, expiresAt: ticket.expiresAt, studentId: ticket.studentId, hackathonId: ticket.hackathonId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function scanQRTicket(token: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = session.user as any;

    if (user.role !== "ADMIN" && user.role !== "AMBASSADOR") {
      return { success: false, error: "Forbidden: Only Ambassadors and Admins can scan QR tickets" };
    }

    const record = await AttendanceService.validateQRTicketAndMarkAttendance(token, user.id);

    revalidatePath("/dashboard/admin/teams");
    revalidatePath("/dashboard/ambassador/attendance");
    revalidatePath(`/dashboard/student/profile`);

    return { success: true, message: "Attendance marked successfully!", record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

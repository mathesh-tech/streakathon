"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AttendanceService } from "@/server/services/attendance.service";
import { AttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

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

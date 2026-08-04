"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AnalyticsService } from "@/server/services/analytics.service";
import { ReportingService } from "@/server/services/reporting.service";
import { Role } from "@prisma/client";

/**
 * Validates admin or ambassador access
 */
async function validateStaff() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || (role !== Role.ADMIN && role !== Role.AMBASSADOR)) {
    throw new Error("Unauthorized");
  }
  return (session.user as any)?.id;
}

export async function getDashboardKPIs() {
  await validateStaff();
  return await AnalyticsService.getKPIs();
}

export async function getDepartmentBreakdown() {
  await validateStaff();
  return await AnalyticsService.getDepartmentBreakdown();
}

export async function getClassWiseBreakdown() {
  await validateStaff();
  return await AnalyticsService.getClassWiseBreakdown();
}

export async function getParticipationTrends() {
  await validateStaff();
  return await AnalyticsService.getDailyParticipation(14);
}

export async function getLeaderboardInsights() {
  await validateStaff();
  return await AnalyticsService.getLeaderboardAnalytics();
}

export async function generateReportData(reportType: 'STUDENTS' | 'HACKATHON', hackathonId?: string) {
  const staffId = await validateStaff();
  let data;
  
  if (reportType === 'STUDENTS') {
    data = await ReportingService.generateStudentReport();
  } else if (reportType === 'HACKATHON' && hackathonId) {
    data = await ReportingService.generateHackathonReport(hackathonId);
  } else {
    throw new Error("Invalid report parameters");
  }

  ReportingService.logReportGeneration(staffId, reportType, { hackathonId }).catch(console.error);
  return data;
}

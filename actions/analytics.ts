"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AnalyticsService } from "@/server/services/analytics.service";
import { BusinessIntelligenceService } from "@/server/services/bi.service";
import { ReportingService } from "@/server/services/reporting.service";
import { Role } from "@prisma/client";

/**
 * Validates admin access securely
 */
async function validateAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== Role.ADMIN) {
    throw new Error("Unauthorized");
  }
  return (session.user as any)?.id;
}

export async function getDashboardKPIs() {
  await validateAdmin();
  return await AnalyticsService.getKPIs();
}

export async function getParticipationTrends() {
  await validateAdmin();
  return await AnalyticsService.getDailyParticipation(14);
}

export async function getCreditDistribution() {
  await validateAdmin();
  return await AnalyticsService.getCreditDistribution();
}

export async function getLeaderboardInsights() {
  await validateAdmin();
  return await AnalyticsService.getLeaderboardAnalytics();
}

export async function getParticipationForecast() {
  await validateAdmin();
  return await BusinessIntelligenceService.generateParticipationForecast();
}

export async function getRegistrationTrends() {
  await validateAdmin();
  return await BusinessIntelligenceService.getRegistrationTrends();
}

/**
 * Triggers the report generation and logs it
 */
export async function generateReportData(reportType: 'STUDENTS' | 'HACKATHON', hackathonId?: string) {
  const adminId = await validateAdmin();
  let data;
  
  if (reportType === 'STUDENTS') {
    data = await ReportingService.generateStudentReport();
  } else if (reportType === 'HACKATHON' && hackathonId) {
    data = await ReportingService.generateHackathonReport(hackathonId);
  } else {
    throw new Error("Invalid report parameters");
  }

  // Log asynchronously
  ReportingService.logReportGeneration(adminId, reportType, { hackathonId }).catch(console.error);

  return data;
}

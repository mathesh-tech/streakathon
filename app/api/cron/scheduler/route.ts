import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/server/services/notification.service";
import { NotificationType, NotificationPriority } from "@prisma/client";
import { EmailTemplates } from "@/server/utils/emailTemplates";

// Verify Vercel Cron Secret to secure this endpoint
function isAuthorized(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) return true;
  return false;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req) && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    
    // 1. Check for Hackathons starting in 48h, 24h, 6h, 1h
    const upcomingHackathons = await prisma.hackathon.findMany({
      where: {
        registrationOpen: { lt: now },
        // We can add specific logic to check time intervals.
        // For simplicity, we just fetch all ACTIVE/LIVE ones and calculate diff
        status: { in: ["REGISTRATION_OPEN", "REGISTRATION_CLOSED", "DRAFT"] }
      }
    });

    for (const hackathon of upcomingHackathons) {
      const timeToStart = hackathon.registrationClose.getTime() - now.getTime();
      const hoursToStart = timeToStart / (1000 * 60 * 60);

      // Simple interval matching for demonstration (e.g. within a 1-hour window)
      let reminderType = "";
      if (hoursToStart > 47 && hoursToStart <= 48) reminderType = "48 Hours";
      else if (hoursToStart > 23 && hoursToStart <= 24) reminderType = "24 Hours";
      else if (hoursToStart > 5 && hoursToStart <= 6) reminderType = "6 Hours";
      else if (hoursToStart > 0 && hoursToStart <= 1) reminderType = "1 Hour";

      if (reminderType) {
        const registrations = await prisma.registration.findMany({
          where: { hackathonId: hackathon.id, status: "CONFIRMED" },
          include: { student: { include: { user: true } } }
        });

        for (const reg of registrations) {
          const user = reg.student.user;
          const emailHtml = EmailTemplates.GenericAnnouncement(
            "Hackathon Reminder",
            `This is a reminder that ${hackathon.title} starts in exactly ${reminderType}. Make sure you and your team are ready!`,
            `/dashboard/student/hackathon/${hackathon.id}`,
            "View Dashboard"
          );

          await NotificationService.notifyUser({
            userId: user.id,
            title: `Reminder: ${hackathon.title} starts in ${reminderType}`,
            message: `Don't forget! The hackathon is starting in ${reminderType}.`,
            type: NotificationType.SYSTEM,
            priority: NotificationPriority.HIGH,
            emailSubject: `Reminder: ${hackathon.title} starts in ${reminderType}`,
            emailHtml
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: "Scheduler executed successfully" });
  } catch (error: any) {
    console.error("[CRON Scheduler Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

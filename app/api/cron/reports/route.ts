import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";
import { EmailService } from "@/server/services/email.service";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const scheduledReports = await db.scheduledReport.findMany({
      where: { isActive: true },
      include: { createdBy: true }
    });

    const now = new Date();
    
    // Process each scheduled report
    for (const report of scheduledReports) {
      let shouldSend = false;

      // Basic logic to determine if it should be sent today based on frequency
      // In a real production system, this would check `lastSentAt` against `frequency` strictly
      if (!report.lastSentAt) {
        shouldSend = true;
      } else {
        const diffTime = Math.abs(now.getTime() - new Date(report.lastSentAt).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (report.frequency === 'DAILY' && diffDays >= 1) shouldSend = true;
        if (report.frequency === 'WEEKLY' && diffDays >= 7) shouldSend = true;
        if (report.frequency === 'MONTHLY' && diffDays >= 30) shouldSend = true;
      }

      if (shouldSend) {
        // Send email
        await EmailService.sendEmail({
          to: report.recipients.split(',')[0].trim(),
          subject: `Automated Report: ${report.reportType}`,
          html: `
            <h2>STREAKATHON Analytics</h2>
            <p>Your automated <strong>${report.frequency}</strong> report for <strong>${report.reportType}</strong> is ready.</p>
            <p>Please log in to the Admin Dashboard to download the full dataset.</p>
          `
        });

        // Update lastSentAt
        await db.scheduledReport.update({
          where: { id: report.id },
          data: { lastSentAt: now }
        });
      }
    }

    return NextResponse.json({ success: true, processed: scheduledReports.length });
  } catch (error) {
    console.error("[CronReports]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

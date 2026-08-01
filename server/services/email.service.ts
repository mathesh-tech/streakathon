import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  provider?: string;
}

export class EmailService {
  /**
   * Core abstraction to send an email. It logs the result in the database.
   */
  static async sendEmail({ to, subject, html, provider = "RESEND" }: SendEmailParams) {
    try {
      if (!resend) {
        console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
        await this.logEmail(to, subject, "SENT", provider, html);
        return { success: true, message: "Mock email sent" };
      }

      const data = await resend.emails.send({
        from: "notifications@streakathon.sonatech.ac.in",
        to,
        subject,
        html,
      });

      if (data.error) {
        throw new Error(data.error.message);
      }

      await this.logEmail(to, subject, "SENT", provider, html);
      return { success: true, data };
    } catch (error: any) {
      console.error("[EmailService] Failed to send email:", error.message);
      await this.logEmail(to, subject, "FAILED", provider, html, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Log email delivery status to the database.
   */
  static async logEmail(
    recipient: string,
    subject: string,
    status: string,
    provider: string,
    htmlContent: string,
    error?: string,
    retryCount: number = 0
  ) {
    try {
      await prisma.emailLog.create({
        data: {
          recipient,
          subject,
          status,
          provider,
          htmlContent,
          error,
          retryCount,
          sentAt: status === "SENT" ? new Date() : null,
        },
      });
    } catch (err) {
      console.error("[EmailService] Failed to log email to DB:", err);
    }
  }

  /**
   * Retry sending failed emails up to the maximum retry count.
   */
  static async retryFailedEmails(maxRetries: number = 3) {
    const failedLogs = await prisma.emailLog.findMany({
      where: {
        status: "FAILED",
        retryCount: { lt: maxRetries },
        htmlContent: { not: null }
      },
    });

    const results = [];
    for (const log of failedLogs) {
      console.log(`[EmailService] Retrying email to ${log.recipient}...`);
      
      try {
        if (!resend) {
          console.log(`[EMAIL MOCK RETRY] To: ${log.recipient} | Subject: ${log.subject}`);
          await prisma.emailLog.update({
            where: { id: log.id },
            data: { status: "SENT", sentAt: new Date(), retryCount: { increment: 1 } },
          });
          results.push({ logId: log.id, retried: true, status: "SENT_MOCK" });
          continue;
        }

        const data = await resend.emails.send({
          from: "notifications@streakathon.sonatech.ac.in",
          to: log.recipient,
          subject: log.subject,
          html: log.htmlContent!,
        });

        if (data.error) throw new Error(data.error.message);

        await prisma.emailLog.update({
          where: { id: log.id },
          data: { status: "SENT", sentAt: new Date(), retryCount: { increment: 1 } },
        });
        results.push({ logId: log.id, retried: true, status: "SENT" });
      } catch (error: any) {
        await prisma.emailLog.update({
          where: { id: log.id },
          data: { retryCount: { increment: 1 }, error: error.message },
        });
        results.push({ logId: log.id, retried: false, error: error.message });
      }
    }

    return results;
  }
}

import { prisma } from "@/lib/prisma";
import { NotificationType, NotificationPriority, Role } from "@prisma/client";
import { EmailService } from "./email.service";

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  actionUrl?: string;
  expiresAt?: Date;
  emailSubject?: string;
  emailHtml?: string;
  forceEmail?: boolean; // Override preferences (e.g. Security emails)
}

export class NotificationService {
  /**
   * Fetch user preferences or create defaults if missing
   */
  static async getOrCreatePreferences(userId: string) {
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId },
      });
    }

    return prefs;
  }

  /**
   * Create a single notification (in-app + optional email)
   */
  static async notifyUser(params: CreateNotificationParams) {
    const { 
      userId, 
      title, 
      message, 
      type, 
      priority = "NORMAL", 
      actionUrl, 
      expiresAt,
      emailSubject,
      emailHtml,
      forceEmail = false 
    } = params;

    const prefs = await this.getOrCreatePreferences(userId);

    // 1. Create In-App Notification
    if (prefs.inAppNotifications || forceEmail) {
      await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          priority,
          actionUrl,
          expiresAt,
        },
      });
    }

    // 2. Dispatch Email
    const shouldSendEmail = forceEmail || (prefs.emailNotifications && emailSubject && emailHtml);
    if (shouldSendEmail && emailSubject && emailHtml) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
      if (user?.email) {
        // Dispatch asynchronously, not awaiting so it doesn't block
        EmailService.sendEmail({
          to: user.email,
          subject: emailSubject,
          html: emailHtml,
        }).catch(console.error);
      }
    }
  }

  /**
   * Broadcast an announcement to a specific target audience
   */
  static async broadcastAnnouncement(
    title: string, 
    message: string, 
    targetAudience: string, 
    announcementType: string, 
    createdBy: string,
    emailHtml?: string
  ) {
    // 1. Log Announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        targetAudience,
        type: announcementType,
        createdBy,
      },
    });

    // 2. Determine Audience
    let whereClause = {};
    if (targetAudience === "PARTICIPANTS") whereClause = { role: Role.PARTICIPANT };
    else if (targetAudience === "AMBASSADORS") whereClause = { role: Role.AMBASSADOR };
    else if (targetAudience === "ADMINS") whereClause = { role: Role.ADMIN };

    const users = await prisma.user.findMany({ 
      where: whereClause,
      include: { notificationPreference: true } 
    });

    // 3. Batch insert notifications
    const notificationsToCreate = users
      .filter(u => u.notificationPreference?.inAppNotifications !== false)
      .map(user => ({
        userId: user.id,
        title: `[Announcement] ${title}`,
        message,
        type: NotificationType.ANNOUNCEMENT,
        priority: NotificationPriority.HIGH,
      }));

    if (notificationsToCreate.length > 0) {
      await prisma.notification.createMany({ data: notificationsToCreate });
    }

    // 4. Dispatch batch emails
    if (emailHtml) {
      const emailUsers = users.filter(u => u.notificationPreference?.announcementEmails !== false);
      for (const user of emailUsers) {
        EmailService.sendEmail({
          to: user.email,
          subject: `Announcement: ${title}`,
          html: emailHtml,
        }).catch(console.error);
      }
    }

    return announcement;
  }
}

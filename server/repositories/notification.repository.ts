import { prisma } from '@/lib/prisma';
import { TxClient } from '@/server/utils/tx';
import { NotificationType, NotificationPriority, Role } from '@prisma/client';

export class NotificationRepository {
  static async getOrCreatePreferences(userId: string, tx: TxClient | typeof prisma = prisma) {
    let prefs = await tx.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await tx.notificationPreference.create({
        data: { userId },
      });
    }

    return prefs;
  }

  static async createNotification(
    data: {
      userId: string;
      title: string;
      message: string;
      type: NotificationType;
      priority: NotificationPriority;
      actionUrl?: string;
      expiresAt?: Date;
    },
    tx: TxClient | typeof prisma = prisma
  ) {
    return tx.notification.create({ data });
  }

  static async createManyNotifications(
    data: {
      userId: string;
      title: string;
      message: string;
      type: NotificationType;
      priority: NotificationPriority;
      actionUrl?: string;
      expiresAt?: Date;
    }[],
    tx: TxClient | typeof prisma = prisma
  ) {
    return tx.notification.createMany({ data });
  }

  static async createAnnouncement(
    data: {
      title: string;
      message: string;
      targetAudience: string;
      type: string;
      createdBy: string;
    },
    tx: TxClient | typeof prisma = prisma
  ) {
    return tx.announcement.create({ data });
  }
}

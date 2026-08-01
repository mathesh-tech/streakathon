"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications(limit = 50) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return [];

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser) return [];

  const notifications = await prisma.notification.findMany({
    where: { userId: dbUser.id },
    orderBy: [
      { priority: 'desc' }, // CRITICAL first
      { createdAt: 'desc' }
    ],
    take: limit,
  });

  return notifications;
}

export async function markAsRead(notificationId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return { success: false, error: "Unauthorized" };

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser) return { success: false, error: "User not found" };

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: dbUser.id },
    data: { isRead: true },
  });

  revalidatePath('/dashboard/student/notifications');
  revalidatePath('/dashboard/ambassador/notifications');
  return { success: true };
}

export async function markAllAsRead() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return { success: false, error: "Unauthorized" };

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser) return { success: false, error: "User not found" };

  await prisma.notification.updateMany({
    where: { userId: dbUser.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath('/dashboard/student/notifications');
  revalidatePath('/dashboard/ambassador/notifications');
  return { success: true };
}

export async function deleteNotification(notificationId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return { success: false, error: "Unauthorized" };

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser) return { success: false, error: "User not found" };

  await prisma.notification.deleteMany({
    where: { id: notificationId, userId: dbUser.id },
  });

  revalidatePath('/dashboard/student/notifications');
  revalidatePath('/dashboard/ambassador/notifications');
  return { success: true };
}

export async function getPreferences() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return null;

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser) return null;

  const prefs = await prisma.notificationPreference.findUnique({
    where: { userId: dbUser.id },
  });

  return prefs;
}

export async function updatePreferences(data: {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  announcementEmails: boolean;
  reminderEmails: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return { success: false, error: "Unauthorized" };

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser) return { success: false, error: "User not found" };

  await prisma.notificationPreference.upsert({
    where: { userId: dbUser.id },
    update: data,
    create: {
      userId: dbUser.id,
      ...data,
      securityEmails: true // Always true
    }
  });

  return { success: true };
}

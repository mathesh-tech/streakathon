"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/server/services/notification.service";
import { EmailTemplates } from "@/server/utils/emailTemplates";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(
  title: string,
  message: string,
  targetAudience: "ALL" | "PARTICIPANTS" | "AMBASSADORS" | "ADMINS",
  type: "Information" | "Reminder" | "Warning" | "Important" | "Emergency"
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return { success: false, error: "Unauthorized" };

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser || dbUser.role !== "ADMIN") return { success: false, error: "Forbidden: Admin only" };

  try {
    const emailHtml = EmailTemplates.GenericAnnouncement(title, message);

    await NotificationService.broadcastAnnouncement(
      title,
      message,
      targetAudience,
      type,
      dbUser.id,
      emailHtml
    );

    revalidatePath("/dashboard/admin/announcements");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAnnouncements(limit = 20) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return [];

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser || dbUser.role !== "ADMIN") return [];

  return await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { creator: { select: { name: true } } }
  });
}

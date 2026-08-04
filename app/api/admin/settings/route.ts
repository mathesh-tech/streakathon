import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/settings - Fetch platform settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const activeSemester = await prisma.semester.findFirst({ where: { isActive: true } });
    const adminUser = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: { adminProfile: true },
    });

    return NextResponse.json({
      success: true,
      settings: {
        activeSemester: activeSemester?.name || "Even Semester 2026",
        adminName: adminUser?.name,
        adminEmail: adminUser?.email,
        department: adminUser?.department,
        designation: adminUser?.adminProfile?.designation || "Chief Hackathon Administrator",
      },
    });
  } catch (error: any) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

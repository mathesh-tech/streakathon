import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/students - Search and list all students
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const department = searchParams.get("department") || "";
    const year = searchParams.get("year") || "";

    const whereClause: any = {
      role: "PARTICIPANT",
    };

    if (department && department !== "ALL") {
      whereClause.department = department;
    }

    if (year && year !== "ALL") {
      whereClause.year = parseInt(year);
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { registerNumber: { contains: query, mode: "insensitive" } },
      ];
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        registerNumber: true,
        department: true,
        year: true,
        createdAt: true,
        studentProfile: {
          select: {
            studentId: true,
            section: true,
            currentCredits: true,
            lifetimeCredits: true,
            currentStreak: true,
            totalParticipations: true,
            totalWins: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, count: students.length, students });
  } catch (error: any) {
    console.error("Fetch Admin Students Error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

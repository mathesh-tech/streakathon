import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/teams - List all teams with full member and submission details
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    const whereClause: any = {};
    if (query) {
      whereClause.OR = [
        { teamName: { contains: query, mode: "insensitive" } },
        { teamCode: { contains: query, mode: "insensitive" } },
      ];
    }

    const teams = await prisma.team.findMany({
      where: whereClause,
      include: {
        members: {
          include: {
            student: {
              include: {
                user: {
                  select: { name: true, email: true, registerNumber: true, department: true },
                },
              },
            },
          },
        },
        hackathon: {
          select: { title: true, status: true },
        },
        submissions: {
          orderBy: { submittedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: teams.length, teams });
  } catch (error: any) {
    console.error("Fetch Admin Teams Error:", error);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

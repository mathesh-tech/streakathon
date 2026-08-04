import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/hackathons - List all hackathons categorized by LIVE, UPCOMING, PAST
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const hackathons = await prisma.hackathon.findMany({
      include: {
        _count: {
          select: {
            teams: true,
            registrations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const categorized = {
      live: hackathons.filter(h => h.status === "LIVE"),
      upcoming: hackathons.filter(h => h.status === "REGISTRATION_OPEN" || h.status === "DRAFT" || (h.registrationOpen && new Date(h.registrationOpen) > now && h.status !== "COMPLETED")),
      past: hackathons.filter(h => h.status === "COMPLETED" || h.status === "EVALUATION" || (h.submissionDeadline && new Date(h.submissionDeadline) < now && h.status !== "LIVE")),
      all: hackathons,
    };

    return NextResponse.json({ success: true, ...categorized });
  } catch (error: any) {
    console.error("Fetch Admin Hackathons Error:", error);
    return NextResponse.json({ error: "Failed to fetch hackathons" }, { status: 500 });
  }
}

// POST /api/admin/hackathons - Create a new hackathon
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, theme, venue, registrationOpen, registrationClose, submissionDeadline, status } = body;

    if (!title || !description || !theme || !venue) {
      return NextResponse.json({ error: "Title, description, theme, and venue are required." }, { status: 400 });
    }

    // Get active semester or create default
    let activeSemester = await prisma.semester.findFirst({ where: { isActive: true } });
    if (!activeSemester) {
      activeSemester = await prisma.semester.create({
        data: {
          name: "Even Semester 2026",
          startDate: new Date(),
          endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
      });
    }

    const newHackathon = await prisma.hackathon.create({
      data: {
        title,
        description,
        theme,
        venue,
        registrationOpen: registrationOpen ? new Date(registrationOpen) : new Date(),
        registrationClose: registrationClose ? new Date(registrationClose) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        problemReleaseTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        status: status === "REGISTRATION_OPEN" ? "REGISTRATION_OPEN" : "LIVE",
        semesterId: activeSemester.id,
        createdBy: (session.user as any).id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Hackathon "${title}" created successfully!`,
      hackathon: newHackathon,
    });
  } catch (error: any) {
    console.error("Create Hackathon Error:", error);
    return NextResponse.json({ error: "Failed to create hackathon." }, { status: 500 });
  }
}

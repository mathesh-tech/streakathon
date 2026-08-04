import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/certificates - List issued certificates
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const certificates = await prisma.certificate.findMany({
      include: {
        student: {
          include: {
            user: {
              select: { name: true, email: true, registerNumber: true, department: true },
            },
          },
        },
      },
      orderBy: { issueDate: "desc" },
    });

    return NextResponse.json({ success: true, count: certificates.length, certificates });
  } catch (error: any) {
    console.error("Fetch Certificates Error:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

// POST /api/admin/certificates - Issue certificate to top 3 winners or team members
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { teamSearch, studentEmail, certificateType } = await req.json();

    let studentIdsToCertify: string[] = [];
    let targetHackathonId: string | null = null;
    let hackathonTitle = "Streakathon 2K26 - Sona Innovation Sprint";

    // Find active hackathon
    const activeHackathon = await prisma.hackathon.findFirst({ where: { status: "LIVE" } });
    if (activeHackathon) {
      targetHackathonId = activeHackathon.id;
      hackathonTitle = activeHackathon.title;
    } else {
      const anyHackathon = await prisma.hackathon.findFirst();
      if (anyHackathon) {
        targetHackathonId = anyHackathon.id;
        hackathonTitle = anyHackathon.title;
      }
    }

    if (!targetHackathonId) {
      return NextResponse.json({ error: "No active hackathon found to link certificates." }, { status: 400 });
    }

    if (teamSearch) {
      // Find team by code or name
      const team = await prisma.team.findFirst({
        where: {
          OR: [
            { teamName: { contains: teamSearch, mode: "insensitive" } },
            { teamCode: { contains: teamSearch, mode: "insensitive" } },
          ],
        },
        include: {
          members: true,
          hackathon: true,
        },
      });

      if (!team) {
        return NextResponse.json({ error: `Team matching "${teamSearch}" not found.` }, { status: 404 });
      }

      studentIdsToCertify = team.members.map((m) => m.studentId);
      if (team.hackathonId) targetHackathonId = team.hackathonId;
      if (team.hackathon?.title) hackathonTitle = team.hackathon.title;
    } else if (studentEmail) {
      const user = await prisma.user.findUnique({
        where: { email: studentEmail.toLowerCase().trim() },
        include: { studentProfile: true },
      });

      if (!user || !user.studentProfile) {
        return NextResponse.json({ error: `Student with email "${studentEmail}" not found.` }, { status: 404 });
      }

      studentIdsToCertify = [user.studentProfile.studentId];
    } else {
      return NextResponse.json({ error: "Please provide a team name/code or student email." }, { status: 400 });
    }

    const typeEnum = certificateType || "WINNER_FIRST";

    // Issue certificates for all identified students
    const createdCertificates = [];
    for (const studentId of studentIdsToCertify) {
      const verifyToken = `SONA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const cert = await prisma.certificate.create({
        data: {
          studentId,
          hackathonId: targetHackathonId,
          type: typeEnum,
          issueDate: new Date(),
          verificationToken: verifyToken,
          qrCode: `https://streakathon.sonatech.ac.in/verify/${verifyToken}`,
        },
      });
      createdCertificates.push(cert);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully issued ${createdCertificates.length} certificate(s) for ${hackathonTitle}!`,
      certificates: createdCertificates,
    });
  } catch (error: any) {
    console.error("Issue Certificate Error:", error);
    return NextResponse.json({ error: "Failed to issue certificate" }, { status: 500 });
  }
}

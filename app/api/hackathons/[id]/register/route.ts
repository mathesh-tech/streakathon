import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RegistrationService } from "@/server/services/registration.service";
import { prisma } from "@/lib/prisma";
import { sendRegistrationConfirmationEmail } from "@/lib/email";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== "PARTICIPANT") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const studentProfile = await prisma.student.findUnique({
      where: { userId: (session.user as any).id }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
    }

    const { teamId } = await req.json();

    const registration = await RegistrationService.registerForHackathon(studentProfile.studentId, params.id, teamId);

    // If successfully registered, send confirmation email
    if (registration.status === "REGISTERED" || registration.status === "CONFIRMED") {
      const hackathon = await prisma.hackathon.findUnique({ where: { id: params.id } });
      const team = teamId ? await prisma.team.findUnique({ where: { id: teamId } }) : null;
      
      await sendRegistrationConfirmationEmail({
        email: session.user.email!,
        studentName: session.user.name!,
        hackathonName: hackathon?.title || "STREAKATHON",
        teamName: team?.teamName || "Individual (Waitlisted/NA)",
        date: hackathon?.registrationOpen.toLocaleDateString() || "TBA",
        venue: hackathon?.venue || "TBA",
        registrationNumber: registration.id.split('-')[0].toUpperCase(),
      });
    }

    return NextResponse.json({ success: true, registration });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

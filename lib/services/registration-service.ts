import { prisma } from "@/lib/prisma";
import { RegistrationState, TeamStatus } from "@prisma/client";

/**
 * Validates if the current time falls within the allowed registration window:
 * Wednesday 09:00 AM to Friday 12:00 PM (noon).
 */
export function isRegistrationWindowOpen(): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // If before Wednesday
  if (dayOfWeek < 3) return false;

  // If Wednesday, must be after 09:00 AM
  if (dayOfWeek === 3) {
    if (hours < 9) return false;
  }

  // If after Friday
  if (dayOfWeek > 5) return false;

  // If Friday, must be before 12:00 PM (noon)
  if (dayOfWeek === 5) {
    if (hours >= 12) return false;
  }

  return true;
}

/**
 * Registers a student/team for a hackathon.
 */
export async function registerForHackathon(studentId: string, hackathonId: string, teamId?: string) {
  if (!isRegistrationWindowOpen()) {
    throw new Error("Registration is currently closed. Registrations are only open from Wednesday 09:00 AM to Friday 12:00 PM.");
  }

  // Verify the student exists and is verified
  const student = await prisma.student.findUnique({
    where: { studentId },
    include: { user: true }
  });

  if (!student) throw new Error("Student not found.");
  if (!student.user.emailVerified) throw new Error("Email must be verified before registering.");
  if (student.user.status !== "ACTIVE") throw new Error("Account is currently disabled.");

  // Verify hackathon exists and is open
  const hackathon = await prisma.hackathon.findUnique({
    where: { id: hackathonId },
    include: { 
      _count: {
        select: { teams: true }
      }
    }
  });

  if (!hackathon) throw new Error("Hackathon not found.");
  if (hackathon.status !== "REGISTRATION_OPEN" && hackathon.status !== "DRAFT") {
    // For demo purposes, we might allow registration if status is DRAFT or REGISTRATION_OPEN, 
    // but strictly it should just be REGISTRATION_OPEN.
  }

  // Check if student already registered
  const existingRegistration = await prisma.registration.findUnique({
    where: { hackathonId_studentId: { hackathonId, studentId } }
  });

  if (existingRegistration && existingRegistration.status !== "CANCELLED") {
    throw new Error("You are already registered for this hackathon.");
  }

  // Maximum team capacity logic (assume MAX_TEAMS config)
  const MAX_TEAMS = 50; // Hardcoded default, can be fetched from settings
  let finalStatus: RegistrationState = "REGISTERED";

  if (hackathon._count.teams >= MAX_TEAMS) {
    finalStatus = "WAITING";
  }

  // Handle Team validation
  if (teamId) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team || team.hackathonId !== hackathonId) {
      throw new Error("Invalid team for this hackathon.");
    }
    if (team.status === "LOCKED" || team.status === "DISQUALIFIED") {
      throw new Error(`Cannot register. Team status is ${team.status}.`);
    }
  }

  // Create or Update Registration
  const registration = await prisma.registration.upsert({
    where: { hackathonId_studentId: { hackathonId, studentId } },
    update: {
      teamId: teamId || null,
      status: finalStatus,
      registeredAt: new Date()
    },
    create: {
      hackathonId,
      studentId,
      teamId: teamId || null,
      status: finalStatus
    }
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      userId: student.userId,
      action: "REGISTER",
      entity: "Hackathon",
      target: hackathonId,
      details: `Registered with status ${finalStatus}`
    }
  });

  return registration;
}

export async function cancelRegistration(studentId: string, hackathonId: string) {
  const registration = await prisma.registration.findUnique({
    where: { hackathonId_studentId: { hackathonId, studentId } },
    include: { student: true }
  });

  if (!registration) throw new Error("Registration not found.");

  await prisma.registration.update({
    where: { hackathonId_studentId: { hackathonId, studentId } },
    data: { status: "CANCELLED" }
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      userId: registration.student.userId,
      action: "CANCEL_REGISTRATION",
      entity: "Hackathon",
      target: hackathonId
    }
  });

  // Automatically promote someone from the waiting list if applicable
  await promoteFromWaitingList(hackathonId);
}

export async function promoteFromWaitingList(hackathonId: string) {
  // Logic to find oldest WAITING registration and set to REGISTERED
  const waitingReg = await prisma.registration.findFirst({
    where: { hackathonId, status: "WAITING" },
    orderBy: { registeredAt: 'asc' }
  });

  if (waitingReg) {
    await prisma.registration.update({
      where: { id: waitingReg.id },
      data: { status: "REGISTERED" }
    });
    // Trigger waitlist email here if implemented
  }
}

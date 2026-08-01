import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { isRegistrationWindowOpen } from "./registration-service";
import { sendInvitationEmail } from "../email";

/**
 * Creates a new Team. The creator automatically becomes the LEADER.
 */
export async function createTeam(teamName: string, leaderId: string, hackathonId: string) {
  if (!isRegistrationWindowOpen()) {
    throw new Error("Registration is closed. Teams can only be created between Wed 09:00 AM and Fri 12:00 PM.");
  }

  // Verify leader exists and hasn't already formed a team for this hackathon
  const existingTeam = await prisma.teamMember.findFirst({
    where: { 
      studentId: leaderId,
      team: { hackathonId }
    }
  });

  if (existingTeam) {
    throw new Error("You are already part of a team for this hackathon.");
  }

  const teamCode = crypto.randomBytes(4).toString('hex').toUpperCase();

  const team = await prisma.team.create({
    data: {
      teamName,
      teamCode,
      leaderId,
      hackathonId,
      status: "OPEN",
      members: {
        create: {
          studentId: leaderId,
          role: "LEADER"
        }
      }
    }
  });

  return team;
}

export async function inviteMember(teamId: string, email: string, inviterId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { _count: { select: { members: true } }, hackathon: true }
  });

  if (!team) throw new Error("Team not found.");
  if (team.leaderId !== inviterId) throw new Error("Only the team leader can invite members.");
  if (team.status === "LOCKED" || team.status === "DISQUALIFIED") throw new Error(`Cannot invite. Team is ${team.status}.`);
  if (team._count.members >= team.maxMembers) throw new Error("Team is already full.");

  // Check if student exists by email
  const user = await prisma.user.findUnique({
    where: { email },
    include: { studentProfile: true }
  });

  if (!user || !user.studentProfile) {
    throw new Error("Only registered STREAKATHON students can be invited.");
  }

  // Ensure student not already in a team for this hackathon
  const existingMembership = await prisma.teamMember.findFirst({
    where: {
      studentId: user.studentProfile.studentId,
      team: { hackathonId: team.hackathonId }
    }
  });

  if (existingMembership) {
    throw new Error("This student is already in a team for this hackathon.");
  }

  // Ensure student not already invited
  const existingInvite = await prisma.teamInvitation.findFirst({
    where: { teamId, email, status: "PENDING" }
  });

  if (existingInvite) {
    throw new Error("An invitation is already pending for this email.");
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

  const invite = await prisma.teamInvitation.create({
    data: {
      teamId,
      email,
      token,
      expiresAt
    }
  });

  // Get leader name
  const leaderUser = await prisma.user.findFirst({
    where: { studentProfile: { studentId: inviterId } }
  });

  await sendInvitationEmail({
    email,
    teamName: team.teamName,
    leaderName: leaderUser?.name || "The Team Leader",
    hackathonName: team.hackathon.title,
    token,
    expiresAt
  });

  return invite;
}

export async function acceptInvitation(studentId: string, token: string) {
  if (!isRegistrationWindowOpen()) {
    throw new Error("Registration is closed. You cannot join a team outside the registration window.");
  }

  const invite = await prisma.teamInvitation.findUnique({
    where: { token },
    include: { team: { include: { _count: { select: { members: true } } } } }
  });

  if (!invite) throw new Error("Invalid invitation token.");
  if (invite.status !== "PENDING") throw new Error(`Invitation is already ${invite.status}.`);
  if (invite.expiresAt < new Date()) {
    await prisma.teamInvitation.update({ where: { id: invite.id }, data: { status: "EXPIRED" } });
    throw new Error("Invitation has expired.");
  }

  if (invite.team._count.members >= invite.team.maxMembers) {
    throw new Error("Team is already full.");
  }

  // Verify email matches the student
  const student = await prisma.student.findUnique({
    where: { studentId },
    include: { user: true }
  });

  if (!student || student.user.email !== invite.email) {
    throw new Error("This invitation was not sent to your email.");
  }

  // Join Team transaction
  await prisma.$transaction([
    prisma.teamMember.create({
      data: {
        teamId: invite.teamId,
        studentId,
        role: "MEMBER"
      }
    }),
    prisma.teamInvitation.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED", acceptedAt: new Date() }
    }),
    // Auto-update team status if full
    ...(invite.team._count.members + 1 >= invite.team.maxMembers
      ? [prisma.team.update({ where: { id: invite.teamId }, data: { status: "FULL" } })]
      : [])
  ]);

  return true;
}

export async function removeMember(teamId: string, leaderId: string, memberId: string) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error("Team not found.");
  if (team.leaderId !== leaderId) throw new Error("Only the team leader can remove members.");
  if (team.status === "LOCKED") throw new Error("Cannot remove members from a locked team.");
  if (memberId === leaderId) throw new Error("You cannot remove yourself. Transfer leadership first.");

  await prisma.teamMember.delete({
    where: { teamId_studentId: { teamId, studentId: memberId } }
  });

  if (team.status === "FULL") {
    await prisma.team.update({ where: { id: teamId }, data: { status: "OPEN" } });
  }

  return true;
}

export async function leaveTeam(teamId: string, studentId: string) {
  if (!isRegistrationWindowOpen()) {
    throw new Error("Registration is closed. You cannot leave a team outside the registration window.");
  }

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error("Team not found.");
  if (team.status === "LOCKED") throw new Error("Cannot leave a locked team.");
  if (team.leaderId === studentId) throw new Error("The leader cannot leave without transferring leadership first.");

  await prisma.teamMember.delete({
    where: { teamId_studentId: { teamId, studentId } }
  });

  if (team.status === "FULL") {
    await prisma.team.update({ where: { id: teamId }, data: { status: "OPEN" } });
  }

  return true;
}

export async function transferLeadership(teamId: string, currentLeaderId: string, newLeaderId: string) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error("Team not found.");
  if (team.leaderId !== currentLeaderId) throw new Error("Only the current leader can transfer leadership.");

  const newLeaderMembership = await prisma.teamMember.findUnique({
    where: { teamId_studentId: { teamId, studentId: newLeaderId } }
  });

  if (!newLeaderMembership) throw new Error("The new leader must be a member of the team.");

  await prisma.$transaction([
    prisma.team.update({
      where: { id: teamId },
      data: { leaderId: newLeaderId }
    }),
    prisma.teamMember.update({
      where: { teamId_studentId: { teamId, studentId: newLeaderId } },
      data: { role: "LEADER" }
    }),
    prisma.teamMember.update({
      where: { teamId_studentId: { teamId, studentId: currentLeaderId } },
      data: { role: "MEMBER" }
    })
  ]);

  return true;
}

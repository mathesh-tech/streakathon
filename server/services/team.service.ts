import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { RegistrationService } from '@/server/services/registration.service';
import { sendInvitationEmail } from '@/lib/email';
import { BusinessRuleError, NotFoundError, ConflictError } from '@/server/utils/errors';
import { TeamRepository } from '@/server/repositories/team.repository';

export class TeamService {
  /**
   * Creates a new Team. The creator automatically becomes the LEADER.
   */
  static async createTeam(teamName: string, leaderId: string, hackathonId: string) {
    if (!RegistrationService.isRegistrationWindowOpen()) {
      throw new BusinessRuleError('Registration is closed. Teams can only be created between Wed 09:00 AM and Fri 12:00 PM.');
    }

    const existingTeam = await TeamRepository.getStudentTeam(leaderId, hackathonId);
    if (existingTeam) {
      throw new ConflictError('You are already part of a team for this hackathon.');
    }

    const teamCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    return prisma.team.create({
      data: {
        teamName,
        teamCode,
        leaderId,
        hackathonId,
        status: 'OPEN',
        members: {
          create: {
            studentId: leaderId,
            role: 'LEADER'
          }
        }
      }
    });
  }

  static async inviteMember(teamId: string, email: string, inviterId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { _count: { select: { members: true } }, hackathon: true }
    });

    if (!team) throw new NotFoundError('Team not found.');
    if (team.leaderId !== inviterId) throw new BusinessRuleError('Only the team leader can invite members.');
    if (team.status === 'LOCKED' || team.status === 'DISQUALIFIED') throw new BusinessRuleError(`Cannot invite. Team is ${team.status}.`);
    if (team._count.members >= team.maxMembers) throw new BusinessRuleError('Team is already full.');

    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true }
    });

    if (!user || !user.studentProfile) {
      throw new BusinessRuleError('Only registered STREAKATHON students can be invited.');
    }

    const existingMembership = await TeamRepository.getStudentTeam(user.studentProfile.studentId, team.hackathonId);
    if (existingMembership) {
      throw new ConflictError('This student is already in a team for this hackathon.');
    }

    const existingInvite = await prisma.teamInvitation.findFirst({
      where: { teamId, email, status: 'PENDING' }
    });

    if (existingInvite) {
      throw new ConflictError('An invitation is already pending for this email.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const invite = await prisma.teamInvitation.create({
      data: { teamId, email, token, expiresAt }
    });

    const leaderUser = await prisma.user.findFirst({
      where: { studentProfile: { studentId: inviterId } }
    });

    await sendInvitationEmail({
      email,
      teamName: team.teamName,
      leaderName: leaderUser?.name || 'The Team Leader',
      hackathonName: team.hackathon.title,
      token,
      expiresAt
    });

    return invite;
  }

  static async acceptInvitation(studentId: string, token: string) {
    if (!RegistrationService.isRegistrationWindowOpen()) {
      throw new BusinessRuleError('Registration is closed. You cannot join a team outside the registration window.');
    }

    return prisma.$transaction(async (tx) => {
      const invite = await tx.teamInvitation.findUnique({
        where: { token },
        include: { team: { include: { _count: { select: { members: true } } } } }
      });

      if (!invite) throw new NotFoundError('Invalid invitation token.');
      if (invite.status !== 'PENDING') throw new BusinessRuleError(`Invitation is already ${invite.status}.`);
      if (invite.expiresAt < new Date()) {
        await tx.teamInvitation.update({ where: { id: invite.id }, data: { status: 'EXPIRED' } });
        throw new BusinessRuleError('Invitation has expired.');
      }

      if (invite.team._count.members >= invite.team.maxMembers) {
        throw new BusinessRuleError('Team is already full.');
      }

      const student = await tx.student.findUnique({
        where: { studentId },
        include: { user: true }
      });

      if (!student || student.user.email !== invite.email) {
        throw new BusinessRuleError('This invitation was not sent to your email.');
      }

      await tx.teamMember.create({
        data: { teamId: invite.teamId, studentId, role: 'MEMBER' }
      });

      await tx.teamInvitation.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date() }
      });

      if (invite.team._count.members + 1 >= invite.team.maxMembers) {
        await tx.team.update({ where: { id: invite.teamId }, data: { status: 'FULL' } });
      }

      return true;
    });
  }

  static async removeMember(teamId: string, leaderId: string, memberId: string) {
    return prisma.$transaction(async (tx) => {
      const team = await TeamRepository.findById(teamId, tx);
      if (!team) throw new NotFoundError('Team not found.');
      if (team.leaderId !== leaderId) throw new BusinessRuleError('Only the team leader can remove members.');
      if (team.status === 'LOCKED') throw new BusinessRuleError('Cannot remove members from a locked team.');
      if (memberId === leaderId) throw new BusinessRuleError('You cannot remove yourself. Transfer leadership first.');

      await tx.teamMember.delete({
        where: { teamId_studentId: { teamId, studentId: memberId } }
      });

      if (team.status === 'FULL') {
        await tx.team.update({ where: { id: teamId }, data: { status: 'OPEN' } });
      }

      return true;
    });
  }

  static async leaveTeam(teamId: string, studentId: string) {
    if (!RegistrationService.isRegistrationWindowOpen()) {
      throw new BusinessRuleError('Registration is closed. You cannot leave a team outside the registration window.');
    }

    return prisma.$transaction(async (tx) => {
      const team = await TeamRepository.findById(teamId, tx);
      if (!team) throw new NotFoundError('Team not found.');
      if (team.status === 'LOCKED') throw new BusinessRuleError('Cannot leave a locked team.');
      if (team.leaderId === studentId) throw new BusinessRuleError('The leader cannot leave without transferring leadership first.');

      await tx.teamMember.delete({
        where: { teamId_studentId: { teamId, studentId } }
      });

      if (team.status === 'FULL') {
        await tx.team.update({ where: { id: teamId }, data: { status: 'OPEN' } });
      }

      return true;
    });
  }

  static async transferLeadership(teamId: string, currentLeaderId: string, newLeaderId: string) {
    return prisma.$transaction(async (tx) => {
      const team = await TeamRepository.findById(teamId, tx);
      if (!team) throw new NotFoundError('Team not found.');
      if (team.leaderId !== currentLeaderId) throw new BusinessRuleError('Only the current leader can transfer leadership.');

      const newLeaderMembership = await tx.teamMember.findUnique({
        where: { teamId_studentId: { teamId, studentId: newLeaderId } }
      });

      if (!newLeaderMembership) throw new BusinessRuleError('The new leader must be a member of the team.');

      await tx.team.update({
        where: { id: teamId },
        data: { leaderId: newLeaderId }
      });

      await tx.teamMember.update({
        where: { teamId_studentId: { teamId, studentId: newLeaderId } },
        data: { role: 'LEADER' }
      });

      await tx.teamMember.update({
        where: { teamId_studentId: { teamId, studentId: currentLeaderId } },
        data: { role: 'MEMBER' }
      });

      return true;
    });
  }
}

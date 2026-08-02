import { prisma } from '@/lib/prisma';
import { RegistrationState } from '@prisma/client';
import { BusinessRuleError, NotFoundError } from '@/server/utils/errors';
import { HackathonRepository } from '@/server/repositories/hackathon.repository';
import { AuditService } from '@/server/services/audit.service';

export class RegistrationService {
  /**
   * Validates if the current time falls within the allowed registration window:
   * Wednesday 09:00 AM to Friday 12:00 PM (noon).
   */
  static isRegistrationWindowOpen(): boolean {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const hours = now.getHours();

    if (dayOfWeek < 3) return false;
    if (dayOfWeek === 3 && hours < 9) return false;
    if (dayOfWeek > 5) return false;
    if (dayOfWeek === 5 && hours >= 12) return false;

    return true;
  }

  static async registerForHackathon(studentId: string, hackathonId: string, teamId?: string) {
    if (!this.isRegistrationWindowOpen()) {
      throw new BusinessRuleError('Registration is currently closed. Registrations are only open from Wednesday 09:00 AM to Friday 12:00 PM.');
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
      include: { user: true }
    });

    if (!student) throw new NotFoundError('Student not found.');
    if (!student.user.emailVerified) throw new BusinessRuleError('Email must be verified before registering.');
    if (student.user.status !== 'ACTIVE') throw new BusinessRuleError('Account is currently disabled.');

    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
      include: { _count: { select: { teams: true } } }
    });

    if (!hackathon) throw new NotFoundError('Hackathon not found.');

    const existingRegistration = await prisma.registration.findUnique({
      where: { hackathonId_studentId: { hackathonId, studentId } }
    });

    if (existingRegistration && existingRegistration.status !== 'CANCELLED') {
      throw new BusinessRuleError('You are already registered for this hackathon.');
    }

    const MAX_TEAMS = 50; 
    let finalStatus: RegistrationState = 'REGISTERED';

    if (hackathon._count.teams >= MAX_TEAMS) {
      finalStatus = 'WAITING';
    }

    if (teamId) {
      const team = await prisma.team.findUnique({ where: { id: teamId } });
      if (!team || team.hackathonId !== hackathonId) {
        throw new BusinessRuleError('Invalid team for this hackathon.');
      }
      if (team.status === 'LOCKED' || team.status === 'DISQUALIFIED') {
        throw new BusinessRuleError(`Cannot register. Team status is ${team.status}.`);
      }
    }

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

    await AuditService.log({
      userId: student.userId,
      action: 'REGISTER',
      entity: 'Hackathon',
      target: hackathonId,
      details: `Registered with status ${finalStatus}`
    });

    return registration;
  }

  static async cancelRegistration(studentId: string, hackathonId: string) {
    const registration = await prisma.registration.findUnique({
      where: { hackathonId_studentId: { hackathonId, studentId } },
      include: { student: true }
    });

    if (!registration) throw new NotFoundError('Registration not found.');

    await prisma.registration.update({
      where: { hackathonId_studentId: { hackathonId, studentId } },
      data: { status: 'CANCELLED' }
    });

    await AuditService.log({
      userId: registration.student.userId,
      action: 'CANCEL_REGISTRATION',
      entity: 'Hackathon',
      target: hackathonId
    });

    await this.promoteFromWaitingList(hackathonId);
  }

  static async promoteFromWaitingList(hackathonId: string) {
    const waitingReg = await prisma.registration.findFirst({
      where: { hackathonId, status: 'WAITING' },
      orderBy: { registeredAt: 'asc' }
    });

    if (waitingReg) {
      await prisma.registration.update({
        where: { id: waitingReg.id },
        data: { status: 'REGISTERED' }
      });
    }
  }
}

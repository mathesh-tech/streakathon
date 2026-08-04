import { PrismaClient, Role, HackathonStatus, RegistrationState, TeamStatus, TeamMemberRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Updating official Admin emails & passwords...");

  // Hashes for official Admin accounts
  const vijayPassword = await bcrypt.hash("vijay@123", 10);
  const matheshPassword = await bcrypt.hash("mathesh@123", 10);
  const studentPassword = await bcrypt.hash("student123", 10);

  // Clear existing database tables in correct foreign key order
  await prisma.evaluationScore.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.teamInvitation.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.qRTicket.deleteMany({});
  await prisma.participantEvaluation.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.creditTransaction.deleteMany({});
  await prisma.hackathon.deleteMany({});
  await prisma.semester.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.loginLog.deleteMany({});
  await prisma.activityLog.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.ambassador.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleaned old records.");

  // 1. Official Admin 1: vijayaragavan.24it@sonatech.ac.in (vijay@123)
  console.log("Creating Admin 1: vijayaragavan.24it@sonatech.ac.in");
  const admin1 = await prisma.user.create({
    data: {
      name: "Vijayaragavan R (Admin)",
      email: "vijayaragavan.24it@sonatech.ac.in",
      password: vijayPassword,
      role: Role.ADMIN,
      department: "IT",
      emailVerified: true,
      forcePasswordChange: false,
      canDeductCredits: true,
      adminProfile: {
        create: {
          designation: "Chief Hackathon Administrator",
          department: "Information Technology",
        },
      },
    },
  });

  // 2. Official Admin 2: mathesh.24it@sonatech.ac.in (mathesh@123)
  console.log("Creating Admin 2: mathesh.24it@sonatech.ac.in");
  const admin2 = await prisma.user.create({
    data: {
      name: "Siva Mathesh (Admin)",
      email: "mathesh.24it@sonatech.ac.in",
      password: matheshPassword,
      role: Role.ADMIN,
      department: "IT",
      emailVerified: true,
      forcePasswordChange: false,
      canDeductCredits: true,
      adminProfile: {
        create: {
          designation: "Lead Technical Admin",
          department: "Information Technology",
        },
      },
    },
  });

  // 3. Default Student Login for student portal access
  console.log("Creating Default Student account...");
  const studentUser = await prisma.user.create({
    data: {
      name: "Sona Student",
      email: "student@sonatech.ac.in",
      password: studentPassword,
      role: Role.PARTICIPANT,
      department: "IT",
      registerNumber: "617824IT001",
      year: 3,
      emailVerified: true,
      forcePasswordChange: false,
      studentProfile: {
        create: {
          batch: "2024-2028",
          section: "A",
          semester: 6,
          currentCredits: 1200,
          lifetimeCredits: 1450,
          currentStreak: 10,
          bestStreak: 14,
          totalParticipations: 6,
          totalWins: 2,
          github: "https://github.com/mathesh-tech/streakathon",
          bio: "Default Student Account for Sona College Hackathon Platform",
        },
      },
    },
  });

  const studentProfile = await prisma.student.findUnique({ where: { userId: studentUser.id } });

  // Additional sample students
  const sampleStudents = [
    { name: "Anand Kumar", email: "anand.24it@sonatech.ac.in", reg: "617824IT002", credits: 1350 },
    { name: "Bhavana S", email: "bhavana.24it@sonatech.ac.in", reg: "617824IT003", credits: 980 },
    { name: "Chandran R", email: "chandran.24it@sonatech.ac.in", reg: "617824IT004", credits: 820 },
  ];

  for (const s of sampleStudents) {
    await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        password: studentPassword,
        role: Role.PARTICIPANT,
        department: "IT",
        registerNumber: s.reg,
        year: 3,
        emailVerified: true,
        forcePasswordChange: false,
        studentProfile: {
          create: {
            batch: "2024-2028",
            section: "A",
            semester: 6,
            currentCredits: s.credits,
            lifetimeCredits: s.credits + 100,
            currentStreak: 5,
            bestStreak: 8,
          },
        },
      },
    });
  }

  // 4. Create Active Hackathon & Semester
  console.log("Creating Active Hackathon...");
  const semester = await prisma.semester.create({
    data: {
      name: "Even Semester 2026",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-06-30"),
      isActive: true,
    },
  });

  const hackathon = await prisma.hackathon.create({
    data: {
      title: "Streakathon 2K26 - Sona Innovation Sprint",
      description: "Official 48-hour innovation hackathon at Sona College of Technology.",
      theme: "AI & Smart Campus Solutions",
      venue: "APJ Abdul Kalam Block",
      registrationOpen: new Date("2026-07-01"),
      registrationClose: new Date("2026-08-10"),
      problemReleaseTime: new Date("2026-08-11T09:00:00Z"),
      submissionDeadline: new Date("2026-08-13T18:00:00Z"),
      status: HackathonStatus.LIVE,
      semesterId: semester.id,
      createdBy: admin1.id,
    },
  });

  // 5. Create Team & Submissions
  if (studentProfile) {
    await prisma.team.create({
      data: {
        teamName: "Sona Innovators",
        teamCode: "SONA-01",
        leaderId: studentProfile.studentId,
        hackathonId: hackathon.id,
        status: TeamStatus.SUBMITTED,
        maxMembers: 4,
        members: {
          create: {
            studentId: studentProfile.studentId,
            role: TeamMemberRole.LEADER,
          },
        },
        registrations: {
          create: {
            hackathonId: hackathon.id,
            studentId: studentProfile.studentId,
            status: RegistrationState.REGISTERED,
          },
        },
        submissions: {
          create: {
            githubLink: "https://github.com/mathesh-tech/streakathon",
            documentation: "Streakathon Hackathon Platform Documentation",
          },
        },
      },
    });
  }

  // System Announcements
  await prisma.announcement.create({
    data: {
      title: "🚀 Welcome to Streakathon 2K26 Portal",
      message: "Admins vijayaragavan.24it@sonatech.ac.in and mathesh.24it@sonatech.ac.in can create Hackathon Ambassador accounts in the Admin panel.",
      targetAudience: "ALL",
      type: "Important",
      createdBy: admin1.id,
    },
  });

  console.log("------------------------------------");
  console.log("✅ Official Admin Accounts Updated!");
  console.log("1. vijayaragavan.24it@sonatech.ac.in (Password: vijay@123)");
  console.log("2. mathesh.24it@sonatech.ac.in (Password: mathesh@123)");
  console.log("------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

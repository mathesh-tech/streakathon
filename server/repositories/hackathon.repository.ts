// Placeholder for prisma client
// import prisma from "@/lib/prisma";

export class HackathonRepository {
  static async findById(id: string) {
    // return await prisma.hackathon.findUnique({ where: { id } });
    return null;
  }

  static async findActive() {
    // return await prisma.hackathon.findFirst({
    //   where: { status: { in: ["LIVE", "REGISTRATION_OPEN"] } },
    // });
    return null;
  }

  static async getRegistrations(hackathonId: string) {
    // return await prisma.registration.findMany({ where: { hackathonId } });
    return [];
  }
}

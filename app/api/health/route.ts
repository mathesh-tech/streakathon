import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const health: any = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'OK',
    services: {
      database: 'UNKNOWN',
      authentication: 'OK', // Assuming NextAuth is running if the server is running
    },
    memory: process.memoryUsage(),
  };

  try {
    // Check Database connection
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'OK';
  } catch (error) {
    health.status = 'DEGRADED';
    health.services.database = 'ERROR';
  }

  // Return a 503 Service Unavailable if critical services are down
  const statusCode = health.status === 'OK' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}

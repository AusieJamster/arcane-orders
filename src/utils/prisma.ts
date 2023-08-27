import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient =
  (global as unknown as { prisma: any }).prisma ||
  new PrismaClient({
    errorFormat: 'pretty'
  });

if (process.env.NODE_ENV === 'development')
  (global as unknown as { prisma: any }).prisma = prisma;

export default prisma;

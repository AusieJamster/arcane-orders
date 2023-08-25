// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
    errorFormat: 'pretty'
  });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;

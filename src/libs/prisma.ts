import { PrismaClient } from '@/.prisma';

const prisma: PrismaClient =
  global.prisma || new PrismaClient({ log: ['info'] });
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;

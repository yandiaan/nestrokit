/**
 * Database Seed Script
 * 
 * Run with: pnpm db:seed
 */

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      // Password: "Admin123!" - bcrypt hash
      passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Zf4a2OPY.EXAMPLE.HASH',
      role: UserRole.ADMIN,
    },
  });

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      // Password: "User1234!" - bcrypt hash  
      passwordHash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Zf4a2OPY.EXAMPLE.HASH',
      role: UserRole.USER,
    },
  });

  console.log('✅ Seeded users:', { admin: admin.email, user: user.email });
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@bohoor.com';
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin already exists.');
    
    // Update password just in case
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword }
    });
    console.log('Admin password updated to 123456');
  } else {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.admin.create({
      data: { email, name: 'System Admin', password: hashedPassword }
    });
    console.log('Admin user created successfully.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

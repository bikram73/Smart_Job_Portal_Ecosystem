import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🔄 Starting database reset...');

    // Delete data in reverse order of dependencies to avoid foreign key constraints
    await prisma.auditLog.deleteMany();
    await prisma.aTSAssessment.deleteMany();
    await prisma.resume.deleteMany();
    await prisma.prepTask.deleteMany();
    await prisma.prepPlan.deleteMany();
    await prisma.jobMatch.deleteMany();
    
    // Delete core entities
    await prisma.profile.deleteMany();
    await prisma.jobPosting.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Database cleared successfully.');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
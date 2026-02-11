const { connectDB } = require('./config/database');
const { Job } = require('./models');
const { seedJobs } = require('./seedData');

async function reseedForce() {
  try {
    await connectDB();
    
    console.log('Deleting all existing jobs...');
    await Job.destroy({ where: {}, truncate: true });
    
    console.log('Seeding database with fresh data...');
    await seedJobs();
    
    const count = await Job.count();
    console.log(`✓ Successfully seeded ${count} jobs!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

reseedForce();
